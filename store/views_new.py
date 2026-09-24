from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Device, Order, ItemCategory, ContactMessage, News
from rest_framework import generics

from .serializers import DeviceSerializer, OrderSerializer, CategorySerializer, ContactMessageSerializer, NewsSerializer
from .serializers_new import OrderBalanceSerializer, OrderPaymentUploadSerializer
from .order_status import OrderStatusMachine


class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        email = self.request.query_params.get('email', None)
        if email:
            return Order.objects.filter(email=email).order_by('-ordered_at')
        return Order.objects.all().order_by('-ordered_at')
    
    @action(detail=True, methods=['post'])
    def upload_deposit(self, request, pk=None):
        order = self.get_object()
        serializer = OrderPaymentUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        amount = serializer.validated_data['amount']
        receipt = serializer.validated_data['receipt']
        
        success, message, new_status = OrderStatusMachine.process_deposit(order, amount, receipt)
        
        if not success:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'message': message,
            'status': new_status,
            'deposit_paid': str(order.deposit_paid)
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def upload_final_payment(self, request, pk=None):
        order = self.get_object()
        serializer = OrderPaymentUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        amount = serializer.validated_data['amount']
        receipt = serializer.validated_data['receipt']
        
        success, message, new_status = OrderStatusMachine.process_final_payment(order, amount, receipt)
        
        if not success:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'message': message,
            'status': new_status,
            'balance_paid': str(order.final_payment)
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'])
    def balance(self, request, pk=None):
        order = self.get_object()
        serializer = OrderBalanceSerializer(order)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_orders(request):
    email = request.query_params.get('email', None)
    if email:
        orders = Order.objects.filter(email=email).order_by('-ordered_at')
        serializer = OrderSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)
    return Response({'error': 'Email parameter is required'}, status=400)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_order_balance(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = OrderBalanceSerializer(order)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def upload_deposit_receipt(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = OrderPaymentUploadSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    amount = serializer.validated_data['amount']
    receipt = serializer.validated_data['receipt']
    
    success, message, new_status = OrderStatusMachine.process_deposit(order, amount, receipt)
    
    if not success:
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({
        'message': message,
        'status': new_status,
        'deposit_paid': str(order.deposit_paid)
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def upload_final_payment_receipt(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = OrderPaymentUploadSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    amount = serializer.validated_data['amount']
    receipt = serializer.validated_data['receipt']
    
    success, message, new_status = OrderStatusMachine.process_final_payment(order, amount, receipt)
    
    if not success:
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({
        'message': message,
        'status': new_status,
        'balance_paid': str(order.final_payment)
    }, status=status.HTTP_200_OK)


class ItemCategoryViewSet(viewsets.ModelViewSet):
    queryset = ItemCategory.objects.all()
    serializer_class = CategorySerializer


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by('-published_at')
    serializer_class = NewsSerializer
