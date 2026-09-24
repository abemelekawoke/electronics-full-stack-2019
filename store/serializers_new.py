from rest_framework import serializers
from django.conf import settings
from .models import Device, Order, ItemCategory, ContactMessage, News

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategory
        fields = ['id', 'name']

class DeviceSerializer(serializers.ModelSerializer):
    image1 = serializers.SerializerMethodField()
    image2 = serializers.SerializerMethodField()
    image3 = serializers.SerializerMethodField()
    category_name = serializers.ReadOnlyField(source='category.name') 
    type_name = serializers.ReadOnlyField(source='type.name')
    
    class Meta:
        model = Device
        fields = ['id', 'name', 'description', 'price', 'price_type', 'stock', 'created_at', 'image1', 'image2', 'image3', 'type', 'category', 'page']
    
    def get_image1(self, obj):
        if not obj.image1:
            return None
        try:
            request = self.context.get('request')
            if request and hasattr(request, 'build_absolute_uri'):
                return request.build_absolute_uri(obj.image1.url)
        except Exception:
            pass
        return f"{settings.MEDIA_URL}{obj.image1.name}"
    
    def get_image2(self, obj):
        if not obj.image2:
            return None
        try:
            request = self.context.get('request')
            if request and hasattr(request, 'build_absolute_uri'):
                return request.build_absolute_uri(obj.image2.url)
        except Exception:
            pass
        return f"{settings.MEDIA_URL}{obj.image2.name}"
    
    def get_image3(self, obj):
        if not obj.image3:
            return None
        try:
            request = self.context.get('request')
            if request and hasattr(request, 'build_absolute_uri'):
                return request.build_absolute_uri(obj.image3.url)
        except Exception:
            pass
        return f"{settings.MEDIA_URL}{obj.image3.name}"

class OrderSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(source='device.name', read_only=True)
    device_price = serializers.DecimalField(source='device.price', read_only=True, max_digits=10, decimal_places=2)
    base_price = serializers.DecimalField(source='base_price', read_only=True, max_digits=10, decimal_places=2)
    device_image = serializers.SerializerMethodField()
    balance_due = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    is_balance_due = serializers.BooleanField(read_only=True)
    final_total_price = serializers.DecimalField(source='total_price', read_only=True, max_digits=10, decimal_places=2)
    calculated_total_percentage = serializers.DecimalField(read_only=True, max_digits=5, decimal_places=2)
    
    class Meta:
        model = Order
        fields = [
            'id', 'device', 'device_name', 'device_price', 'device_image', 
            'quantity', 'base_price', 'total_price', 'final_total_price', 'calculated_total_percentage',
            'ordered_at', 'name', 'email', 
            'phone', 'address', 'status', 'gender', 'size', 'color', 'type',
            'deposit_paid', 'deposit_verified', 'deposit_receipt',
            'final_payment', 'final_payment_verified', 'final_payment_receipt',
            'payment_verified', 'balance_due', 'is_balance_due',
            'ship_date', 'tracking_number',
            'deposit_date', 'final_payment_date'
        ]
    
    def get_device_image(self, obj):
        if not obj.device.image1:
            return None
        try:
            request = self.context.get('request')
            if request and hasattr(request, 'build_absolute_uri'):
                return request.build_absolute_uri(obj.device.image1.url)
        except Exception:
            pass
        return f"{settings.MEDIA_URL}{obj.device.image1.name}"


class OrderBalanceSerializer(serializers.ModelSerializer):
    balance_due = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    final_total_price = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    
    class Meta:
        model = Order
        fields = ['id', 'base_price', 'total_price', 'final_total_price', 'deposit_paid', 'balance_due', 'status']


class OrderPaymentUploadSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    receipt = serializers.ImageField()
    
    def validate_receipt(self, value):
        max_size = 5 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError("Image file too large. Maximum size is 5MB.")
        
        allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
        ext = value.name.split('.')[-1].lower()
        if ext not in allowed_extensions:
            raise serializers.ValidationError(f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}")
        
        return value


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'message', 'submitted_at']
        
        
class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ['id', 'title', 'description', 'published_at']
