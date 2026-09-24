import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
    Container, Card, Typography, Box, Button, Stack, 
    Chip, Divider, Skeleton, Fade, Grow, Avatar, 
    Paper, Breadcrumbs, IconButton, Tooltip, Alert,
    CardMedia, Dialog, DialogContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import ShareIcon from '@mui/icons-material/Share';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import './NewsDetail.css';

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [videoDialogOpen, setVideoDialogOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        setShareUrl(window.location.href);
        
        if (!id) {
            setError('Invalid news article ID');
            setLoading(false);
            return;
        }
        
        api.get(`news/${id}/`)
            .then(response => {
                if (response.data) {
                    setNewsItem(response.data);
                } else {
                    setError('News article not found');
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching news detail:', error);
                if (error.response?.status === 404) {
                    setError('News article not found');
                } else {
                    setError('Failed to load news article. Please try again later.');
                }
                setLoading(false);
            });
    }, [id]);

    const handleShare = (platform) => {
        const text = `Check out this article: ${newsItem?.title}`;
        const url = shareUrl;
        
        switch(platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                break;
            default:
                break;
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleVideoClick = (videoUrl) => {
        setSelectedVideo(videoUrl);
        setVideoDialogOpen(true);
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImageDialogOpen(true);
    };

    const handleCloseVideoDialog = () => {
        setVideoDialogOpen(false);
        setSelectedVideo(null);
    };

    const handleCloseImageDialog = () => {
        setImageDialogOpen(false);
        setSelectedImage(null);
    };

    // Render media (image/video) for the news detail
    const renderNewsMedia = () => {
        if (!newsItem) return null;
        
        const hasImage = newsItem.image || newsItem.image_url;
        const hasVideo = newsItem.video || newsItem.video_url;
        
        if (!hasImage && !hasVideo) return null;

        return (
            <Box className="news-media-container" sx={{ position: 'relative', mb: 4 }}>
                {hasVideo ? (
                    <Box sx={{ position: 'relative', cursor: 'pointer' }} onClick={() => handleVideoClick(newsItem.video_url || newsItem.video)}>
                        <CardMedia
                            component="img"
                            height={500}
                            image={hasImage || '/video-thumbnail-placeholder.jpg'}
                            alt={newsItem.title}
                            sx={{ 
                                objectFit: 'cover',
                                borderRadius: 2,
                                transition: 'transform 0.3s ease'
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                borderRadius: '50%',
                                width: 80,
                                height: 80,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(156, 39, 176, 0.8)',
                                    transform: 'translate(-50%, -50%) scale(1.1)'
                                }
                            }}
                        >
                            <PlayArrowIcon sx={{ color: 'white', fontSize: 50 }} />
                        </Box>
                        <Chip
                            icon={<VideocamIcon />}
                            label="Video"
                            size="medium"
                            sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                '& .MuiChip-icon': { color: 'white' },
                                fontSize: '1rem',
                                py: 2
                            }}
                        />
                    </Box>
                ) : hasImage ? (
                    <Box sx={{ position: 'relative', cursor: 'pointer' }} onClick={() => handleImageClick(newsItem.image_url || newsItem.image)}>
                        <CardMedia
                            component="img"
                            height={500}
                            image={newsItem.image_url || newsItem.image}
                            alt={newsItem.title}
                            sx={{ 
                                objectFit: 'cover',
                                borderRadius: 2,
                                transition: 'transform 0.3s ease'
                            }}
                        />
                        <Chip
                            icon={<ImageIcon />}
                            label="Image"
                            size="medium"
                            sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                '& .MuiChip-icon': { color: 'white' },
                                fontSize: '1rem',
                                py: 2
                            }}
                        />
                    </Box>
                ) : null}
            </Box>
        );
    };

    if (loading) {
        return (
            <Box className="news-detail-loading">
                <Container maxWidth="lg">
                    <Box sx={{ mt: 3, mb: 3 }}>
                        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                    </Box>
                    <Card className="loading-card">
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                        <Box sx={{ p: 4 }}>
                            <Skeleton variant="text" height={60} width="80%" />
                            <Skeleton variant="text" height={30} width="40%" sx={{ mt: 2 }} />
                            <Skeleton variant="text" height={20} width="100%" sx={{ mt: 4 }} />
                            <Skeleton variant="text" height={20} width="95%" />
                            <Skeleton variant="text" height={20} width="90%" />
                            <Skeleton variant="text" height={20} width="85%" />
                        </Box>
                    </Card>
                </Container>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="news-detail-error">
                <Container maxWidth="md">
                    <Fade in timeout={500}>
                        <Paper className="error-paper">
                            <Box className="error-content">
                                <ErrorIcon className="error-icon" />
                                <Typography variant="h4" className="error-title">
                                    {error === 'News article not found' ? 'Article Not Found' : 'Something Went Wrong'}
                                </Typography>
                                <Typography variant="body1" className="error-message">
                                    {error === 'News article not found' 
                                        ? "The news article you're looking for doesn't exist or has been removed."
                                        : error}
                                </Typography>
                                <Stack direction="row" spacing={2} justifyContent="center">
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate('/news')}
                                        className="error-btn"
                                    >
                                        View All News
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/')}
                                        className="error-btn-outline"
                                    >
                                        Go to Homepage
                                    </Button>
                                </Stack>
                            </Box>
                        </Paper>
                    </Fade>
                </Container>
            </Box>
        );
    }

    if (!newsItem) {
        return null;
    }

    return (
        <Box className="news-detail-page">
            {/* Hero Section */}
            <Box className="news-detail-hero">
                <Container maxWidth="lg">
                    <Fade in timeout={800}>
                        <Box className="hero-content">
                            <Typography variant="overline" className="hero-overline">
                                Latest News & Updates
                            </Typography>
                            <Typography variant="h1" className="hero-title">
                                {newsItem.title}
                            </Typography>
                            {/* ✅ ሙሉ በሙሉ ተወግዷል - እዚህ መግለጫ አያስፈልግም */}
                        </Box>
                    </Fade>
                </Container>
                <Box className="hero-bg" />
            </Box>

            <Container maxWidth="lg" className="news-detail-container">
                {/* Navigation Breadcrumbs */}
                <Box className="news-navigation">
                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
                        <Link to="/" className="breadcrumb-link">Home</Link>
                        <Link to="/news" className="breadcrumb-link">News</Link>
                        <Typography color="text.primary" className="breadcrumb-current">
                            {newsItem.title?.substring(0, 50)}...
                        </Typography>
                    </Breadcrumbs>
                    
                    <Box className="nav-buttons">
                        <Tooltip title="Go Back">
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate(-1)}
                                className="nav-btn back-btn"
                            >
                                Back
                            </Button>
                        </Tooltip>
                        <Tooltip title="Go to Homepage">
                            <Button
                                startIcon={<HomeIcon />}
                                component={Link}
                                to="/"
                                className="nav-btn home-btn"
                            >
                                Home
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Main Article Card */}
                <Grow in timeout={600}>
                    <Card className="article-card">
                        {/* Article Media (Image/Video) */}
                        {renderNewsMedia()}

                        {/* Article Header */}
                        <Box className="article-header">
                            <Typography variant="h2" className="article-title">
                                {newsItem.title}
                            </Typography>
                            
                            <Box className="article-meta">
                                <Box className="meta-item">
                                    <CalendarTodayIcon className="meta-icon" />
                                    <Typography variant="body2">
                                        {new Date(newsItem.published_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Typography>
                                </Box>
                                <Box className="meta-item">
                                    <PersonIcon className="meta-icon" />
                                    <Typography variant="body2">
                                        Parrot Advert Team
                                    </Typography>
                                </Box>
                                <Box className="meta-item">
                                    <VisibilityIcon className="meta-icon" />
                                    <Typography variant="body2">
                                        1.2K views
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <Divider className="article-divider" />
                            
                            {/* ✅ መግለጫው እዚህ ብቻ ይታያል */}
                            <Typography variant="h5" className="article-description">
                                {newsItem.title}
                            </Typography>
                        </Box>

                        {/* Article Content */}
                        <Box className="article-content">
                            <Typography variant="body1" className="content-text">
                                {newsItem.content || newsItem.description}
                            </Typography>
                        </Box>

                        <Divider className="article-divider" />

                        {/* Share Section */}
                        <Box className="share-section">
                            <Typography variant="h6" className="share-title">
                                Share this article
                            </Typography>
                            <Stack direction="row" spacing={2} justifyContent="center" className="share-buttons">
                                <Tooltip title="Share on Facebook">
                                    <IconButton 
                                        className="share-icon facebook" 
                                        onClick={() => handleShare('facebook')}
                                    >
                                        <FacebookIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share on Twitter">
                                    <IconButton 
                                        className="share-icon twitter" 
                                        onClick={() => handleShare('twitter')}
                                    >
                                        <TwitterIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share on LinkedIn">
                                    <IconButton 
                                        className="share-icon linkedin" 
                                        onClick={() => handleShare('linkedin')}
                                    >
                                        <LinkedInIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share on WhatsApp">
                                    <IconButton 
                                        className="share-icon whatsapp" 
                                        onClick={() => handleShare('whatsapp')}
                                    >
                                        <WhatsAppIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={copied ? "Copied!" : "Copy Link"}>
                                    <IconButton 
                                        className={`share-icon copy ${copied ? 'copied' : ''}`} 
                                        onClick={handleCopyLink}
                                    >
                                        {copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Box>

                        {/* Bottom Navigation */}
                        <Box className="bottom-navigation">
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                                <Button
                                    startIcon={<ArrowBackIcon />}
                                    onClick={() => navigate('/news')}
                                    className="bottom-nav-btn back-list-btn"
                                >
                                    Back to News List
                                </Button>
                                <Button
                                    startIcon={<HomeIcon />}
                                    component={Link}
                                    to="/"
                                    className="bottom-nav-btn home-list-btn"
                                >
                                    Go to Homepage
                                </Button>
                            </Stack>
                        </Box>
                    </Card>
                </Grow>

                {/* Related Articles Section */}
                <Box className="related-articles">
                    <Typography variant="h4" className="related-title">
                        You Might Also Like
                    </Typography>
                    <Typography variant="body1" className="related-subtitle">
                        Discover more news and updates from Parrot Advert
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/all-news')}
                        className="view-all-btn"
                    >
                        View All News
                    </Button>
                </Box>
            </Container>

            {/* Video Dialog */}
            <Dialog
                open={videoDialogOpen}
                onClose={handleCloseVideoDialog}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(0,0,0,0.95)',
                        borderRadius: 2,
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogContent sx={{ p: 0, position: 'relative' }}>
                    <IconButton
                        onClick={handleCloseVideoDialog}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            zIndex: 1,
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.9)'
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {selectedVideo && (
                        <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                            <video
                                controls
                                autoPlay
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 8
                                }}
                                src={selectedVideo}
                            />
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {/* Image Dialog */}
            <Dialog
                open={imageDialogOpen}
                onClose={handleCloseImageDialog}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(0,0,0,0.95)',
                        borderRadius: 2,
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogContent sx={{ p: 0, position: 'relative' }}>
                    <IconButton
                        onClick={handleCloseImageDialog}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            zIndex: 1,
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.9)'
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="News image"
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '85vh',
                                objectFit: 'contain',
                                borderRadius: 8
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default NewsDetail;