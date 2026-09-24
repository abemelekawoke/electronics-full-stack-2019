import React from 'react';
import { Container, Typography, Box, Paper, Divider, Grid, Chip, useTheme } from '@mui/material';
import { 
    PrivacyTip, 
    Security, 
    DataUsage, 
    Email, 
    Phone, 
    LocationOn,
    CheckCircle,
    Info
} from '@mui/icons-material';

const PrivacyPolicy = () => {
    const sections = [
        {
            icon: <Info fontSize="small" />,
            title: "1. Information We Collect",
            content: [
                "Personal Information: Full name, Phone number, Email address, Physical address, Company or business information, Payment and billing information",
                "Business and Project Information: Logos, artwork, designs, marketing materials, Printing specifications and order details, Product preferences and purchase history",
                "Technical Information: IP address, Browser type and device information, Website usage data, Cookies and similar technologies"
            ]
        },
        {
            icon: <DataUsage fontSize="small" />,
            title: "2. How We Use Your Information",
            content: [
                "Process and fulfill orders",
                "Provide printing, advertising, and sales services",
                "Communicate regarding orders, quotations, and customer support",
                "Improve our products and services",
                "Send promotional offers and business updates, where permitted",
                "Maintain business records and comply with legal obligations"
            ]
        },
        {
            icon: <Security fontSize="small" />,
            title: "3. Protection of Customer Content",
            content: [
                "All designs, documents, logos, artwork, and advertising materials provided by customers remain confidential.",
                "We use such materials solely for the purpose of delivering requested services unless otherwise authorized by the customer."
            ]
        },
        {
            icon: <Security fontSize="small" />,
            title: "4. Sharing of Information",
            content: [
                "We do not sell, rent, or trade customer information to third parties.",
                "We may share information only: With service providers who assist in business operations, With delivery and logistics partners for order fulfillment, When required by law, regulation, or legal process, To protect our legal rights and business interests"
            ]
        },
        {
            icon: <Security fontSize="small" />,
            title: "5. Data Security",
            content: [
                "We implement reasonable administrative, technical, and physical safeguards to protect personal and business information from unauthorized access, disclosure, alteration, or destruction."
            ]
        },
        {
            icon: <Security fontSize="small" />,
            title: "6. Data Retention",
            content: [
                "We retain customer information only for as long as necessary to: Provide services, Maintain business and accounting records, Meet legal and regulatory requirements, Resolve disputes and enforce agreements"
            ]
        },
        {
            icon: <Security fontSize="small" />,
            title: "7. Your Rights",
            content: [
                "Access your personal information",
                "Request correction of inaccurate information",
                "Request deletion of your information",
                "Withdraw consent for marketing communications",
                "Request information about how your data is used"
            ]
        },
        {
            icon: <Security fontSize="small" />,
            title: "8. Cookies and Website Technologies",
            content: [
                "Our website may use cookies and similar technologies to enhance user experience, analyze website traffic, and improve our services. Users may adjust browser settings to manage cookie preferences."
            ]
        },
        {
            icon: <Security fontSize="small" />,
            title: "9. Changes to This Privacy Policy",
            content: [
                "Parrot Advert reserves the right to update this Privacy Policy at any time. Updated versions will be posted through our official communication channels and become effective upon publication."
            ]
        },
        {
            icon: <Security fontSize="small" />,
            title: "10. Contact Information",
            content: [
                "Parrot Advert",
                "Phone: +251908882277",
                "Email: parrotadvert7@gmail.com",
                "Address: Bahir Dar, Ethiopia"
            ]
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, bgcolor: '#fafafa' }}>
                <Box textAlign="center" mb={6}>
                    <PrivacyTip sx={{ fontSize: 60, color: '#1A237E', mb: 2 }} />
                    <Typography 
                        variant="h3" 
                        fontWeight={900} 
                        sx={{ 
                            background: 'linear-gradient(45deg, #1A237E 30%, #FFD700 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Privacy Policy
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mt={1}>
                        Effective Date: June 11, 2026
                    </Typography>
                    <Chip 
                        label="Parrot Advert" 
                        sx={{ mt: 1, bgcolor: '#1A237E', color: 'white' }} 
                    />
                    <Divider sx={{ mt: 3 }} />
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="body1" paragraph color="textSecondary" sx={{ mb: 4 }}>
                            Parrot Advert or Parrot Printing, Advertising and Selling Company ("Parrot", "we", "our", or "us") 
                            is committed to protecting the privacy and confidentiality of our customers, business partners, 
                            and website visitors. This Privacy Policy explains how we collect, use, disclose, and safeguard 
                            your information when you use our services.
                        </Typography>

                        {sections.map((section, index) => (
                            <Box key={index} mb={4}>
                                <Typography 
                                    variant="h6" 
                                    fontWeight={700} 
                                    color="#1A237E"
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                    {section.icon}
                                    {section.title}
                                </Typography>
                                <Box sx={{ pl: 4, mt: 1 }}>
                                    {section.content.map((item, i) => (
                                        <Typography 
                                            key={i} 
                                            variant="body2" 
                                            color="textSecondary"
                                            sx={{ 
                                                mb: 0.5,
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 1
                                            }}
                                        >
                                            <CheckCircle sx={{ color: '#FFD700', fontSize: 16, mt: 0.3, flexShrink: 0 }} />
                                            {item}
                                        </Typography>
                                    ))}
                                </Box>
                                {index < sections.length - 1 && <Divider sx={{ mt: 3 }} />}
                            </Box>
                        ))}
                    </Grid>
                </Grid>

                <Box 
                    sx={{ 
                        mt: 6, 
                        p: 3, 
                        bgcolor: '#1A237E', 
                        borderRadius: 2, 
                        color: 'white',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="body1" fontWeight={600}>
                        Parrot Advert - Your advertising solution, big or small.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone sx={{ fontSize: 16 }} />
                            <Typography variant="caption">+251908882277</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Email sx={{ fontSize: 16 }} />
                            <Typography variant="caption">parrotadvert7@gmail.com</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn sx={{ fontSize: 16 }} />
                            <Typography variant="caption">Bahir Dar, Ethiopia</Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default PrivacyPolicy;