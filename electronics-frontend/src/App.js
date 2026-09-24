import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
    AppBar, Toolbar, Typography, Box, IconButton, Menu, 
    MenuItem, Button, Container, useTheme, useMediaQuery, 
    Avatar, Tooltip 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Component Imports
import DeviceList from './components/DeviceList';
import DeviceDetail from './components/DeviceDetail';
import OrderForm from './components/OrderForm';
import AboutUs from './components/AboutUs';
import TermsAndConditions from './components/TermsAndConditions';  // ✅ አዲስ
import PrivacyPolicy from './components/PrivacyPolicy';            // ✅ አዲስ
import ContactUs from './components/ContactUs';
import NewsDetail from './components/NewsDetail';
import CurrentNews from './components/CurrentNews';
import Login from './components/Login';
import Signup from './components/Signup';
import OrderHistory from './components/OrderHistory';
import Portfolio from './components/Portfolio';
import Products from './components/Products';
import Services from './components/Services';
import Footer from './components/Footer';
import CustomerChat from './components/CustomerChat';
import { checkAuthStatus, getCurrentUserEmail } from './services/auth';
import './App.css';

// ✅ Scroll to top component
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [userMenuAnchor, setUserMenuAnchor] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authStatus = await checkAuthStatus();
                setIsAuthenticated(authStatus);
                if (authStatus) {
                    setUserEmail(getCurrentUserEmail());
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);
        window.addEventListener('focus', checkAuth);
        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('focus', checkAuth);
        };
    }, []);

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleUserMenu = (event) => setUserMenuAnchor(event.currentTarget);
    const handleClose = () => {
        setAnchorEl(null);
        setUserMenuAnchor(null);
    };

    const handleLogout = async () => {
        handleClose();
        localStorage.clear();
        try {
            await fetch('/api/v1/logout/', { credentials: 'include' });
        } catch (e) { 
            console.log('Logout error:', e); 
        }
        setIsAuthenticated(false);
        setUserEmail('');
        window.location.href = '/';
    };

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        { label: 'Services', path: '/services' },
        { label: 'Portfolio', path: '/portfolio' },
        { label: 'News', path: '/news' },
        { label: 'About', path: '/about-us' },
        { label: 'Contact', path: '/contact-us' },
    ];

    return (
        <Router>
            {/* ✅ Scrolls window to top on route change */}
            <ScrollToTop />

            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--brand-white)' }}>
                {/* Modern AppBar with Brand Blue */}
                <AppBar position="sticky" elevation={0} sx={{ 
                    backgroundColor: 'var(--brand-blue)', 
                    borderBottom: '1px solid rgba(255,255,255,0.1)' 
                }}>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            {/* Logo Section */}
                            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                                    <img src="/parrot.JPG" alt="Logo" style={{ height: 64, width: 90, borderRadius: '60%', objectFit: 'cover', marginRight: 12, marginTop: 6}} />
                                    <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px', display: { xs: 'none', sm: 'block' } }}>
                                    <span style={{ color: 'var(--brand-white)' }}>PARROT </span><span style={{ color: 'var(--brand-orange)' }}> ADVERT</span>
                                    </Typography>
                                </Link>
                            </Box> 

                            {/* Desktop Navigation */}
                            {!isMobile && (
                                <Box sx={{ display: 'flex', gap: 0.5, mr: 2 }}>
                                    {navItems.map((item) => (
                                        <Button 
                                            key={item.label} 
                                            component={Link} 
                                            to={item.path}
                                            sx={{ 
                                                color: 'white', 
                                                fontWeight: 600,
                                                px: 2,
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } 
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                </Box>
                            )}

                            {/* Auth Section */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {isAuthenticated ? (
                                    <>
                                        <Tooltip title={userEmail}>
                                            <IconButton onClick={handleUserMenu} sx={{ p: 0, border: '2px solid var(--brand-orange)' }}>
                                                <Avatar sx={{ bgcolor: 'var(--brand-black)', width: 35, height: 35 }}>
                                                    {userEmail.charAt(0).toUpperCase()}
                                                </Avatar>
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            anchorEl={userMenuAnchor}
                                            open={Boolean(userMenuAnchor)}
                                            onClose={handleClose}
                                            PaperProps={{ sx: { mt: 1.5, minWidth: 180, boxShadow: 'var(--card-hover-shadow)' } }}
                                        >
                                            <MenuItem disabled><Typography variant="caption">{userEmail}</Typography></MenuItem>
                                            <MenuItem component={Link} to="/order-history" onClick={handleClose}>Order History</MenuItem>
                                            <MenuItem onClick={handleLogout} sx={{ color: 'var(--danger-color)', fontWeight: 'bold' }}>Logout</MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <Button 
                                        component={Link} 
                                        to="/login" 
                                        variant="contained"
                                        className="btn-modern-secondary"
                                        sx={{ borderRadius: '4px', px: 3 }}
                                    >
                                        Login
                                    </Button>
                                )}

                                {isMobile && (
                                    <IconButton color="inherit" onClick={handleMenu} sx={{ ml: 1 }}>
                                        <MenuIcon />
                                    </IconButton>
                                )}
                            </Box>

                            {/* Mobile Menu */}
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                                {navItems.map((item) => (
                                    <MenuItem key={item.label} onClick={handleClose} component={Link} to={item.path}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                                {/* ✅ የሞባይል ሜኑ ላይ ያክሉ */}
                                <MenuItem onClick={handleClose} component={Link} to="/terms">
                                    Terms & Conditions
                                </MenuItem>
                                <MenuItem onClick={handleClose} component={Link} to="/privacy">
                                    Privacy Policy
                                </MenuItem>
                            </Menu>
                        </Toolbar>
                    </Container>
                </AppBar>

                {/* Main Content Area */}
                <Box component="main" sx={{ flex: 1, position: 'relative' }} className="bg-pattern">
                    <Routes>
                        <Route path="/" element={<DeviceList />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/device/:id" element={<DeviceDetail />} />
                        <Route path="/order/:deviceId" element={<OrderForm />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route path="/all-news" element={<CurrentNews showAll={true} />} />
                        <Route path="/news/:id" element={<NewsDetail />} />
                        <Route path="/news" element={<CurrentNews />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/order-history" element={<OrderHistory />} />
                        {/* ✅ አዲስ Routes */}
                        <Route path="/terms" element={<TermsAndConditions />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                    </Routes>
                </Box>

                <Footer />
                
                {/* Third Party Chat Component */}
                <CustomerChat propertyId="69b951f55005201c341f2e6a/default" />
            </Box>
        </Router>
    );
}

export default App;