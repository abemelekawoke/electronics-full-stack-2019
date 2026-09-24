import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Collapse from '@mui/material/Collapse';
// MUI Components
import { 
    Container, Grid, Card, CardContent, Chip, 
    Button, TextField, MenuItem, Select, 
    FormControl, InputLabel, Box, Stack, 
    Typography, Skeleton, InputAdornment,
    Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Divider, Alert, AlertTitle,
    Fade, Grow, Zoom, Paper, Badge, SpeedDial, SpeedDialAction,
    useMediaQuery, useTheme, Breadcrumbs, Link, Rating,
    Pagination as MuiPagination
} from '@mui/material';

// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import TelegramIcon from '@mui/icons-material/Telegram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ErrorIcon from '@mui/icons-material/Error';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SortIcon from '@mui/icons-material/Sort';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Project Imports
import api, { getDevices, getProducts, getServices, getCategoriesWithCounts } from '../services/api';
import BlinkingDiscountBadge from './BlinkingDiscountBadge';
import './DeviceList.css';
import AnnouncementBar from './AnnouncementBar';
import PartnersSlider from './PartnersSlider';

// Sort options
const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: '🆕' },
    { value: 'price_asc', label: 'Price: Low to High', icon: '💰' },
    { value: 'price_desc', label: 'Price: High to Low', icon: '💎' },
    { value: 'popular', label: 'Most Popular', icon: '⭐' },
    { value: 'name_asc', label: 'Name: A to Z', icon: '📝' }
];

// Page type configurations
const PAGE_CONFIGS = {
    products: {
        title: 'Products',
        subtitle: 'Discover our wide range of printing materials and clothing',
        pageType: 'products',
        breadcrumb: 'Products'
    },
    services: {
        title: 'Services',
        subtitle: 'Professional printing services tailored to your needs',
        pageType: 'services',
        breadcrumb: 'Services'
    },
    all: {
        title: 'Your Advertising Solution',
        subtitle: 'Complete collection of products and services',
        pageType: null,
        breadcrumb: 'Your Advertising Solution'
    }
};

const DeviceImageSlider = ({ device }) => {
    const images = [device.image1, device.image2, device.image3].filter(img => img != null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (images.length <= 1 || !isHovered) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images, isHovered]);

    return (
        <Box 
            className="card-img-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img 
                src={images[currentIndex] || '/placeholder-electronics.png'} 
                alt={device.name} 
                className="card-img-top"
            />
            {images.length > 1 && (
                <Box className="image-counter">
                    <Typography variant="caption">
                        {currentIndex + 1} / {images.length}
                    </Typography>
                </Box>
            )}
            {device.isNew && (
                <Chip label="NEW" size="small" className="new-badge" />
            )}
        </Box>
    );
};

const QuoteModal = ({ open, onClose }) => {
    const socialLinks = {
        telegram: "https://t.me/Parrotadvert",
        facebook: "https://www.facebook.com/share/1ED6PexafD/",
        whatsapp: "https://wa.me/799922212",
        instagram: "https://www.instagram.com/parrotadvert?igsh=cTUweHR0NGt4MmJ5"
    };

    const handleSocialClick = (link) => {
        window.open(link, '_blank');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth TransitionComponent={Fade}>
            <Box className="quote-modal-header">
                <Box className="quote-modal-title">
                    <FormatQuoteIcon className="quote-modal-title-icon" />
                    <Typography className="quote-modal-title-text">Get Quote</Typography>
                </Box>
                <IconButton onClick={onClose} className="quote-modal-close-btn">
                    <CloseIcon />
                </IconButton>
            </Box>
            
            <DialogContent className="quote-modal-content">
                <Fade in timeout={500}>
                    <Box>
                        <Typography className="quote-slogan">
                            "Your Printing Solution, Big or Small"
                        </Typography>
                        <Typography className="quote-subtitle">
                            Choose your preferred platform to get in touch with us
                        </Typography>
                    </Box>
                </Fade>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={6} sm={3}>
                        <Zoom in timeout={300}>
                            <Box className="social-icon-box" onClick={() => handleSocialClick(socialLinks.telegram)}>
                                <Box className="social-icon-circle social-telegram">
                                    <TelegramIcon className="social-icon" />
                                </Box>
                                <Typography className="social-label">Telegram</Typography>
                            </Box>
                        </Zoom>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Zoom in timeout={400}>
                            <Box className="social-icon-box" onClick={() => handleSocialClick(socialLinks.facebook)}>
                                <Box className="social-icon-circle social-facebook">
                                    <FacebookIcon className="social-icon" />
                                </Box>
                                <Typography className="social-label">Facebook</Typography>
                            </Box>
                        </Zoom>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Zoom in timeout={500}>
                            <Box className="social-icon-box" onClick={() => handleSocialClick(socialLinks.whatsapp)}>
                                <Box className="social-icon-circle social-whatsapp">
                                    <WhatsAppIcon className="social-icon" />
                                </Box>
                                <Typography className="social-label">WhatsApp</Typography>
                            </Box>
                        </Zoom>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Zoom in timeout={600}>
                            <Box className="social-icon-box" onClick={() => handleSocialClick(socialLinks.instagram)}>
                                <Box className="social-icon-circle social-instagram">
                                    <InstagramIcon className="social-icon" />
                                </Box>
                                <Typography className="social-label">Instagram</Typography>
                            </Box>
                        </Zoom>
                    </Grid>
                </Grid>

                <Divider className="quote-divider" />
                <Typography variant="caption" className="quote-footer-text">
                    Click any platform to start a conversation with our team
                </Typography>
            </DialogContent>

            <DialogActions className="quote-modal-actions">
                <Button onClick={onClose} variant="outlined" className="btn-close-modal">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Feature Cards Component
const FeatureCards = () => {
    const features = [
        { icon: <SpeedIcon />, title: 'Fast Delivery', description: 'Within 24-48 hours' },
        { icon: <SecurityIcon />, title: 'Quality Guarantee', description: '100% satisfaction' },
        { icon: <SupportAgentIcon />, title: '24/7 Support', description: 'Customer first' },
        { icon: <LocalOfferIcon />, title: 'Best Prices', description: 'Competitive rates' }
    ];

    return (
        <Box className="features-section">
            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Zoom in timeout={500 + index * 100}>
                                <Paper className="feature-card" elevation={0}>
                                    <Box className="feature-icon">{feature.icon}</Box>
                                    <Typography variant="h6" className="feature-title">
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" className="feature-description">
                                        {feature.description}
                                    </Typography>
                                </Paper>
                            </Zoom>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

const DeviceList = ({ pageType = 'all' }) => {
    const theme = useTheme();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    
    // Get page configuration
    const pageConfig = PAGE_CONFIGS[pageType] || PAGE_CONFIGS.all;
    
    // State for devices and pagination
    const [devices, setDevices] = useState([]);
    const [allDevices, setAllDevices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(!isMobile);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quoteModalOpen, setQuoteModalOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(12);
    const [filteredCount, setFilteredCount] = useState(0);

    // Handle scroll to top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ============================================
    // FETCH CATEGORIES FROM BACKEND
    // ============================================
    const fetchCategories = async () => {
        try {
            // Get categories with counts for the current page type
            const pageTypeParam = pageType === 'all' ? null : pageType;
            const response = await getCategoriesWithCounts(pageTypeParam);
            
            let categoryData = response.data || response;
            
            if (Array.isArray(categoryData) && categoryData.length > 0) {
                setCategories(categoryData);
            } else {
                // If no categories from API, fetch from /categories/ endpoint
                const catResponse = await api.get('categories/');
                const fallbackData = catResponse.data || catResponse;
                if (Array.isArray(fallbackData)) {
                    // Add device_count from the devices list
                    const categoriesWithCount = fallbackData.map(cat => ({
                        ...cat,
                        device_count: devices.filter(d => d.category_id === cat.id).length
                    }));
                    setCategories(categoriesWithCount);
                }
            }
        } catch (err) {
            console.warn('Could not fetch categories:', err);
            // Don't set error - just show empty categories
            setCategories([]);
        }
    };

    // ============================================
    // LOAD DEVICES BASED ON PAGE TYPE
    // ============================================
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const params = {
                    page: currentPage,
                    page_size: pageSize,
                    search: searchQuery || undefined,
                };
                
                // Add category filter
                if (categoryFilter) {
                    params.category = categoryFilter;
                }
                
                // Add ordering
                if (sortBy === 'price_asc') params.ordering = 'price';
                else if (sortBy === 'price_desc') params.ordering = '-price';
                else if (sortBy === 'name_asc') params.ordering = 'name';
                else if (sortBy === 'newest') params.ordering = '-created_at';
                
                let response;
                
                // Choose the right API endpoint based on page type
                if (pageType === 'products') {
                    response = await getProducts(params);
                } else if (pageType === 'services') {
                    response = await getServices(params);
                } else {
                    // All devices - use the main endpoint with page_type filter
                    response = await getDevices(params);
                }
                
                const data = response.data;
                const results = data.results || [];
                const count = data.count || 0;
                
                const devicesArray = results.map(device => ({
                    ...device,
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    reviewCount: Math.floor(Math.random() * 100) + 10,
                    isNew: Math.random() > 0.8
                }));
                
                setDevices(devicesArray);
                setAllDevices(devicesArray);
                setTotalItems(count);
                setTotalPages(Math.ceil(count / pageSize));
                setFilteredCount(devicesArray.length);
                
                // Fetch categories after devices are loaded
                await fetchCategories();
                
            } catch (err) {
                console.error("Error loading devices:", err);
                setError("Failed to load items. Please try again later.");
                setDevices([]);
                setAllDevices([]);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [currentPage, pageSize, pageType, searchQuery, categoryFilter, sortBy]);

    // Re-fetch categories when devices change (for count updates)
    useEffect(() => {
        if (!loading && devices.length > 0) {
            fetchCategories();
        }
    }, [devices, pageType]);

    // Handle page change
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getGridCols = () => {
        if (viewMode === 'list') return 1;
        if (isMobile) return 1;
        if (isTablet) return 2;
        return 3;
    };

    // Get category icon - can use a simple emoji map or just show the name
    const getCategoryIcon = (categoryName) => {
        // Simple fallback icons - but we don't really need icons if we show the name
        const iconMap = {
            'Printers': '🖨️',
            'Scanners': '📠',
            'Copiers': '📄',
            'Accessories': '🔌',
            'Supplies': '📦',
            'T-Shirts': '👕',
            'Banners': '🎏',
            'Posters': '📯',
            'Design': '🎨',
            'Service': '🔧'
        };
        return iconMap[categoryName] || '📁';
    };

    return (
        <Box className="device-list-wrapper">
            {/* Hero Section */}
            <Box className="hero-section">
                <Container maxWidth="xl">
                    <Fade in timeout={800}>
                        <Box className="hero-content">
                            <Typography variant="overline" className="hero-overline">
                                Welcome to Parrot Advert
                            </Typography>
                            <Typography variant="h1" className="hero-title">
                                {pageConfig.title}
                            </Typography>
                            <Box className="slogan-container">
                                <Typography variant="h3" className="slogan-text">
                                    <span className="slogan-blue">Big</span>
                                    <span className="slogan-orange"> or </span>
                                    <span className="slogan-black">Small</span>
                                </Typography>
                            </Box>
                            <Typography variant="body1" className="hero-description">
                                {pageConfig.subtitle}
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<FormatQuoteIcon />}
                                onClick={() => setQuoteModalOpen(true)}
                                className="hero-cta-button"
                            >
                                Get Quote Today
                            </Button>
                        </Box>
                    </Fade>
                </Container>
                <Box className="hero-bg-overlay" />
            </Box>

            {/* Features Section */}
            <FeatureCards />

            {/* Announcement Bar */}
            <AnnouncementBar />
            
            {/* ============================================ */}
            {/* FILTER SECTION */}
            {/* ============================================ */}
            <Container maxWidth="xl" className="filter-section">
                <Paper elevation={0} className="filter-paper">
                    <Grid container spacing={2} alignItems="center" wrap="nowrap">
                        
                        {/* 1. Search Field */}
                        <Grid item xs={12} md={3}>
                            <TextField 
                                fullWidth 
                                size="small"
                                placeholder="Search products..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-field"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* 2. Sort Dropdown */}
                        <Grid item xs={6} md={2.5}>
                            <FormControl fullWidth size="small">
                                <Select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value)}
                                    startAdornment={<SortIcon sx={{ mr: 1 }} />}
                                >
                                    {sortOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <span>{option.icon}</span>
                                                {option.label}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        {/* 3. Category Filter - Using categories from backend */}
                        <Grid item xs={6} md={2.5}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Category</InputLabel>
                                <Select 
                                    value={categoryFilter} 
                                    label="Category" 
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <MenuItem value="">All Categories</MenuItem>
                                    {categories.length > 0 ? (
                                        categories.map(c => (
                                            <MenuItem key={c.id} value={c.id}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <span>{getCategoryIcon(c.name)}</span>
                                                    {c.name}
                                                    <Chip 
                                                        label={c.device_count || 0} 
                                                        size="small" 
                                                        sx={{ ml: 1 }} 
                                                    />
                                                </Box>
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No categories available</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* 4. Reset Button */}
                        <Grid item xs={6} md={2}>
                            <Button 
                                fullWidth 
                                size="small"
                                variant="contained" 
                                color="error"
                                onClick={() => {
                                    setSearchQuery('');
                                    setCategoryFilter('');
                                    setTypeFilter('');
                                    setSortBy('newest');
                                    setCurrentPage(1);
                                }}
                                className="reset-filters-btn"
                                sx={{ whiteSpace: 'nowrap' }}
                            >
                                Reset All
                            </Button>
                        </Grid>
                        
                        {/* 5. View Toggle Buttons */}
                        <Grid item xs="auto">
                            <Box className="view-toggle" sx={{ display: 'flex' }}>
                                <IconButton 
                                    className={viewMode === 'grid' ? 'active' : ''}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <ViewModuleIcon />
                                </IconButton>
                                <IconButton 
                                    className={viewMode === 'list' ? 'active' : ''}
                                    onClick={() => setViewMode('list')}
                                >
                                    <ViewListIcon />
                                </IconButton>
                            </Box>
                        </Grid>

                    </Grid>
                </Paper>
            </Container>

            {/* Results Stats */}
            <Container maxWidth="xl" className="results-stats">
                <Box className="stats-container">
                    <Typography variant="body2" className="stats-text">
                        Showing <strong>{devices.length}</strong> of <strong>{totalItems}</strong> items
                        {filteredCount < totalItems && ` (filtered: ${filteredCount})`}
                    </Typography>
                    <Typography variant="body2" className="stats-text">
                        Page {currentPage} of {totalPages}
                    </Typography>
                    {searchQuery && (
                        <Chip 
                            label={`Search: "${searchQuery}"`} 
                            size="small"
                            onDelete={() => setSearchQuery('')}
                            className="search-chip"
                        />
                    )}
                    {categoryFilter && categories.find(c => c.id === parseInt(categoryFilter)) && (
                        <Chip 
                            label={`Category: ${categories.find(c => c.id === parseInt(categoryFilter))?.name}`}
                            size="small"
                            onDelete={() => setCategoryFilter('')}
                            className="category-chip"
                        />
                    )}
                </Box>
            </Container>

            {/* Results Grid */}
            <Container maxWidth="xl" className="results-container">
                {loading ? (
                    <Grid container spacing={3}>
                        {Array(6).fill(0).map((_, i) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
                                <Box sx={{ p: 2 }}>
                                    <Skeleton width="80%" />
                                    <Skeleton width="60%" />
                                    <Skeleton width="40%" />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                ) : error ? (
                    <Box className="error-container">
                        <ErrorIcon className="error-icon" />
                        <Typography variant="h5" className="error-title">
                            Oops! Something went wrong
                        </Typography>
                        <Typography variant="body1" className="error-message">
                            {error}
                        </Typography>
                        <Button variant="contained" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </Box>
                ) : devices.length > 0 ? (
                    <>
                        <Grid container spacing={3}>
                            {devices.map((device, index) => (
                                <Grow in timeout={300 + index * 50} key={device.id}>
                                    <Grid item xs={12} sm={6} md={4} lg={viewMode === 'list' ? 12 : 3}>
                                        <Card className={`device-card ${viewMode === 'list' ? 'list-view' : ''}`}>
                                            <Box className={`card-inner ${viewMode === 'list' ? 'list-layout' : ''}`}>
                                                <Box className="card-media">
                                                    <DeviceImageSlider device={device} />
                                                    {device.discount > 0 && (
                                                        <BlinkingDiscountBadge discount={device.discount} />
                                                    )}
                                                </Box>
                                                <CardContent className="card-content" sx={{ p: 2.5, backgroundColor: '#fff', position: 'relative' }}>
                                                    {/* Header Section: Category, Type & Stock */}
                                                    <Box className="card-header" sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 1.5 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                                            <Typography 
                                                                variant="caption" 
                                                                sx={{ 
                                                                    color: '#0D47A1',
                                                                    fontWeight: 800, 
                                                                    textTransform: 'uppercase', 
                                                                    letterSpacing: '0.5px',
                                                                    fontSize: '0.65rem'
                                                                }}
                                                            >
                                                                {device.category_name || device.category}
                                                            </Typography>
                                                            
                                                            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#E0E0E0' }} />

                                                            <Typography 
                                                                variant="caption" 
                                                                sx={{ 
                                                                    color: '#1976D2',
                                                                    fontWeight: 600, 
                                                                    fontSize: '0.65rem'
                                                                }}
                                                            >
                                                                {device.item_status || 'New'}
                                                            </Typography>

                                                            <Box 
                                                                sx={{ 
                                                                    ml: 'auto',
                                                                    backgroundColor: device.stock > 0 ? '#E8F5E9' : '#FFEBEE',
                                                                    color: device.stock > 0 ? '#2E7D32' : '#C62828',
                                                                    px: 1, 
                                                                    py: 0.2,
                                                                    borderRadius: '4px', 
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: 900,
                                                                    border: `1px solid ${device.stock > 0 ? '#C8E6C9' : '#FFCDD2'}`
                                                                }}
                                                            >
                                                                {device.stock > 0 ? `${device.stock} IN STOCK` : 'OUT OF STOCK'}
                                                            </Box>
                                                        </Box>

                                                        <Typography 
                                                            className="device-name" 
                                                            variant="h6" 
                                                            sx={{ 
                                                                color: '#000000', 
                                                                fontWeight: 800, 
                                                                fontSize: '1.1rem',
                                                                lineHeight: 1.2,
                                                                mb: 0.5
                                                            }}
                                                        >
                                                            {device.name}
                                                        </Typography>

                                                        <Box className="rating-container" sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Rating 
                                                                value={parseFloat(device.rating)} 
                                                                precision={0.5} 
                                                                size="small" 
                                                                readOnly 
                                                                sx={{ color: '#FF9800' }} 
                                                            />
                                                            <Typography variant="caption" sx={{ ml: 0.5, color: '#9E9E9E', fontWeight: 600 }}>
                                                                ({device.reviewCount})
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Typography 
                                                        className="device-description" 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: '#424242', 
                                                            mb: 2,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            minHeight: '2.5rem'
                                                        }}
                                                    >
                                                        {device.description}
                                                    </Typography>

                                                    <Box className="card-footer" sx={{ borderTop: '1px solid #F5F5F5', pt: 2 }}>
                                                        <Box className="price-container" sx={{ mb: 2 }}>
                                                            {device.old_price && (
                                                                <Typography 
                                                                    className="old-price" 
                                                                    sx={{ color: '#BDBDBD', textDecoration: 'line-through', fontSize: '0.8rem' }}
                                                                >
                                                                    ETB {parseFloat(device.old_price).toLocaleString()}
                                                                </Typography>
                                                            )}
                                                            <Typography 
                                                                className="price-tag" 
                                                                sx={{ color: '#000', fontWeight: 900, fontSize: '1.25rem' }}
                                                            >
                                                                <span style={{ fontSize: '0.8rem', color: '#E65100', marginRight: '4px' }}>ETB</span>
                                                                {parseFloat(device.price).toLocaleString()}
                                                            </Typography>
                                                        </Box>

                                                        <Box className="action-buttons" sx={{ display: 'flex', gap: 1 }}>
                                                            <Button 
                                                                variant="contained"
                                                                fullWidth
                                                                size="small"
                                                                onClick={() => navigate(`/device/${device.id}`)}
                                                                startIcon={<VisibilityIcon />}
                                                                sx={{ 
                                                                    bgcolor: '#000', 
                                                                    color: '#fff',
                                                                    borderRadius: '6px',
                                                                    textTransform: 'none',
                                                                    '&:hover': { bgcolor: '#333' }
                                                                }}
                                                            >
                                                                Details
                                                            </Button>
                                                            
                                                            <Button 
                                                                variant="outlined"
                                                                fullWidth
                                                                size="small"
                                                                onClick={() => setQuoteModalOpen(true)}
                                                                startIcon={<FormatQuoteIcon />}
                                                                sx={{ 
                                                                    color: '#1976D2', 
                                                                    borderColor: '#1976D2',
                                                                    borderRadius: '6px',
                                                                    textTransform: 'none',
                                                                    fontWeight: 700,
                                                                    '&:hover': { borderColor: '#0D47A1', bgcolor: '#E3F2FD' }
                                                                }}
                                                            >
                                                                Quote
                                                            </Button>
                                                        </Box>
                                                    </Box>

                                                    {device.stock <= 5 && device.stock > 0 && (
                                                        <Chip 
                                                            label={`Low Stock: Only ${device.stock} left`} 
                                                            size="small" 
                                                            sx={{ 
                                                                position: 'absolute',
                                                                top: 10,
                                                                right: 10,
                                                                bgcolor: '#E65100', 
                                                                color: '#fff',
                                                                fontWeight: 700,
                                                                fontSize: '0.65rem',
                                                                boxShadow: '0 2px 8px rgba(230, 81, 0, 0.3)'
                                                            }}
                                                        />
                                                    )}
                                                </CardContent>
                                                    
                                            </Box>
                                        </Card>
                                    </Grid>
                                </Grow>
                            ))}
                        </Grid>

                        {/* Pagination Component */}
                        {totalPages > 1 && (
                            <Box className="pagination-container" sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <MuiPagination 
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size={isMobile ? 'small' : 'large'}
                                    showFirstButton
                                    showLastButton
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            fontWeight: 600,
                                            borderRadius: '8px',
                                        },
                                        '& .Mui-selected': {
                                            backgroundColor: '#1976D2 !important',
                                            color: '#fff',
                                            fontWeight: 700,
                                        }
                                    }}
                                />
                            </Box>
                        )}
                    </>
                ) : (
                    <Box className="empty-state">
                        <Box className="empty-state-icon">🔍</Box>
                        <Typography variant="h5" className="empty-state-title">
                            No items found
                        </Typography>
                        <Typography variant="body1" className="empty-state-message">
                            Try adjusting your search or filter criteria
                        </Typography>
                        <Button variant="contained" onClick={() => {
                            setSearchQuery('');
                            setCategoryFilter('');
                            setTypeFilter('');
                            setCurrentPage(1);
                        }}>
                            Clear all filters
                        </Button>
                    </Box>
                )}
            </Container>

            {/* Partners Slider */}
            <PartnersSlider />  

            {/* Scroll to Top Button */}
            <Fade in={showScrollTop}>
                <IconButton className="scroll-to-top" onClick={scrollToTop}>
                    <KeyboardArrowUpIcon />
                </IconButton>
            </Fade>

            {/* Quote Modal */}
            <QuoteModal open={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />
        </Box>
    );
};

export default DeviceList;