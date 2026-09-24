from django.db import models
# import os
from import_export import resources
from django.db.models import Subquery, OuterRef
from django.db import connection
from django.utils import timezone
import datetime
from datetime import datetime
from django.conf import settings
from django.contrib.auth.models import User
from django_currentuser.middleware import (
    get_current_user, get_current_authenticated_user)
from django_currentuser.db.models import CurrentUserField
from django.urls import reverse
from django.http import HttpResponse
from setups.models import *
from smart_selects.db_fields import ChainedForeignKey
from store.models import *
from django.db.models import Sum
# from django.db.models.query import QuerySet
# import numpy as np

# Create your models here.
class Sale(models.Model):
    shift = (
        ('Morning', 'Morning'),
        ('Afternoon', 'Afternoon'),
    )
    id = models.AutoField(primary_key=True, unique=True)
    Customer_name = models.CharField(max_length=250)
    Customer_phone = models.CharField(max_length=250, null=True, blank=True)
    Day_shift = models.CharField(max_length=250, choices = shift, default='Morning')	
    Total = models.DecimalField(max_digits = 11, decimal_places = 2, null=True, blank=True)

    # Price_paid = models.DecimalField(max_digits = 11, decimal_places = 2, null=True, blank=True, default='0')
    # The_rest = models.DecimalField(max_digits = 11, decimal_places = 2, null=True, blank=True, default='0')

    Sold_date = models.DateField(auto_now=True)
    # Change CurrentUserField to regular ForeignKey with auto-set
    Sold_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        editable=False,
        related_name="sales_sold"
    )
    Modified_date = models.DateTimeField(auto_now=True)
    Modified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        editable=False,
        related_name="sales_modified"
    )
 
	# def save(self, *args, **kwargs):
	# 	invoice_lines = NewSale.objects.filter(Internal_order=self.id)
	# 	self.Total = 0
	# 	for line in invoice_lines:
	# 		self.Total+=line.Sale_total_price
	# 		self.The_rest = self.Sale_total_price-self.Price_paid
	# 	super(Sale, self).save(*args, **kwargs)
    def __str__(self):
        return "%s" % self.Customer_name

    def save(self, *args, **kwargs):
        # Auto-set the user if not already set
        if not self.Sold_by:
            from django_currentuser.middleware import get_current_authenticated_user
            self.Sold_by = get_current_authenticated_user()
        
        if not self.Modified_by:
            from django_currentuser.middleware import get_current_authenticated_user
            self.Modified_by = get_current_authenticated_user()
        
        # Save the Sale first
        super(Sale, self).save(*args, **kwargs)
        
        # Re-calculate total
        from django.db.models import Sum
        res = NewSale.objects.filter(sale=self).aggregate(Sum('Sale_total_price'))
        new_total = res['Sale_total_price__sum'] or 0
        
        if self.Total != new_total:
            Sale.objects.filter(id=self.id).update(Total=new_total)
		
class NewSale(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    Item_category = models.ForeignKey(ItemCategory, on_delete=models.CASCADE)
    Item_type = ChainedForeignKey(
        ItemType, 
        chained_field="Item_category", 
        chained_model_field="Item_category", 
        show_all=False, 
        auto_choose=True, 
        sort=True,
        on_delete=models.CASCADE
    )
    Quantity = models.DecimalField(max_digits=11, decimal_places=2)
    Sale_single_price = models.DecimalField(max_digits=11, decimal_places=2, null=True, blank=True)
    Sale_total_price = models.DecimalField(max_digits=11, decimal_places=2, null=True, blank=True)
    
    def clean(self):
        """Validate before saving"""
        if not self.Quantity or self.Quantity <= 0:
            raise ValidationError({'Quantity': 'Quantity must be greater than 0'})
        
        # Check if Device exists for this Item_type
        device_exists = Device.objects.filter(type=self.Item_type).exists()
        if not device_exists:
            raise ValidationError(f'No device found for item type: {self.Item_type}')

    def save(self, *args, **kwargs):
        # Validate first
        self.full_clean()
        
        # Get device price
        try:
            device = Device.objects.get(type=self.Item_type)
            self.Sale_single_price = device.price
            
            if self.Quantity:
                self.Sale_total_price = self.Quantity * self.Sale_single_price
            else:
                self.Sale_total_price = 0
                
        except Device.DoesNotExist:
            # Don't save if device doesn't exist
            raise ValidationError(f'Cannot save: No device found for {self.Item_type}')
        
        # Save the NewSale
        super(NewSale, self).save(*args, **kwargs)
        
        # Update parent Sale total
        if self.sale:
            from django.db.models import Sum
            total = NewSale.objects.filter(sale=self.sale).aggregate(
                total=Sum('Sale_total_price')
            )['total'] or 0
            
            # Update without triggering another save
            Sale.objects.filter(id=self.sale.id).update(Total=total)