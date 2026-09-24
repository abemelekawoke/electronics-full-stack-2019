import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
  Card,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  Button,
  IconButton,
  Fade,
  Grow,
  Skeleton,
  Rating,
  useMediaQuery,
  useTheme,
  Alert,
  AlertTitle
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ErrorIcon from '@mui/icons-material/Error';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import api from '../services/api';
import './Portfolio.css';

const Portfolio = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [portfolioOrders, setPortfolioOrders] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch portfolio orders from API (only orders with is_portfolio=True)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // ============ FETCH PORTFOLIO ORDERS (is_portfolio = true) ============
        try {
          const ordersResponse = await api.get('orders/');
          let ordersData = ordersResponse.data || ordersResponse;
          let ordersArray = Array.isArray(ordersData) ? ordersData : [];
          
          // ONLY filter orders where is_portfolio is true
          const filteredPortfolioOrders = ordersArray.filter(order => order.is_portfolio === true);
          
          console.log('Portfolio Orders found:', filteredPortfolioOrders.length);
          
          // Map portfolio orders to display items
          const mappedPortfolioItems = filteredPortfolioOrders.map(order => {
            const device = order.device || {};
            
            return {
              id: `portfolio-${order.id}`,
              name: order.device_name || device.name || `Portfolio Project #${order.id}`,
              description: order.description || `Completed portfolio project - Order #${order.id}`,
              price: order.total_price || order.base_price || 0,
              // Use front image if available, fallback to sample_design, then device image
              img: order.front_url || order.front || 
                   order.sample_design_url || order.sample_design || 
                   order.back_url || order.back || 
                   order.left_url || order.left_image ||
                   order.right_url || order.right_image ||
                   (device.image1) || '/placeholder-electronics.png',
              category: 'Portfolio',
              rating: 4.8,
              reviewCount: 15,
              type: order.type || 'new',
              status: order.status || 'Completed',
              is_portfolio: true,
              orderData: order,
              gender: order.gender,
              size: order.size,
              color: order.color,
              deviceName: order.device_name || device.name,
              ordered_at: order.ordered_at || order.created_at,
              // Include all design images for detail view
              front_url: order.front_url,
              back_url: order.back_url,
              left_url: order.left_url,
              right_url: order.right_url,
              sample_design_url: order.sample_design_url,
              // Include order details
              quantity: order.quantity,
              total_price: order.total_price,
              delivery_date: order.delivery_date,
              service_size: order.service_size,
              service_size_width: order.service_size_width,
              service_size_height: order.service_size_height
            };
          });
          
          setPortfolioOrders(mappedPortfolioItems);
          
          // Build categories list - only Portfolio since we only show portfolio items
          let categoryNames = ['All'];
          
          // Add Portfolio category if there are portfolio items
          if (mappedPortfolioItems.length > 0) {
            categoryNames.push('Portfolio');
          }
          
          setCategories(categoryNames);
          
        } catch (orderErr) {
          console.error('Error fetching portfolio orders:', orderErr);
          setError('Failed to load portfolio items. Please try again later.');
          setPortfolioOrders([]);
        }
        
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load portfolio items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Get filtered items based on selected tab
  const getFilteredItems = () => {
    if (tabValue === 0) {
      // "All" tab - show all portfolio items
      return portfolioOrders;
    }
    
    const selectedCategory = categories[tabValue];
    
    if (selectedCategory === 'Portfolio') {
      // Portfolio tab - show portfolio items
      return portfolioOrders;
    }
    
    return [];
  };

  const filteredItems = getFilteredItems();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const getGridCols = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'All': '🏠',
      'Portfolio': '🏆',
      'Others': '📁',
      'Uncategorized': '📁'
    };
    return icons[category] || '📁';
  };

  const LoadingSkeleton = () => (
    <ImageList variant="masonry" cols={getGridCols()} gap={24} className="portfolio-grid">
      {Array(6).fill(0).map((_, index) => (
        <ImageListItem key={index}>
          <Card className="portfolio-card">
            <Skeleton variant="rectangular" height={300} />
            <Box className="card-content" sx={{ p: 2 }}>
              <Skeleton width="80%" height={32} />
              <Skeleton width="60%" height={24} sx={{ mt: 1 }} />
              <Skeleton width="90%" height={40} sx={{ mt: 1 }} />
            </Box>
          </Card>
        </ImageListItem>
      ))}
    </ImageList>
  );

  // ============ EMPTY PORTFOLIO STATE ============
  const EmptyPortfolioState = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        textAlign: 'center',
        minHeight: '400px',
      }}
    >
      <Fade in timeout={800}>
        <Box>
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: 'rgba(156, 39, 176, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 60, color: '#9c27b0' }} />
          </Box>
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1a1a2e',
              mb: 2,
              background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            No Portfolio Items Yet
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              maxWidth: 500,
              mx: 'auto',
              mb: 3,
              lineHeight: 1.8,
            }}
          >
            We haven't added any portfolio projects yet. 
            Portfolio items are created when orders are marked as portfolio pieces.
            Check back soon to see our amazing work!
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Chip
              icon={<FolderOpenIcon />}
              label="Browse Products"
              sx={{
                backgroundColor: '#9c27b0',
                color: '#fff',
                px: 2,
                py: 2,
                '&:hover': { backgroundColor: '#7b1fa2' },
                cursor: 'pointer'
              }}
              onClick={() => window.location.href = '/'}
            />
            <Chip
              icon={<AutoAwesomeIcon />}
              label="Coming Soon"
              sx={{
                backgroundColor: '#e0e0e0',
                color: '#666',
                px: 2,
                py: 2,
              }}
            />
          </Box>
          
          <Typography
            variant="body2"
            sx={{
              mt: 4,
              color: '#999',
              fontSize: '0.875rem',
            }}
          >
            💡 Tip: Mark orders as portfolio items in the admin panel to showcase your best work here.
          </Typography>
        </Box>
      </Fade>
    </Box>
  );

  if (error) {
    return (
      <Box className="portfolio-container">
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Alert severity="error" icon={<ErrorIcon />}>
            <AlertTitle>Error Loading Portfolio</AlertTitle>
            {error}
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()} 
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }

  const getCategoryCount = (category) => {
    if (category === 'All') {
      return portfolioOrders.length;
    }
    if (category === 'Portfolio') {
      return portfolioOrders.length;
    }
    return 0;
  };

  // Check if there are no portfolio items
  const hasNoPortfolioItems = portfolioOrders.length === 0;

  return (
    <Box className="portfolio-container">
      {/* Hero Section */}
      <Box className="portfolio-hero">
        <Container maxWidth="lg">
          <Fade in timeout={800}>
            <Box className="hero-content">
              <Typography variant="overline" className="hero-overline">
                Our Creative Showcase
              </Typography>
              <Typography variant="h1" className="hero-title">
                Portfolio
              </Typography>
              <Typography variant="h5" className="hero-subtitle">
                Discover our completed projects and creative work. 
                Each piece represents our commitment to quality and customer satisfaction.
              </Typography>
              <Button
                variant="contained"
                href="https://www.youtube.com/@Parrotadvert"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-button"
                startIcon={<PlayArrowIcon />}
              >
                Watch Our Work Video Preview
              </Button>
            </Box>
          </Fade>
        </Container>
        <Box className="hero-bg-overlay" />
      </Box>

      {/* Category Tabs */}
      <Container maxWidth="xl" className="portfolio-content">
        <Box className="tabs-container">
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            className="portfolio-tabs"
          >
            {categories.map((category, index) => {
              const count = getCategoryCount(category);
              
              return (
                <Tab 
                  key={category} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{getCategoryIcon(category)}</span>
                      <span>
                        {category}
                        <Typography component="span" sx={{ ml: 1, fontSize: '0.75rem', opacity: 0.8 }}>
                          ({count})
                        </Typography>
                      </span>
                    </Box>
                  }
                  className="portfolio-tab"
                />
              );
            })}
          </Tabs>
        </Box>

        {/* Portfolio Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : hasNoPortfolioItems ? (
          <EmptyPortfolioState />
        ) : filteredItems.length > 0 ? (
          <ImageList
            variant="masonry"
            cols={getGridCols()}
            gap={24}
            className="portfolio-grid"
          >
            {filteredItems.map((item, index) => (
              <Grow in timeout={500 + (index * 50)} key={item.id || index}>
                <ImageListItem className="portfolio-item">
                  <Card 
                    className="portfolio-card"
                    onClick={() => handleItemClick(item)}
                  >
                    <Box className="card-image-wrapper">
                      <CardMedia
                        component="img"
                        image={item.img}
                        alt={item.name}
                        className="card-image"
                        onError={(e) => {
                          e.target.src = '/placeholder-electronics.png';
                        }}
                      />
                      <Box className="card-overlay">
                        <IconButton className="zoom-icon">
                          <ZoomInIcon />
                        </IconButton>
                      </Box>
                      {item.is_portfolio && (
                        <Chip 
                          label="🏆 Portfolio" 
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8, 
                            backgroundColor: '#9c27b0', 
                            color: '#fff',
                            zIndex: 2,
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                      {item.status && (
                        <Chip 
                          label={item.status} 
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            bottom: 8, 
                            left: 8, 
                            backgroundColor: item.status === 'Delivered' ? '#4caf50' : 
                                           item.status === 'Shipped' ? '#2196f3' : 
                                           item.status === 'In_Production' ? '#ff9800' : '#9e9e9e',
                            color: '#fff',
                            zIndex: 2
                          }}
                        />
                      )}
                    </Box>
                    <Box className="card-content">
                      <Typography variant="h6" className="card-title">
                        {item.name}
                      </Typography>
                      <Box className="rating-container">
                        <Rating 
                          value={parseFloat(item.rating)} 
                          precision={0.5} 
                          size="small" 
                          readOnly 
                        />
                        <Typography variant="caption" className="review-count">
                          ({item.reviewCount})
                        </Typography>
                      </Box>
                      <Chip 
                        label={item.category || 'Portfolio'} 
                        size="small"
                        className="card-category"
                        icon={<span>{getCategoryIcon(item.category || 'Portfolio')}</span>}
                      />
                      {item.gender && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                          {item.gender}{item.size && ` • ${item.size}`}{item.color && ` • ${item.color}`}
                        </Typography>
                      )}
                      <Typography variant="body2" className="card-description">
                        {item.description?.substring(0, 80) || 'Completed portfolio project'}...
                      </Typography>
                      <Box className="price-container">
                        <Typography className="price-tag" sx={{ color: '#9c27b0' }}>
                          Portfolio Project
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </ImageListItem>
              </Grow>
            ))}
          </ImageList>
        ) : (
          <EmptyPortfolioState />
        )}
      </Container>

      {/* Lightbox Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        className="portfolio-dialog"
        TransitionComponent={Fade}
        transitionDuration={400}
      >
        {selectedItem && (
          <DialogContent className="dialog-content">
            <IconButton className="dialog-close-btn" onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
            <Box className="dialog-image-container">
              <img
                src={selectedItem.img}
                alt={selectedItem.name}
                className="dialog-image"
                onError={(e) => {
                  e.target.src = '/placeholder-electronics.png';
                }}
              />
              <Box className="dialog-info">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant="h4" className="dialog-title">
                    {selectedItem.name}
                  </Typography>
                  <Chip 
                    label="🏆 Portfolio Project" 
                    sx={{ backgroundColor: '#9c27b0', color: '#fff', fontWeight: 'bold' }}
                  />
                </Box>
                <Box className="dialog-rating">
                  <Rating 
                    value={parseFloat(selectedItem.rating)} 
                    precision={0.5} 
                    readOnly 
                    size="large"
                  />
                  <Typography variant="body2">
                    ({selectedItem.reviewCount} reviews)
                  </Typography>
                </Box>
                <Chip 
                  label={selectedItem.category || 'Portfolio'} 
                  className="dialog-category"
                  icon={<span>{getCategoryIcon(selectedItem.category || 'Portfolio')}</span>}
                  sx={{ alignSelf: 'flex-start', mb: 2 }}
                />
                <Typography variant="body1" className="dialog-description">
                  {selectedItem.description || 'Completed portfolio project showcasing our work.'}
                </Typography>
                
                {/* Project Details */}
                {selectedItem.orderData && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2, width: '100%' }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      Project Details:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip 
                        size="small" 
                        label={`Status: ${selectedItem.orderData.status || 'Completed'}`} 
                        sx={{ backgroundColor: selectedItem.orderData.status === 'Delivered' ? '#4caf50' : 
                                            selectedItem.orderData.status === 'Shipped' ? '#2196f3' : 
                                            selectedItem.orderData.status === 'In_Production' ? '#ff9800' : '#9e9e9e',
                            color: '#fff' }}
                      />
                      <Chip 
                        size="small" 
                        label={`Order #${selectedItem.orderData.id}`} 
                        sx={{ backgroundColor: '#2196f3', color: '#fff' }}
                      />
                      {selectedItem.orderData.device_name && (
                        <Chip 
                          size="small" 
                          label={`Device: ${selectedItem.orderData.device_name}`} 
                          sx={{ backgroundColor: '#ff9800', color: '#fff' }}
                        />
                      )}
                      {selectedItem.orderData.quantity && (
                        <Chip 
                          size="small" 
                          label={`Qty: ${selectedItem.orderData.quantity}`} 
                          sx={{ backgroundColor: '#795548', color: '#fff' }}
                        />
                      )}
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      {selectedItem.orderData.ordered_at && (
                        <Typography variant="body2">
                          Completed: {new Date(selectedItem.orderData.ordered_at).toLocaleDateString()}
                        </Typography>
                      )}
                      {selectedItem.orderData.gender && (
                        <Typography variant="body2">
                          Gender: {selectedItem.orderData.gender}
                        </Typography>
                      )}
                      {selectedItem.orderData.size && (
                        <Typography variant="body2">
                          Size: {selectedItem.orderData.size}
                        </Typography>
                      )}
                      {selectedItem.orderData.color && (
                        <Typography variant="body2">
                          Color: {selectedItem.orderData.color}
                        </Typography>
                      )}
                      {selectedItem.orderData.service_size && (
                        <Typography variant="body2">
                          Service Size: {selectedItem.orderData.service_size} m²
                        </Typography>
                      )}
                      {selectedItem.orderData.total_price && (
                        <Typography variant="body2" fontWeight="bold">
                          Total Price: ETB {parseFloat(selectedItem.orderData.total_price).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Design Images */}
                    {(selectedItem.front_url || selectedItem.back_url || selectedItem.left_url || selectedItem.right_url || selectedItem.sample_design_url) && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                          Design Images:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {selectedItem.sample_design_url && (
                            <Chip 
                              size="small" 
                              label="📐 Sample Design" 
                              sx={{ backgroundColor: '#e3f2fd' }}
                              onClick={() => window.open(selectedItem.sample_design_url, '_blank')}
                              clickable
                            />
                          )}
                          {selectedItem.front_url && (
                            <Chip 
                              size="small" 
                              label="👕 Front" 
                              sx={{ backgroundColor: '#fce4ec' }}
                              onClick={() => window.open(selectedItem.front_url, '_blank')}
                              clickable
                            />
                          )}
                          {selectedItem.back_url && (
                            <Chip 
                              size="small" 
                              label="👕 Back" 
                              sx={{ backgroundColor: '#fce4ec' }}
                              onClick={() => window.open(selectedItem.back_url, '_blank')}
                              clickable
                            />
                          )}
                          {selectedItem.left_url && (
                            <Chip 
                              size="small" 
                              label="⬅️ Left" 
                              sx={{ backgroundColor: '#e8f5e9' }}
                              onClick={() => window.open(selectedItem.left_url, '_blank')}
                              clickable
                            />
                          )}
                          {selectedItem.right_url && (
                            <Chip 
                              size="small" 
                              label="➡️ Right" 
                              sx={{ backgroundColor: '#e8f5e9' }}
                              onClick={() => window.open(selectedItem.right_url, '_blank')}
                              clickable
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
                
                <Box className="dialog-actions">
                  <Button
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    sx={{ backgroundColor: '#9c27b0', '&:hover': { backgroundColor: '#7b1fa2' } }}
                    onClick={() => {
                      handleCloseDialog();
                      window.location.href = `/order/${selectedItem.orderData?.id || selectedItem.id}`;
                    }}
                  >
                    View Full Order Details
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FolderOpenIcon />}
                    onClick={() => {
                      handleCloseDialog();
                      window.location.href = '/';
                    }}
                  >
                    Browse Products
                  </Button>
                </Box>
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
};

export default Portfolio;