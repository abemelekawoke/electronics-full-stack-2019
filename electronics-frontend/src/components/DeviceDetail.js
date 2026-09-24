import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Button } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { formatDistanceToNow } from 'date-fns';
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    TelegramShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    TelegramIcon
} from 'react-share';
import {
    Box,
    Typography,
    Divider,
    Chip,
    Stack,
    IconButton,
    Tooltip,
    Paper,
    Fade,
    Zoom,
    Grow,
    Skeleton,
    LinearProgress,
    Alert,
    AlertTitle,
    Snackbar,
    Rating
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShareIcon from '@mui/icons-material/Share';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import './DeviceDetail.css';

const DeviceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [device, setDevice] = useState(null);
    const [shareUrl, setShareUrl] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const currentUrl = window.location.href;
        setShareUrl(currentUrl);

        api.get(`devices/${id}/`)
            .then(response => {
                const deviceData = {
                    ...response.data,
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    reviewCount: Math.floor(Math.random() * 100) + 10,
                    specifications: {
                        brand: 'Parrot Advert',
                        model: `PA-${response.data.id}`,
                        warranty: '12 months',
                        returnPolicy: '7 days free return'
                    }
                };
                setDevice(deviceData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching device:', error);
                setError('Failed to load product details. Please try again later.');
                setLoading(false);
            });
    }, [id]);

    const handleSelect = (selectedIndex) => {
        setActiveIndex(selectedIndex);
    };

    const handleOrderClick = () => {
        navigate(`/order/${id}`);
    };

    const handleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        setSnackbarMessage(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
        setShowSnackbar(true);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setSnackbarMessage('Link copied to clipboard!');
        setShowSnackbar(true);
    };

    const handleWhatsAppShare = () => {
        const text = `Check out this amazing product: ${device.name} - ${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleEmailShare = () => {
        const subject = `Check out this product: ${device.name}`;
        const body = `I thought you might be interested in this product:\n\n${device.name}\n${shareUrl}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const images = [
        device?.image1,
        device?.image2,
        device?.image3
    ].filter(img => img);

    if (loading) {
        return (
            <Box className="detail-loading-container">
                <Container>
                    <Row>
                        <Col lg={7} className="mb-4">
                            <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 3 }} animation="wave" />
                            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                                {[1, 2, 3].map(i => (
                                    <Skeleton key={i} variant="rectangular" width={70} height={70} sx={{ borderRadius: 2 }} />
                                ))}
                            </Box>
                        </Col>
                        <Col lg={5}>
                            <Skeleton variant="text" height={60} width="80%" />
                            <Skeleton variant="text" height={30} width="40%" sx={{ mt: 2 }} />
                            <Skeleton variant="rectangular" height={100} sx={{ mt: 3, borderRadius: 2 }} />
                            <Skeleton variant="text" height={20} sx={{ mt: 3 }} />
                            <Skeleton variant="text" height={20} width="90%" />
                            <Skeleton variant="text" height={20} width="80%" />
                            <Skeleton variant="rectangular" height={60} sx={{ mt: 4, borderRadius: 2 }} />
                        </Col>
                    </Row>
                </Container>
            </Box>
        );
    }

    if (error || !device) {
        return (
            <Box className="detail-error-container">
                <Container>
                    <Fade in timeout={500}>
                        <Box className="error-content">
                            <ErrorIcon className="error-icon" />
                            <Typography variant="h4" className="error-title">
                                Oops! Something went wrong
                            </Typography>
                            <Typography variant="body1" className="error-message">
                                {error || 'Product not found'}
                            </Typography>
                            <Stack direction="row" spacing={2} justifyContent="center">
                                <Button 
                                    variant="contained" 
                                    onClick={() => navigate('/')}
                                    className="error-btn"
                                >
                                    Go to Home
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => window.location.reload()}
                                    className="error-btn-outline"
                                >
                                    Try Again
                                </Button>
                            </Stack>
                        </Box>
                    </Fade>
                </Container>
            </Box>
        );
    }

    const getStockStatus = () => {
        // High Stock
        if (device.stock > 20) {
            return { 
                text: `${device.stock} In Stock`, 
                color: '#4caf50', 
                icon: <CheckCircleIcon /> 
            };
        }
        
        // Low Stock
        if (device.stock > 0) {
            return { 
                text: `${device.stock} Low Stock`, 
                color: '#ff9800', 
                icon: <ErrorIcon /> 
            };
        }

        // Zero Stock
        return { 
            text: '0 Out of Stock', 
            color: '#f44336', 
            icon: <ErrorIcon /> 
        };
    };

    const stockStatus = getStockStatus();

    return (
        <Box className="detail-page">
            {/* Hero Breadcrumb */}
            <Box className="detail-hero">
                <Container>
                    <Fade in timeout={800}>
                        <Box className="detail-hero-content">
                            <Typography variant="overline" className="detail-hero-overline">
                                Product Details
                            </Typography>
                            <Typography variant="h1" className="detail-hero-title">
                                {device.name}
                            </Typography>
                            <Typography variant="body1" className="detail-hero-description">
                                Discover premium quality printing solutions tailored to your needs
                            </Typography>
                        </Box>
                    </Fade>
                </Container>
                <Box className="detail-hero-bg" />
            </Box>

            <Container className="detail-main">
                {/* Navigation Bar */}
                <Paper className="detail-nav-bar" elevation={0}>
                    <Box className="nav-buttons">
                        <Button 
                            variant="outlined" 
                            onClick={() => navigate(-1)}
                            startIcon={<ArrowBackIcon />}
                            className="nav-btn-back"
                        >
                            Back
                        </Button>
                        <Button 
                            variant="outlined" 
                            onClick={() => navigate('/')}
                            startIcon={<HomeIcon />}
                            className="nav-btn-home"
                        >
                            Home
                        </Button>
                    </Box>
                </Paper>

                <Row className="detail-main-row">
                    {/* Image Gallery */}
                    <Col lg={7} className="detail-gallery-col">
                        <Zoom in timeout={500}>
                            <Card className="detail-gallery-card">
                                <Box className="gallery-container">
                                    {images.length === 0 ? (
                                        <Box className="no-images-container">
                                            <InventoryIcon className="no-images-icon" />
                                            <Typography variant="body2">No images available</Typography>
                                        </Box>
                                    ) : (
                                        <>
                                            <Box className="main-image-container">
                                                <img
                                                    src={images[activeIndex]}
                                                    alt={`${device.name} - Main view`}
                                                    className="main-image"
                                                />
                                                
                                                {/* Image Counter */}
                                                <Box className="image-counter-badge">
                                                    <Typography variant="caption">
                                                        {activeIndex + 1} / {images.length}
                                                    </Typography>
                                                </Box>
                                                
                                                {/* Stock Badge */}
                                                <Box className={`stock-badge ${stockStatus.text.toLowerCase().replace(' ', '-')}`}>
                                                    {stockStatus.icon}
                                                    <Typography variant="caption">{stockStatus.text}</Typography>
                                                </Box>
                                            </Box>
                                            
                                            {/* Thumbnails */}
                                            {images.length > 1 && (
                                                <Box className="thumbnail-container">
                                                    {images.map((img, index) => (
                                                        <Box 
                                                            key={index}
                                                            className={`thumbnail ${activeIndex === index ? 'active' : ''}`}
                                                            onClick={() => setActiveIndex(index)}
                                                        >
                                                            <img
                                                                src={img}
                                                                alt={`Thumbnail ${index + 1}`}
                                                                className="thumbnail-image"
                                                            />
                                                        </Box>
                                                    ))}
                                                </Box>
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Card>
                        </Zoom>
                    </Col>
                    
                    {/* Product Info */}
                    <Col lg={5} className="detail-info-col">
                        <Grow in timeout={600}>
                            <Card className="detail-info-card">
                                <Card.Body className="detail-info-body">
                                    {/* Badges */}
                                    <Box className="badges-container">
                                        <Chip 
                                            label={device.category || 'Standard'}
                                            size="small"
                                            className="type-badge"
                                        />
                                        <Chip 
                                            label={device.type || 'Standard'}
                                            size="small"
                                            className="type-badge"
                                        />
                                        {device.isNew && (
                                            <Chip 
                                                label="New Arrival"
                                                size="small"
                                                className="new-badge-detail"
                                            />
                                        )}
                                        {device.discount > 0 && (
                                            <Chip 
                                                label={`${device.discount}% OFF`}
                                                size="small"
                                                className="discount-badge-detail"
                                            />
                                        )}
                                    </Box>
                                    
                                    {/* Title */}
                                    <Typography variant="h3" className="product-title">
                                        {device.name}
                                    </Typography>
                                    
                                    {/* Rating */}
                                    <Box className="rating-section">
                                        <Rating value={parseFloat(device.rating)} precision={0.5} readOnly />
                                        <Typography variant="body2" className="rating-text">
                                            {device.rating} ({device.reviewCount} reviews)
                                        </Typography>
                                    </Box>
                                    
                                    {/* Price Section */}
                                    <Paper className="price-paper" elevation={0}>
                                        <Typography variant="body2" className="price-label">
                                            Price
                                        </Typography>
                                        <Box className="price-container-detail">
                                            {device.old_price && (
                                                <Typography className="old-price-detail">
                                                    ETB {parseFloat(device.old_price).toLocaleString()}
                                                </Typography>
                                            )}
                                            <Typography className="current-price-detail">
                                                ETB {parseFloat(device.price).toLocaleString()}
                                                {' '} {device.price_type} 
                                            </Typography>
                                        </Box>
                                        {device.shipping_fee && (
                                            <Typography variant="caption" className="price-type">
                                                shipping fee: {device.shipping_fee} 
                                            </Typography>
                                        )}
                                        
                                    </Paper>
                                    
                                    {/* Description */}
                                    <Box className="description-section">
                                        <Typography variant="h6" className="section-title">
                                            Description
                                        </Typography>
                                        <Typography variant="body1" className="description-text">
                                            {device.description}
                                        </Typography>
                                    </Box>
                                    
                                    {/* Specifications */}
                                    <Box className="specifications-section">
                                        <Typography variant="h6" className="section-title">
                                            Specifications
                                        </Typography>
                                        <Box className="specs-grid">
                                            <Box className="spec-item">
                                                <Typography variant="caption" className="spec-label">Brand</Typography>
                                                <Typography variant="body2" className="spec-value">
                                                    {device.specifications?.brand || 'Parrot Advert'}
                                                </Typography>
                                            </Box>
                                            <Box className="spec-item">
                                                <Typography variant="caption" className="spec-label">Model</Typography>
                                                <Typography variant="body2" className="spec-value">
                                                    {device.specifications?.model || `PA-${device.id}`}
                                                </Typography>
                                            </Box>
                                            <Box className="spec-item">
                                                <Typography variant="caption" className="spec-label">Warranty</Typography>
                                                <Typography variant="body2" className="spec-value">
                                                    {device.specifications?.warranty || '12 months'}
                                                </Typography>
                                            </Box>
                                            <Box className="spec-item">
                                                <Typography variant="caption" className="spec-label">Returns</Typography>
                                                <Typography variant="body2" className="spec-value">
                                                    {device.specifications?.returnPolicy || '7 days'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    
                                    <Divider className="detail-divider" />
                                    
                                    {/* Action Buttons */}
                                    <Box className="action-buttons-section">
                                        <Button 
                                            variant="contained"
                                            fullWidth
                                            onClick={handleOrderClick}
                                            disabled={device.stock <= 0}
                                            startIcon={<ShoppingCartIcon />}
                                            className="order-now-btn"
                                            size="large"
                                        >
                                            {device.stock > 0 ? 'Order Now' : 'Out of Stock'}
                                        </Button>
                                        
                                        <Box className="secondary-actions">
                                            <IconButton 
                                                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                                                onClick={handleWishlist}
                                            >
                                                {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                            </IconButton>
                                            <IconButton className="compare-btn">
                                                <CompareArrowsIcon />
                                            </IconButton>
                                            <IconButton className="share-btn" onClick={handleCopyLink}>
                                                <ContentCopyIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    
                                    <Divider className="detail-divider" />
                                    
                                    {/* Share Section */}
                                    <Box className="share-section">
                                        <Typography variant="body2" className="share-label">
                                            <ShareIcon className="share-icon" /> Share this product:
                                        </Typography>
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Tooltip title="Share on Facebook">
                                                <FacebookShareButton url={shareUrl} quote={device.name}>
                                                    <FacebookIcon size={40} round className="social-share-icon" />
                                                </FacebookShareButton>
                                            </Tooltip>
                                            <Tooltip title="Share on Twitter">
                                                <TwitterShareButton url={shareUrl} title={device.name}>
                                                    <TwitterIcon size={40} round className="social-share-icon" />
                                                </TwitterShareButton>
                                            </Tooltip>
                                            <Tooltip title="Share on LinkedIn">
                                                <LinkedinShareButton url={shareUrl} title={device.name}>
                                                    <LinkedinIcon size={40} round className="social-share-icon" />
                                                </LinkedinShareButton>
                                            </Tooltip>
                                            <Tooltip title="Share on Telegram">
                                                <TelegramShareButton url={shareUrl} title={device.name}>
                                                    <TelegramIcon size={40} round className="social-share-icon" />
                                                </TelegramShareButton>
                                            </Tooltip>
                                            <Tooltip title="Share on WhatsApp">
                                                <IconButton onClick={handleWhatsAppShare} className="whatsapp-share">
                                                    <WhatsAppIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Share via Email">
                                                <IconButton onClick={handleEmailShare} className="email-share">
                                                    <EmailIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Box>
                                </Card.Body>
                            </Card>
                        </Grow>
                    </Col>
                </Row>
                
                {/* Bottom Navigation */}
                <Paper className="detail-bottom-nav" elevation={0}>
                    <Box className="bottom-nav-buttons">
                        <Button 
                            variant="outlined" 
                            onClick={() => navigate(-1)}
                            startIcon={<ArrowBackIcon />}
                            className="bottom-nav-btn"
                        >
                            Continue Shopping
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={() => navigate('/')}
                            startIcon={<HomeIcon />}
                            className="bottom-nav-btn-primary"
                        >
                            Back to Home
                        </Button>
                    </Box>
                </Paper>
            </Container>

            {/* Snackbar for notifications */}
            <Snackbar
                open={showSnackbar}
                autoHideDuration={3000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" className="snackbar-alert">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DeviceDetail;