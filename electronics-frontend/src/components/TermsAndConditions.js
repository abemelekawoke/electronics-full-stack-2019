import React from 'react';
import { Container, Typography, Box, Paper, Divider, Grid, useTheme } from '@mui/material';
import { Gavel, Description, CheckCircle, Warning } from '@mui/icons-material';

const TermsAndConditions = () => {
    const theme = useTheme();

    const sections = [
        {
            title: "1. Services and Products",
            content: "We provide printing services, advertising solutions, textile printing, branding services, and sale of printing and advertising materials. All services are subject to availability and confirmation."
        },
        {
            title: "2. Orders and Confirmation",
            content: "All orders must be clearly specified and confirmed before production or delivery. Customers are responsible for providing accurate details, including design files, text, and specifications. Once an order is confirmed, changes may not be possible or may incur additional charges."
        },
        {
            title: "3. Pricing and Payment",
            content: "Prices are based on material type, quantity, size, and complexity of the work. Payment may be required in full or partially before production begins. Goods and services will only be delivered after full payment is completed unless otherwise agreed."
        },
        {
            title: "4. Customer Responsibility",
            content: "Customers must ensure that all provided content (text, images, logos) is correct and free from errors. The company is not responsible for spelling mistakes or incorrect information approved by the customer. Customers must confirm final designs before printing."
        },
        {
            title: "5. Production and Delivery",
            content: "Production time depends on order size and complexity. Delivery times are estimates and may be affected by technical or supply issues. The company is not liable for delays caused by unforeseen circumstances."
        },
        {
            title: "6. Quality and Variations",
            content: "We aim to provide high-quality products and services. Minor variations in color, size, or finishing may occur due to printing processes and material differences. Such variations are not considered defects."
        },
        {
            title: "7. Returns and Refunds",
            content: "Refunds are only applicable in cases of proven production errors made by the company. No refunds will be issued for approved designs or customer-provided mistakes. Customized products cannot be returned unless defective."
        },
        {
            title: "8. Cancellation Policy",
            content: "Orders can only be cancelled before production begins. Once production has started, cancellation is not allowed. Deposits may be non-refundable."
        },
        {
            title: "9. Intellectual Property",
            content: "Customers confirm they have legal rights to all content provided for printing or branding. The company is not responsible for copyright or trademark violations submitted by customers. We may refuse to print illegal or inappropriate content."
        },
        {
            title: "10. Material Sales",
            content: "All materials sold are checked for quality before delivery. Once materials are delivered and accepted, responsibility transfers to the customer. Returns for materials are only accepted if defects are reported immediately upon receipt."
        },
        {
            title: "11. Confidentiality",
            content: "We respect customer privacy and will not share or reuse customer designs, files, or business information without permission."
        },
        {
            title: "12. Limitation of Liability",
            content: "The company is not responsible for indirect losses, business interruptions, or damages arising from the use of our products or services."
        },
        {
            title: "13. Amendments",
            content: "We reserve the right to update or modify these Terms and Conditions at any time without prior notice."
        },
        {
            title: "14. Contact Information",
            content: "Parrot Advert\nPhone: +251908882277\nEmail: parrotadvert7@gmail.com\nAddress: Bahir Dar, Ethiopia"
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, bgcolor: '#fafafa' }}>
                <Box textAlign="center" mb={6}>
                    <Gavel sx={{ fontSize: 60, color: '#1A237E', mb: 2 }} />
                    <Typography 
                        variant="h3" 
                        fontWeight={900} 
                        sx={{ 
                            background: 'linear-gradient(45deg, #1A237E 30%, #FFD700 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Terms and Conditions
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mt={1}>
                        Parrot Advert - Your advertising solution, big or small.
                    </Typography>
                    <Divider sx={{ mt: 3 }} />
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        {sections.map((section, index) => (
                            <Box key={index} mb={4}>
                                <Typography 
                                    variant="h6" 
                                    fontWeight={700} 
                                    color="#1A237E"
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                    <CheckCircle sx={{ color: '#FFD700', fontSize: 20 }} />
                                    {section.title}
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    color="textSecondary" 
                                    sx={{ pl: 4, mt: 1, whiteSpace: 'pre-line' }}
                                >
                                    {section.content}
                                </Typography>
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
                        "Your advertising solution, big or small."
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        Parrot Advert - Bahir Dar, Ethiopia
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default TermsAndConditions;