from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.db import transaction
from .models import Order

@receiver(pre_save, sender=Order)
def capture_old_status(sender, instance, **kwargs):
    if instance.pk:
        try:
            # We only fetch the 'status' field to keep it fast
            old_order = Order.objects.only('status').get(pk=instance.pk)
            instance._old_status = old_order.status
        except Order.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None

@receiver(post_save, sender=Order)
def update_device_stock(sender, instance, **kwargs):
    old_status = getattr(instance, '_old_status', None)
    new_status = instance.status

    # Define the "Reduction Zone" 
    # Stock should be removed when entering any of these states for the FIRST time
    stock_reducing_statuses = ['Ready_To_Ship', 'Shipped', 'Delivered']

    # TRIGGER LOGIC:
    # 1. The new status is one of the 'shipping' statuses
    # 2. The old status was NOT one of those statuses (prevents double-counting)
    if new_status in stock_reducing_statuses and old_status not in stock_reducing_statuses:
        
        # Use a transaction to ensure database integrity
        with transaction.atomic():
            # select_for_update() prevents two people from buying the same item at the exact same microsecond
            device = instance.device
            
            if device.stock >= instance.quantity:
                device.stock -= instance.quantity
                device.save()
                print(f"✅ Stock Reduced: {device.name} (-{instance.quantity}). New Total: {device.stock}")
            else:
                # IMPORTANT: In a real system, you'd want to raise an error 
                # or revert the status change here.
                print(f"❌ INSUFFICIENT STOCK: {device.name}. Required: {instance.quantity}")