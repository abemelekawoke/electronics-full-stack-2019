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

# Create your models here.
class PurchasedInventory(models.Model):
	severity = (
	    ('Regular', 'Regular'),
	    ('Urgent', 'Urgent'),
	)
	shift = (
	    ('Morning', 'Morning'),
	    ('Afternoon', 'Afternoon'),
	)
	plan = (
	    ('Partial', 'Partial'),
	    ('Full', 'Full'),
	)
	
	id = models.AutoField(primary_key=True, unique=True)
	Item_category = models.ForeignKey(ItemCategory, on_delete=models.CASCADE)
	Item_type = ChainedForeignKey(ItemType, chained_field="Item_category", chained_model_field="Item_category", show_all=False, auto_choose=True, sort=True)
	Measurement = models.ForeignKey(Measurement, on_delete=models.CASCADE)
	Day_shift = models.CharField(max_length=250, choices = shift)
	Quantity = models.PositiveIntegerField()
	# Purchased_single_price = models.PositiveIntegerField()
	# Purchased_total_price = models.PositiveIntegerField(null=True, blank=True)
	Purchased_single_price = models.DecimalField(max_digits = 11, decimal_places = 2)
	Purchased_total_price = models.DecimalField(max_digits = 11, decimal_places = 2, null=True, blank=True)
	Remark = models.CharField(max_length=250, null=True, blank=True)
	
	Created_date = models.DateField(auto_now=True)
	Created_by = CurrentUserField()
	Modified_date = models.DateTimeField(auto_now=True)
	Modified_by = CurrentUserField(related_name="updated_byp")

	def __str__(self):
		return "%s" % self.Item_type

	class Meta:
		verbose_name_plural = "Purchased inventories"

	def save(self, *args, **kwargs):
		self.Purchased_total_price = self.Quantity * self.Purchased_single_price
		super(PurchasedInventory, self).save(*args, **kwargs)
		
class BeginInventory(models.Model):
	severity = (
	    ('Regular', 'Regular'),
	    ('Urgent', 'Urgent'),
	)
	shift = (
	    ('Morning', 'Morning'),
	    ('Afternoon', 'Afternoon'),
	)
	plan = (
	    ('Partial', 'Partial'),
	    ('Full', 'Full'),
	)
	# types= (
	# 	('New purchase', 'New purchase'),
	# 	('Begin inventory', 'Begin inventory'),
	# 	)
	id = models.AutoField(primary_key=True, unique=True)
	Item_category = models.ForeignKey(ItemCategory, on_delete=models.CASCADE)
	Item_type = ChainedForeignKey(ItemType, chained_field="Item_category", chained_model_field="Item_category", show_all=False, auto_choose=True, sort=True)
	Measurement = models.ForeignKey(Measurement, on_delete=models.CASCADE)
	Day_shift = models.CharField(max_length=250, choices = shift)
	Quantity = models.PositiveIntegerField()
	# Purchased_single_price = models.PositiveIntegerField()
	# Purchased_total_price	= models.PositiveIntegerField(null=True, blank=True)
	Purchased_single_price = models.DecimalField(max_digits = 11, decimal_places = 2)
	Purchased_total_price = models.DecimalField(max_digits = 11, decimal_places = 2, null=True, blank=True)
	Remark = models.CharField(max_length=250, null=True, blank=True)
	
	Created_date = models.DateField(auto_now=True)
	Created_by = CurrentUserField()
	Modified_date = models.DateTimeField(auto_now=True)
	Modified_by = CurrentUserField(related_name="updated_by1")

	def __str__(self):
		return "%s" % self.Item_type

	class Meta:
		verbose_name_plural = "Begin inventories"

	def save(self, *args, **kwargs):
		self.Purchased_total_price = self.Quantity * self.Purchased_single_price
		super(BeginInventory, self).save(*args, **kwargs)
