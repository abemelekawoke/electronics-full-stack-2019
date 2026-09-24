// src/chatbot/ActionProvider.js

class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
    }

    // Helper to add message to state
    addMessage(message) {
        const msg = this.createChatBotMessage(message);
        this.setState((prev) => ({
            ...prev,
            messages: [...prev.messages, msg],
        }));
    }

    // Greeting
    greet() {
        this.addMessage("Hello! 👋 Welcome to Parrot Advert! How can I help you today?");
    }

    // Help menu
    showHelp() {
        this.addMessage("Here's how I can help you:");
        this.addMessage("📦 **Order Status** - Check your order by saying 'track my order'");
        this.addMessage("🛒 **Product Recommendations** - Get device suggestions - say 'I need a laptop' or 'recommend phone'");
        this.addMessage("💳 **Payment Methods** - Learn about payment options");
        this.addMessage("🚚 **Shipping Info** - Ask about delivery times");
        this.addMessage("↩️ **Returns** - Learn about return policy");
        this.addMessage("❓ **FAQ** - Common questions about our store");
    }

    // Order Status
    handleOrderStatus(email) {
        this.addMessage(`To check your order status, please provide your order ID or email address. You can also check in the 'My Orders' section of your account.`);
        this.addMessage("Your order statuses can be: Deposit Pending → In Production → Balance Due → Final Payment Pending → Ready To Ship → Shipped → Delivered");
    }

    // Product Recommendations
    handleProductRecommendation(category) {
        const recommendations = {
            laptop: "Here are some laptops we offer:\n\n🖥️ **Gaming Laptops** - High performance for gaming\n💼 **Business Laptops** - Professional and reliable\n📚 **Student Laptops** - Affordable and practical\n\nWould you like to see our full device list? Just click 'Devices' in the menu!",
            phone: "Here are our phone options:\n\n📱 **Smartphones** - Latest models available\n📱 **Used Phones** - Quality pre-owned devices\n📱 **Refurbished** - Professionally restored phones\n\nWould you like to browse our devices? Visit the home page!",
            tablet: "We have tablets available for:\n\n✏️ **Drawing Tablets** - For artists and designers\n📺 **Entertainment Tablets** - Movies and games\n📚 **E-Readers** - Digital books\n\nWould you like more details about any specific type?",
            default: "We have a wide variety of electronics! Here's what we offer:\n\n🖥️ Laptops & Computers\n📱 Smartphones & Tablets\n🎮 Gaming Equipment\n📷 Cameras & Accessories\n\nJust visit our home page to see all available devices!",
        };

        const key = category.toLowerCase();
        if (recommendations[key]) {
            this.addMessage(recommendations[key]);
        } else {
            this.addMessage(recommendations.default);
        }
    }

    // Payment Methods
    handlePaymentMethods() {
        this.addMessage("💳 **Accepted Payment Methods:**\n\n🏦 **Bank Transfers:**\n• Bank of Abyssinia (BoA): 113623659\n• CBE: 1000262107860\n\n📱 **Mobile Money:**\n• Tele Birr: 943444568\n\n💰 Name: Dagim Zerie\n\nAfter making payment, upload your receipt in the order section!");
    }

    // Shipping Info
    handleShipping() {
        this.addMessage("🚚 **Shipping Information:**\n\n📦 **Delivery Times:**\n• Less than 1 day (Urgent): +30% extra charge\n• 2-3 days: Standard\n• 7 days: 5% discount\n• 14 days: 10% discount\n• 1 month: 13% discount\n• More than 1 month: 17% discount\n\n📍 We deliver across Ethiopia\n\n⚠️ Note: Delivery times may vary based on product availability.");
    }

    // Returns Policy
    handleReturns() {
        this.addMessage("↩️ **Return Policy:**\n\n✅ Items can be returned within 7 days of delivery\n✅ Items must be unused and in original packaging\n✅ Contact us before returning\n✅ Refunds are processed within 5-7 business days\n\nFor returns, please contact our support team through the Contact Us page.");
    }

    // FAQ
    handleFAQ() {
        this.addMessage("❓ **Frequently Asked Questions:**\n\n**Q: How do I place an order?**\nA: Browse devices, select your item, fill in the order form, and upload your payment receipt.\n\n**Q: How long does delivery take?**\nA: Delivery takes 2-3 days for standard orders. Urgent delivery is available for same-day delivery.\n\n**Q: What payment methods do you accept?**\nA: We accept bank transfers (BoA, CBE) and Tele Birr mobile money.\n\n**Q: Can I track my order?**\nA: Yes! Check the 'My Orders' section or ask me to track your order.\n\n**Q: Do you offer warranties?**\nA: Yes, new devices come with manufacturer warranty. Contact us for details.");
    }

    // Contact Support
    handleContactSupport() {
        this.addMessage("📞 **Contact Support:**\n\nYou can reach us through:\n• Contact Us page on our website\n• Email: support@parrotstudio.com\n• Phone: [Available on Contact Us page]\n\nOur team is available during business hours!");
    }

    // Price Inquiry
    handlePriceInquiry() {
        this.addMessage("💰 For pricing information, please visit our home page where all devices are listed with their current prices. You can also filter by price range!");
    }

    // Stock Inquiry
    handleStockInquiry() {
        this.addMessage("📦 For stock availability, please check the product detail page. If a device shows 'Out of Stock', you can contact us to check when it will be available again!");
    }

    // Default fallback
    handleDefault() {
        this.addMessage("I'm not sure I understood that. 😅\n\nTry saying:\n• 'Help' - for all options\n• 'I want to buy a laptop'\n• 'Track my order'\n• 'Payment methods'\n• 'Shipping info'");
    }

    // Quick replies suggestions
    handleQuickReplies() {
        const suggestions = [
            "📦 Track my order",
            "🛒 Product recommendations",
            "💳 Payment methods",
            "🚚 Shipping info",
            "❓ FAQ",
            "❓ Help"
        ];
        return suggestions;
    }
}

export default ActionProvider;

