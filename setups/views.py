from django.shortcuts import render

# Create your views here.
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *

@api_view(['GET'])
def get_active_announcement(request):
    now = timezone.now()
    
    # Find the announcement that is active AND current time is within its start/end window
    announcement = AnnouncementBar.objects.filter(
        is_active=True,
        start_date__lte=now,
        end_date__gte=now
    ).order_by('-start_date').first() # Gets the most recently started valid announcement
    
    if announcement:
        return Response({
            "text": announcement.text,
            "coupon_code": announcement.coupon_code,
            "end_date": announcement.end_date.isoformat() # Send the end date to React for an optional countdown
        })
    
    return Response(None, status=204)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ShippingMethod

@api_view(['POST'])
def calculate_shipping_options(request):
    """
    Expects JSON payload from React:
    { "cart_total": 85.00, "country": "US", "zip_code": "90210" }
    """
    cart_total = request.data.get('cart_total', 0)
    # You can expand this logic to filter by country/zip_code if needed!
    
    active_methods = ShippingMethod.objects.filter(is_active=True)
    
    options = []
    for method in active_methods:
        options.append({
            "id": method.id,
            "name": method.name,
            "cost": float(method.calculate_cost(float(cart_total))),
            "base_price": float(method.price)
        })
        
    return Response({"shipping_options": options})

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Case, When, Value, IntegerField
from .models import Partner
from .serializers import *

class PartnerListView(generics.ListAPIView):
    """
    API endpoint for listing active partners.
    Partners are ordered by tier (Platinum > Gold > Silver) and then by name.
    """
    serializer_class = PartnerSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        # Order by tier priority: Platinum (3), Gold (2), Silver (1)
        tier_order = Case(
            When(tier=Partner.Tier.PLATINUM, then=Value(3)),
            When(tier=Partner.Tier.GOLD, then=Value(2)),
            When(tier=Partner.Tier.SILVER, then=Value(1)),
            default=Value(0),
            output_field=IntegerField()
        )
        
        return Partner.active.order_by(
            -tier_order,  # Platinum first
            'name'
        ).only('id', 'name', 'slug', 'tier', 'logo', 'website')

class AnnouncementBarListView(generics.ListAPIView):
    """
    API endpoint for listing active announcement bars.
    Only returns announcements that are currently live.
    """
    serializer_class = AnnouncementBarSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        now = timezone.now()
        # Return only active announcements that are currently within date range
        return AnnouncementBar.objects.filter(
            is_active=True,
            start_date__lte=now,
            end_date__gte=now
        ).order_by('-start_date')