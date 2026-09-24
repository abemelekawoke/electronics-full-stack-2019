import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Container, Row, Col, Card, Carousel, Badge, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
    TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel,
    Box, Chip, Stack, IconButton, Tooltip, Typography, Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const DeviceGallery = ({ pageFilter = '' }) => {
    const [devices, setDevices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [priceFilter, setPriceFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(true);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDevices();
        fetchCategories();
    }, []);

    useEffect(() => {
        filterAndSortDevices();
    }, [searchQuery, priceFilter, categoryFilter, typeFilter, sortBy, devices, pageFilter]);

    const fetchDevices = () => {
        api.get('devices/')
            .then(response => {
                setDevices(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching devices:', error);
                setLoading(false);
            });
    };

    const fetchCategories = () => {
        api.get('categories/')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    };

    const filterAndSortDevices = () => {
        let filtered = [...devices];

        if (pageFilter) {
            filtered = filtered.filter(device => device.page === pageFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter(device =>
                device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                device.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (priceFilter) {
            filtered = filtered.filter(device => device.price <= parseFloat(priceFilter));
        }

        if (categoryFilter) {
            filtered = filtered.filter(device => device.category === parseInt(categoryFilter));
        }

        if (typeFilter) {
            filtered = filtered.filter(device => device.type === typeFilter);
        }

        switch(sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'stock':
                filtered.sort((a, b) => b.stock - a.stock);
                break;
            case 'newest':
            default:
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
        }

        setFilteredDevices(filtered);
    };

    const formatCategoryName = (categoryId) => {
        if (!categoryId) return 'N/A';
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'N/A';
    };

    const getDeviceTypeColor = (type) => {
        switch(type?.toLowerCase()) {
            case 'new': return 'success';
            case 'used': return 'warning';
            case 'refurbished': return 'info';
            default: return 'secondary';
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setPriceFilter('');
        setCategoryFilter('');
        setTypeFilter('');
        setSortBy('newest');
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (searchQuery) count++;
        if (priceFilter) count++;
        if (categoryFilter) count++;
        if (typeFilter) count++;
        if (sortBy !== 'newest') count++;
        return count;
    };

    const handleQuickOrder = (deviceId) => {
        navigate(`/order/${deviceId}`);
    };

    const renderSkeletons = () => {
        return Array(6).fill(0).map((_, index) => (
            <Col xs={12} sm={6} lg={4} key={index} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                    <Skeleton variant="rectangular" height={220} />
                    <Card.Body>
                        <Skeleton variant="text" width="80%" height={30} />
                        <Skeleton variant="text" width="100%" />
                        <Skeleton variant="text" width="60%" />
                        <Stack direction="row" spacing={1} className="mt-3">
                            <Skeleton variant="rounded" width={80} height={32} />
                            <Skeleton variant="rounded" width={60} height={32} />
                        </Stack>
                    </Card.Body>
                </Card>
            </Col>
        ));
    };

    return (
        <Container fluid className="px-4">
            <Box sx={{ 
                mb: 4, 
                p: 3, 
                bgcolor: 'white', 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
                <Row className="align-items-center">
                    <Col md={8}>
                        <TextField
                            variant="outlined"
                            placeholder="Search for devices, electronics, gadgets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#4361ee' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: searchQuery && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '50px',
                                    backgroundColor: '#f8f9fa',
                                    '&:hover': {
                                        backgroundColor: '#fff',
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#fff',
                                        boxShadow: '0 0 0 3px rgba(67, 97, 238, 0.15)',
                                    }
                                },
                            }}
                        />
                    </Col>
                    <Col md={4} className="text-end">
                        <Tooltip title="Toggle filters">
                            <Button
                                variant={showFilters ? "contained" : "outlined"}
                                onClick={() => setShowFilters(!showFilters)}
                                startIcon={<FilterListIcon />}
                                sx={{ 
                                    borderRadius: '50px',
                                    backgroundColor: showFilters ? '#4361ee' : 'transparent',
                                    color: showFilters ? 'white' : '#4361ee',
                                    borderColor: '#4361ee',
                                    '&:hover': {
                                        backgroundColor: showFilters ? '#3a56d4' : 'rgba(67, 97, 238, 0.1)',
                                    }
                                }}
                                className="me-2"
                            >
                                Filters
                                {getActiveFilterCount() > 0 && (
                                    <Badge 
                                        bg="danger" 
                                        className="ms-2"
                                        style={{ fontSize: '0.7rem' }}
                                    >
                                        {getActiveFilterCount()}
                                    </Badge>
                                )}
                            </Button>
                        </Tooltip>
                        {getActiveFilterCount() > 0 && (
                            <Button 
                                variant="text" 
                                size="small"
                                onClick={clearFilters}
                                startIcon={<ClearIcon />}
                                sx={{ color: '#6c757d' }}
                            >
                                Clear
                            </Button>
                        )}
                    </Col>
                </Row>

                {showFilters && (
                    <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e9ecef' }} className="fade-in">
                        <Row>
                            <Col xs={12} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Price Range</InputLabel>
                                    <Select
                                        value={priceFilter}
                                        onChange={(e) => setPriceFilter(e.target.value)}
                                        label="Price Range"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="">All Prices</MenuItem>
                                        <MenuItem value={100}>Under ETB 100</MenuItem>
                                        <MenuItem value={500}>Under ETB 500</MenuItem>
                                        <MenuItem value={1000}>Under ETB 1,000</MenuItem>
                                        <MenuItem value={2000}>Under ETB 2,000</MenuItem>
                                        <MenuItem value={5000}>Under ETB 5,000</MenuItem>
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col xs={12} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        label="Category"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="">All Categories</MenuItem>
                                        {categories.map(category => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col xs={12} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Device Type</InputLabel>
                                    <Select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        label="Device Type"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="">All Types</MenuItem>
                                        <MenuItem value="new">New</MenuItem>
                                        <MenuItem value="used">Used</MenuItem>
                                        <MenuItem value="refurbished">Refurbished</MenuItem>
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col xs={12} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Sort By</InputLabel>
                                    <Select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        label="Sort By"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="newest">Newest First</MenuItem>
                                        <MenuItem value="price-low">Price: Low to High</MenuItem>
                                        <MenuItem value="price-high">Price: High to Low</MenuItem>
                                        <MenuItem value="stock">Most in Stock</MenuItem>
                                    </Select>
                                </FormControl>
                            </Col>
                        </Row>
                    </Box>
                )}

                {getActiveFilterCount() > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {searchQuery && (
                                <Chip 
                                    label={`Search: "${searchQuery}"`}
                                    onDelete={() => setSearchQuery('')}
                                    size="small"
                                    sx={{ 
                                        backgroundColor: '#e8f0fe',
                                        color: '#4361ee',
                                        '& .MuiChip-deleteIcon': { color: '#4361ee' }
                                    }}
                                />
                            )}
                            {priceFilter && (
                                <Chip 
                                    label={`Max: ETB ${priceFilter}`}
                                    onDelete={() => setPriceFilter('')}
                                    size="small"
                                    sx={{ 
                                        backgroundColor: '#e8f0fe',
                                        color: '#4361ee',
                                        '& .MuiChip-deleteIcon': { color: '#4361ee' }
                                    }}
                                />
                            )}
                            {categoryFilter && (
                                <Chip 
                                    label={formatCategoryName(parseInt(categoryFilter))}
                                    onDelete={() => setCategoryFilter('')}
                                    size="small"
                                    sx={{ 
                                        backgroundColor: '#e8f0fe',
                                        color: '#4361ee',
                                        '& .MuiChip-deleteIcon': { color: '#4361ee' }
                                    }}
                                />
                            )}
                            {typeFilter && (
                                <Chip 
                                    label={typeFilter}
                                    onDelete={() => setTypeFilter('')}
                                    size="small"
                                    sx={{ 
                                        backgroundColor: '#e8f0fe',
                                        color: '#4361ee',
                                        '& .MuiChip-deleteIcon': { color: '#4361ee' }
                                    }}
                                />
                            )}
                            {sortBy !== 'newest' && (
                                <Chip 
                                    label={sortBy.replace('-', ' ')}
                                    onDelete={() => setSortBy('newest')}
                                    size="small"
                                    sx={{ 
                                        backgroundColor: '#e8f0fe',
                                        color: '#4361ee',
                                        '& .MuiChip-deleteIcon': { color: '#4361ee' }
                                    }}
                                />
                            )}
                        </Stack>
                    </Box>
                )}
            </Box>

            <Row className="mb-3">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2b2d42' }}>
                            {loading ? 'Loading...' : (
                                <>
                                    <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4361ee' }} />
                                    {filteredDevices.length} {pageFilter || 'Devices'} Available
                                </>
                            )}
                        </Typography>
                        {filteredDevices.length === 0 && !loading && (
                            <Button 
                                variant="link" 
                                onClick={clearFilters}
                                className="text-decoration-none"
                                sx={{ color: '#4361ee' }}
                            >
                                Clear all filters
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>

            {loading ? (
                <Row>{renderSkeletons()}</Row>
            ) : filteredDevices.length > 0 ? (
                <Row>
                    {filteredDevices.map((device, index) => (
                        <Col xs={12} sm={6} lg={4} key={device.id} className="mb-4">
                            <Card 
                                className="h-100 shadow-sm border-0"
                                sx={{ 
                                    borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    animation: 'fadeInUp 0.5s ease forwards',
                                    animationDelay: `${index * 0.05}s`,
                                    opacity: 0,
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                        '& .device-image': {
                                            transform: 'scale(1.05)'
                                        }
                                    }
                                }}
                            >
                                <div style={{ position: 'relative', overflow: 'hidden' }}>
                                    <Carousel indicators={true} controls={true} interval={3000}>
                                        {[device.image1, device.image2, device.image3]
                                            .filter(img => img)
                                            .map((img, idx) => (
                                                <Carousel.Item key={idx}>
                                                    <div style={{ 
                                                        height: '240px', 
                                                        overflow: 'hidden',
                                                        backgroundColor: '#f8f9fa'
                                                    }}>
                                                        <img
                                                            className="d-block w-100 device-image"
                                                            src={img}
                                                            alt={`${device.name} ${idx + 1}`}
                                                            style={{ 
                                                                objectFit: 'cover',
                                                                height: '100%',
                                                                width: '100%',
                                                                transition: 'transform 0.5s ease'
                                                            }}
                                                        />
                                                    </div>
                                                </Carousel.Item>
                                            ))}
                                    </Carousel>
                                    {device.stock <= 3 && device.stock > 0 && (
                                        <Badge 
                                            bg="warning" 
                                            className="position-absolute top-0 end-0 m-2"
                                            style={{ borderRadius: '8px' }}
                                        >
                                            Only {device.stock} left!
                                        </Badge>
                                    )}
                                    {device.stock === 0 && (
                                        <Badge 
                                            bg="danger" 
                                            className="position-absolute top-0 end-0 m-2"
                                            style={{ borderRadius: '8px' }}
                                        >
                                            Out of Stock
                                        </Badge>
                                    )}
                                    <Badge 
                                        bg={getDeviceTypeColor(device.type)}
                                        className="position-absolute top-0 start-0 m-2"
                                        style={{ borderRadius: '8px', textTransform: 'capitalize' }}
                                    >
                                        {device.type}
                                    </Badge>
                                    <div 
                                        className="position-absolute bottom-0 start-0 m-2"
                                        style={{
                                            backgroundColor: 'rgba(255,255,255,0.95)',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: '#4361ee'
                                        }}
                                    >
                                        <CategoryIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                        {formatCategoryName(device.category)}
                                    </div>
                                </div>

                                <Card.Body className="d-flex flex-column p-3">
                                    <Card.Title className="h6 mb-2" style={{ fontWeight: 700, color: '#2b2d42' }}>
                                        {device.name}
                                    </Card.Title>
                                    <Card.Text className="text-muted mb-3 flex-grow-1" style={{ fontSize: '0.9rem' }}>
                                        {device.description.length > 80 ? (
                                            `${device.description.substring(0, 80)}...`
                                        ) : (
                                            device.description
                                        )}
                                    </Card.Text>
                                    <div className="mb-3" style={{ 
                                        backgroundColor: '#f8f9fa', 
                                        padding: '12px', 
                                        borderRadius: '12px' 
                                    }}>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Price</span>
                                            <span className="h5 mb-0" style={{ color: '#4361ee', fontWeight: 700 }}>
                                                ETB {device.price.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Added</span>
                                            <small className="text-muted">
                                                {formatDistanceToNow(new Date(device.created_at), { addSuffix: true })}
                                            </small>
                                        </div>
                                    </div>
                                    <div className="mt-auto">
                                        <Row className="g-2">
                                            <Col xs={6}>
                                                <Button
                                                    variant="outline-primary"
                                                    className="w-100"
                                                    onClick={() => navigate(`/device/${device.id}`)}
                                                    startIcon={<VisibilityIcon />}
                                                    sx={{ 
                                                        borderRadius: '25px',
                                                        borderColor: '#4361ee',
                                                        color: '#4361ee',
                                                        '&:hover': {
                                                            backgroundColor: '#4361ee',
                                                            color: 'white'
                                                        }
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            </Col>
                                            <Col xs={6}>
                                                <Button
                                                    variant="primary"
                                                    className="w-100"
                                                    onClick={() => handleQuickOrder(device.id)}
                                                    disabled={device.stock === 0}
                                                    startIcon={<ShoppingCartIcon />}
                                                    sx={{ 
                                                        borderRadius: '25px',
                                                        backgroundColor: '#4361ee',
                                                        '&:hover': {
                                                            backgroundColor: '#3a56d4'
                                                        },
                                                        '&:disabled': {
                                                            backgroundColor: '#ccc'
                                                        }
                                                    }}
                                                >
                                                    Order
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Row>
                    <Col>
                        <Box sx={{ 
                            textAlign: 'center', 
                            py: 8, 
                            bgcolor: 'white', 
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                        }}>
                            <TrendingUpIcon sx={{ fontSize: 80, color: '#e9ecef', mb: 2 }} />
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#2b2d42', mb: 1 }}>
                                No devices found
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                Try adjusting your search or filters to find what you're looking for.
                            </Typography>
                            <Button 
                                variant="contained"
                                onClick={clearFilters}
                                startIcon={<ClearIcon />}
                                sx={{ 
                                    borderRadius: '25px',
                                    backgroundColor: '#4361ee',
                                    padding: '10px 30px'
                                }}
                            >
                                Clear All Filters
                            </Button>
                        </Box>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default DeviceGallery;