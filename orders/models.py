from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django_currentuser.middleware import get_current_authenticated_user
from setups.models import *
from smart_selects.db_fields import ChainedForeignKey
from store.models import Device

# Create your models here.
class InternalOrder(models.Model):
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
    status = (
        ('Pending', 'Pending'),
        ('Progress', 'Progress'),
        ('Delivered', 'Delivered'),
    )
    id = models.AutoField(primary_key=True, unique=True)
    Customer_name = models.CharField(max_length=250)
    Customer_phone = models.CharField(max_length=250, null=True, blank=True)
    Day_shift = models.CharField(max_length=250, choices=shift, blank=True, null=True, default='Morning')
    Order_source = models.CharField(max_length=250, default="Parrot Advert")
    Order_status = models.CharField(max_length=250, choices=status, null=True, blank=True, default='Pending')
    Payment_plan = models.CharField(max_length=250, choices=plan, null=True, blank=True, default='Full')
    Item_total_price = models.DecimalField(max_digits=11, decimal_places=2, null=True, blank=True, default='0')
    Price_paid = models.DecimalField(max_digits=11, decimal_places=2, null=True, blank=True, default='0')
    The_rest = models.DecimalField(max_digits=11, decimal_places=2, null=True, blank=True, default='0')
    Appointment_date = models.DateField(null=True, blank=True)

    Ordered_date = models.DateField(auto_now=True)
    Ordered_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        editable=False,
        related_name="internal_orders_ordered"
    )
    Modified_date = models.DateTimeField(auto_now=True)
    Modified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        editable=False,
        related_name="internal_orders_modified"
    )

    def __str__(self):
        return "%s" % self.Customer_name

    def save(self, *args, **kwargs):
        # Auto-set the user if not already set
        if not self.Ordered_by:
            self.Ordered_by = get_current_authenticated_user()
        
        if not self.Modified_by:
            self.Modified_by = get_current_authenticated_user()
        
        # Calculate totals from related items
        invoice_lines = NewInternalOrder.objects.filter(Internal_order=self.id)
        self.Item_total_price = 0
        for line in invoice_lines:
            self.Item_total_price += line.Total_price
            self.The_rest = self.Item_total_price - self.Price_paid
        
        super(InternalOrder, self).save(*args, **kwargs)

class NewInternalOrder(models.Model):
    severity = (
        ('Regular', 'Regular'),
        ('Urgent', 'Urgent'),
    )
    id = models.AutoField(primary_key=True)
    Internal_order = models.ForeignKey(InternalOrder, on_delete=models.CASCADE, related_name='items')
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
    Item_severity = models.CharField(max_length=250, choices=severity)
    Quantity = models.DecimalField(max_digits=11, decimal_places=2)
    Single_price = models.DecimalField(max_digits=11, decimal_places=2, null=True, blank=True)
    Total_price = models.DecimalField(max_digits=11, decimal_places=2, null=True, blank=True)

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
            self.Single_price = device.price
            
            if self.Quantity:
                self.Total_price = self.Quantity * self.Single_price
            else:
                self.Total_price = 0
                
        except Device.DoesNotExist:
            # Don't save if device doesn't exist
            raise ValidationError(f'Cannot save: No device found for {self.Item_type}')
        
        # Save the NewInternalOrder
        super(NewInternalOrder, self).save(*args, **kwargs)
        
        # Update parent order total
        if self.Internal_order:
            from django.db.models import Sum
            total = NewInternalOrder.objects.filter(Internal_order=self.Internal_order).aggregate(
                total=Sum('Total_price')
            )['total'] or 0
            
            # Update without triggering another save
            InternalOrder.objects.filter(id=self.Internal_order.id).update(Item_total_price=total)
            
            # Update The_rest
            order = self.Internal_order
            the_rest = total - order.Price_paid
            InternalOrder.objects.filter(id=self.Internal_order.id).update(The_rest=the_rest)

    class Meta:
        verbose_name = "New internal order"
        verbose_name_plural = "New internal orders"


class ExternalOrder(models.Model):
    severity = (
        ('Regular', 'Regular'),
        ('Urgent', 'Urgent'),
    )
    shift = (
        ('Morning', 'Morning'),
        ('Afternoon', 'Afternoon'),
    )
    photo = (
        ('Edited', 'Edited'),
        ('Not Edited', 'Not Edited'),
    )
    plan = (
        ('Partial', 'Partial'),
        ('Full', 'Full'),
    )
    status = (
        ('Pending', 'Pending'),
        ('Progress', 'Progress'),
        ('Delivered', 'Delivered'),
    )
    id = models.AutoField(primary_key=True, unique=True)
    Customer_name = models.CharField(max_length=250)
    Customer_phone = models.CharField(max_length=250, null=True, blank=True)
    Day_shift = models.CharField(max_length=250, choices=shift, blank=True, null=True, default='Morning')
    Order_source = models.CharField(max_length=250, default="Online")
    Order_status = models.CharField(max_length=250, choices=status, null=True, blank=True, default='Pending')
    Payment_plan = models.CharField(max_length=250, choices=plan, null=True, blank=True, default='Full')
    Item_total_price = models.DecimalField(max_digits=11, decimal_places=2, null=True, blank=True, default='0')
    Price_paid = models.DecimalField(max_digits=11, decimal_places=2, null=True, blank=True, default='0')
    The_rest = models.DecimalField(max_digits=11, decimal_places=2, null=True, blank=True, default='0')
    Appointment_date = models.DateField(null=True, blank=True)

    Ordered_date = models.DateField(auto_now=True)
    Ordered_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        editable=False,
        related_name="external_orders_ordered"
    )
    Modified_date = models.DateTimeField(auto_now=True)
    Modified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        editable=False,
        related_name="external_orders_modified"
    )

    def __str__(self):
        return "%s" % self.Customer_name

    def save(self, *args, **kwargs):
        # Auto-set the user if not already set
        if not self.Ordered_by:
            self.Ordered_by = get_current_authenticated_user()
        
        if not self.Modified_by:
            self.Modified_by = get_current_authenticated_user()
        
        # Calculate totals from related items
        invoice_lines = NewExternalOrder.objects.filter(External_order=self.id)
        self.Item_total_price = 0
        for line in invoice_lines:
            self.Item_total_price += line.Total_price
            self.The_rest = self.Item_total_price - self.Price_paid
        
        super(ExternalOrder, self).save(*args, **kwargs)


class NewExternalOrder(models.Model):
    severity = (
        ('Regular', 'Regular'),
        ('Urgent', 'Urgent'),
    )
    photo = (
        ('Edited', 'Edited'),
        ('Not Edited', 'Not Edited'),
    )
    id = models.AutoField(primary_key=True)
    External_order = models.ForeignKey(ExternalOrder, on_delete=models.CASCADE, related_name='items')
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
    Item_severity = models.CharField(max_length=250, choices=severity)
    # Photo_is = models.CharField(max_length=250, choices=photo, null=True, blank=True)  # Uncommented and fixed
    Quantity = models.DecimalField(max_digits=11, decimal_places=2)
    Single_price = models.DecimalField(max_digits=11, decimal_places=2, null=True, blank=True)
    Total_price = models.DecimalField(max_digits=11, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return "%s" % self.id

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
            self.Single_price = device.price
            
            if self.Quantity:
                self.Total_price = self.Quantity * self.Single_price
            else:
                self.Total_price = 0
                
        except Device.DoesNotExist:
            # Don't save if device doesn't exist
            raise ValidationError(f'Cannot save: No device found for {self.Item_type}')
        
        # Save the NewExternalOrder
        super(NewExternalOrder, self).save(*args, **kwargs)
        
        # Update parent order total
        if self.External_order:
            from django.db.models import Sum
            total = NewExternalOrder.objects.filter(External_order=self.External_order).aggregate(
                total=Sum('Total_price')
            )['total'] or 0
            
            # Update without triggering another save
            ExternalOrder.objects.filter(id=self.External_order.id).update(Item_total_price=total)
            
            # Update The_rest
            order = self.External_order
            the_rest = total - order.Price_paid
            ExternalOrder.objects.filter(id=self.External_order.id).update(The_rest=the_rest)

    class Meta:
        verbose_name = "New external order"
        verbose_name_plural = "New external orders"