from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from django.shortcuts import redirect
from django.db import connection
# from django.conf.urls import 
from django.urls import path
from django.http import HttpResponse
# import csv
from django.utils import timezone
import datetime
from datetime import datetime
from .models import *
from django.contrib.contenttypes.models import ContentType
from django.http import HttpResponseRedirect
from django_object_actions import DjangoObjectActions
# import psycopg 
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import InternalOrder

class NewInternalOrderInline(admin.TabularInline):
    model = NewInternalOrder
    extra = 0
    list_filter = ['Item_category', 'Item_type']
    readonly_fields=('Single_price', 'Total_price',)

class InternalOrderAdmin(ImportExportModelAdmin):
    pass
    inlines = [NewInternalOrderInline,]
    fields = [('Order_source', 'Day_shift'), ('Customer_name', 'Customer_phone'), ('Payment_plan', 'Item_total_price'), ('Price_paid', 'The_rest'), ('Appointment_date', 'Order_status')]
    list_display = ['id', 'Customer_name', 'print_receipt', 'Item_total_price', 'Price_paid', 'The_rest', 'Payment_plan', 'Appointment_date', 'Ordered_date', 'Ordered_by', 'Modified_date', 'Modified_by']
    search_fields = ['Customer_name', 'Customer_phone', 'Day_shift', 'Payment_plan', 'Appointment_date', 'Order_status', 'Ordered_date', 'Ordered_by', 'Modified_date', 'Modified_by']
    list_filter = ['Day_shift', 'Ordered_date']
    list_display_links = ['id', 'Customer_name', 'Item_total_price', 'Price_paid', 'The_rest', 'Payment_plan', 'Appointment_date', 'Ordered_date', 'Ordered_by', 'Modified_date', 'Modified_by']
    # list_editable = ['Order_status']
    readonly_fields = ('Order_source', 'Item_total_price', 'Ordered_date', 'Ordered_by', 'Modified_date', 'Modified_by',)
    list_per_page = 10
    list_select_related = True
    
    @admin.display(description='Print Receipt')
    def print_receipt(self, obj):
        url = reverse('internal_order_receipt', args=[obj.pk])
        return format_html(f'<a href="{url}" target="_blank" class="button">🖨️</a>')


    class Meta:
        model = InternalOrder

    def save_model(self, request, obj, form, change):
        if change:
            obj.Modified_by = request.user
            obj.Modified_date = datetime.now()
        obj.save()

    # def get_actions(self, request):
    #     actions = super().get_actions(request)
    #     if 'delete_selected' in actions:
    #         del actions['delete_selected']
    #     return actions
    
admin.site.register(InternalOrder, InternalOrderAdmin)

class NewExternalOrderInline(admin.TabularInline):
    model = NewExternalOrder
    extra = 0
    list_filter = ['Item_category', 'Item_type']
    readonly_fields=('Total_price',)

class ExternalOrderAdmin(ImportExportModelAdmin):
    pass
    inlines = [NewExternalOrderInline,]
    fields = [('Order_source', 'Day_shift'), ('Customer_name', 'Customer_phone'), ('Payment_plan', 'Item_total_price'), ('Price_paid', 'The_rest'), ('Appointment_date', 'Order_status')]
    list_display = ['id', 'Customer_name', 'print_receipt', 'Item_total_price', 'Price_paid', 'The_rest', 'Payment_plan', 'Appointment_date', 'Ordered_date', 'Ordered_by', 'Modified_date', 'Modified_by']
    search_fields = ['Customer_name', 'Customer_phone', 'Day_shift', 'Payment_plan', 'Appointment_date', 'Order_status']
    list_filter = ['Day_shift','Ordered_date']
    list_display_links = ['id', 'Customer_name', 'Item_total_price', 'Price_paid', 'The_rest', 'Payment_plan', 'Appointment_date']
    # list_editable = ['Order_status']
    readonly_fields = ('Order_source', 'Item_total_price', 'Ordered_date', 'Ordered_by', 'Modified_date', 'Modified_by',)
    list_per_page = 10
    list_select_related = True
    
    @admin.display(description='Print Receipt')
    def print_receipt(self, obj):
        url = reverse('external_order_receipt', args=[obj.pk])
        return format_html(f'<a href="{url}" target="_blank" class="button">🖨️</a>')

    class Meta:
        model = ExternalOrder
    
    def save(self, *args, **kwargs):
        self.Total_price = self.Quantity * self.Single_price
        super(ExternalOrder, self).save(*args, **kwargs)

    def save_model(self, request, obj, form, change):
        if change:
            obj.Modified_by = request.user
            obj.Modified_date = datetime.now()
        obj.save()

    # def get_actions(self, request):
    #     actions = super().get_actions(request)
    #     if 'delete_selected' in actions:
    #         del actions['delete_selected']
    #     return actions

admin.site.register(ExternalOrder, ExternalOrderAdmin)