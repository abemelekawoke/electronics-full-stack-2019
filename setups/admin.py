from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from django.shortcuts import redirect
from django.db import connection
#from django.conf.urls import url
from django.http import HttpResponse
# import csv
from django.utils import timezone
import datetime
from datetime import datetime
from .models import *
from django.contrib.contenttypes.models import ContentType
from django.http import HttpResponseRedirect

class MeasurementAdmin(ImportExportModelAdmin):
    pass
    fields = ['name', 'description']
    list_display = ['name', 'description']
    search_fields = ['name', 'description']
    list_filter = ['name']
    list_display_links = ['name', 'description']
    # readonly_fields = ('id')
    list_per_page = 10
    list_select_related = True

    class Meta:
        model = Measurement

admin.site.register(Measurement, MeasurementAdmin)

class ItemCategoryAdmin(ImportExportModelAdmin):
    pass
    fields = ['name', 'description']
    list_display = ['id', 'name', 'description']
    search_fields = ['id', 'name', 'description']
    list_filter = ['name']
    list_display_links = ['id', 'name', 'description']
    # readonly_fields = ('id')
    list_per_page = 10
    list_select_related = True


    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions

    class Meta:
        model = ItemCategory

admin.site.register(ItemCategory, ItemCategoryAdmin)


class ItemTypeAdmin(ImportExportModelAdmin):
    pass
    fields = ['Item_category', 'name', 'description']
    list_display = ['Item_category', 'name', 'description']
    search_fields = ['Item_category', 'name', 'description']
    list_filter = ['Item_category']
    list_display_links = ['Item_category', 'name', 'description']
    # readonly_fields = ('id')
    list_per_page = 10
    list_select_related = True


    # def get_actions(self, request):
    #     actions = super().get_actions(request)
    #     if 'delete_selected' in actions:
    #         del actions['delete_selected']
    #     return actions

    class Meta:
        model = ItemType

admin.site.register(ItemType, ItemTypeAdmin)

# class ItemPriceAdmin(ImportExportModelAdmin):
#     pass
#     fields = [('Item_category', 'Item_type'), ('Sale_single_price','Day_shift')]
#     list_display = ['Item_category', 'Item_type', 'Sale_single_price', 'Day_shift']
#     search_fields = ['Item_category', 'Item_type', 'Sale_single_price', 'Day_shift']
#     list_filter = ['Item_category','Item_type', 'Day_shift', 'Created_date', 'Day_shift']
#     list_display_links = ['Item_category', 'Item_type', 'Sale_single_price', 'Day_shift']
#     readonly_fields = ('Created_date', 'Created_by', 'Modified_date', 'Modified_by',)
#     list_per_page = 10
#     list_select_related = True


#     def get_actions(self, request):
#         actions = super().get_actions(request)
#         if 'delete_selected' in actions:
#             del actions['delete_selected']
#         return actions

#     class Meta:
#         model = ItemPrice

# admin.site.register(ItemPrice, ItemPriceAdmin)

import csv
from django.contrib import admin
from django.http import HttpResponse
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import Partner

@admin.action(description="Export selected partners to CSV")
def export_to_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="partners_export.csv"'
    writer = csv.writer(response)
    
    writer.writerow(['Name', 'Tier', 'Website', 'Is Active', 'Date Added'])
    for partner in queryset:
        writer.writerow([partner.name, partner.get_tier_display(), partner.website, partner.is_active, partner.created_at])
    return response

@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ('display_logo', 'name', 'colored_tier', 'is_active', 'created_at')
    list_display_links = ('display_logo', 'name', 'colored_tier', 'is_active', 'created_at')
    list_filter = ('tier', 'is_active', 'created_at')
    search_fields = ('name', 'website')
    prepopulated_fields = {'slug': ('name',)}
    actions = [export_to_csv, 'toggle_active_status']

    # Adjusted Layout
    fieldsets = (
        ('Core Overview', {
            'fields': ('name', 'slug', ('tier', 'is_active')),
            'description': 'Main identification details for this partner.'
        }),
        ('Assets & Links', {
            'fields': ('logo', 'website'),
        }),
    )

    @admin.display(description="Logo")
    def display_logo(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="max-height: 40px; width: auto; border-radius: 4px;" />', obj.logo.url)
        return mark_safe('<span style="color: #999;">No Image</span>')

    @admin.display(description="Tier", ordering="tier")
    def colored_tier(self, obj):
        colors = {
            'SILVER': '#6c757d',
            'GOLD': '#ffc107',
            'PLATINUM': '#0dcaf0'
        }
        text_color = '#000' if obj.tier == 'GOLD' else '#fff'
        return format_html(
            '<span style="background-color: {}; color: {}; padding: 3px 10px; border-radius: 12px; font-weight: bold; font-size: 11px;">{}</span>',
            colors.get(obj.tier, '#6c757d'), text_color, obj.get_tier_display()
        )

    @admin.action(description="Toggle active/inactive status")
    def toggle_active_status(self, request, queryset):
        for partner in queryset:
            partner.is_active = not partner.is_active
            partner.save()
        self.message_user(request, "Selected partners' statuses have been updated successfully.")

from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from .models import AnnouncementBar

@admin.register(AnnouncementBar)
class AnnouncementBarAdmin(admin.ModelAdmin):
    # 1. Clean up the main list view with readable columns
    list_display = ('text_preview', 'coupon_code_badge', 'schedule_status', 'start_date', 'end_date', 'time_remaining', 'is_active')
    list_filter = ('is_active', 'start_date', 'end_date')
    search_fields = ('text', 'coupon_code')
    actions = ['activate_announcements', 'deactivate_announcements']

    # 2. Organize the editing form into logical sections
    fieldsets = (
        ('Content Configuration', {
            'fields': ('text', 'coupon_code'),
            'description': 'Define what the customer sees on the banner.'
        }),
        ('Scheduling & Rules', {
            'fields': ('start_date', 'end_date', 'is_active'),
            'description': 'Control precisely when this banner goes live or expires.'
        }),
    )

    # --- Custom Visual Enhancements ---

    def text_preview(self, obj):
        """Truncates long text so the table stays clean."""
        return obj.text[:60] + "..." if len(obj.text) > 60 else obj.text
    text_preview.short_description = "Announcement Text"

    def coupon_code_badge(self, obj):
        """Displays the coupon code as a pill badge or a dim dash if empty."""
        if obj.coupon_code:
            return format_html(
                '<span style="background: #e0f2fe; color: #0369a1; padding: 3px 8px; '
                'border-radius: 4px; font-family: monospace; font-weight: bold; border: 1px solid #bae6fd;">'
                '{}</span>', obj.coupon_code
            )
        return format_html('<span style="color: #9ca3af;">—</span>')
    coupon_code_badge.short_description = "Coupon Code"

    def schedule_status(self, obj):
        """Displays real-time status badges: Live, Scheduled, or Expired."""
        now = timezone.now()
        if not obj.is_active:
            return format_html('<span style="background: #f3f4f6; color: #4b5563; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;">DISABLED</span>')
        if obj.start_date <= now <= obj.end_date:
            return format_html('<span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;">● LIVE</span>')
        elif obj.start_date > now:
            return format_html('<span style="background: #fef9c3; color: #a16207; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;">SCHEDULED</span>')
        else:
            return format_html('<span style="background: #fee2e2; color: #b91c1c; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;">EXPIRED</span>')
    schedule_status.short_description = "Status"

    def time_remaining(self, obj):
        """Calculates and displays a running text counter of time left/elapsed."""
        now = timezone.now()
        if obj.start_date <= now <= obj.end_date:
            delta = obj.end_date - now
            days = delta.days
            hours = delta.seconds // 3600
            minutes = (delta.seconds // 60) % 60
            if days > 0:
                return f"{days}d {hours}h left"
            return f"{hours}h {minutes}m left"
        elif obj.start_date > now:
            delta = obj.start_date - now
            return f"Starts in {delta.days}d"
        return "Ended"
    time_remaining.short_description = "Time Window"

    # --- Bulk Quick Actions ---

    def activate_announcements(self, request, queryset):
        queryset.update(is_active=True)
    activate_announcements.short_description = "🟢 Mark selected as Active (Master Switch)"

    def deactivate_announcements(self, request, queryset):
        queryset.update(is_active=False)
    deactivate_announcements.short_description = "🔴 Mark selected as Inactive (Master Switch)"

from django.contrib import admin
from django.utils.html import format_html
from .models import ShippingMethod

@admin.register(ShippingMethod)
class ShippingMethodAdmin(admin.ModelAdmin):
    # 1. Main table columns setup
    list_display = ('name', 'formatted_base_price', 'free_shipping_threshold_badge', 'status_badge')
    list_filter = ('is_active',)
    search_fields = ('name',)
    ordering = ('price',)
    actions = ['activate_methods', 'deactivate_methods']

    # 2. Organize forms into clean visual sections
    fieldsets = (
        ('General Details', {
            'fields': ('name', 'is_active'),
            'description': 'Configure the method name visible to your customers at checkout.'
        }),
        ('Pricing & Rules', {
            'fields': ('price', 'free_shipping_threshold'),
            'description': 'Set your core pricing or configure spending thresholds to automatically unlock free shipping.'
        }),
    )

    # --- HTML Visual Enhancements ---

    def formatted_base_price(self, obj):
        """Displays base price format."""
        return f"${obj.price:,.2f}"
    formatted_base_price.short_description = "Base Cost"

    def free_shipping_threshold_badge(self, obj):
        """Displays threshold rules as clear, distinct badges."""
        if obj.free_shipping_threshold:
            # Step 1: Format the number safely into a plain string first
            formatted_price = f"{obj.free_shipping_threshold:,.2f}"
            
            # Step 2: Pass the plain string safely into format_html using standard {}
            return format_html(
                '<span style="background: #eff6ff; color: #1d4ed8; padding: 3px 8px; '
                'border-radius: 4px; font-weight: 500; border: 1px solid #bfdbfe;">'
                'Free over ${}</span>', formatted_price
            )
        return format_html('<span style="color: #6b7280; font-style: italic;">Always Flat Rate</span>')
    free_shipping_threshold_badge.short_description = "Free Shipping Rule"

    def status_badge(self, obj):
        """Renders green or gray toggle status pills."""
        if obj.is_active:
            return format_html(
                '<span style="background: #dcfce7; color: #15803d; padding: 4px 10px; '
                'border-radius: 12px; font-size: 11px; font-weight: bold;">ACTIVE</span>'
            )
        return format_html(
            '<span style="background: #f3f4f6; color: #4b5563; padding: 4px 10px; '
            'border-radius: 12px; font-size: 11px; font-weight: bold;">DISABLED</span>'
        )
    status_badge.short_description = "Status"

    # --- Bulk Selection Actions ---

    def activate_methods(self, request, queryset):
        queryset.update(is_active=True)
    activate_methods.short_description = "🟢 Enable selected delivery options"

    def deactivate_methods(self, request, queryset):
        queryset.update(is_active=False)
    deactivate_methods.short_description = "🔴 Disable selected delivery options"