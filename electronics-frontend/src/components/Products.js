import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Grid, Card, CardContent, Chip,
    Button, TextField, MenuItem, Select,
    FormControl, InputLabel, Box,
    Typography, Skeleton, InputAdornment,
    IconButton, Fade, Grow, Zoom, Paper, Badge,
    useMediaQuery, useTheme, Rating,
    Slider, Popover, Pagination as MuiPagination
} from '@mui/material';

// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SortIcon from '@mui/icons-material/Sort';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Inventory2Icon from '@mui/icons-material/Inventory2';

// Project Imports
import api, { getProducts, getCategoriesWithCounts } from '../services/api';
import './Products.css';
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
                <Grid container spacing={2}>
                    {features.map((feature, index) => (
                        <Grid item xs={6} sm={3} md={3} key={index}>
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

// Product Image Slider Component
const ProductImageSlider = ({ device }) => {
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

const Products = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    
    // State for devices
    const [devices, setDevices] = useState([]);
    const [allDevices, setAllDevices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 50000]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(12);
    
    const navigate = useNavigate();

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
            // Get categories with counts for products page
            const response = await getCategoriesWithCounts('products');
            
            let categoryData = response.data || response;
            
            if (Array.isArray(categoryData) && categoryData.length > 0) {
                setCategories(categoryData);
            } else {
                // Fallback: fetch from /categories/ endpoint
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
            setCategories([]);
        }
    };

    // ============================================
    // LOAD PRODUCTS (MATERIAL & CLOTHING)
    // ============================================
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Build params
                const params = {
                    page: currentPage,
                    page_size: pageSize,
                };
                
                // Add category filter
                if (categoryFilter) {
                    params.category = categoryFilter;
                }
                
                // Add search
                if (searchQuery) {
                    params.search = searchQuery;
                }
                
                // Add ordering
                if (sortBy === 'price_asc') params.ordering = 'price';
                else if (sortBy === 'price_desc') params.ordering = '-price';
                else if (sortBy === 'name_asc') params.ordering = 'name';
                else if (sortBy === 'newest') params.ordering = '-created_at';
                
                // Fetch products
                const response = await getProducts(params);
                const data = response.data;
                
                const results = data.results || [];
                const count = data.count || 0;
                
                const devicesArray = results.map(device => ({
                    ...device,
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    reviewCount: Math.floor(Math.random() * 100) + 10,
                    isNew: Math.random() > 0.8,
                    stock: device.stock !== undefined ? device.stock : 0
                }));
                
                setDevices(devicesArray);
                setAllDevices(devicesArray);
                setTotalItems(count);
                setTotalPages(Math.ceil(count / pageSize));
                
                // Fetch categories after devices are loaded
                await fetchCategories();
                
            } catch (err) {
                console.error("Error loading products:", err);
                setError("Failed to load products. Please try again later.");
                setDevices([]);
                setAllDevices([]);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [currentPage, pageSize, categoryFilter, searchQuery, sortBy]);

    // Re-fetch categories when devices change
    useEffect(() => {
        if (!loading && devices.length > 0) {
            fetchCategories();
        }
    }, [devices]);

    // Filter and sort devices locally for instant feedback
    useEffect(() => {
        let result = [...allDevices];
        
        if (searchQuery) {
            result = result.filter(d => 
                d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        if (categoryFilter) {
            result = result.filter(d => String(d.category_id) === String(categoryFilter));
        }
        
        if (typeFilter) {
            result = result.filter(d => d.type === typeFilter);
        }
        
        if (priceRange[1] < 50000) {
            result = result.filter(d => d.price >= priceRange[0] && d.price <= priceRange[1]);
        }
        
        result.sort((a, b) => {
            switch(sortBy) {
                case 'price_asc':
                    return parseFloat(a.price) - parseFloat(b.price);
                case 'price_desc':
                    return parseFloat(b.price) - parseFloat(a.price);
                case 'name_asc':
                    return a.name?.localeCompare(b.name);
                case 'popular':
                    return (b.rating || 0) - (a.rating || 0);
                case 'newest':
                    return new Date(b.created_at) - new Date(a.created_at);
                default:
                    return 0;
            }
        });
        
        setFilteredDevices(result);
    }, [searchQuery, categoryFilter, typeFilter, priceRange, allDevices, sortBy]);

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

    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    // Get category name by ID
    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === parseInt(categoryId));
        return category ? category.name : '';
    };

    return (
        <Box className="products-page-wrapper">
            {/* Hero Section */}
            <Box className="hero-section">
                <Container maxWidth="xl">
                    <Fade in timeout={800}>
                        <Box className="hero-content">
                            <Typography variant="overline" className="hero-overline">
                                Premium Quality
                            </Typography>
                            <Typography variant="h1" className="hero-title">
                                Our Products
                            </Typography>
                            <Typography variant="h5" className="hero-subtitle">
                                Discover our premium printing solutions and materials
                            </Typography>
                            <Typography variant="body1" className="hero-description">
                                High-quality products designed to meet your professional printing needs
                            </Typography>
                        </Box>
                    </Fade>
                </Container>
                <Box className="hero-bg-overlay" />
            </Box>

            {/* Features Section */}
            <FeatureCards />
            
            {/* Announcement Bar */}
            <Box sx={{ 
                position: 'relative',
                zIndex: 999,
                width: '100%',
                mt: 1,
                mb: 1
            }}>
                <AnnouncementBar />
            </Box>

            {/* Filter Section */}
            <Container maxWidth="xl" className="filter-section">
                <Paper elevation={0} className="filter-paper">
                    <Grid container spacing={2} alignItems="center" wrap="nowrap">
                        
                        {/* 1. Search Field */}
                        <Grid item xs={12} md={2.5}>
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
                                    endAdornment: searchQuery && (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setSearchQuery('')} size="small">
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        {/* 2. Sort Dropdown */}
                        <Grid item xs={6} md={2}>
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
                        
                        {/* 3. Category Filter - FROM BACKEND */}
                        <Grid item xs={6} md={2}>
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

                        {/* 4. Price Range Slider */}
                        <Grid item xs={12} md={2.5}>
                            <Box className="price-range-slider-container">
                                <Slider
                                    value={priceRange}
                                    onChange={(e, newValue) => setPriceRange(newValue)}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={50000}
                                    className="price-slider-inline"
                                    size="small"
                                />
                                <Box className="price-range-values-inline">
                                    <Typography variant="caption">ETB {priceRange[0].toLocaleString()}</Typography>
                                    <Typography variant="caption">ETB {priceRange[1].toLocaleString()}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        
                        {/* 5. Reset Button */}
                        <Grid item xs={6} md={1}>
                            <Button 
                                fullWidth 
                                size="small"
                                variant="contained" 
                                color="error"
                                onClick={() => {
                                    setSearchQuery('');
                                    setCategoryFilter('');
                                    setTypeFilter('');
                                    setPriceRange([0, 50000]);
                                    setSortBy('newest');
                                    setCurrentPage(1);
                                }}
                                className="reset-filters-btn"
                            >
                                Reset
                            </Button>
                        </Grid>
                        
                        {/* 6. View Toggle Buttons */}
                        <Grid item xs="auto">
                            <Box className="view-toggle">
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
                        Showing <strong>{filteredDevices.length}</strong> of <strong>{totalItems}</strong> products
                        {filteredDevices.length < allDevices.length && ` (filtered: ${filteredDevices.length})`}
                    </Typography>
                    <Typography variant="body2" className="stats-text">
                        Page {currentPage} of {totalPages}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {searchQuery && (
                            <Chip 
                                label={`"${searchQuery}"`} 
                                size="small"
                                onDelete={() => setSearchQuery('')}
                                className="search-chip"
                            />
                        )}
                        {categoryFilter && getCategoryName(categoryFilter) && (
                            <Chip 
                                label={getCategoryName(categoryFilter)}
                                size="small"
                                onDelete={() => setCategoryFilter('')}
                                className="filter-chip"
                            />
                        )}
                        {typeFilter && (
                            <Chip 
                                label={`Type: ${typeFilter}`}
                                size="small"
                                onDelete={() => setTypeFilter('')}
                                className="filter-chip"
                            />
                        )}
                        {priceRange[1] < 50000 && (
                            <Chip 
                                label={`ETB ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}`}
                                size="small"
                                onDelete={() => setPriceRange([0, 50000])}
                                className="filter-chip"
                            />
                        )}
                    </Box>
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
                ) : filteredDevices.length > 0 ? (
                    <>
                        <Grid container spacing={3}>
                            {filteredDevices.map((device, index) => (
                                <Grow in timeout={300 + index * 50} key={device.id}>
                                    <Grid item xs={12} sm={6} md={4} lg={viewMode === 'list' ? 12 : 3}>
                                        <Card className={`device-card ${viewMode === 'list' ? 'list-view' : ''}`}>
                                            <Box className={`card-inner ${viewMode === 'list' ? 'list-layout' : ''}`}>
                                                <Box className="card-media">
                                                    <ProductImageSlider device={device} />
                                                    {device.discount > 0 && (
                                                        <Chip 
                                                            label={`-${device.discount}%`} 
                                                            size="small" 
                                                            className="discount-badge"
                                                            sx={{ 
                                                                position: 'absolute',
                                                                top: 12,
                                                                right: 12,
                                                                bgcolor: '#ff8f00',
                                                                color: 'white',
                                                                fontWeight: 700,
                                                                zIndex: 2
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                                <CardContent className="card-content">
                                                    <Box className="card-header">
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

                                                        <Box className="rating-container">
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

                                                    <Box className="card-footer">
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

                                                        <Box className="action-buttons">
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
                                                                onClick={() => navigate(`/order/${device.id}`)}
                                                                startIcon={<ShoppingCartIcon />}
                                                                sx={{ 
                                                                    color: '#1976D2', 
                                                                    borderColor: '#1976D2',
                                                                    borderRadius: '6px',
                                                                    textTransform: 'none',
                                                                    fontWeight: 700,
                                                                    '&:hover': { borderColor: '#0D47A1', bgcolor: '#E3F2FD' }
                                                                }}
                                                            >
                                                                Order
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
                        <Inventory2Icon className="empty-icon" />
                        <Typography variant="h5" className="empty-state-title">
                            No products found
                        </Typography>
                        <Typography variant="body1" className="empty-state-message">
                            Try adjusting your search or filter criteria
                        </Typography>
                        <Button 
                            variant="contained" 
                            onClick={() => {
                                setSearchQuery('');
                                setCategoryFilter('');
                                setTypeFilter('');
                                setPriceRange([0, 50000]);
                                setSortBy('newest');
                                setCurrentPage(1);
                            }}
                            className="empty-reset-btn"
                        >
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
        </Box>
    );
};

export default Products;