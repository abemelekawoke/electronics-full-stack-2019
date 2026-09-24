import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
  IconButton,
  Skeleton,
  Alert,
  Divider,
  Paper,
  Avatar,
  Fade,
  Grow,
  Zoom,
  Container,
  Grid,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import { formatDistanceToNow } from 'date-fns';
import './CurrentNews.css';

const CurrentNews = ({ limit = 3, showAll = false }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [navigating, setNavigating] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setLoading(true);
    api.get('news/')
      .then(response => {
        // ✅ ትክክለኛው መንገድ - response.data ሙሉ ነገር ነው
        const data = response.data;
        console.log('📊 News API Response:', data);
        
        // ✅ ውሂቡን ከ results ወይም ቀጥታ መውሰድ
        let newsData = [];
        if (data && typeof data === 'object') {
          if (Array.isArray(data)) {
            // ቀጥታ አራይ ከሆነ
            newsData = data;
          } else if (data.results && Array.isArray(data.results)) {
            // Pagination ካለ (results ውስጥ ነው)
            newsData = data.results;
          } else {
            // ነጠላ ነገር ከሆነ
            newsData = [data];
          }
        }
        
        console.log('📊 News data array:', newsData);
        console.log('📊 News count:', newsData.length);
        
        // ✅ አሁን newsData አራይ ነው, sort መጠቀም እንችላለን
        if (newsData.length > 0) {
          newsData.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        }
        
        if (showAll) {
          setNews(newsData);
        } else {
          setNews(newsData.slice(0, limit));
        }
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching news:', error);
        setError('Failed to load news. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [limit, showAll]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadTime = (content) => {
    const words = content?.split(/\s+/).length || 200;
    const readTime = Math.ceil(words / 200);
    return `${readTime} min read`;
  };

  const handleReadMore = (newsId) => {
    setNavigating(true);
    navigate(`/news/${newsId}`);
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

  if (loading) {
    return (
      <Box className="news-loading-container">
        <Container maxWidth="xl">
          <Box className="loading-skeletons">
            {[1, 2, 3].map(i => (
              <Card key={i} className="skeleton-card">
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                <CardContent>
                  <Skeleton variant="text" height={30} width="80%" />
                  <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
                  <Skeleton variant="text" height={20} width="90%" />
                  <Skeleton variant="text" height={20} width="70%" />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" className="error-alert-news" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (news.length === 0) {
    return (
      <Container maxWidth="md">
        <Fade in timeout={500}>
          <Paper className="empty-news-paper">
            <NewspaperIcon className="empty-news-icon" />
            <Typography variant="h5" className="empty-news-title">
              No News Available
            </Typography>
            <Typography variant="body1" className="empty-news-message">
              Check back later for updates and announcements
            </Typography>
          </Paper>
        </Fade>
      </Container>
    );
  }

  // Featured news (first item when showAll is false)
  const featuredNews = !showAll && news.length > 0 ? news[0] : null;
  const remainingNews = !showAll && news.length > 1 ? news.slice(1) : (showAll ? news : []);

  // Render media (image/video) for a news item
  const renderNewsMedia = (newsItem, isFeatured = false) => {
    const hasImage = newsItem.image || newsItem.image_url;
    const hasVideo = newsItem.video || newsItem.video_url;
    
    if (!hasImage && !hasVideo) return null;

    const mediaHeight = isFeatured ? 400 : 200;

    return (
      <Box className="news-media-container" sx={{ position: 'relative' }}>
        {hasVideo ? (
          <Box sx={{ position: 'relative', cursor: 'pointer' }} onClick={() => handleVideoClick(newsItem.video_url || newsItem.video)}>
            <CardMedia
              component="img"
              height={mediaHeight}
              image={hasImage || '/video-thumbnail-placeholder.jpg'}
              alt={newsItem.title}
              sx={{ 
                objectFit: 'cover',
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
                width: 60,
                height: 60,
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
              <PlayArrowIcon sx={{ color: 'white', fontSize: 40 }} />
            </Box>
            <Chip
              icon={<VideocamIcon />}
              label="Video"
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
          </Box>
        ) : hasImage ? (
          <Box sx={{ position: 'relative', cursor: 'pointer' }} onClick={() => handleImageClick(newsItem.image_url || newsItem.image)}>
            <CardMedia
              component="img"
              height={mediaHeight}
              image={newsItem.image_url || newsItem.image}
              alt={newsItem.title}
              sx={{ 
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
            />
            <Chip
              icon={<ImageIcon />}
              label="Image"
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
          </Box>
        ) : null}
      </Box>
    );
  };

  return (
    <Box className="news-page">
      {/* Hero Section for showAll mode */}
      {showAll && (
        <Box className="news-hero">
          <Container maxWidth="xl">
            <Fade in timeout={800}>
              <Box className="hero-content-news">
                <Typography variant="overline" className="hero-overline-news">
                  Stay Informed
                </Typography>
                <Typography variant="h1" className="hero-title-news">
                  Latest News
                </Typography>
                <Typography variant="body1" className="hero-description-news">
                  Stay updated with our latest announcements, product launches, and company updates
                </Typography>
                <Chip 
                  label={`${news.length} articles`}
                  className="article-count-chip"
                />
              </Box>
            </Fade>
          </Container>
          <Box className="hero-bg-news" />
        </Box>
      )}

      <Container maxWidth="xl" className="news-container">
        {/* Navigation Section for showAll mode */}
        {showAll && (
          <Box className="news-navigation">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              className="nav-btn-back-news"
            >
              Back
            </Button>
            <Stack direction="row" spacing={2}>
              <Button
                startIcon={<HomeIcon />}
                onClick={() => navigate('/')}
                className="nav-btn-home-news"
              >
                Home
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/devices')}
                startIcon={<TrendingUpIcon />}
                className="nav-btn-shop-news"
              >
                Browse Items
              </Button>
            </Stack>
          </Box>
        )}

        {/* Header for non-showAll mode */}
        {!showAll && (
          <Box className="news-header">
            <Stack direction="row" alignItems="center" spacing={2} className="header-stack">
              <NewspaperIcon className="header-icon" />
              <Typography variant="h4" className="header-title">
                Latest News & Updates
              </Typography>
              <Chip 
                label={`${news.length} new`}
                size="small"
                className="header-chip"
              />
            </Stack>
            <Divider className="header-divider" />
          </Box>
        )}

        {/* Featured News (showAll false mode) */}
        {!showAll && featuredNews && (
          <Grow in timeout={500}>
            <Card className="featured-news-card">
              {renderNewsMedia(featuredNews, true)}
              <Box className="featured-badge">
                <WhatshotIcon />
                <Typography variant="caption">Featured Story</Typography>
              </Box>
              <CardContent className="featured-content">
                <Stack direction="row" spacing={2} className="featured-meta">
                  <Box className="meta-item">
                    <CalendarTodayIcon className="meta-icon" />
                    <Typography variant="caption">{formatDate(featuredNews.published_at)}</Typography>
                  </Box>
                  <Box className="meta-item">
                    <AccessTimeIcon className="meta-icon" />
                    <Typography variant="caption">{getReadTime(featuredNews.description)}</Typography>
                  </Box>
                  <Box className="meta-item">
                    <VisibilityIcon className="meta-icon" />
                    <Typography variant="caption">1.2K views</Typography>
                  </Box>
                </Stack>
                
                <Typography variant="h3" className="featured-title">
                  {featuredNews.title}
                </Typography>
                
                <Typography variant="body1" className="featured-description">
                  {featuredNews.description}
                </Typography>
                
                <Button
                  variant="contained"
                  onClick={() => handleReadMore(featuredNews.id)}
                  className="read-more-btn featured-btn"
                  endIcon={navigating ? <CircularProgress size={20} /> : <ReadMoreIcon />}
                  disabled={navigating}
                >
                  Read Full Story
                </Button>
              </CardContent>
            </Card>
          </Grow>
        )}

        {/* News Grid */}
        <Box className="news-grid">
          {remainingNews.map((newsItem, index) => (
            <Grow in timeout={300 + index * 100} key={newsItem.id}>
              <Card 
                className={`news-card ${hoveredCard === newsItem.id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(newsItem.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {renderNewsMedia(newsItem)}
                <CardContent className="news-card-content">
                  {/* Card Header */}
                  <Box className="news-card-header">
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Chip 
                        label={formatDistanceToNow(new Date(newsItem.published_at), { addSuffix: true })}
                        size="small"
                        className="time-chip"
                      />
                      <IconButton size="small" className="bookmark-btn">
                        <BookmarkBorderIcon />
                      </IconButton>
                    </Stack>
                    
                    <Typography variant="h6" className="news-card-title">
                      {newsItem.title}
                    </Typography>
                    
                    <Typography variant="body2" className="news-card-description">
                      {newsItem.description}
                    </Typography>
                  </Box>
                  
                  {/* Card Footer */}
                  <Box className="news-card-footer">
                    <Divider className="card-divider" />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box className="date-info">
                        <CalendarTodayIcon className="date-icon" />
                        <Typography variant="caption">
                          {formatDate(newsItem.published_at)}
                        </Typography>
                      </Box>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => handleReadMore(newsItem.id)}
                        className="read-more-link"
                        endIcon={<ReadMoreIcon />}
                      >
                        Read More
                      </Button>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          ))}
        </Box>

        {/* See All Link */}
        {!showAll && news.length > 0 && (
          <Box className="see-all-section">
            <Button
              variant="text"
              onClick={() => navigate('/all-news')}
              className="see-all-btn"
              endIcon={<ReadMoreIcon />}
            >
              View All News Articles
            </Button>
          </Box>
        )}

        {/* Bottom Navigation for showAll mode */}
        {showAll && (
          <Box className="bottom-navigation-news">
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                className="bottom-nav-back"
              >
                Go Back
              </Button>
              <Button
                startIcon={<HomeIcon />}
                onClick={() => navigate('/')}
                className="bottom-nav-home"
              >
                Return to Home
              </Button>
            </Stack>
          </Box>
        )}
      </Container>

      {/* Video Dialog */}
      <Dialog
        open={videoDialogOpen}
        onClose={handleCloseVideoDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.9)',
            borderRadius: 2
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
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.8)'
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
            backgroundColor: 'rgba(0,0,0,0.9)',
            borderRadius: 2
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
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.8)'
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
                maxHeight: '90vh',
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

export default CurrentNews;