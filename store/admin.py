# admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import *
from django.utils.safestring import mark_safe
# start
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
# end
class DeviceAdmin(ImportExportModelAdmin):
    list_display = ('id', 'page', 'category', 'name', 'item_status', 'type', 'price', 'price_type', 'shipping_fee', 'stock', 'created_at')
    list_display_links = ('id', 'page', 'category', 'name', 'item_status', 'type', 'price', 'price_type', 'stock', 'created_at')
    list_filter = ('page', 'price_type', 'created_at')
    search_fields = ('name', 'description')
    save_on_top = True
    fieldsets = ( 
        (None, {
            'fields': (('page', 'category', 'type'), ('name', 'description', 'item_status'), ('price', 'price_type', 'shipping_fee', 'stock'), ('image1', 'image2', 'image3', 'video'))
        }),
        ('Date Information', {
            'fields': ('created_at',),
            'classes': ('collapse',),  # Hide by default, can be expanded if needed
        }),
    )

    readonly_fields = ('created_at',)  # Make 'created_at' read-only

class OrderAdmin(admin.ModelAdmin):
    """
    Order Admin with beautiful presentation and payment verification features.
    """
    list_display = (
        'id', 
        'get_device_name', 
        'gender',
        'size',
        'color',
        'quantity',
        'status_badge',
        'deposit_badge',
        'final_payment_badge',
        'total_price',
        'balance_due_display', # New: Quickly see what's left to pay
        'ordered_at', 
        'name',
    )
    list_display_links = (
        'id', 
        'get_device_name', 
        'gender',
        'size',
        'color',
        'quantity',
        'status_badge',
        'deposit_badge',
        'final_payment_badge',
        'total_price',
        'balance_due_display', # New: Quickly see what's left to pay
        'ordered_at', 
        'name',
    )
    list_filter = (
        'status', 
        'deposit_verified', 
        'final_payment_verified',
        'gender',
        'type',
        'delivery_date',
        'ordered_at'
    )
    search_fields = ('name', 'email', 'phone', 'address', 'id')
    readonly_fields = (
        'id', 'ordered_at', 'deposit_date', 'final_payment_date',
        'display_deposit_receipt', 'display_final_receipt' # Names must match exactly below
    )
    ordering = ('-ordered_at',)
    date_hierarchy = 'ordered_at'
    
    actions = ['verify_deposits', 'verify_final_payments', 'mark_ready_to_ship']
    
    fieldsets = (
        ('Order Information', {
            'fields': (
                ('id', 'ordered_at'), 
                ('device', 'type', 'quantity'),
                ('base_price', 'total_price', 'status'),
                ('gender', 'size', 'color'),
                ('service_size_width', 'service_size_height', 'service_size'),
                ('sample_design', 'front', 'back', 'left_image', 'right_image', 'is_portfolio')
            ),
        }),
        ('Payment Information', {
            'fields': (
                ('deposit_paid', 'deposit_verified', 'deposit_date'),
                'display_deposit_receipt', # Use the display method here
                ('final_payment', 'final_payment_verified', 'final_payment_date'),
                'display_final_receipt',   # Use the display method here
                'payment_verified'
            )
        }),
        ('Customer Details', {
            'fields': ('name', ('email', 'phone'), ('address', 'description')),
            'classes': ('collapse',)
        }),
        ('Shipping Information', {
            'fields': ('shipping_fee', 'ship_date', 'tracking_number', 'admin_notes'),
            'classes': ('collapse',)
        }),
    )
    def deposit_receipt_preview(self, obj):
        if obj.deposit_receipt:
            return format_html('<img src="{}" style="width: 50px; height: auto; border-radius: 4px;" />', obj.deposit_receipt.url)
        return "No Receipt"
    deposit_receipt_preview.short_description = 'Receipt'

    def balance_due_display(self, obj):
        amount = obj.balance_due
        color = "red" if amount > 0 else "green"
        return format_html('<span style="color: {}; font-weight: bold;">${}</span>', color, amount)
    balance_due_display.short_description = 'Balance Due'

    # Optimization: Add 'image_tag' for receipts in the details view
    readonly_fields = (
        'id', 'ordered_at', 'deposit_date', 'final_payment_date',
        'display_deposit_receipt', 'display_final_receipt'
    )
    # 1. Add the missing method for the Final Receipt
    def display_final_receipt(self, obj):
        if obj.final_payment_receipt:
            return format_html(
                '<a href="{0}" target="_blank"><img src="{0}" style="max-width: 300px; border: 1px solid #ccc;" /></a>', 
                obj.final_payment_receipt.url
            )
        return "No final payment receipt uploaded"
    display_final_receipt.short_description = 'Final Payment Receipt Preview'
    
    # 2. Add the method for the Deposit Receipt (if you haven't already)
    def display_deposit_receipt(self, obj):
        if obj.deposit_receipt:
            return format_html(
                '<a href="{0}" target="_blank"><img src="{0}" style="max-width: 300px; border: 1px solid #ccc;" /></a>', 
                obj.deposit_receipt.url
            )
        return "No deposit receipt uploaded"
    display_deposit_receipt.short_description = 'Deposit Receipt Preview'
    
    def get_device_name(self, obj):
        return obj.device.name
    get_device_name.short_description = 'Device'
    get_device_name.admin_order_field = 'device__name'
    
    def status_badge(self, obj):
        colors = {
            'Deposit_Pending': 'orange',
            'In_Production': 'blue',
            'Balance_Due': 'red',
            'Final_Pay_Pending': 'purple',
            'Ready_To_Ship': 'green',
            'Shipped': 'teal',
            'Delivered': 'darkgreen',
            'Cancelled': 'gray',
        }
        color = colors.get(obj.status, 'black')
        return format_html(
            '<span style="color: white; background-color: {}; padding: 3px 10px; border-radius: 12px; font-size: 11px;">{}</span>',
            color,
            obj.status.replace('_', ' ')
        )
    status_badge.short_description = 'Status'
    
    # def deposit_badge(self, obj):
    #     if obj.deposit_verified:
    #         return format_html(
    #             '<span style="color: white; background-color: green; padding: 3px 10px; border-radius: 12px; font-size: 11px;">✓ Verified</span>'
    #         )
    #     elif obj.deposit_paid > 0:
    #         return format_html(
    #             '<span style="color: white; background-color: orange; padding: 3px 10px; border-radius: 12px; font-size: 11px;">⏳ Pending</span>'
    #         )
    #     return format_html(
    #         '<span style="color: white; background-color: gray; padding: 3px 10px; border-radius: 12px; font-size: 11px;">Not Paid</span>'
    #     )
    # deposit_badge.short_description = 'Deposit'
    

    def deposit_badge(self, obj):
        if obj.deposit_verified:
            return mark_safe(
                '<span style="color: white; background-color: green; padding: 3px 10px; border-radius: 12px; font-size: 11px;">✓ Verified</span>'
            )
        elif obj.deposit_paid > 0:
            return mark_safe(
                '<span style="color: white; background-color: orange; padding: 3px 10px; border-radius: 12px; font-size: 11px;">⏳ Pending</span>'
            )
        return mark_safe(
            '<span style="color: white; background-color: gray; padding: 3px 10px; border-radius: 12px; font-size: 11px;">Not Paid</span>'
        )
    deposit_badge.short_description = 'Deposit'

    # def final_payment_badge(self, obj):
    #     if obj.final_payment_verified:
    #         return format_html(
    #             '<span style="color: white; background-color: green; padding: 3px 10px; border-radius: 12px; font-size: 11px;">✓ Verified</span>'
    #         )
    #     elif obj.final_payment > 0:
    #         return format_html(
    #             '<span style="color: white; background-color: orange; padding: 3px 10px; border-radius: 12px; font-size: 11px;">⏳ Pending</span>'
    #         )
    #     return format_html(
    #         '<span style="color: white; background-color: gray; padding: 3px 10px; border-radius: 12px; font-size: 11px;">Not Paid</span>'
    #     )
    # final_payment_badge.short_description = 'Final Payment'
    
    def final_payment_badge(self, obj):
        if obj.final_payment_verified:
            return mark_safe(
                '<span style="color: white; background-color: green; padding: 3px 10px; border-radius: 12px; font-size: 11px;">✓ Verified</span>'
            )
        elif obj.final_payment > 0:
            return mark_safe(
                '<span style="color: white; background-color: orange; padding: 3px 10px; border-radius: 12px; font-size: 11px;">⏳ Pending</span>'
            )
        return mark_safe(
            '<span style="color: white; background-color: gray; padding: 3px 10px; border-radius: 12px; font-size: 11px;">Not Paid</span>'
        )
    final_payment_badge.short_description = 'Final Payment'
    
    def final_total_price_display(self, obj):
        return format_html(
            '<strong>{}</strong>',
            obj.final_total_price
        )
    final_total_price_display.short_description = 'Final Total (total_price)'
    
    @admin.action(description='Verify selected deposits')
    def verify_deposits(self, request, queryset):
        from .order_status import OrderStatusMachine
        updated = 0
        for order in queryset:
            if order.deposit_receipt:
                success, msg = OrderStatusMachine.verify_deposit(order, verified=True)
                if success:
                    updated += 1
        self.message_user(request, f'{updated} deposit(s) verified successfully.')
    
    @admin.action(description='Verify final payments and ready to ship')
    def verify_final_payments(self, request, queryset):
        from .order_status import OrderStatusMachine
        updated = 0
        for order in queryset:
            if order.final_payment_receipt:
                success, msg = OrderStatusMachine.verify_final_payment(order, verified=True)
                if success:
                    updated += 1
        self.message_user(request, f'{updated} final payment(s) verified and ready to ship.')
    
    @admin.action(description='Mark as Ready to Ship')
    def mark_ready_to_ship(self, request, queryset):
        updated = 0
        for order in queryset:
            if order.status == 'Final_Pay_Pending' and order.final_payment_verified:
                order.status = 'Ready_To_Ship'
                order.save()
                updated += 1
        self.message_user(request, f'{updated} order(s) marked as Ready to Ship.')

admin.site.register(Device, DeviceAdmin)
admin.site.register(Order, OrderAdmin)

@admin.register(OrderReview)
class OrderReviewAdmin(admin.ModelAdmin):
    list_display = ('order', 'email', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('email', 'comment', 'order__id')
    readonly_fields = ('created_at',)

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'published_at')
    search_fields = ('title', 'description')

class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'submitted_at')
    list_filter = ('submitted_at',)
    search_fields = ('name', 'email', 'message')

admin.site.register(ContactMessage, ContactMessageAdmin)

