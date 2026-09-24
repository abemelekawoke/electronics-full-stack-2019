from django.urls import path
from .views import sale_receipt

urlpatterns = [
    path('sale-receipt/<int:pk>/', sale_receipt, name='sale_receipt'),
]
