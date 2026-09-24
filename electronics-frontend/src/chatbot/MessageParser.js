// src/chatbot/MessageParser.js

class MessageParser {
    constructor(actionProvider) {
        this.actionProvider = actionProvider;
    }

    parse(message) {
        const lowercase = message.toLowerCase().trim();

        // Greetings
        if (lowercase.includes('hello') || 
            lowercase.includes('hi') || 
            lowercase.includes('hey') ||
            lowercase.includes('greetings')) {
            this.actionProvider.greet();
            return;
        }

        // Help
        if (lowercase.includes('help') || 
            lowercase.includes('what can you do') ||
            lowercase.includes('options') ||
            lowercase.includes('menu')) {
            this.actionProvider.showHelp();
            return;
        }

        // Order Status / Track Order
        if (lowercase.includes('track') || 
            lowercase.includes('order status') ||
            lowercase.includes('my order') ||
            lowercase.includes('where is my order') ||
            lowercase.includes('order id')) {
            this.actionProvider.handleOrderStatus();
            return;
        }

        // Product Recommendations - Laptops
        if (lowercase.includes('laptop') || 
            lowercase.includes('computer') ||
            lowercase.includes('pc') ||
            lowercase.includes('notebook') ||
            lowercase.includes('macbook')) {
            this.actionProvider.handleProductRecommendation('laptop');
            return;
        }

        // Product Recommendations - Phones
        if (lowercase.includes('phone') || 
            lowercase.includes('smartphone') ||
            lowercase.includes('mobile') ||
            lowercase.includes('iphone') ||
            lowercase.includes('android')) {
            this.actionProvider.handleProductRecommendation('phone');
            return;
        }

        // Product Recommendations - Tablets
        if (lowercase.includes('tablet') || 
            lowercase.includes('ipad') ||
            lowercase.includes('e-reader') ||
            lowercase.includes('drawing tablet')) {
            this.actionProvider.handleProductRecommendation('tablet');
            return;
        }

        // Product Recommendations - General
        if (lowercase.includes('recommend') || 
            lowercase.includes('suggestion') ||
            lowercase.includes('what do you have') ||
            lowercase.includes('products') ||
            lowercase.includes('devices') ||
            lowercase.includes('items for sale')) {
            this.actionProvider.handleProductRecommendation('default');
            return;
        }

        // I want to buy / looking for
        if (lowercase.includes('buy') || 
            lowercase.includes('want to buy') ||
            lowercase.includes('looking for') ||
            lowercase.includes('need a') ||
            lowercase.includes('need an')) {
            // Try to identify the category
            if (lowercase.includes('laptop') || lowercase.includes('computer')) {
                this.actionProvider.handleProductRecommendation('laptop');
            } else if (lowercase.includes('phone') || lowercase.includes('mobile')) {
                this.actionProvider.handleProductRecommendation('phone');
            } else if (lowercase.includes('tablet')) {
                this.actionProvider.handleProductRecommendation('tablet');
            } else {
                this.actionProvider.handleProductRecommendation('default');
            }
            return;
        }

        // Payment Methods
        if (lowercase.includes('payment') || 
            lowercase.includes('pay') ||
            lowercase.includes('bank') ||
            lowercase.includes('transfer') ||
            lowercase.includes('tele birr') ||
            lowercase.includes('cbe') ||
            lowercase.includes('boa')) {
            this.actionProvider.handlePaymentMethods();
            return;
        }

        // Shipping / Delivery
        if (lowercase.includes('shipping') || 
            lowercase.includes('delivery') ||
            lowercase.includes('deliver') ||
            lowercase.includes('how long') ||
            lowercase.includes('arrival') ||
            lowercase.includes('when will')) {
            this.actionProvider.handleShipping();
            return;
        }

        // Returns / Refund
        if (lowercase.includes('return') || 
            lowercase.includes('refund') ||
            lowercase.includes('exchange') ||
            lowercase.includes('money back')) {
            this.actionProvider.handleReturns();
            return;
        }

        // FAQ / Questions
        if (lowercase.includes('faq') || 
            lowercase.includes('question') ||
            lowercase.includes('how do i') ||
            lowercase.includes('what is') ||
            lowercase.includes('common')) {
            this.actionProvider.handleFAQ();
            return;
        }

        // Contact Support
        if (lowercase.includes('contact') || 
            lowercase.includes('support') ||
            lowercase.includes('customer service') ||
            lowercase.includes('talk to someone')) {
            this.actionProvider.handleContactSupport();
            return;
        }

        // Price / Cost
        if (lowercase.includes('price') || 
            lowercase.includes('cost') ||
            lowercase.includes('how much') ||
            lowercase.includes('expensive') ||
            lowercase.includes('cheap') ||
            lowercase.includes('affordable')) {
            this.actionProvider.handlePriceInquiry();
            return;
        }

        // Stock / Availability
        if (lowercase.includes('stock') || 
            lowercase.includes('available') ||
            lowercase.includes('in stock') ||
            lowercase.includes('out of stock')) {
            this.actionProvider.handleStockInquiry();
            return;
        }

        // Thank you
        if (lowercase.includes('thank') || 
            lowercase.includes('thanks') ||
            lowercase.includes('appreciate')) {
            this.actionProvider.addMessage("You're welcome! 😊 Feel free to ask if you need anything else!");
            return;
        }

        // Goodbye
        if (lowercase.includes('bye') || 
            lowercase.includes('goodbye') ||
            lowercase.includes('see you') ||
            lowercase.includes('later')) {
            this.actionProvider.addMessage("Goodbye! 👋 Thank you for visiting Parrot Advert. Have a great day!");
            return;
        }

        // Default - couldn't understand
        this.actionProvider.handleDefault();
    }
}

export default MessageParser;

