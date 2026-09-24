from rest_framework import serializers
from .models import *
from setups.models import ItemCategory, ItemType  # Import the models

# ============ CATEGORY SERIALIZER ============
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategory
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemType
        fields = ['id', 'Item_category', 'name', 'description']
        read_only_fields = ['id']

# ============ PARTNER SERIALIZER ============
class PartnerSerializer(serializers.ModelSerializer):
    tier_display = serializers.CharField(source='get_tier_display', read_only=True)
    logo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Partner
        fields = [
            'id', 'name', 'slug', 'tier', 'tier_display',
            'logo', 'logo_url', 'website', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def get_logo_url(self, obj):
        if obj.logo and hasattr(obj.logo, 'url'):
            return obj.logo.url
        return None

# ============ ANNOUNCEMENT BAR SERIALIZER ============
class AnnouncementBarSerializer(serializers.ModelSerializer):
    is_currently_live = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = AnnouncementBar
        fields = [
            'id', 'text', 'coupon_code', 'is_active',
            'start_date', 'end_date', 'is_currently_live'
        ]
        read_only_fields = ['id']