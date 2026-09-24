import React, { useState } from 'react';
import { 
    Container, TextField, Button, Typography, Box, Paper, 
    Alert, AlertTitle, Grid, IconButton, Stack, CircularProgress,
    Divider, Chip, Link, SvgIcon
} from '@mui/material';
import axios from 'axios';
import { 
    Facebook, Telegram, Instagram, YouTube, Pinterest, LinkedIn,
    Email, LocationOn, Phone, Send, Business, 
    Print, Storefront
} from '@mui/icons-material';

// Custom TikTok SVG Icon as MUI doesn't include TikTok in @mui/icons-material
const TikTokIcon = (props) => (
    <SvgIcon {...props} viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.22V8.2a6.34 6.34 0 1 0 6.34 6.34V9.2a8.27 8.27 0 0 0 4.77 1.49V7.2a4.83 4.83 0 0 1-1-0.51z" />
    </SvgIcon>
);

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const getCsrfToken = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });
        
        try {
            const csrfToken = getCsrfToken('csrftoken');
            if (!csrfToken) {
                throw new Error('CSRF token not found. Please refresh the page.');
            }
            await axios.post('/api/contact/', formData, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            setStatus({ type: 'success', msg: 'Your message has been sent successfully! We will get back to you soon.' });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Contact form error:', error);
            setStatus({ 
                type: 'error', 
                msg: error.response?.data?.message || 'Failed to send message. Please try again later.' 
            });
        } finally {
            setLoading(false);
        }
    };

    const socialLinks = [
        { icon: <TikTokIcon />, color: '#000000', url: 'https://tiktok.com/@parrotadvert', name: 'TikTok' },
        { icon: <Telegram />, color: '#0088cc', url: 'https://t.me/parrotadvert77', name: 'Telegram' },
        { icon: <YouTube />, color: '#FF0000', url: 'http://www.youtube.com/@Parrotadvert', name: 'YouTube' },
        { icon: <Facebook />, color: '#1877F2', url: 'https://www.facebook.com/share/1ED6PexafD/', name: 'Facebook' },
        { icon: <Instagram />, color: '#E4405F', url: 'https://www.instagram.com/parrotadvert', name: 'Instagram' },
        { icon: <Pinterest />, color: '#BD081C', url: 'https://www.pinterest.com/parrotstore7', name: 'Pinterest' },
        { icon: <LinkedIn />, color: '#0A66C2', url: 'https://www.linkedin.com/in/parrot-advert-423924437?trk=contact-info', name: 'LinkedIn' },
    ];

    const services = [
        'Business Cards',
        'Flyers & Brochures',
        'Billboards',
        'Banners & Posters',
        'Custom Printing',
        'Digital Advertising'
    ];

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            <Paper elevation={20} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <Grid container>
                    {/* Left Panel: Brand & Info */}
                    <Grid item xs={12} md={5} sx={{ 
                        background: 'linear-gradient(135deg, #1A237E 0%, #0D47A1 100%)',
                        color: 'white',
                        p: { xs: 4, md: 6 },
                        display: 'flex',
                        flexDirection: 'column',
                        justify: 'space-between'
                    }}>
                        <Box>
                            {/* Company Name and Logo */}
                            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ 
                                    bgcolor: '#FFD700', 
                                    borderRadius: 2, 
                                    p: 1.5,
                                    display: 'inline-flex'
                                }}>
                                    <Print sx={{ fontSize: 32, color: '#1A237E' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight={800} sx={{ color: '#FFD700', lineHeight: 1.2 }}>
                                        Parrot
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ color: '#FFD700', fontWeight: 500 }}>
                                        Advertising & Printing
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, fontSize: '1rem' }}>
                                ፓሮት ህትመትና ማስታወቂያ
                            </Typography>
                            
                            <Typography variant="body2" sx={{ opacity: 0.85, mb: 4, fontSize: '0.95rem' }}>
                                Your trusted partner for high-quality printing and advertising solutions. 
                                We bring your ideas to life with premium quality and exceptional service.
                            </Typography>

                            <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />

                            {/* Services/Capabilities */}
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#FFD700' }}>
                                Our Services
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                                {services.map((service, index) => (
                                    <Chip 
                                        key={index}
                                        label={service}
                                        size="small"
                                        sx={{ 
                                            bgcolor: 'rgba(255,215,0,0.15)', 
                                            color: '#FFD700',
                                            '&:hover': { bgcolor: 'rgba(255,215,0,0.25)' }
                                        }}
                                    />
                                ))}
                            </Box>

                            <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />

                            {/* Contact Information */}
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#FFD700' }}>
                                Contact Info
                            </Typography>
                            <Stack spacing={3} sx={{ mb: 4 }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box sx={{ p: 1, bgcolor: 'rgba(255,215,0,0.1)', borderRadius: 2, color: '#FFD700' }}>
                                        <Phone fontSize="small" />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>Phone</Typography>
                                        <Typography variant="body2">+251 908 882 277</Typography>
                                        <Typography variant="body2">+251 799 922 212</Typography>
                                    </Box>
                                </Box>
                                
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box sx={{ p: 1, bgcolor: 'rgba(255,215,0,0.1)', borderRadius: 2, color: '#FFD700' }}>
                                        <Email fontSize="small" />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>Email</Typography>
                                        <Typography variant="body2">parrotadvert7@gmail.com</Typography>
                                    </Box>
                                </Box>
                            </Stack>

                            <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />

                            {/* Location/Address */}
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#FFD700' }}>
                                Location
                            </Typography>
                            <Box display="flex" alignItems="flex-start" gap={2} sx={{ mb: 4 }}>
                                <Box sx={{ p: 1, bgcolor: 'rgba(255,215,0,0.1)', borderRadius: 2, color: '#FFD700' }}>
                                    <LocationOn fontSize="small" />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                        Bahir Dar, Ethiopia
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                                        Kebele 04, Warkaw building 1st floor #12
                                    </Typography>
                                    <Button 
                                        component="a"
                                        href="https://maps.app.goo.gl/1aGuvKN2zV8kFThY6"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        size="small"
                                        sx={{ 
                                            mt: 1, 
                                            color: '#FFD700', 
                                            textTransform: 'none',
                                            '&:hover': { bgcolor: 'rgba(255,215,0,0.1)' }
                                        }}
                                    >
                                        View on Google Maps →
                                    </Button>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />

                            {/* Social Media */}
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#FFD700' }}>
                                Follow Us
                            </Typography>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {socialLinks.map((social, index) => (
                                        <IconButton 
                                            key={index}
                                            component="a"
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.name}
                                            sx={{ 
                                                color: 'white', 
                                                bgcolor: 'rgba(255,255,255,0.1)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': { 
                                                    bgcolor: social.color, 
                                                    transform: 'translateY(-3px)',
                                                    boxShadow: `0 4px 12px ${social.color}66`
                                                }
                                            }}
                                        >
                                            {social.icon}
                                        </IconButton>
                                    ))}
                                </Box>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                    Connect with us on social media for updates and offers
                                </Typography>
                            </Stack>

                            {/* Storefront Note */}
                            <Box sx={{ mt: 4, pt: 2 }}>
                                <Typography variant="caption" sx={{ opacity: 0.6, display: 'block' }}>
                                    <Storefront fontSize="inherit" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                    Visit our store for personalized service
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Link 
                                        href="https://share.google/8J8JLSJysLWFT7wBs" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ color: '#FFD700', fontSize: '0.75rem', textDecoration: 'none' }}
                                    >
                                        Google Maps Location
                                    </Link>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Panel: The Form */}
                    <Grid item xs={12} md={7} sx={{ p: { xs: 4, md: 6 }, bgcolor: '#FFFFFF' }}>
                        {status.msg && (
                            <Alert 
                                severity={status.type} 
                                sx={{ mb: 4, borderRadius: 2 }} 
                                onClose={() => setStatus({ type: '', msg: '' })}
                            >
                                <AlertTitle sx={{ fontWeight: 700 }}>
                                    {status.type === 'success' ? 'Message Sent!' : 'Error'}
                                </AlertTitle>
                                {status.msg}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A237E', mb: 1 }}>
                                    Send us a Message
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    We'd love to hear from you! Fill out the form and we'll get back to you within 24 hours.
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Full Name"
                                        name="name"
                                        placeholder="Enter your full name"
                                        fullWidth
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        fullWidth
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="How can we help you?"
                                        name="message"
                                        multiline
                                        rows={4}
                                        placeholder="Please describe your printing or advertising needs..."
                                        fullWidth
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        disabled={loading}
                                        endIcon={!loading && <Send />}
                                        fullWidth
                                        sx={{ 
                                            py: 1.8,
                                            borderRadius: 2,
                                            fontWeight: 700,
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                            bgcolor: '#1A237E',
                                            color: '#FFD700',
                                            '&:hover': { 
                                                bgcolor: '#0D47A1',
                                                boxShadow: '0 8px 24px rgba(26, 35, 126, 0.3)'
                                            },
                                            '&.Mui-disabled': {
                                                bgcolor: '#1A237E80',
                                                color: '#FFD70080'
                                            }
                                        }}
                                    >
                                        {loading ? <CircularProgress size={26} sx={{ color: '#FFD700' }} /> : 'Send Message'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>

                        {/* Quick Response Note */}
                        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                <Business fontSize="inherit" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                We typically respond within 24 hours. For urgent inquiries, please call us directly.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default ContactUs;