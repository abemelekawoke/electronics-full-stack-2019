"""
Order Status State Machine Logic

This module contains the state machine logic for order status transitions.
It ensures data integrity by validating status changes before they are applied.

State Machine Flow:
Deposit_Pending -> In_Production -> Balance_Due -> Final_Pay_Pending -> Ready_To_Ship -> Delivered
"""

from django.utils import timezone
from datetime import timedelta


class OrderStatusMachine:
    """
    State machine for order status transitions.
    This is a modular approach keeping the status logic separate from UI components.
    """
    
    # Valid state transitions
    VALID_TRANSITIONS = {
        'Deposit_Pending': ['In_Production', 'Cancelled'],
        'In_Production': ['Balance_Due', 'Cancelled'],
        'Balance_Due': ['Final_Pay_Pending', 'Cancelled'],
        'Final_Pay_Pending': ['Ready_To_Ship', 'Balance_Due', 'Cancelled'],
        'Ready_To_Ship': ['Shipped', 'Cancelled'],
        'Shipped': ['Delivered', 'Cancelled'],
        'Delivered': [],
        'Cancelled': [],
    }
    
    @classmethod
    def can_transition(cls, current_status, new_status):
        """
        Check if a status transition is valid.
        
        Args:
            current_status: The current status of the order
            new_status: The desired new status
            
        Returns:
            bool: True if the transition is valid, False otherwise
        """
        if current_status not in cls.VALID_TRANSITIONS:
            return False
        return new_status in cls.VALID_TRANSITIONS[current_status]
    
    @classmethod
    def get_valid_transitions(cls, current_status):
        """
        Get all valid transitions from the current status.
        
        Args:
            current_status: The current status of the order
            
        Returns:
            list: List of valid next statuses
        """
        return cls.VALID_TRANSITIONS.get(current_status, [])
    
    @classmethod
    def calculate_balance(cls, total_price, deposit_paid):
        """
        Calculate the balance due using the formula: Balance = Total_Order_Price - Deposit_Paid
        
        This is a dynamic calculation - never hardcode values.
        
        Args:
            total_price: The total order price
            deposit_paid: The amount already paid as deposit
            
        Returns:
            Decimal: The balance amount due
        """
        return total_price - deposit_paid
    
    @classmethod
    def is_balance_due_order(cls, order):
        """
        Check if an order should show a balance due alert.
        
        This checks if the order status is 'Balance_Due', which means
        the customer needs to make a final payment.
        
        Args:
            order: The order object
            
        Returns:
            bool: True if balance due alert should be shown
        """
        return order.status == 'Balance_Due'
    
    @classmethod
    def should_transition_to_balance_due(cls, order):
        """
        Check if an order should transition to Balance_Due status.
        
        This implements the 1-Day Buffer Rule:
        The system must automatically identify orders where:
        - status == 'In_Production'
        - ship_date == Today + 1
        
        Args:
            order: The order object
            
        Returns:
            bool: True if the order should transition to Balance_Due
        """
        if order.status != 'In_Production':
            return False
        
        if not order.ship_date:
            return False
        
        today = timezone.now().date()
        tomorrow = today + timedelta(days=1)
        
        return order.ship_date == tomorrow
    
    @classmethod
    def process_deposit(cls, order, amount, receipt):
        """
        Process a deposit payment for an order.
        
        Args:
            order: The order object
            amount: The deposit amount
            receipt: The deposit receipt image
            
        Returns:
            tuple: (success, message, new_status)
        """
        if order.status != 'Deposit_Pending':
            return False, "Order is not in Deposit_Pending status", None
        
        # Validate amount (deposit should be 50% of final total price)
        if amount <= 0:
            return False, "Deposit amount must be positive", None
        
        # Calculate expected deposit as 50% of final total price
        expected_deposit = order.final_total_price / 2
        if amount != expected_deposit:
            return False, f"Deposit must be exactly 50% of final total: ETB {expected_deposit}", None
        
        # Update order
        order.deposit_paid = amount
        order.deposit_receipt = receipt
        order.deposit_date = timezone.now()
        
        # Transition to In_Production
        # Note: deposit_verified should be set by admin after verification
        order.status = 'In_Production'
        order.save()
        
        return True, "Deposit recorded successfully. Order is now in production.", 'In_Production'
    
    @classmethod
    def process_final_payment(cls, order, amount, receipt):
        """
        Process a final payment for an order.
        
        Args:
            order: The order object
            amount: The final payment amount
            receipt: The final payment receipt image
            
        Returns:
            tuple: (success, message, new_status)
        """
        # Allow final payment from both Balance_Due and In_Production statuses
        # This provides flexibility when the status hasn't transitioned automatically
        if order.status not in ['Balance_Due', 'In_Production']:
            return False, "Order is not in Balance_Due status", None
        
        # Validate amount (should match the balance due)
        # Use final_total_price which includes discount/extra calculations
        expected_balance = cls.calculate_balance(order.final_total_price, order.deposit_paid)
        if amount != expected_balance:
            return False, f"Final payment must be exactly {expected_balance}", None
        
        # Update order
        order.final_payment = amount
        order.final_payment_receipt = receipt
        order.final_payment_date = timezone.now()
        
        # Transition to Final_Pay_Pending (requires admin verification)
        order.status = 'Final_Pay_Pending'
        order.save()
        
        return True, "Final payment uploaded. Awaiting admin verification.", 'Final_Pay_Pending'
    
    @classmethod
    def verify_deposit(cls, order, verified=True):
        """
        Admin function to verify a deposit payment.
        
        Args:
            order: The order object
            verified: Whether the deposit is verified
            
        Returns:
            tuple: (success, message)
        """
        if not order.deposit_receipt:
            return False, "No deposit receipt found"
        
        order.deposit_verified = verified
        
        if verified:
            order.status = 'In_Production'
            order.payment_verified = True
        
        order.save()
        return True, "Deposit verification updated"
    
    @classmethod
    def verify_final_payment(cls, order, verified=True):
        """
        Admin function to verify a final payment.
        
        IMPORTANT: Never consider an order "paid" based on uploaded receipt alone.
        The system status must reflect 'Final_Pay_Pending' until admin manually confirms.
        
        Args:
            order: The order object
            verified: Whether the final payment is verified
            
        Returns:
            tuple: (success, message)
        """
        if not order.final_payment_receipt:
            return False, "No final payment receipt found"
        
        order.final_payment_verified = verified
        
        if verified:
            order.status = 'Ready_To_Ship'
            order.payment_verified = True
        
        order.save()
        return True, "Final payment verification updated"


def get_orders_for_status_update():
    """
    Get orders that should be transitioned to Balance_Due.
    
    This implements the 1-Day Buffer Rule via a cron job:
    - status == 'In_Production'
    - ship_date == Today + 1
    
    Returns:
        QuerySet: Orders that need to be transitioned
    """
    from .models import Order
    
    today = timezone.now().date()
    tomorrow = today + timedelta(days=1)
    
    return Order.objects.filter(
        status='In_Production',
        ship_date=tomorrow
    )
