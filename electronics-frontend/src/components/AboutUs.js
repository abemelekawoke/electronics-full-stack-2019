import React from 'react';
import { 
    Container, Typography, Box, Paper, Grid, 
    Divider, Stack, Avatar, useTheme, Chip,
    List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { 
    Brush, Print, Campaign, Stars, 
    Public, Speed, WorkspacePremium,
    Palette, Description, 
    Inventory,
    LocalOffer, EmojiObjects, TrendingUp,
    CheckCircle, SupportAgent,
    Flag, Visibility, ThumbUp, People,
    Phone, Email, LocationOn,
    PhotoCamera, Storefront, Check,
    Style, ShoppingBag, ColorLens
} from '@mui/icons-material';
import './AboutUs.css';

const AboutUs = () => {
    const theme = useTheme();

    // Services based on the document
    const services = [
        { icon: <Palette fontSize="large" />, title: "Graphics Design", desc: "Professional graphic design services for all your branding needs." },
        { icon: <Description fontSize="large" />, title: "Digital Printing", desc: "High-quality flyers, brochures, business cards, and more." },
        { icon: <PhotoCamera fontSize="large" />, title: "Large Format Printing", desc: "Banners, billboards, signage, and outdoor advertising." },
        { icon: <Style fontSize="large" />, title: "Textile Printing", desc: "Custom T-shirts, caps, uniforms, jerseys, and promotional wear." },
        { icon: <Brush fontSize="large" />, title: "Branding & Advertising", desc: "Complete branding solutions and advertising design services." },
        { icon: <LocalOffer fontSize="large" />, title: "Packaging & Label Printing", desc: "Custom packaging and label design for your products." },
        { icon: <ShoppingBag fontSize="large" />, title: "Promotional Materials", desc: "Corporate materials and promotional items for your business." },
        { icon: <Storefront fontSize="large" />, title: "Raw Materials & Equipment", desc: "Quality printing raw materials and equipment supply." },
    ];

    // What We Do - Detailed List
    const whatWeDoList = [
        "Graphics Design",
        "Digital printing (flyers, brochures, business cards)",
        "Large format printing (banners, billboards, signage)",
        "Textile printing (T-shirts, caps, uniforms, jerseys)",
        "Branding and advertising design",
        "Packaging and label printing",
        "Promotional and corporate materials",
        "Selling Printing raw materials and Equipment's"
    ];

    // Why Choose Us
    const reasons = [
        { icon: <ThumbUp />, title: "High-Quality Technology", desc: "Cutting-edge printing technology for superior results." },
        { icon: <People />, title: "Creative Design Team", desc: "Professional and experienced design professionals." },
        { icon: <Speed />, title: "Fast & Reliable Service", desc: "Quick turnaround times without compromising quality." },
        { icon: <EmojiObjects />, title: "Affordable Pricing", desc: "Competitive prices for all clients and projects." },
        { icon: <SupportAgent />, title: "Customer Satisfaction", desc: "Your satisfaction is our top priority." },
        { icon: <CheckCircle />, title: "Quality Guarantee", desc: "100% satisfaction guaranteed on all services." },
    ];

    return (
        <Box className="about-container">
            {/* ===== Hero Section ===== */}
            <Box className="about-hero">
                <Container maxWidth="lg">
                    <Box className="hero-content">
                        <Box className="hero-badge">
                            WELCOME TO PARROT ADVERT
                        </Box>
                        <Typography className="hero-title">
                            Your <span className="highlight">Advertising</span> Solution
                        </Typography>
                        <Typography className="hero-subtitle">
                            "Big or Small"
                        </Typography>
                        <Typography className="hero-description">
                            Parrot Printing and Advertising Company in short <strong>Parrot Advert</strong>.
                            A modern and creative printing and branding business based in Bahir Dar, Ethiopia.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* ===== Who We Are ===== */}
            <Container maxWidth="lg">
                <Box className="section-card" sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={700} color="#1A237E" gutterBottom>
                        Who We Are
                    </Typography>
                    <Typography variant="body1" color="textSecondary" fontSize="1.1rem" paragraph>
                        Parrot Advert is a modern and creative printing and branding business based in Bahir Dar, Ethiopia. 
                        We specialize in providing high-quality designing, printing, advertising, and textile printing 
                        solutions for individuals, small businesses, and large organizations.
                    </Typography>
                    <Typography variant="body1" color="textSecondary" fontSize="1.1rem">
                        We also supply printing raw materials and equipment to support the printing industry.
                    </Typography>
                </Box>

                {/* ===== Mission & Vision ===== */}
                <Grid container spacing={4} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Box className="mission-card">
                            <Flag className="icon" />
                            <Typography variant="h5" fontWeight={700} gutterBottom>
                                Our Mission
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
                                Our mission is to help businesses and individuals communicate their ideas effectively 
                                through powerful visual design, high-quality printing, and innovative branding solutions 
                                at affordable prices.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box className="vision-card">
                            <Visibility className="icon" />
                            <Typography variant="h5" fontWeight={700} gutterBottom>
                                Our Vision
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.8, fontWeight: 500 }}>
                                To become one of the leading printing and advertising companies in Ethiopia, 
                                known for creativity, quality, and customer satisfaction.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* ===== What We Do - Section ===== */}
                <Box sx={{ mb: 5 }}>
                    <Typography 
                        variant="h4" 
                        fontWeight={800} 
                        textAlign="center" 
                        color="#1A237E"
                        sx={{ mb: 1 }}
                    >
                        What We Do
                    </Typography>
                    <Typography 
                        variant="body1" 
                        color="textSecondary" 
                        textAlign="center"
                        sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}
                    >
                        We provide a wide range of professional printing and advertising services
                    </Typography>
                    
                    {/* Service Cards Grid */}
                    <Grid container spacing={3}>
                        {services.map((service, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Box className="service-card">
                                    <Box className="service-icon">
                                        {service.icon}
                                    </Box>
                                    <Typography className="service-title">
                                        {service.title}
                                    </Typography>
                                    <Typography className="service-desc">
                                        {service.desc}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Detailed List */}
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            mt: 4, 
                            p: 3, 
                            bgcolor: '#f8f9fa', 
                            borderRadius: 3,
                            border: '1px solid #e0e0e0'
                        }}
                    >
                        <Typography variant="h6" fontWeight={700} color="#1A237E" gutterBottom>
                            Our Services Include:
                        </Typography>
                        <Grid container spacing={1}>
                            {whatWeDoList.map((item, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Check sx={{ color: '#FFD700', fontSize: 20 }} />
                                        <Typography variant="body2" color="textSecondary">
                                            {item}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Box>

                {/* ===== Textile & Branding Services ===== */}
                <Box className="textile-section" sx={{ mb: 4 }}>
                    <Grid container alignItems="center" spacing={4}>
                        <Grid item xs={12} md={8}>
                            <Typography className="textile-title">
                                <Style className="icon" />
                                Textile & Branding Services
                            </Typography>
                            <Typography className="textile-text">
                                We bring your ideas to life on fabric and promotional items. From custom T-shirts and 
                                uniforms to branded caps and event clothing, we help you turn everyday items into 
                                powerful marketing tools.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} textAlign={{ xs: 'left', md: 'center' }}>
                            <Box className="textile-badge">
                                Premium Quality
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* ===== Why Choose Us ===== */}
                <Box sx={{ mb: 5 }}>
                    <Typography 
                        variant="h4" 
                        fontWeight={800} 
                        textAlign="center" 
                        color="#1A237E"
                        sx={{ mb: 4 }}
                    >
                        Why Choose Us
                    </Typography>
                    
                    <Grid container spacing={3}>
                        {reasons.map((reason, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Box className="why-card">
                                    <Box className="why-icon">
                                        {reason.icon}
                                    </Box>
                                    <Typography className="why-title">
                                        {reason.title}
                                    </Typography>
                                    <Typography className="why-desc">
                                        {reason.desc}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* ===== Stats Section ===== */}
                <Box className="stats-section" sx={{ mb: 4 }}>
                    <Grid container justifyContent="center" spacing={4}>
                        <Grid item xs={6} md={3}>
                            <Box className="stat-item">
                                <Typography className="stat-number">
                                    99<sup className="plus">%</sup>
                                </Typography>
                                <Typography className="stat-label">Client Satisfaction</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box className="stat-item">
                                <Typography className="stat-number">
                                    500<sup className="plus">+</sup>
                                </Typography>
                                <Typography className="stat-label">Projects Completed</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box className="stat-item">
                                <Typography className="stat-number">
                                    24<sup className="plus">/7</sup>
                                </Typography>
                                <Typography className="stat-label">Customer Support</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box className="stat-item">
                                <Typography className="stat-number">
                                    100<sup className="plus">%</sup>
                                </Typography>
                                <Typography className="stat-label">Quality Guarantee</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* ===== Our Commitment ===== */}
                <Box className="commitment-section">
                    <Typography className="commitment-title">
                        Our Commitment
                    </Typography>
                    <Typography className="commitment-text">
                        We are committed to delivering excellent service, maintaining strong customer relationships, 
                        and ensuring every project reflects quality, creativity, and professionalism.
                    </Typography>
                    <Box className="commitment-chips">
                        <Box className="commitment-chip commitment-chip-blue">
                            <ThumbUp sx={{ fontSize: 16 }} />
                            Quality
                        </Box>
                        <Box className="commitment-chip commitment-chip-gold">
                            <Stars sx={{ fontSize: 16 }} />
                            Creativity
                        </Box>
                        <Box className="commitment-chip commitment-chip-light">
                            <WorkspacePremium sx={{ fontSize: 16 }} />
                            Professionalism
                        </Box>
                    </Box>
                </Box>

                {/* ===== Contact Info at Bottom ===== */}
                <Box 
                    sx={{ 
                        mt: 4, 
                        p: 3, 
                        bgcolor: '#FFFFFF', 
                        borderRadius: 3, 
                        color: 'black',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        Contact Us
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone sx={{ color: '#FFD700' }} />
                            <Typography variant="body2">+251908882277</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Email sx={{ color: '#FFD700' }} />
                            <Typography variant="body2">parrotadvert7@gmail.com</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn sx={{ color: '#FFD700' }} />
                            <Typography variant="body2">Bahir Dar, Ethiopia</Typography>
                        </Box>
                    </Box>
                    <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 2 }}>
                        "Your advertising solution, big or small."
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutUs;