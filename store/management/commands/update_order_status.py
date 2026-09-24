"""
Management command to update order statuses based on the 1-Day Buffer Rule.

This cron job:
1. Identifies orders where status == 'In_Production' and ship_date == Today + 1
2. Transitions these orders to 'Balance_Due' status

This implements the requirement: "The system must automatically identify orders 
where status == 'In_Production' and ship_date == Today + 1. These orders 
must be transitioned to Balance_Due via a background cron job."
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from store.models import Order


class Command(BaseCommand):
    help = 'Update order statuses - handles Balance_Due transition for orders shipping tomorrow'

    def handle(self, *args, **options):
        today = timezone.now().date()
        tomorrow = today + timedelta(days=1)
        
        # Find orders that are In_Production and ship_date is tomorrow
        # This implements the 1-Day Buffer Rule
        orders_to_update = Order.objects.filter(
            status='In_Production',
            ship_date=tomorrow
        )
        
        count = 0
        for order in orders_to_update:
            # Manually transition the order to Balance_Due (1-Day Buffer Rule)
            order.status = 'Balance_Due'
            order.save()
            count += 1
            self.stdout.write(
                self.style.SUCCESS(
                    f'Order {order.id}: Transitioned from In_Production to Balance_Due (1-Day Buffer Rule)'
                )
            )
        
        if count == 0:
            self.stdout.write('No orders require status update at this time.')
        else:
            self.stdout.write(
                self.style.SUCCESS(f'Updated {count} order(s) to Balance_Due status')
            )
