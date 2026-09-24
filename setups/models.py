from django.db import models
import os
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
from smart_selects.db_fields import ChainedForeignKey

class Measurement(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=100)
    description = models.CharField(max_length=250)

    def __str__(self):
        return "%s" % self.name
# Create your models here.
class ItemCategory(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=100)
    description = models.CharField(max_length=250)
    
    def __str__(self):
        return "%s" % self.name
    
    class Meta:
        verbose_name_plural = "Categories"

class ItemType(models.Model):
    # id = models.AutoField(primary_key=True, unique=True)
    Item_category = models.ForeignKey(ItemCategory, on_delete=models.CASCADE)
    name = models.CharField(unique=True, max_length=100)
    description = models.CharField(max_length=250)

    def __str__(self):
        return "%s" % self.name

import uuid
from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

class ActivePartnerManager(models.Manager):
    """Custom manager to easily fetch active partners."""
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)

def validate_logo_size(image):
    """Prevents uploading massive images that break frontend layouts."""
    file_size = image.file.size
    limit_mb = 2
    if file_size > limit_mb * 1024 * 1024:
        raise ValidationError(f"Max file size is {limit_mb}MB")

class Partner(models.Model):
    class Tier(models.TextChoices):
        SILVER = 'SILVER', 'Silver Tier'
        GOLD = 'GOLD', 'Gold Tier'
        PLATINUM = 'PLATINUM', 'Platinum Tier'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    tier = models.CharField(max_length=15, choices=Tier.choices, default=Tier.SILVER)
    
    # Assets & Web
    logo = models.ImageField(
        upload_to='partners/logos/%Y/%m/', 
        validators=[validate_logo_size, FileExtensionValidator(['jpg', 'jpeg', 'png', 'svg'])],
        blank=True, 
        null=True
    )
    website = models.URLField(blank=True)
    
    # Status & Logistics
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Managers
    active = ActivePartnerManager()  # Fallback/default shifts to standard manager behavior behind the scenes

    class Meta:
        ordering = ['-tier', 'name']
        verbose_name = "Corporate Partner"
        verbose_name_plural = "Corporate Partners"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.get_tier_display()})"
    
from django.db import models
from django.utils import timezone

from django.db import models
from django.utils import timezone

class AnnouncementBar(models.Model):
    text = models.CharField(max_length=255, help_text="e.g., Flash Sale! 20% off everything!")
    coupon_code = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True, help_text="Master switch to turn this off manually.")
    
    # Scheduling fields
    start_date = models.DateTimeField(default=timezone.now, help_text="When the announcement should start showing.")
    end_date = models.DateTimeField(
        default=timezone.now,  # Add default to prevent migration errors
        help_text="When the announcement should automatically disappear."
    )

    def __str__(self):
        return self.text

    @property
    def is_currently_live(self):
        now = timezone.now()
        return self.is_active and (self.start_date <= now <= self.end_date)

    class Meta:
        ordering = ['-start_date']
    
from django.db import models

class ShippingMethod(models.Model):
    name = models.CharField(max_length=100, help_text="e.g., Standard Ground, Express Delivery")
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Base cost for this method")
    
    # Conditional logic triggers
    free_shipping_threshold = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True, 
        help_text="Free if cart total is greater than or equal to this amount"
    )
    is_active = models.BooleanField(default=True)

    def calculate_cost(self, cart_total):
        """Determines if the customer qualifies for free shipping tiers."""
        if self.free_shipping_threshold and cart_total >= self.free_shipping_threshold:
            return 0.00
        return self.price

    def __str__(self):
        return f"{self.name} (${self.price})"