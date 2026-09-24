from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import mixins
from django.db.models import Q
from .models import Device, Order, ContactMessage, News, OrderReview
from .serializers import (
    DeviceSerializer, OrderSerializer, ContactMessageSerializer, 
    NewsSerializer, OrderReviewSerializer
)
from .pagination import CustomPagination
from setups.models import ItemCategory  # Import ItemCategory from setups
from setups.serializers import CategorySerializer  # Import CategorySerializer

# ============ DEVICE VIEWSET ============
class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    permission_classes = [AllowAny]
    pagination_class = CustomPagination
    
    def get_queryset(self):
        queryset = Device.objects.all()
        
        # Filter by page_type (products, services, or all)
        page_type = self.request.query_params.get('page_type', None)
        
        if page_type == 'products':
            queryset = queryset.filter(page__in=['MATERIAL', 'CLOTHING'])
        elif page_type == 'services':
            queryset = queryset.filter(page='SERVICE')
        # If no page_type, return all devices
        
        # Filter by category ID
        category_id = self.request.query_params.get('category', None)
        if category_id:
            try:
                queryset = queryset.filter(category_id=int(category_id))
            except (ValueError, TypeError):
                pass
        
        # Filter by category name
        category_name = self.request.query_params.get('category_name', None)
        if category_name:
            queryset = queryset.filter(category__name__iexact=category_name)
        
        # Filter by type (ItemType ID)
        type_id = self.request.query_params.get('type', None)
        if type_id:
            try:
                queryset = queryset.filter(type_id=int(type_id))
            except (ValueError, TypeError):
                pass
        
        # Filter by item_status (new, used, refurbished, etc.)
        item_status = self.request.query_params.get('item_status', None)
        if item_status:
            queryset = queryset.filter(item_status=item_status)
        
        # Search by name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        # Order by
        ordering = self.request.query_params.get('ordering', '-created_at')
        if ordering:
            queryset = queryset.order_by(ordering)
        
        return queryset

    @action(detail=False, methods=['get'])
    def products(self, request):
        """Get all products (MATERIAL and CLOTHING) with category filtering"""
        queryset = Device.objects.filter(page__in=['MATERIAL', 'CLOTHING'])
        
        # Apply category filter
        category_id = request.query_params.get('category', None)
        if category_id:
            try:
                queryset = queryset.filter(category_id=int(category_id))
            except (ValueError, TypeError):
                pass
        
        # Apply search
        search = request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        # Paginate
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def services(self, request):
        """Get all services (SERVICE) with category filtering"""
        queryset = Device.objects.filter(page='SERVICE')
        
        # Apply category filter
        category_id = request.query_params.get('category', None)
        if category_id:
            try:
                queryset = queryset.filter(category_id=int(category_id))
            except (ValueError, TypeError):
                pass
        
        # Apply search
        search = request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        # Paginate
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get all categories with device counts"""
        page_type = request.query_params.get('page_type', None)
        
        categories = ItemCategory.objects.all()
        
        # Add device count for each category
        result = []
        for category in categories:
            devices = Device.objects.filter(category=category)
            if page_type == 'products':
                devices = devices.filter(page__in=['MATERIAL', 'CLOTHING'])
            elif page_type == 'services':
                devices = devices.filter(page='SERVICE')
            
            result.append({
                'id': category.id,
                'name': category.name,
                'description': category.description,
                'device_count': devices.count()
            })
        
        return Response(result)

# ============ ORDER VIEWSET ============
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def get_queryset(self):
        email = self.request.query_params.get('email', None)
        if email:
            return Order.objects.filter(email=email).order_by('-ordered_at')
        return Order.objects.all().order_by('-ordered_at')

# ============ CATEGORY VIEWSET ============
# This can be in store/views.py or setups/views.py
class ItemCategoryViewSet(viewsets.ModelViewSet):
    queryset = ItemCategory.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

# ============ CONTACT MESSAGE VIEWSET ============
class ContactMessageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

# ============ NEWS VIEWSET ============
class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by('-published_at')
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]

# ============ ORDER REVIEW VIEWSET ============
class OrderReviewViewSet(viewsets.ModelViewSet):
    queryset = OrderReview.objects.all().order_by('-created_at')
    serializer_class = OrderReviewSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        order_id = self.request.query_params.get('order_id')
        email = self.request.query_params.get('email')
        
        if order_id:
            queryset = queryset.filter(order_id=order_id)
        if email:
            queryset = queryset.filter(email=email)
        return queryset

# ============ API VIEWS ============
@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_orders(request):
    email = request.query_params.get('email', None)
    if email:
        orders = Order.objects.filter(email=email).order_by('-ordered_at')
        serializer = OrderSerializer(orders, many=True, context={'request': request, 'user_email': email})
        return Response(serializer.data)
    return Response({'error': 'Email parameter is required'}, status=400)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def order_review(request, order_id=None):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)
    
    if request.method == 'GET':
        reviews = order.reviews.all().order_by('-created_at')
        serializer = OrderReviewSerializer(reviews, many=True, context={'request': request})
        return Response(serializer.data)
    
    if request.method == 'POST':
        if order.status != 'Delivered':
            return Response({'error': 'Can only review delivered orders'}, status=400)
        
        user_email = request.data.get('email')
        if not user_email or user_email != order.email:
            return Response({'error': 'Email must match order email'}, status=400)
        
        rating = request.data.get('rating')
        comment = request.data.get('comment', '')
        
        if not rating or not 1 <= int(rating) <= 5:
            return Response({'error': 'Rating must be 1-5'}, status=400)
        
        if order.reviews.filter(email=user_email).exists():
            return Response({'error': 'You have already reviewed this order'}, status=400)
        
        review = OrderReview.objects.create(
            order=order,
            email=user_email,
            rating=int(rating),
            comment=comment
        )
        serializer = OrderReviewSerializer(review)
        return Response(serializer.data, status=201)
    
    return Response({'error': 'Method not allowed'}, status=405)