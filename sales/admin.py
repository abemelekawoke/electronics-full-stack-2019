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
from django.utils.html import format_html
from django.urls import reverse

class NewSaleInline(admin.TabularInline):
    model = NewSale
    extra = 0
    readonly_fields = ('Sale_single_price', 'Sale_total_price',)
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Filter Item_type based on selected category"""
        if db_field.name == "Item_type":
            # Get the sale instance if it exists
            if request.resolver_match.args:
                sale_id = request.resolver_match.args[0]
                try:
                    sale = Sale.objects.get(id=sale_id)
                    # You can add custom filtering here if needed
                except:
                    pass
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

class SaleAdmin(ImportExportModelAdmin):
    pass
    inlines = [NewSaleInline]
    fields = ['Customer_name', 'Customer_phone', 'Day_shift', 'Total']
    list_display = ['id', 'Customer_name', 'print_receipt', 'Customer_phone', 'Total', 'Day_shift','Sold_date', 'Sold_by', 'Modified_date', 'Modified_by']
    search_fields = ['Customer_name', 'Customer_phone', 'Day_shift', 'Sold_date', 'Sold_by', 'Modified_date', 'Modified_by']
    list_filter = ['Day_shift', 'Sold_date']
    list_display_links = ['id', 'Customer_name', 'Customer_phone', 'Day_shift', 'Total']
    readonly_fields = ('Total', 'Sold_by', 'Modified_date', 'Modified_by',)
    list_per_page = 10
    list_select_related = True
    
    @admin.display(description='Print Receipt')
    def print_receipt(self, obj):
        url = reverse('sale_receipt', args=[obj.pk])
        return format_html(f'<a href="{url}" target="_blank" class="button">🖨️</a>')

    # def get_actions(self, request):
    #     actions = super().get_actions(request)
    #     if 'delete_selected' in actions:
    #         del actions['delete_selected']
    #     return actions

admin.site.register(Sale, SaleAdmin)