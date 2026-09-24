import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { reviewApi } from '../services/api';
import { getCurrentUserEmail, checkAuthStatus, verifySession } from '../services/auth';
import PaymentUpload from './PaymentUpload';
import { 
    Container, Typography, Paper, Box, Stack, Divider, Button,
    Chip, Card, CardContent, Grid, Alert, Skeleton, Collapse,
    Dialog, DialogTitle, DialogContent, DialogActions, Rating,
    TextField, IconButton, CircularProgress, Fade, Grow, Zoom,
    Avatar, LinearProgress, Tooltip, Badge, Stepper, Step, StepLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import WarningIcon from '@mui/icons-material/Warning';
import PaymentIcon from '@mui/icons-material/Payment';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CloseIcon from '@mui/icons-material/Close';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import StraightenIcon from '@mui/icons-material/Straighten';
import './OrderHistory.css';

// Helper function to get gender display name and icon
const getGenderInfo = (gender) => {
    const genders = {
        'adult': { label: 'Adult', icon: <MaleIcon />, color: '#0046be' },
        'women': { label: 'Women', icon: <FemaleIcon />, color: '#ff69b4' },
        'young': { label: 'Young', icon: <ChildCareIcon />, color: '#ff8f00' },
        'child': { label: 'Child', icon: <ChildCareIcon />, color: '#4caf50' },
        'unisex': { label: 'Unisex', icon: <MaleIcon />, color: '#9c27b0' }
    };
    return genders[gender] || { label: gender || 'N/A', icon: <PersonIcon />, color: '#999' };
};

// Helper function to get size display name
const getSizeLabel = (size) => {
    const sizes = {
        'S': 'Small',
        'M': 'Medium',
        'L': 'Large',
        'XL': 'Extra Large',
        '2XL': 'Double XL',
        '3XL': 'Triple XL',
        '4XL': 'Quadruple XL',
        'custom': 'Custom Size'
    };
    return sizes[size] || size || 'N/A';
};

// Helper function to get color display name and hex
const getColorInfo = (color) => {
    const colors = {
        'black': { label: 'Black', hex: '#000000', textColor: '#ffffff' },
        'white': { label: 'White', hex: '#ffffff', textColor: '#000000' },
        'red': { label: 'Red', hex: '#ff0000', textColor: '#ffffff' },
        'blue': { label: 'Blue', hex: '#0000ff', textColor: '#ffffff' },
        'green': { label: 'Green', hex: '#00ff00', textColor: '#000000' },
        'yellow': { label: 'Yellow', hex: '#ffff00', textColor: '#000000' },
        'orange': { label: 'Orange', hex: '#ff8f00', textColor: '#ffffff' },
        'purple': { label: 'Purple', hex: '#800080', textColor: '#ffffff' },
        'pink': { label: 'Pink', hex: '#ff69b4', textColor: '#ffffff' },
        'gray': { label: 'Gray', hex: '#808080', textColor: '#ffffff' },
        'navy': { label: 'Navy', hex: '#000080', textColor: '#ffffff' },
        'brown': { label: 'Brown', hex: '#8b4513', textColor: '#ffffff' }
    };
    return colors[color] || { label: color || 'N/A', hex: '#999', textColor: '#ffffff' };
};

const OrderHistory = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [existingReview, setExistingReview] = useState(null);
    const [sessionValid, setSessionValid] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await checkAuthStatus();
            setIsAuthenticated(authStatus);
            setIsLoadingAuth(false);
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if (isLoadingAuth || !isAuthenticated) return;
        fetchOrders();
    }, [isAuthenticated, isLoadingAuth]);

    const fetchOrders = async () => {
        try {
            const userEmail = getCurrentUserEmail();
            if (!userEmail) {
                setError('User email not found. Please login again.');
                setLoading(false);
                return;
            }

            const response = await api.get(`user-orders/?email=${encodeURIComponent(userEmail)}`);
            
            const ordersWithReviews = await Promise.all(
                response.data.map(async (order) => {
                    try {
                        const reviewResponse = await reviewApi.getReviews(order.id, userEmail);
                        if (reviewResponse.data && reviewResponse.data.length > 0) {
                            return { ...order, has_review: true, review_details: reviewResponse.data[0] };
                        }
                        return { ...order, has_review: false, review_details: null };
                    } catch (err) {
                        console.error(`Error fetching review for order ${order.id}:`, err);
                        return { ...order, has_review: false, review_details: null };
                    }
                })
            );
            
            setOrders(ordersWithReviews);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'deposit_pending': return 'warning';
            case 'in_production': return 'info';
            case 'balance_due': return 'error';
            case 'final_pay_pending': return 'warning';
            case 'ready_to_ship': return 'success';
            case 'shipped': return 'primary';
            case 'delivered': return 'success';
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            case 'processing': return 'info';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch(status?.toLowerCase()) {
            case 'deposit_pending': return <PendingIcon />;
            case 'in_production': return <ScheduleIcon />;
            case 'balance_due': return <WarningIcon />;
            case 'final_pay_pending': return <PendingIcon />;
            case 'ready_to_ship': return <CheckCircleIcon />;
            case 'shipped': return <LocalShippingIcon />;
            case 'delivered': return <CheckCircleIcon />;
            case 'completed': return <CheckCircleIcon />;
            case 'pending': return <PendingIcon />;
            case 'cancelled': return <CancelIcon />;
            case 'processing': return <ScheduleIcon />;
            default: return <ReceiptLongIcon />;
        }
    };

    const getStatusSteps = (status) => {
        const steps = [
            { label: 'Order Placed', completed: true },
            { label: 'Payment Confirmed', completed: ['in_production', 'balance_due', 'ready_to_ship', 'shipped', 'delivered', 'completed'].includes(status?.toLowerCase()) },
            { label: 'In Production', completed: ['ready_to_ship', 'shipped', 'delivered', 'completed'].includes(status?.toLowerCase()) },
            { label: 'Ready to Ship', completed: ['shipped', 'delivered', 'completed'].includes(status?.toLowerCase()) },
            { label: 'Shipped', completed: ['delivered', 'completed'].includes(status?.toLowerCase()) },
            { label: 'Delivered', completed: ['completed'].includes(status?.toLowerCase()) }
        ];
        return steps;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatShipDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePaymentSuccess = () => {
        fetchOrders();
        setExpandedOrder(null);
    };

    const getPaymentType = (order) => {
        const status = order.status?.toLowerCase();
        if (status === 'balance_due' || status === 'in_production') {
            return 'final';
        }
        return 'deposit';
    };

    const handleOpenReview = async (order) => {
        const isValid = await verifySession();
        if (!isValid) {
            setError('Your session has expired. Please login again.');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }
        
        setSelectedOrder(order);
        setRating(0);
        setComment('');
        setReviewError('');
        setExistingReview(null);
        
        try {
            const userEmail = getCurrentUserEmail();
            const response = await reviewApi.getReviews(order.id, userEmail);
            if (response.data && response.data.length > 0) {
                const review = response.data[0];
                setExistingReview(review);
                setRating(review.rating);
                setComment(review.comment || '');
            }
        } catch (err) {
            console.error('Error checking review:', err);
        }
        
        setReviewDialogOpen(true);
    };

    const handleCloseReview = () => {
        setReviewDialogOpen(false);
        setSelectedOrder(null);
        setRating(0);
        setComment('');
        setReviewError('');
        setExistingReview(null);
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            setReviewError('Please provide a rating');
            return;
        }

        if (!comment.trim()) {
            setReviewError('Please write a review comment');
            return;
        }

        setReviewSubmitting(true);
        setReviewError('');

        try {
            const isValid = await verifySession();
            if (!isValid) {
                setReviewError('Your session has expired. Please refresh the page and login again.');
                setReviewSubmitting(false);
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            const userEmail = getCurrentUserEmail();
            
            const reviewData = {
                order: selectedOrder.id,
                email: userEmail,
                rating: rating,
                comment: comment.trim()
            };

            let response;
            if (existingReview) {
                response = await reviewApi.updateReview(existingReview.id, reviewData);
            } else {
                response = await reviewApi.createReview(reviewData);
            }

            if (response.status === 200 || response.status === 201) {
                await fetchOrders();
                handleCloseReview();
            }
            
        } catch (err) {
            console.error('Error submitting review:', err);
            
            if (err.response) {
                if (err.response.status === 401) {
                    setReviewError('Authentication failed. Please refresh the page and login again.');
                    setTimeout(() => navigate('/login'), 2000);
                } else if (err.response.status === 403) {
                    setReviewError('You don\'t have permission to review this order.');
                } else if (err.response.data) {
                    if (typeof err.response.data === 'object') {
                        const errorMessages = Object.values(err.response.data).flat().join(' ');
                        setReviewError(errorMessages);
                    } else {
                        setReviewError(err.response.data);
                    }
                } else {
                    setReviewError('Failed to submit review. Please try again.');
                }
            } else if (err.request) {
                setReviewError('No response from server. Please check if backend is running.');
            } else {
                setReviewError('Error: ' + err.message);
            }
        } finally {
            setReviewSubmitting(false);
        }
    };

    if (isLoadingAuth) {
        return (
            <Box className="order-loading-container">
                <Container maxWidth="lg">
                    <LinearProgress />
                    <Box sx={{ mt: 3 }}>
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
                        ))}
                    </Box>
                </Container>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return (
            <Box className="order-auth-required">
                <Container maxWidth="md">
                    <Fade in timeout={500}>
                        <Paper className="auth-required-paper-order">
                            <Box className="auth-content-order">
                                <Avatar className="auth-icon-order">
                                    <ShoppingCartIcon />
                                </Avatar>
                                <Typography variant="h4" className="auth-title-order">
                                    Please Login to View Orders
                                </Typography>
                                <Typography variant="body1" className="auth-message-order">
                                    You need to be logged in to view your order history and track your purchases.
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/login')}
                                    className="auth-login-btn-order"
                                >
                                    Login Now
                                </Button>
                            </Box>
                        </Paper>
                    </Fade>
                </Container>
            </Box>
        );
    }

    return (
        <Box className="order-history-page">
            <Container maxWidth="xl">
                {/* Hero Section */}
                <Box className="order-history-hero">
                    <Fade in timeout={800}>
                        <Box className="hero-content-order">
                            <Typography variant="overline" className="hero-overline-order">
                                Your Purchase History
                            </Typography>
                            <Typography variant="h1" className="hero-title-order">
                                My Orders
                            </Typography>
                            <Typography variant="body1" className="hero-description-order">
                                Track and manage all your orders in one place
                            </Typography>
                        </Box>
                    </Fade>
                    <Box className="hero-bg-order" />
                </Box>

                {/* Navigation */}
                <Box className="order-nav-section">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        className="nav-back-order"
                    >
                        Back
                    </Button>
                    <Button
                        startIcon={<HomeIcon />}
                        onClick={() => navigate('/')}
                        className="nav-home-order"
                    >
                        Home
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" className="error-alert-order" onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {loading && (
                    <Box className="orders-loading">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} variant="rectangular" height={250} sx={{ mb: 3, borderRadius: 2 }} />
                        ))}
                    </Box>
                )}

                {!loading && orders.length === 0 && (
                    <Fade in timeout={500}>
                        <Paper className="empty-orders-paper">
                            <Box className="empty-orders-content">
                                <ShoppingCartIcon className="empty-orders-icon" />
                                <Typography variant="h5" className="empty-orders-title">
                                    No Orders Yet
                                </Typography>
                                <Typography variant="body1" className="empty-orders-message">
                                    You haven't placed any orders yet. Start shopping to see your orders here!
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/')}
                                    startIcon={<ShoppingCartIcon />}
                                    className="empty-orders-btn"
                                >
                                    Start Shopping
                                </Button>
                            </Box>
                        </Paper>
                    </Fade>
                )}

                {!loading && orders.length > 0 && (
                    <Stack spacing={4} className="orders-list">
                        {orders.map((order, index) => {
                            const genderInfo = getGenderInfo(order.gender);
                            const colorInfo = getColorInfo(order.color);
                            const sizeLabel = getSizeLabel(order.size);
                            
                            return (
                                <Grow in timeout={300 + index * 100} key={order.id}>
                                    <Card className="order-card">
                                        <CardContent className="order-card-content">
                                            {/* Status Alert */}
                                            {(order.status?.toLowerCase() === 'in_production' || order.status?.toLowerCase() === 'balance_due') && order.balance_due > 0 && (
                                                <Alert 
                                                    severity="warning" 
                                                    icon={<WarningIcon />}
                                                    className="status-alert warning-alert"
                                                    action={
                                                        <Button 
                                                            color="inherit" 
                                                            size="small"
                                                            startIcon={<PaymentIcon />}
                                                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                                            className="pay-now-btn"
                                                        >
                                                            Pay Now
                                                        </Button>
                                                    }
                                                >
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        Final Payment Required: ETB {order.balance_due.toLocaleString()}
                                                    </Typography>
                                                </Alert>
                                            )}

                                            {order.status?.toLowerCase() === 'deposit_pending' && (
                                                <Alert 
                                                    severity="info" 
                                                    icon={<PendingIcon />}
                                                    className="status-alert info-alert"
                                                    action={
                                                        <Button 
                                                            color="inherit" 
                                                            size="small"
                                                            startIcon={<PaymentIcon />}
                                                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                                            className="pay-now-btn"
                                                        >
                                                            Pay Advance
                                                        </Button>
                                                    }
                                                >
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        Advance Payment Required
                                                    </Typography>
                                                </Alert>
                                            )}

                                            {order.status?.toLowerCase() === 'delivered' && (
                                                <Alert 
                                                    severity="success" 
                                                    icon={<CheckCircleIcon />}
                                                    className="status-alert success-alert"
                                                    action={
                                                        <Button 
                                                            color="inherit" 
                                                            size="small"
                                                            startIcon={<RateReviewIcon />}
                                                            onClick={() => handleOpenReview(order)}
                                                            className="review-btn"
                                                        >
                                                            {order.has_review ? 'Edit Review' : 'Write a Review'}
                                                        </Button>
                                                    }
                                                >
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        Your order has been delivered!
                                                    </Typography>
                                                </Alert>
                                            )}

                                            {/* Payment Collapse */}
                                            <Collapse in={expandedOrder === order.id}>
                                                <Box className="payment-section">
                                                    <PaymentUpload 
                                                        orderId={order.id}
                                                        paymentType={getPaymentType(order)}
                                                        amount={getPaymentType(order) === 'deposit' 
                                                            ? (parseFloat(order.final_total_price) * 0.5).toFixed(2)
                                                            : order.balance_due}
                                                        onSuccess={handlePaymentSuccess}
                                                    />
                                                </Box>
                                            </Collapse>

                                            {/* Order Header */}
                                            <Box className="order-header-section">
                                                <Box className="order-id-section">
                                                    <Typography variant="h6" className="order-id">
                                                        Order #{order.id}
                                                    </Typography>
                                                    <Typography variant="caption" className="order-date">
                                                        {formatDate(order.ordered_at)}
                                                    </Typography>
                                                </Box>
                                                <Chip 
                                                    icon={getStatusIcon(order.status)}
                                                    label={order.status?.replace(/_/g, ' ')}
                                                    color={getStatusColor(order.status)}
                                                    className="status-chip"
                                                />
                                            </Box>

                                            {/* Order Timeline */}
                                            <Box className="order-timeline">
                                                <Stepper activeStep={getStatusSteps(order.status).filter(s => s.completed).length} alternativeLabel>
                                                    {getStatusSteps(order.status).map((step, idx) => (
                                                        <Step key={idx}>
                                                            <StepLabel>{step.label}</StepLabel>
                                                        </Step>
                                                    ))}
                                                </Stepper>
                                            </Box>

                                            {/* Existing Review */}
                                            {order.has_review && order.review_details && (
                                                <Box className="existing-review">
                                                    <Box className="review-header">
                                                        <StarIcon className="review-star" />
                                                        <Typography variant="body2" fontWeight={600}>
                                                            Your Review:
                                                        </Typography>
                                                        <Rating value={order.review_details.rating} readOnly size="small" />
                                                    </Box>
                                                    <Typography variant="body2" className="review-comment">
                                                        "{order.review_details.comment}"
                                                    </Typography>
                                                    <Button 
                                                        size="small" 
                                                        startIcon={<RateReviewIcon />}
                                                        onClick={() => handleOpenReview(order)}
                                                        className="edit-review-btn"
                                                    >
                                                        Edit Review
                                                    </Button>
                                                </Box>
                                            )}

                                            <Divider className="order-divider" />

                                            {/* Order Details */}
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={3}>
                                                    <Box className="product-image-box">
                                                        {order.device_image ? (
                                                            <img 
                                                                src={order.device_image} 
                                                                alt={order.device_name}
                                                                className="product-image"
                                                            />
                                                        ) : (
                                                            <Box className="product-image-placeholder">
                                                                <ShoppingCartIcon />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12} sm={5}>
                                                    <Typography variant="subtitle1" className="product-name">
                                                        {order.device_name}
                                                    </Typography>
                                                    <Stack spacing={1} className="product-details">
                                                        <Box className="detail-row">
                                                            <Typography variant="body2" color="text.secondary">Type:</Typography>
                                                            <Chip label={order.type} size="small" className="type-chip" />
                                                        </Box>
                                                        
                                                        {/* NEW: Gender Display */}
                                                        <Box className="detail-row">
                                                            <Typography variant="body2" color="text.secondary">Gender/Fit:</Typography>
                                                            <Chip 
                                                                icon={genderInfo.icon}
                                                                label={genderInfo.label}
                                                                size="small"
                                                                sx={{ 
                                                                    backgroundColor: `${genderInfo.color}15`,
                                                                    color: genderInfo.color,
                                                                    fontWeight: 500
                                                                }}
                                                            />
                                                        </Box>
                                                        
                                                        {/* NEW: Size Display */}
                                                        <Box className="detail-row">
                                                            <Typography variant="body2" color="text.secondary">Size:</Typography>
                                                            <Chip 
                                                                icon={<StraightenIcon />}
                                                                label={`${order.size?.toUpperCase()} (${sizeLabel})`}
                                                                size="small"
                                                                sx={{ 
                                                                    backgroundColor: '#e8f0fe',
                                                                    color: '#0046be',
                                                                    fontWeight: 500
                                                                }}
                                                            />
                                                        </Box>
                                                        
                                                        {/* NEW: Color Display */}
                                                        <Box className="detail-row">
                                                            <Typography variant="body2" color="text.secondary">Color:</Typography>
                                                            <Chip 
                                                                icon={<ColorLensIcon />}
                                                                label={colorInfo.label}
                                                                size="small"
                                                                sx={{ 
                                                                    backgroundColor: colorInfo.hex,
                                                                    color: colorInfo.textColor,
                                                                    fontWeight: 500,
                                                                    '& .MuiChip-icon': {
                                                                        color: colorInfo.textColor
                                                                    }
                                                                }}
                                                            />
                                                        </Box>
                                                        
                                                        <Box className="detail-row">
                                                            <Typography variant="body2" color="text.secondary">Quantity:</Typography>
                                                            <Typography variant="body2" fontWeight={600}>{order.quantity}</Typography>
                                                        </Box>
                                                        <Box className="detail-row">
                                                            <Typography variant="body2" color="text.secondary">Price per item:</Typography>
                                                            <Typography variant="body2" fontWeight={600}>ETB {order.device_price?.toLocaleString()}</Typography>
                                                        </Box>
                                                    </Stack>
                                                </Grid>

                                                <Grid item xs={12} sm={4}>
                                                    <Paper className="price-summary-order" elevation={0}>
                                                        <Typography variant="body2" color="text.secondary">Base Price</Typography>
                                                        <Typography variant="h6" className="base-price">
                                                            ETB {order.total_price?.toLocaleString()}
                                                        </Typography>
                                                        
                                                        {order.calculated_total_percentage != 100 && (
                                                            <Box className="discount-info">
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Discount/Extra:
                                                                </Typography>
                                                                <Typography 
                                                                    variant="body2" 
                                                                    fontWeight={600}
                                                                    className={order.calculated_total_percentage > 100 ? 'extra-charge' : 'discount'}
                                                                >
                                                                    {order.calculated_total_percentage > 100 
                                                                        ? `+${order.calculated_total_percentage - 100}%`
                                                                        : `-${100 - order.calculated_total_percentage}%`
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                        
                                                        <Divider className="price-divider" />
                                                        
                                                        <Typography variant="body2" color="text.secondary">Final Total</Typography>
                                                        <Typography variant="h5" className="final-price">
                                                            ETB {order.final_total_price?.toLocaleString()}
                                                        </Typography>
                                                        
                                                        {order.deposit_paid > 0 && (
                                                            <Typography variant="body2" className="paid-info">
                                                                Advance Paid: ETB {order.deposit_paid.toLocaleString()}
                                                            </Typography>
                                                        )}
                                                        {order.final_payment > 0 && (
                                                            <Typography variant="body2" className="paid-info success">
                                                                Final Payment: ETB {order.final_payment.toLocaleString()}
                                                            </Typography>
                                                        )}
                                                    </Paper>
                                                </Grid>
                                            </Grid>

                                            <Divider className="order-divider" />

                                            {/* Customer Info */}
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={4}>
                                                    <Box className="info-section">
                                                        <PersonIcon className="info-icon" />
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600}>Customer Info</Typography>
                                                            {order.name && <Typography variant="body2">{order.name}</Typography>}
                                                            <Typography variant="body2">{order.phone}</Typography>
                                                            <Typography variant="body2">{order.email}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Box className="info-section">
                                                        <LocalShippingIcon className="info-icon" />
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600}>Shipping Address</Typography>
                                                            <Typography variant="body2">{order.address}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Box className="info-section">
                                                        <ScheduleIcon className="info-icon" />
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600}>Delivery Time</Typography>
                                                            <Typography variant="body2">
                                                                {order.delivery_date === '2_to_3_days' ? '2 to 3 days' : 
                                                                 order.delivery_date === '7_days' ? '7 days' :
                                                                 order.delivery_date === '14_days' ? '14 days' :
                                                                 order.delivery_date === '1_month' ? '1 month' :
                                                                 order.delivery_date === 'more_than_1_month' ? 'More than 1 month' :
                                                                 order.delivery_date || 'Not specified'}
                                                            </Typography>
                                                            {order.ship_date && (
                                                                <Typography variant="body2">
                                                                    Ship Date: {formatShipDate(order.ship_date)}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grow>
                            );
                        })}
                    </Stack>
                )}

                {/* Review Dialog */}
                <Dialog 
                    open={reviewDialogOpen} 
                    onClose={handleCloseReview}
                    maxWidth="sm"
                    fullWidth
                    className="review-dialog"
                >
                    <DialogTitle className="review-dialog-title">
                        <Typography variant="h6" fontWeight={700}>
                            {existingReview ? 'Edit Your Review' : 'Write a Review'}
                        </Typography>
                        <IconButton onClick={handleCloseReview} size="small">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    
                    <DialogContent className="review-dialog-content">
                        {selectedOrder && (
                            <>
                                <Box className="review-order-info">
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Reviewing Order #{selectedOrder.id}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {selectedOrder.device_name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Ordered on: {formatDate(selectedOrder.ordered_at)}
                                    </Typography>
                                </Box>

                                <Box className="rating-section-review">
                                    <Typography variant="body1" gutterBottom fontWeight={600}>
                                        Your Rating
                                    </Typography>
                                    <Rating
                                        value={rating}
                                        onChange={(event, newValue) => {
                                            setRating(newValue || 0);
                                            setReviewError('');
                                        }}
                                        size="large"
                                        className="rating-stars"
                                    />
                                </Box>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Your Review Comment"
                                    placeholder="Share your experience with this product..."
                                    value={comment}
                                    onChange={(e) => {
                                        setComment(e.target.value);
                                        setReviewError('');
                                    }}
                                    error={!!reviewError}
                                    helperText={reviewError}
                                    className="review-textfield"
                                />

                                <Typography variant="caption" color="text.secondary" className="review-note">
                                    Your honest feedback helps other customers make better decisions.
                                </Typography>
                            </>
                        )}
                    </DialogContent>
                    
                    <DialogActions className="review-dialog-actions">
                        <Button onClick={handleCloseReview} variant="outlined">
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmitReview} 
                            variant="contained"
                            disabled={reviewSubmitting}
                            className="submit-review-btn"
                        >
                            {reviewSubmitting ? <CircularProgress size={24} /> : (existingReview ? 'Update Review' : 'Submit Review')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default OrderHistory;