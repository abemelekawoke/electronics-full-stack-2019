from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from django.shortcuts import redirect
from django.db import connection
from django.conf.urls import *
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

class PurchaseAdmin(ImportExportModelAdmin):
    pass
    fields = [('Item_category', 'Item_type', 'Day_shift'), ('Measurement'), ('Quantity', 'Purchased_single_price', 'Purchased_total_price'), ('Remark'),('Created_date', 'Created_by'), ('Modified_date', 'Modified_by')]
    list_display = ['Item_category', 'Item_type', 'Quantity', 'Purchased_single_price', 'Purchased_total_price']
    search_fields = ['Item_category', 'Item_type', 'Measurement', 'Day_shift', 'Quantity', 'Purchased_single_price', 'Purchased_total_price', 'Remark','Created_date', 'Created_by', 'Modified_date', 'Modified_by']
    list_filter = ['Item_category', 'Item_type', 'Day_shift', 'Created_date']
    list_display_links = ['Item_category', 'Item_type', 'Quantity', 'Purchased_single_price', 'Purchased_total_price']
    readonly_fields = ('Purchased_total_price', 'Created_date', 'Created_by', 'Modified_date', 'Modified_by')
    list_per_page = 10
    list_select_related = True

    class Meta:
        model = PurchasedInventory

    def save_model(self, request, obj, form, change):
        if change:
            obj.Modified_by = request.user
            obj.Modified_date = datetime.now()
        obj.save()

    def Delivered(self, request, queryset):
        queryset.update(Order_status=Delivered)
# 
    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions

admin.site.register(PurchasedInventory, PurchaseAdmin)

class InventoryAdmin(ImportExportModelAdmin):
    pass
    fields = [('Item_category', 'Item_type', 'Day_shift'), ('Measurement', 'Quantity'), ('Purchased_single_price', 'Purchased_total_price'), ('Remark'),('Created_date', 'Created_by'), ('Modified_date', 'Modified_by')]
    list_display = ['Item_category', 'Item_type', 'Quantity', 'Purchased_single_price', 'Purchased_total_price']
    search_fields = ['Item_category', 'Item_type', 'Measurement', 'Day_shift', 'Quantity', 'Purchased_single_price', 'Purchased_total_price', 'Remark','Created_date', 'Created_by', 'Modified_date', 'Modified_by']
    list_filter = ['Item_category', 'Item_type', 'Day_shift', 'Created_date']
    list_display_links = ['Item_category', 'Item_type', 'Quantity', 'Purchased_single_price', 'Purchased_total_price']
    readonly_fields = ('Purchased_total_price', 'Created_date', 'Created_by', 'Modified_date', 'Modified_by')
    list_per_page = 10
    list_select_related = True

    class Meta:
        model = BeginInventory

    def save_model(self, request, obj, form, change):
    	if change:
    		obj.Modified_by = request.user
    		obj.Modified_date = datetime.now()
    	obj.save()

    # actions = ["Progress"]

    def Progress(self, request, queryset):
        queryset.update(Order_status=Progress)

    def Delivered(self, request, queryset):
        queryset.update(Order_status=Delivered)
# 
    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions


admin.site.register(BeginInventory, InventoryAdmin)

# # The new shahura inventory starts here
# class ShahuraPurchaseAdmin(ImportExportModelAdmin):
#     pass
#     fields = [('Item_category', 'Item_type', 'Day_shift'), ('Measurement'), ('Quantity', 'Purchased_single_price', 'Purchased_total_price'), ('Remark'),('Created_date', 'Created_by'), ('Modified_date', 'Modified_by')]
#     list_display = ['Item_category', 'Item_type', 'Quantity', 'Purchased_single_price', 'Purchased_total_price']
#     search_fields = ['Item_category', 'Item_type', 'Measurement', 'Day_shift', 'Quantity', 'Purchased_single_price', 'Purchased_total_price', 'Remark','Created_date', 'Created_by', 'Modified_date', 'Modified_by']
#     list_filter = ['Item_category', 'Item_type', 'Day_shift', 'Created_date']
#     list_display_links = ['Item_category', 'Item_type', 'Quantity', 'Purchased_single_price', 'Purchased_total_price']
#     readonly_fields = ('Purchased_total_price', 'Created_date', 'Created_by', 'Modified_date', 'Modified_by')
#     list_per_page = 10
#     list_select_related = True

#     class Meta:
#         model = ShahuraPurchasedInventory

#     def save_model(self, request, obj, form, change):
#         if change:
#             obj.Modified_by = request.user
#             obj.Modified_date = datetime.now()
#         obj.save()

#     def Delivered(self, request, queryset):
#         queryset.update(Order_status=Delivered)
# # 
#     def get_actions(self, request):
#         actions = super().get_actions(request)
#         if 'delete_selected' in actions:
#             del actions['delete_selected']
#         return actions

# admin.site.register(ShahuraPurchasedInventory, ShahuraPurchaseAdmin)

# class ShahuraInventoryAdmin(ImportExportModelAdmin):
#     pass
#     fields = [('Item_category', 'Item_type', 'Day_shift'), ('Measurement', 'Quantity'), ('Purchased_single_price', 'Purchased_total_price'), ('Remark'),('Created_date', 'Created_by'), ('Modified_date', 'Modified_by')]
#     list_display = ['Item_category', 'Item_type', 'Quantity', 'Purchased_single_price', 'Purchased_total_price']
#     search_fields = ['Item_category', 'Item_type', 'Measurement', 'Day_shift', 'Quantity', 'Purchased_single_price', 'Purchased_total_price', 'Remark','Created_date', 'Created_by', 'Modified_date', 'Modified_by']
#     list_filter = ['Item_category', 'Item_type', 'Day_shift', 'Created_date']
#     list_display_links = ['Item_category', 'Item_type', 'Quantity', 'Purchased_single_price', 'Purchased_total_price']
#     readonly_fields = ('Purchased_total_price', 'Created_date', 'Created_by', 'Modified_date', 'Modified_by')
#     list_per_page = 10
#     list_select_related = True

#     class Meta:
#         model = ShahuraBeginInventory

#     def save_model(self, request, obj, form, change):
#         if change:
#             obj.Modified_by = request.user
#             obj.Modified_date = datetime.now()
#         obj.save()

#     # actions = ["Progress"]

#     def Progress(self, request, queryset):
#         queryset.update(Order_status=Progress)

#     def Delivered(self, request, queryset):
#         queryset.update(Order_status=Delivered)
# # 
#     def get_actions(self, request):
#         actions = super().get_actions(request)
#         if 'delete_selected' in actions:
#             del actions['delete_selected']
#         return actions


# admin.site.register(ShahuraBeginInventory, ShahuraInventoryAdmin)