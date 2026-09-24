from rest_framework import serializers
from django.conf import settings
from django.db.models import Avg
from .models import *
from setups.serializers import CategorySerializer, TypeSerializer  # Import from setups

# ============ HELPER FUNCTION ============
def get_image_url(serializer, image_field):
    """Get absolute URL for an image field"""
    request = serializer.context.get('request')
    if image_field and request:
        return request.build_absolute_uri(image_field.url)
    elif image_field:
        return image_field.url
    return None

# ============ DEVICE SERIALIZER ============
class DeviceSerializer(serializers.ModelSerializer):
    image1 = serializers.SerializerMethodField()
    image2 = serializers.SerializerMethodField()
    image3 = serializers.SerializerMethodField()
    
    # Use nested serializers for full category and type data
    category_detail = CategorySerializer(source='category', read_only=True)
    type_detail = TypeSerializer(source='type', read_only=True)
    
    # Keep simple fields for backward compatibility
    category_name = serializers.ReadOnlyField(source='category.name')
    category_id = serializers.ReadOnlyField(source='category.id')
    type_name = serializers.ReadOnlyField(source='type.name')
    type_id = serializers.ReadOnlyField(source='type.id')
    
    page_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Device
        fields = [
            'id', 'page', 'page_display', 
            'category', 'category_id', 'category_name', 'category_detail',
            'type', 'type_id', 'type_name', 'type_detail',
            'name', 'description', 'item_status',
            'price', 'price_type', 'shipping_fee', 'stock', 
            'created_at', 'image1', 'image2', 'image3', 'video'
        ]
    
    def get_image1(self, obj):
        if not obj.image1:
            return None
        return get_image_url(self, obj.image1)
    
    def get_image2(self, obj):
        if not obj.image2:
            return None
        return get_image_url(self, obj.image2)
    
    def get_image3(self, obj):
        if not obj.image3:
            return None
        return get_image_url(self, obj.image3)

    def get_page_display(self, obj):
        page_map = {
            'MATERIAL': 'Printing Material',
            'CLOTHING': 'Clothing',
            'SERVICE': 'Services'
        }
        return page_map.get(obj.page, obj.page)

# ============ ORDER REVIEW SERIALIZER ============
class OrderReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderReview
        fields = ['id', 'order', 'email', 'rating', 'comment', 'created_at']
        read_only_fields = ['created_at']
    
    def validate(self, data):
        request = self.context.get('request')
        if request and request.method == 'POST':
            if OrderReview.objects.filter(
                order=data['order'], 
                email=request.user.email
            ).exists():
                raise serializers.ValidationError("You have already reviewed this order")
        return data

# ============ ORDER SERIALIZER ============
class OrderSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(source='device.name', read_only=True)
    device_price = serializers.DecimalField(source='device.price', read_only=True, max_digits=10, decimal_places=2)
    device_image = serializers.SerializerMethodField()
    device_page = serializers.CharField(source='device.page', read_only=True)
    device_category = serializers.CharField(source='device.category.name', read_only=True)
    device_category_id = serializers.IntegerField(source='device.category.id', read_only=True)
    
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    base_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    balance_due = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    final_total_price = serializers.DecimalField(source='total_price', read_only=True, max_digits=10, decimal_places=2)
    is_balance_due = serializers.BooleanField(read_only=True)
    
    reviews = serializers.SerializerMethodField()
    user_has_review = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    
    sample_design_url = serializers.SerializerMethodField(read_only=True)
    front_url = serializers.SerializerMethodField(read_only=True)
    back_url = serializers.SerializerMethodField(read_only=True)
    left_url = serializers.SerializerMethodField(read_only=True)
    right_url = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'device', 'device_name', 'device_price', 'device_image', 
            'device_page', 'device_category', 'device_category_id',
            'quantity', 'base_price', 'total_price', 'ordered_at', 
            'name', 'email', 'phone', 'address', 'description', 
            'status', 'gender', 'size', 'service_size_width', 
            'service_size_height', 'service_size', 'color', 'type',
            'sample_design', 'sample_design_url', 
            'front', 'back', 'front_url', 'back_url',
            'left_image', 'left_url',
            'right_image', 'right_url',
            'is_portfolio',
            'delivery_date',
            'discount_percentage', 'extra_percentage', 'calculated_total_percentage',
            'final_total_price',
            'deposit_paid', 'balance_due', 'deposit_receipt', 
            'final_payment_receipt', 'ship_date', 'shipping_fee', 'is_balance_due',
            'final_payment', 'deposit_verified', 'final_payment_verified',
            'payment_verified', 'deposit_date', 'final_payment_date',
            'reviews', 'user_has_review', 'average_rating'
        ]
    
    def get_device_image(self, obj):
        if obj.device and obj.device.image1:
            return get_image_url(self, obj.device.image1)
        return None

    def get_sample_design_url(self, obj):
        if obj.sample_design:
            return get_image_url(self, obj.sample_design)
        return None

    def get_front_url(self, obj):
        if obj.front:
            return get_image_url(self, obj.front)
        return None

    def get_back_url(self, obj):
        if obj.back:
            return get_image_url(self, obj.back)
        return None

    def get_left_url(self, obj):
        if obj.left_image:
            return get_image_url(self, obj.left_image)
        return None

    def get_right_url(self, obj):
        if obj.right_image:
            return get_image_url(self, obj.right_image)
        return None

    def get_reviews(self, obj):
        reviews = obj.reviews.all().order_by('-created_at')[:3]
        return OrderReviewSerializer(reviews, many=True, context=self.context).data

    def get_user_has_review(self, obj):
        user_email = self.context.get('user_email')
        if user_email:
            return obj.reviews.filter(email=user_email).exists()
        return False

    def get_average_rating(self, obj):
        if obj.reviews.exists():
            avg = obj.reviews.aggregate(avg_rating=Avg('rating'))['avg_rating']
            return round(float(avg), 1) if avg else None
        return None

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.FILES:
            for field in ['sample_design', 'front', 'back', 'left_image', 'right_image']:
                if field in request.FILES:
                    validated_data[field] = request.FILES[field]
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and request.FILES:
            for field in ['sample_design', 'front', 'back', 'left_image', 'right_image']:
                if field in request.FILES:
                    validated_data[field] = request.FILES[field]
        return super().update(instance, validated_data)

# ============ CONTACT MESSAGE SERIALIZER ============
class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'message', 'submitted_at']

# ============ NEWS SERIALIZER ============
class NewsSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField(read_only=True)
    video_url = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = News
        fields = ['id', 'title', 'description', 'image', 'video', 'image_url', 'video_url', 'published_at']
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None
    
    def get_video_url(self, obj):
        request = self.context.get('request')
        if obj.video and request:
            return request.build_absolute_uri(obj.video.url)
        elif obj.video:
            return obj.video.url
        return None