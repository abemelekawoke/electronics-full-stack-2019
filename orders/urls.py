from django.urls import path
from .views import internal_order_receipt, external_order_receipt

urlpatterns = [
    path('in-receipt/<int:pk>/', internal_order_receipt, name='internal_order_receipt'),
    path('ex-receipt/<int:pk>/', external_order_receipt, name='external_order_receipt'),
]
