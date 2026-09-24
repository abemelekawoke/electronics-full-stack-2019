from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DeviceViewSet, OrderViewSet, ItemCategoryViewSet, 
    ContactMessageViewSet, NewsViewSet, OrderReviewViewSet,
    get_user_orders, order_review
)

router = DefaultRouter()
router.register(r'devices', DeviceViewSet, basename='device')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'categories', ItemCategoryViewSet, basename='category')
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'news', NewsViewSet, basename='news')
router.register(r'reviews', OrderReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
    path('user-orders/', get_user_orders, name='user_orders'),
    path('orders/<int:order_id>/review/', order_review, name='order_review'),
]