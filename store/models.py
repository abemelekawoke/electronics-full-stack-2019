from django.db import models
from decimal import Decimal
from django.conf import settings
from setups.models import *
# start
import os
from import_export import resources
from django.db.models import Subquery, OuterRef
from django.db import connection
from django.utils import timezone
import datetime
from datetime import datetime
from django.contrib.auth.models import User
from django_currentuser.middleware import (
    get_current_user, get_current_authenticated_user)
from django_currentuser.db.models import CurrentUserField
from django.urls import reverse
from django.http import HttpResponse
from smart_selects.db_fields import ChainedForeignKey
# end
class Device(models.Model):
    PRICE_TYPE_CHOICES = [
        ('fixed', 'Fixed'),
        ('negotiable', 'Negotiable'),
    ]

    TYPE_CHOICES = [
        ('new', 'New'),
        ('used', 'Used'),
        ('refurbished', 'Refurbished'),
        ('service', 'Service'),
        ('other', 'Other'),
    ]
    id = models.AutoField(primary_key=True)
    page = models.CharField( 
        max_length=20, 
        choices=[('MATERIAL', 'Printing Material'), ('CLOTHING', 'Clothing'), ('SERVICE', 'Services')]
    )
    category = models.ForeignKey(ItemCategory, on_delete=models.CASCADE, related_name='category')
    type = ChainedForeignKey(
        ItemType, 
        chained_field="category", 
        chained_model_field="Item_category", # This must match ItemType.Item_category
        show_all=False, 
        auto_choose=True, 
        sort=True
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    item_status = models.CharField(max_length=25, choices=TYPE_CHOICES, default='new')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    price_type = models.CharField(max_length=10, choices=PRICE_TYPE_CHOICES, default='fixed')
    shipping_fee = models.CharField(max_length=21, default='Negotiable')
    stock = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    image1 = models.ImageField(upload_to='device_images/', blank=True, null=True)
    image2 = models.ImageField(upload_to='device_images/', blank=True, null=True)
    image3 = models.ImageField(upload_to='device_images/', blank=True, null=True)
    video = models.FileField(upload_to='news_videos/', blank=True, null=True)
    
    
    class Meta:
        verbose_name = 'Store'
        verbose_name_plural = 'Stores'

    def __str__(self):
        return self.name

class Order(models.Model):
    """
    Order model with state machine for payment workflow.
    
    Status transitions follow this flow:
    Deposit_Pending -> In_Production -> Balance_Due -> Final_Pay_Pending -> Ready_To_Ship -> Delivered
    
    Discount/Extra Calculation:
    - For quantity <= 10:
      - Urgent (Less than 1 day): Extra 30% -> 130%
      - Normal 2-3 days: No discount/extra -> 100%
      - Normal 7 days: Discount 5% -> 95%
      - Normal 14 days: Discount 10% -> 90%
      - Normal 1 month: Discount 13% -> 87%
      - Normal >1 month: Discount 17% -> 83%
    - For quantity > 10:
      - Urgent (Less than 1 day): Extra 20% -> 120%
      - Normal 2-3 days: Discount 5% -> 95%
      - Normal 7 days: Discount 7% -> 93%
      - Normal 14 days: Discount 12% -> 90%
      - Normal 1 month: Discount 17% -> 87%
      - Normal >1 month: Discount 20% -> 83%
    """
    
    # New status choices following the state machine
    STATUS_CHOICES = [
        ('Deposit_Pending', 'Deposit Pending'),      # Initial order, awaiting deposit
        ('In_Production', 'In Production'),          # Deposit verified, order in progress
        ('Balance_Due', 'Balance Due'),              # Ready for final payment (1 day before shipping)
        ('Final_Pay_Pending', 'Final Payment Pending'),  # Final payment uploaded, awaiting verification
        ('Ready_To_Ship', 'Ready To Ship'),         # Final payment verified, order released
        ('Shipped', 'Shipped'),                     # Order shipped
        ('Delivered', 'Delivered'),                 # Order delivered
        ('Cancelled', 'Cancelled'),                 # Order cancelled
    ]
    
    TYPE_CHOICES = [ 
        ('new', 'New'),
        ('used', 'Used'),
        ('refurbished', 'Refurbished'),
        ('service', 'Service'),
        ('other', 'Other'),
    ]
    
    # Delivery Date Choices (includes urgent option: less_than_1_day)
    DELIVERY_DATE_CHOICES = [
        ('less_than_1_day', 'Less than 1 day (Urgent)'),
        ('2_to_3_days', '2 to 3 days'),
        ('7_days', '7 days'),
        ('14_days', '14 days'),
        ('1_month', '1 month'),
        ('more_than_1_month', '>1 month'),
    ]

     # New: Gender/Fit choices for order items
    GENDER_CHOICES = [
        ('kids', 'kids'),
        ('male', 'Male'),
        ('female', 'Female'),  
        ('other', 'other'),
    ]
    
    # New: Size choices for order items
    SIZE_CHOICES = [
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
        ('XL', 'Extra Large'),
        ('2XL', 'Double XL'),
        ('3XL', 'Triple XL'),
        ('4XL', 'Quadruple XL'),
        ('custom', 'Custom Size'),
        ('other', 'Other'),
    ]
    
    # New: Color choices for order items
    COLOR_CHOICES = [
        ('black', 'Black'),
        ('white', 'White'),
        ('red', 'Red'),
        ('blue', 'Blue'),
        ('green', 'Green'),
        ('yellow', 'Yellow'),
        ('orange', 'Orange'),
        ('purple', 'Purple'),
        ('pink', 'Pink'),
        ('gray', 'Gray'),
        ('navy', 'Navy'),
        ('brown', 'Brown'),
        ('custom', 'Custom Color'),
    ]
    
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='new')
    device = models.ForeignKey(Device, on_delete=models.CASCADE, verbose_name='Item')
    quantity = models.PositiveIntegerField()
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    # Discount and Extra Percentage Fields
    delivery_date = models.CharField(max_length=30, choices=DELIVERY_DATE_CHOICES, default='2_to_3_days')
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    extra_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    calculated_total_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    
    ordered_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(default='unknown@example.com')
    phone = models.CharField(max_length=20)
    address = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Deposit_Pending')
    
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='adult', verbose_name='Fit', blank=True, null=True)
    size = models.CharField(max_length=10, choices=SIZE_CHOICES, default='M', blank=True, null=True)
    service_size_width = models.CharField(max_length=10, verbose_name='Width', help_text='በሜትር/in meter', blank=True, null=True)
    service_size_height = models.CharField(max_length=10, verbose_name='Height', help_text='በሜትር/in meter', blank=True, null=True)
    service_size = models.CharField(max_length=10, verbose_name='Width x Height', help_text='ሜትር ስኩየር', blank=True, null=True)
    color = models.CharField(max_length=20, choices=COLOR_CHOICES, default='black', blank=True, null=True)
    
    #both side design attached
    sample_design = models.ImageField(upload_to='design_images/', blank=True, null=True)
    front = models.ImageField(upload_to='design_images/', blank=True, null=True)
    back = models.ImageField(upload_to='design_images/', blank=True, null=True)
    left_image = models.ImageField(upload_to='design_images/', blank=True, null=True)
    right_image = models.ImageField(upload_to='design_images/', blank=True, null=True)
    is_portfolio = models.BooleanField(default=False)

    # Payment-related fields
    deposit_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deposit_receipt = models.ImageField(upload_to='payment_receipts/deposit/', blank=True, null=True)
    deposit_verified = models.BooleanField(default=False)
    final_payment = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_payment_receipt = models.ImageField(upload_to='payment_receipts/final/', blank=True, null=True)
    final_payment_verified = models.BooleanField(default=False)
    payment_verified = models.BooleanField(default=False)
    
    # Shipping-related fields
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    ship_date = models.DateField(blank=True, null=True)
    tracking_number = models.CharField(max_length=100, blank=True, null=True)
    
    # Admin notes
    admin_notes = models.TextField(blank=True, null=True)
    
    # Timestamps
    deposit_date = models.DateTimeField(blank=True, null=True)
    final_payment_date = models.DateTimeField(blank=True, null=True)
    description = models.TextField(max_length=250, null=True, blank=True)

    def __str__(self):
        options = []
        if self.gender and self.gender != 'adult':
            options.append(self.get_gender_display())
        if self.size and self.size != 'M':
            options.append(self.size)
        if self.color and self.color != 'black':
            options.append(self.color)
        option_str = f" ({', '.join(options)})" if options else ""
        return f'Order {self.id} - {self.device.name}{option_str}'
    
    def calculate_discount_and_extra(self):
        """
        Calculate discount and extra percentage based on quantity and delivery date.
        
        Discount/Extra Table:
        - Quantity <= 10:
          - less_than_1_day: Extra 30% -> 130%
          - 2_to_3_days: No discount/extra -> 100%
          - 7_days: Discount 5% -> 95%
          - 14_days: Discount 10% -> 90%
          - 1_month: Discount 13% -> 87%
          - more_than_1_month: Discount 17% -> 83%
        - Quantity > 10:
          - less_than_1_day: Extra 20% -> 120%
          - 2_to_3_days: Discount 5% -> 95%
          - 7_days: Discount 7% -> 93%
          - 14_days: Discount 10% -> 90%
          - 1_month: Discount 13% -> 87%
          - more_than_1_month: Discount 17% -> 83%
        
        Returns:
            tuple: (discount_percentage, extra_percentage, calculated_total_percentage)
        """
        discount = 0
        extra = 0
        
        # Determine percentage based on quantity and delivery date
        if self.quantity <= 10:
            # For quantity <= 10
            if self.delivery_date == 'less_than_1_day':
                # Urgent: Extra 30%
                extra = 30
            elif self.delivery_date == '2_to_3_days':
                discount = 0
            elif self.delivery_date == '7_days':
                discount = 5
            elif self.delivery_date == '14_days':
                discount = 10
            elif self.delivery_date == '1_month':
                discount = 13
            elif self.delivery_date == 'more_than_1_month':
                discount = 17
            else:
                discount = 0
        else:
            # For quantity > 10
            if self.delivery_date == 'less_than_1_day':
                # Urgent: Extra 20%
                extra = 20
            elif self.delivery_date == '2_to_3_days':
                discount = 5
            elif self.delivery_date == '7_days':
                discount = 7
            elif self.delivery_date == '14_days':
                discount = 10
            elif self.delivery_date == '1_month':
                discount = 13
            elif self.delivery_date == 'more_than_1_month':
                discount = 17
            else:
                discount = 5
        
        # Calculate total percentage (100 + extra - discount)
        calculated_total = 100 + extra - discount
        
        return discount, extra, calculated_total
    
    def save(self, *args, **kwargs):
        """Override save to calculate discount and extra before saving."""
        self.discount_percentage, self.extra_percentage, self.calculated_total_percentage = self.calculate_discount_and_extra()
        

        self.base_price = self.device.price * self.quantity
        self.total_price = self.base_price * Decimal(self.calculated_total_percentage / 100)
        
        super().save(*args, **kwargs)
    
    @property
    def final_total_price(self):
        """
        Final total price (now stored in total_price field)
        """
        return self.total_price
    
    @property
    def balance_due(self):
        """
        Calculate balance using formula: Balance = Total_Order_Price - Deposit_Paid
        This is a dynamic calculation, never hardcode values.
        """
        return self.total_price - self.deposit_paid
    
    @property
    def is_balance_due(self):
        """Check if order has balance due."""
        return self.balance_due > 0
    
    @property
    def deposit_percentage(self):
        """Calculate deposit percentage of total price."""
        if self.total_price > 0:
            return (self.deposit_paid / self.total_price) * 100
        return 0
    
class News(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    published_at = models.DateTimeField(auto_now_add=True)
    
    image = models.ImageField(upload_to='news_images/', blank=True, null=True)
    video = models.FileField(upload_to='news_videos/', blank=True, null=True)
    class Meta:
        verbose_name_plural = "News"

    def __str__(self):
        return self.title
    
class OrderReview(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='reviews')
    email = models.EmailField()
    rating = models.PositiveIntegerField(choices=[(i, f"{i} Star{'s' if i > 1 else ''}") for i in range(1,6)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('order', 'email')
        verbose_name_plural = "Order Reviews"

    def __str__(self):
        return f"Review for Order {self.order.id} by {self.email} ({self.rating}/5)"


class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name}"

    