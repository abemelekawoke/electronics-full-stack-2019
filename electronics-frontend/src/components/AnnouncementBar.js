import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Alert,
    Chip,
    IconButton,
    Skeleton,
    Slide,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Close as CloseIcon,
    LocalOffer as LocalOfferIcon,
    Campaign as CampaignIcon,
    AccessTime as AccessTimeIcon,
    VolumeUp as VolumeUpIcon
} from '@mui/icons-material';
import api from '../services/api';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Always show on first load
    useEffect(() => {
        localStorage.removeItem('announcement_closed');
        setVisible(true);
    }, []);

    // Check if announcement was closed before
    useEffect(() => {
        const closed = localStorage.getItem('announcement_closed');
        if (closed === 'true') {
            setVisible(false);
        }
    }, []);

    // Fetch announcements from API
    useEffect(() => {
        const loadAnnouncements = async () => {
            setLoading(true);
            
            try {
                console.log('🔍 Fetching announcements from /api/v1/announcements/...');
                const response = await api.get('announcements/');
                console.log('✅ API Response:', response);
                
                const data = response.data || response;
                console.log('📊 Full response data:', data);
                
                // ✅ ውሂቡን በትክክል መያዝ - results ውስጥ ነው
                let announcementsData = [];
                if (data && typeof data === 'object') {
                    if (Array.isArray(data)) {
                        // ቀጥታ አራይ ከሆነ
                        announcementsData = data;
                    } else if (data.results && Array.isArray(data.results)) {
                        // Pagination ካለ (results ውስጥ ነው)
                        announcementsData = data.results;
                    } else {
                        // ነጠላ ነገር ከሆነ
                        announcementsData = [data];
                    }
                }
                
                console.log('📊 Announcements count:', announcementsData.length);
                console.log('📊 Announcements:', announcementsData);
                
                if (announcementsData.length > 0) {
                    setAnnouncements(announcementsData);
                } else {
                    console.log('⚠️ No announcements found');
                    setAnnouncements([]);
                }
            } catch (err) {
                console.error('❌ Error loading announcements:', err);
                console.error('Error details:', err.response?.data);
                setAnnouncements([]);
            } finally {
                setLoading(false);
            }
        };
        
        loadAnnouncements();
    }, []);

    // Rotate through announcements
    useEffect(() => {
        if (announcements.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % announcements.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [announcements, isPaused]);

    const handleClose = () => {
        setVisible(false);
        localStorage.setItem('announcement_closed', 'true');
    };

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    // Show loading skeleton
    if (loading) {
        return (
            <Box className="announcement-bar-wrapper">
                <Container maxWidth="xl">
                    <Skeleton 
                        variant="rectangular" 
                        height={isMobile ? 50 : 60} 
                        sx={{ borderRadius: 2 }} 
                    />
                </Container>
            </Box>
        );
    }

    // Don't show if no announcements or closed
    if (announcements.length === 0 || !visible) {
        return null;
    }

    const currentAnnouncement = announcements[currentIndex];

    return (
        <Box 
            className="announcement-bar-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Container maxWidth="xl">
                <Slide direction="down" in={visible} mountOnEnter unmountOnExit>
                    <Alert
                        severity="info"
                        icon={<CampaignIcon />}
                        className="announcement-alert"
                        action={
                            <Box className="announcement-actions">
                                {currentAnnouncement.coupon_code && (
                                    <Chip
                                        icon={<LocalOfferIcon />}
                                        label={
                                            isMobile 
                                                ? `ኮድ: ${currentAnnouncement.coupon_code}`
                                                : `ኮድ ይጠቀሙ: ${currentAnnouncement.coupon_code}`
                                        }
                                        size="small"
                                        className="coupon-chip"
                                    />
                                )}
                                {announcements.length > 1 && (
                                    <Box className="announcement-counter">
                                        <AccessTimeIcon fontSize="small" />
                                        <Typography variant="caption">
                                            {currentIndex + 1}/{announcements.length}
                                        </Typography>
                                    </Box>
                                )}
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={handleClose}
                                    className="close-btn"
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        }
                    >
                        <Box className="announcement-content">
                            <VolumeUpIcon className="announcement-icon" />
                            <Typography variant={isMobile ? 'body2' : 'body1'} className="announcement-text">
                                {currentAnnouncement.text}
                            </Typography>
                            {currentAnnouncement.coupon_code && !isMobile && (
                                <Typography variant="caption" className="announcement-hint">
                                    በትዛዙ ላይ ኮዱን ይጠቀሙት! 
                                </Typography>
                            )}
                        </Box>
                    </Alert>
                </Slide>
            </Container>
        </Box>
    );
};

export default AnnouncementBar;