import React from 'react';
import { Box, Typography, Link, Container, Stack, IconButton, SvgIcon } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PinterestIcon from '@mui/icons-material/Pinterest';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Link as RouterLink } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';

// Custom TikTok SVG Icon as MUI doesn't include TikTok in @mui/icons-material
const TikTokIcon = (props) => (
    <SvgIcon {...props} viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.22V8.2a6.34 6.34 0 1 0 6.34 6.34V9.2a8.27 8.27 0 0 0 4.77 1.49V7.2a4.83 4.83 0 0 1-1-0.51z" />
    </SvgIcon>
);

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box 
            component="footer" 
            sx={{ 
                mt: 8,
                background: 'linear-gradient(135deg, #2b2d42 0%, #1a1a2e 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Decorative elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'rgba(67, 97, 238, 0.1)'
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -50,
                    left: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(247, 37, 133, 0.1)'
                }}
            />

            <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
                <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    spacing={4}
                    justifyContent="space-between"
                    alignItems={{ xs: 'center', md: 'flex-start' }}
                >
                    {/* Company Info */}
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: 300 }}>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 700, 
                                mb: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Follow Us
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            Your advertising solution, big or small. High-quality printing, branding, and advertising services in Bahir Dar, Ethiopia.
                        </Typography>
                        <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                            {/* 1. TikTok */}
                            <IconButton 
                                size="small" 
                                component="a"
                                href="https://tiktok.com/@parrotadvert"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ 
                                    color: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { backgroundColor: '#4361ee' }
                                }}
                            >
                                <TikTokIcon /> {/* Replace with your TikTok SVG icon or standard icon */}
                            </IconButton>

                            {/* 2. Telegram */}
                            <IconButton 
                                size="small" 
                                component="a"
                                href="https://t.me/parrotadvert77"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ 
                                    color: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { backgroundColor: '#4361ee' }
                                }}
                            >
                                <TelegramIcon />
                            </IconButton>

                            {/* 3. YouTube */}
                            <IconButton 
                                size="small" 
                                component="a"
                                href="http://www.youtube.com/@Parrotadvert"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ 
                                    color: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { backgroundColor: '#4361ee' }
                                }}
                            >
                                <YouTubeIcon />
                            </IconButton>

                            {/* 4. Facebook */}
                            <IconButton 
                                size="small" 
                                component="a"
                                href="https://www.facebook.com/share/1ED6PexafD/"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ 
                                    color: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { backgroundColor: '#4361ee' }
                                }}
                            >
                                <FacebookIcon />
                            </IconButton>

                            {/* 5. Instagram */}
                            <IconButton 
                                size="small" 
                                component="a"
                                href="https://www.instagram.com/parrotadvert"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ 
                                    color: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { backgroundColor: '#4361ee' }
                                }}
                            >
                                <InstagramIcon />
                            </IconButton>

                            {/* 6. Pinterest */}
                            <IconButton 
                                size="small" 
                                component="a"
                                href="https://www.pinterest.com/parrotstore7"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ 
                                    color: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { backgroundColor: '#4361ee' }
                                }}
                            >
                                <PinterestIcon />
                            </IconButton>

                            {/* 7. LinkedIn */}
                            <IconButton 
                                size="small" 
                                component="a"
                                href="https://www.linkedin.com/in/parrot-advert-423924437?trk=contact-info"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ 
                                    color: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { backgroundColor: '#4361ee' }
                                }}
                            >
                                <LinkedInIcon />
                            </IconButton>
                        </Stack>
                    </Box>
                    {/* Quick Links */}
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Quick Links
                        </Typography>
                        <Stack spacing={1.5}>
                            <Link 
                                component={RouterLink} 
                                to="/" 
                                sx={{ 
                                    color: 'rgba(255,255,255,0.7)', 
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    '&:hover': { color: '#667eea' }
                                }}
                            >
                                <HomeIcon sx={{ fontSize: 18 }} />
                                Home
                            </Link>
                            <Link 
                                component={RouterLink} 
                                to="/products" 
                                sx={{ 
                                    color: 'rgba(255,255,255,0.7)', 
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    '&:hover': { color: '#667eea' }
                                }}
                            >
                                <HomeIcon sx={{ fontSize: 18 }} />
                                Products
                            </Link>
                            <Link 
                                component={RouterLink} 
                                to="/about-us" 
                                sx={{ 
                                    color: 'rgba(255,255,255,0.7)', 
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    '&:hover': { color: '#667eea' }
                                }}
                            >
                                <InfoIcon sx={{ fontSize: 18 }} />
                                About Us
                            </Link>
                            <Link 
                                component={RouterLink} 
                                to="/contact-us" 
                                sx={{ 
                                    color: 'rgba(255,255,255,0.7)', 
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    '&:hover': { color: '#667eea' }
                                }}
                            >
                                <ContactMailIcon sx={{ fontSize: 18 }} />
                                Contact Us
                            </Link>
                        </Stack>
                    </Box>

                    {/* Legal Links - አዲስ ክፍል */}
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Legal
                        </Typography>
                        <Stack spacing={1.5}>
                            <Link 
                                component={RouterLink} 
                                to="/terms" 
                                sx={{ 
                                    color: 'rgba(255,255,255,0.7)', 
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    '&:hover': { color: '#667eea' }
                                }}
                            >
                                <GavelIcon sx={{ fontSize: 18 }} />
                                Terms & Conditions
                            </Link>
                            <Link 
                                component={RouterLink} 
                                to="/privacy" 
                                sx={{ 
                                    color: 'rgba(255,255,255,0.7)', 
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    '&:hover': { color: '#667eea' }
                                }}
                            >
                                <PrivacyTipIcon sx={{ fontSize: 18 }} />
                                Privacy Policy
                            </Link>
                        </Stack>
                    </Box>

                    {/* Contact Info */}
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Contact Info
                        </Typography>
                        <Stack spacing={1.5}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                <FontAwesomeIcon icon={faPhone} style={{ color: '#667eea' }} />
                                <Link 
                                    href="tel:+251908882277" 
                                    sx={{ 
                                        color: 'rgba(255,255,255,0.7)', 
                                        textDecoration: 'none', 
                                        '&:hover': { color: '#667eea' } 
                                    }}
                                >
                                    +251 90 888 2277
                                </Link>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                <FontAwesomeIcon icon={faEnvelope} style={{ color: '#667eea' }} />
                                <Link 
                                    href="mailto:parrotadvert7@gmail.com" 
                                    sx={{ 
                                        color: 'rgba(255,255,255,0.7)', 
                                        textDecoration: 'none', 
                                        '&:hover': { color: '#667eea' } 
                                    }}
                                >
                                    parrotadvert7@gmail.com
                                </Link>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#667eea', marginTop: 4 }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    Kebele 04, Warkaw building 1st floor #12, Bahir Dar, Ethiopia
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Stack>

                {/* Divider */}
                <Box 
                    sx={{ 
                        my: 4, 
                        height: 1, 
                        backgroundColor: 'rgba(255,255,255,0.1)' 
                    }} 
                />

                {/* Bottom Section */}
                <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    justifyContent="space-between" 
                    alignItems="center"
                    spacing={2}
                >
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        © {currentYear} Parrot Advert. All rights reserved.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        "Your advertising solution, big or small."
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                        Developed by: <strong style={{ color: '#667eea' }}>Zemenu.Tadele21@gmail.com</strong>
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;