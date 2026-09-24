import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { getCurrentUserEmail, checkAuthStatus } from '../services/auth';
import { 
    Container, TextField, MenuItem, Button, Typography, Alert, 
    Grid, Paper, Box, Stack, Divider, Stepper, Step, StepLabel, 
    StepContent, Card, CardContent, IconButton, Tooltip, Fade, 
    Grow, Chip, Avatar, LinearProgress, Radio, RadioGroup, 
    FormControlLabel, FormControl, FormLabel, ToggleButton,
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Dialog, DialogTitle, DialogContent, DialogActions,
    InputAdornment
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DiscountIcon from '@mui/icons-material/LocalOffer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StraightenIcon from '@mui/icons-material/Straighten';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import DescriptionIcon from '@mui/icons-material/Description';
import './OrderForm.css';

// ============ CONSTANTS ============
const genderOptions = [
    { value: 'kids', label: 'Kids' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
];

const sizeOptions = [
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: '2XL', label: '2XL' },
    { value: '3XL', label: '3XL' },
    { value: '4XL', label: '4XL' },
    { value: 'custom', label: 'Custom' },
    { value: 'other', label: 'Other' }
];

const colorOptions = [
    { value: 'black', label: 'Black', colorCode: '#000000' },
    { value: 'white', label: 'White', colorCode: '#ffffff' },
    { value: 'red', label: 'Red', colorCode: '#ff0000' },
    { value: 'blue', label: 'Blue', colorCode: '#0000ff' },
    { value: 'green', label: 'Green', colorCode: '#00ff00' },
    { value: 'yellow', label: 'Yellow', colorCode: '#ffff00' },
    { value: 'orange', label: 'Orange', colorCode: '#ff8f00' },
    { value: 'purple', label: 'Purple', colorCode: '#800080' },
    { value: 'pink', label: 'Pink', colorCode: '#ff69b4' },
    { value: 'gray', label: 'Gray', colorCode: '#808080' },
    { value: 'navy', label: 'Navy', colorCode: '#000080' },
    { value: 'brown', label: 'Brown', colorCode: '#8b4513' },
    { value: 'custom', label: 'Custom', colorCode: '#cccccc' }
];

const deliveryDateOptions = [
    { value: 'less_than_1_day', label: '🚀 Urgent (Less than 1 day)' },
    { value: '2_to_3_days', label: '📦 Standard (2-3 days)' },
    { value: '7_days', label: '📬 Economy (7 days)' },
    { value: '14_days', label: '🚢 Budget (14 days)' },
    { value: '1_month', label: '⏰ Monthly (1 month)' },
    { value: 'more_than_1_month', label: '📅 Extended (>1 month)' }
];

// Helper function to check if fields should be shown based on device page
const shouldShowField = (devicePage, fieldGroup) => {
    if (!devicePage) return true;
    
    switch(devicePage) {
        case 'MATERIAL':
            return !['gender', 'size', 'service_sizes', 'design_images', 'left_right_images'].includes(fieldGroup);
        case 'CLOTHING':
            return !['service_sizes'].includes(fieldGroup);
        case 'SERVICE':
            return !['gender', 'size'].includes(fieldGroup);
        default:
            return true;
    }
};

// Helper function to get display fields based on device page
const getDisplayFields = (devicePage) => {
    if (!devicePage) return { 
        showGender: true, 
        showSize: true, 
        showServiceSizes: true, 
        showDesignImages: true, 
        showSampleDesign: true,
        showLeftRightImages: true 
    };
    
    switch(devicePage) {
        case 'MATERIAL':
            return { 
                showGender: false, 
                showSize: false, 
                showServiceSizes: false, 
                showDesignImages: false, 
                showSampleDesign: true,
                showLeftRightImages: false 
            };
        case 'CLOTHING':
            return { 
                showGender: true, 
                showSize: true, 
                showServiceSizes: false, 
                showDesignImages: true, 
                showSampleDesign: true,
                showLeftRightImages: true 
            };
        case 'SERVICE':
            return { 
                showGender: false, 
                showSize: false, 
                showServiceSizes: true, 
                showDesignImages: true,
                showSampleDesign: true,
                showLeftRightImages: true
            };
        default:
            return { 
                showGender: true, 
                showSize: true, 
                showServiceSizes: true, 
                showDesignImages: true, 
                showSampleDesign: true,
                showLeftRightImages: true 
            };
    }
};

const OrderForm = () => {
    const params = useParams();
    const navigate = useNavigate();
    const deviceIdFromParams = params.deviceId;
    
    // ============ STATE ============
    // Product Selection - auto-loaded from URL
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [selectedDevicePage, setSelectedDevicePage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Product Customization
    const [selectedGender, setSelectedGender] = useState('male');
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('black');
    const [quantity, setQuantity] = useState(1);
    
    // Service-specific fields
    const [serviceSizeWidth, setServiceSizeWidth] = useState('');
    const [serviceSizeHeight, setServiceSizeHeight] = useState('');
    const [serviceSize, setServiceSize] = useState('');
    
    // Image upload states - Front & Back
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [frontPreview, setFrontPreview] = useState(null);
    const [backPreview, setBackPreview] = useState(null);
    const [frontImageError, setFrontImageError] = useState('');
    const [backImageError, setBackImageError] = useState('');
    
    // Image upload states - Left & Right
    const [leftImage, setLeftImage] = useState(null);
    const [rightImage, setRightImage] = useState(null);
    const [leftPreview, setLeftPreview] = useState(null);
    const [rightPreview, setRightPreview] = useState(null);
    const [leftImageError, setLeftImageError] = useState('');
    const [rightImageError, setRightImageError] = useState('');
    
    // Sample Design Image (for all pages - MATERIAL, CLOTHING, SERVICE)
    const [sampleDesignImage, setSampleDesignImage] = useState(null);
    const [sampleDesignPreview, setSampleDesignPreview] = useState(null);
    const [sampleDesignError, setSampleDesignError] = useState('');
    
    // Cart Items
    const [cartItems, setCartItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    
    // Order Details (shared across all items)
    const [deliveryDate, setDeliveryDate] = useState('2_to_3_days');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [shipDate, setShipDate] = useState('');
    const [description, setDescription] = useState('');
    
    // UI State
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [submittingOrders, setSubmittingOrders] = useState(false);
    
    // Image preview dialog
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState('');
    const [previewImageTitle, setPreviewImageTitle] = useState('');
    
    // ============ HELPER FUNCTIONS ============
    const calculatePercentage = (qty, ddate) => {
        const quantityNum = parseInt(qty) || 1;
        
        if (quantityNum <= 10) {
            if (ddate === 'less_than_1_day') return 130;
            if (ddate === '2_to_3_days') return 100;
            if (ddate === '7_days') return 95;
            if (ddate === '14_days') return 90;
            if (ddate === '1_month') return 87;
            if (ddate === 'more_than_1_month') return 83;
        } else {
            if (ddate === 'less_than_1_day') return 120;
            if (ddate === '2_to_3_days') return 95;
            if (ddate === '7_days') return 93;
            if (ddate === '14_days') return 90;
            if (ddate === '1_month') return 87;
            if (ddate === 'more_than_1_month') return 83;
        }
        return 100;
    };
    
    const baseTotal = selectedDevice ? quantity * selectedDevice.price : 0;
    const calculatedPercentage = calculatePercentage(quantity, deliveryDate);
    const finalTotal = baseTotal * calculatedPercentage / 100;
    const cartTotal = cartItems.reduce((sum, item) => sum + item.total_price, 0);
    
    // ============ IMAGE HANDLING ============
    const handleFrontImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setFrontImageError('Please upload a valid image (JPEG, PNG, GIF, WEBP)');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            setFrontImageError('Image size should be less than 5MB');
            return;
        }
        
        setFrontImageError('');
        setFrontImage(file);
        setFrontPreview(URL.createObjectURL(file));
    };
    
    const handleBackImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setBackImageError('Please upload a valid image (JPEG, PNG, GIF, WEBP)');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            setBackImageError('Image size should be less than 5MB');
            return;
        }
        
        setBackImageError('');
        setBackImage(file);
        setBackPreview(URL.createObjectURL(file));
    };
    
    const handleLeftImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setLeftImageError('Please upload a valid image (JPEG, PNG, GIF, WEBP)');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            setLeftImageError('Image size should be less than 5MB');
            return;
        }
        
        setLeftImageError('');
        setLeftImage(file);
        setLeftPreview(URL.createObjectURL(file));
    };
    
    const handleRightImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setRightImageError('Please upload a valid image (JPEG, PNG, GIF, WEBP)');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            setRightImageError('Image size should be less than 5MB');
            return;
        }
        
        setRightImageError('');
        setRightImage(file);
        setRightPreview(URL.createObjectURL(file));
    };
    
    const handleSampleDesignChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setSampleDesignError('Please upload a valid image (JPEG, PNG, GIF, WEBP)');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            setSampleDesignError('Image size should be less than 5MB');
            return;
        }
        
        setSampleDesignError('');
        setSampleDesignImage(file);
        setSampleDesignPreview(URL.createObjectURL(file));
    };
    
    const removeFrontImage = () => {
        if (frontPreview) URL.revokeObjectURL(frontPreview);
        setFrontImage(null);
        setFrontPreview(null);
        setFrontImageError('');
    };
    
    const removeBackImage = () => {
        if (backPreview) URL.revokeObjectURL(backPreview);
        setBackImage(null);
        setBackPreview(null);
        setBackImageError('');
    };
    
    const removeLeftImage = () => {
        if (leftPreview) URL.revokeObjectURL(leftPreview);
        setLeftImage(null);
        setLeftPreview(null);
        setLeftImageError('');
    };
    
    const removeRightImage = () => {
        if (rightPreview) URL.revokeObjectURL(rightPreview);
        setRightImage(null);
        setRightPreview(null);
        setRightImageError('');
    };
    
    const removeSampleDesign = () => {
        if (sampleDesignPreview) URL.revokeObjectURL(sampleDesignPreview);
        setSampleDesignImage(null);
        setSampleDesignPreview(null);
        setSampleDesignError('');
    };
    
    const openImagePreview = (url, title) => {
        setPreviewImageUrl(url);
        setPreviewImageTitle(title);
        setPreviewDialogOpen(true);
    };
    
    // ============ API INTEGRATION ============
    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await checkAuthStatus();
            setIsAuthenticated(authStatus);
            
            if (authStatus) {
                const userEmail = getCurrentUserEmail();
                if (userEmail) setEmail(userEmail);
            }
        };
        checkAuth();
    }, []);
    
    useEffect(() => {
        return () => {
            cartItems.forEach(item => {
                if (item.frontPreview) URL.revokeObjectURL(item.frontPreview);
                if (item.backPreview) URL.revokeObjectURL(item.backPreview);
                if (item.leftPreview) URL.revokeObjectURL(item.leftPreview);
                if (item.rightPreview) URL.revokeObjectURL(item.rightPreview);
                if (item.sampleDesignPreview) URL.revokeObjectURL(item.sampleDesignPreview);
            });
            if (frontPreview) URL.revokeObjectURL(frontPreview);
            if (backPreview) URL.revokeObjectURL(backPreview);
            if (leftPreview) URL.revokeObjectURL(leftPreview);
            if (rightPreview) URL.revokeObjectURL(rightPreview);
            if (sampleDesignPreview) URL.revokeObjectURL(sampleDesignPreview);
        };
    }, [cartItems, frontPreview, backPreview, leftPreview, rightPreview, sampleDesignPreview]);
    
    // ============ FETCH DEVICE FROM URL ============
    useEffect(() => {
        const fetchDevice = async () => {
            if (!deviceIdFromParams) {
                setError('No device specified');
                setLoading(false);
                return;
            }
            
            setLoading(true);
            try {
                const response = await api.get(`devices/${deviceIdFromParams}/`);
                const device = response.data;
                
                if (device) {
                    console.log('Device loaded:', device.name);
                    setSelectedDevice(device);
                    setSelectedDevicePage(device.page);
                } else {
                    setError('Device not found');
                }
            } catch (error) {
                console.error('Error fetching device:', error);
                setError('Failed to load device details. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchDevice();
    }, [deviceIdFromParams]);
    
    // ============ SERVICE SIZE CALCULATION ============
    useEffect(() => {
        const width = parseFloat(serviceSizeWidth);
        const height = parseFloat(serviceSizeHeight);

        if (!isNaN(width) && !isNaN(height)) {
            const area = Number((width * height).toFixed(2));
            setServiceSize(area.toString());
        } else {
            setServiceSize('');
        }
    }, [serviceSizeWidth, serviceSizeHeight]);
    
    // ============ ADD TO CART ============
    const addToCart = async () => {
        if (!selectedDevice) {
            setErrorMessage('Please select a device first');
            return;
        }
        
        setUploadingImages(true);
        
        try {
            const displayFields = getDisplayFields(selectedDevice.page);
            
            const newItem = {
                id: Date.now(),
                device: selectedDevice.id,
                deviceName: selectedDevice.name,
                devicePrice: selectedDevice.price,
                devicePage: selectedDevice.page,
                itemStatus: selectedDevice.item_status || 'new',
                // Use the device's item_status as the order type
                type: selectedDevice.item_status || 'new',
                quantity: quantity,
                delivery_date: deliveryDate,
                gender: displayFields.showGender ? selectedGender : null,
                size: displayFields.showSize ? selectedSize : null,
                color: selectedColor,
                service_size_width: displayFields.showServiceSizes ? serviceSizeWidth : null,
                service_size_height: displayFields.showServiceSizes ? serviceSizeHeight : null,
                service_size: displayFields.showServiceSizes ? serviceSize : null,
                sampleDesignImage: sampleDesignImage,
                sampleDesignPreview: sampleDesignPreview,
                frontImage: displayFields.showDesignImages ? frontImage : null,
                backImage: displayFields.showDesignImages ? backImage : null,
                frontPreview: displayFields.showDesignImages ? frontPreview : null,
                backPreview: displayFields.showDesignImages ? backPreview : null,
                leftImage: displayFields.showLeftRightImages ? leftImage : null,
                rightImage: displayFields.showLeftRightImages ? rightImage : null,
                leftPreview: displayFields.showLeftRightImages ? leftPreview : null,
                rightPreview: displayFields.showLeftRightImages ? rightPreview : null,
                base_price: baseTotal,
                calculated_percentage: calculatedPercentage,
                total_price: finalTotal,
                description: description
            };
            
            setCartItems([...cartItems, newItem]);
            
            // Reset form
            setQuantity(1);
            setSelectedGender('male');
            setSelectedSize('M');
            setSelectedColor('black');
            setServiceSizeWidth('');
            setServiceSizeHeight('');
            setServiceSize('');
            setDescription('');
            removeFrontImage();
            removeBackImage();
            removeLeftImage();
            removeRightImage();
            removeSampleDesign();
            
            setSuccessMessage('Item added to cart!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error adding to cart:', error);
            setErrorMessage('Failed to add item to cart');
        } finally {
            setUploadingImages(false);
        }
    };
    
    const removeFromCart = (id) => {
        const item = cartItems.find(i => i.id === id);
        if (item) {
            if (item.frontPreview) URL.revokeObjectURL(item.frontPreview);
            if (item.backPreview) URL.revokeObjectURL(item.backPreview);
            if (item.leftPreview) URL.revokeObjectURL(item.leftPreview);
            if (item.rightPreview) URL.revokeObjectURL(item.rightPreview);
            if (item.sampleDesignPreview) URL.revokeObjectURL(item.sampleDesignPreview);
        }
        setCartItems(cartItems.filter(item => item.id !== id));
    };
    
    const openEditDialog = (item) => {
        setEditingItem(item);
        setSelectedGender(item.gender || 'male');
        setSelectedSize(item.size || 'M');
        setSelectedColor(item.color || 'black');
        setQuantity(item.quantity);
        setServiceSizeWidth(item.service_size_width || '');
        setServiceSizeHeight(item.service_size_height || '');
        setServiceSize(item.service_size || '');
        setDescription(item.description || '');
        if (item.frontPreview) setFrontPreview(item.frontPreview);
        if (item.backPreview) setBackPreview(item.backPreview);
        if (item.leftPreview) setLeftPreview(item.leftPreview);
        if (item.rightPreview) setRightPreview(item.rightPreview);
        if (item.sampleDesignPreview) setSampleDesignPreview(item.sampleDesignPreview);
        setEditDialogOpen(true);
    };
    
    const updateCartItem = () => {
        if (editingItem) {
            const displayFields = getDisplayFields(editingItem.devicePage);
            const newBaseTotal = editingItem.devicePrice * quantity;
            const newCalculatedPercentage = calculatePercentage(quantity, deliveryDate);
            const newFinalTotal = newBaseTotal * newCalculatedPercentage / 100;
            
            const updatedItem = {
                ...editingItem,
                quantity: quantity,
                gender: displayFields.showGender ? selectedGender : null,
                size: displayFields.showSize ? selectedSize : null,
                color: selectedColor,
                service_size_width: displayFields.showServiceSizes ? serviceSizeWidth : null,
                service_size_height: displayFields.showServiceSizes ? serviceSizeHeight : null,
                service_size: displayFields.showServiceSizes ? serviceSize : null,
                sampleDesignImage: sampleDesignImage || editingItem.sampleDesignImage,
                sampleDesignPreview: sampleDesignPreview || editingItem.sampleDesignPreview,
                frontImage: frontImage || editingItem.frontImage,
                backImage: backImage || editingItem.backImage,
                frontPreview: frontPreview || editingItem.frontPreview,
                backPreview: backPreview || editingItem.backPreview,
                leftImage: leftImage || editingItem.leftImage,
                rightImage: rightImage || editingItem.rightImage,
                leftPreview: leftPreview || editingItem.leftPreview,
                rightPreview: rightPreview || editingItem.rightPreview,
                base_price: newBaseTotal,
                calculated_percentage: newCalculatedPercentage,
                total_price: newFinalTotal,
                description: description
            };
            
            setCartItems(cartItems.map(item => 
                item.id === editingItem.id ? updatedItem : item
            ));
            setEditDialogOpen(false);
            setEditingItem(null);
            removeFrontImage();
            removeBackImage();
            removeLeftImage();
            removeRightImage();
            removeSampleDesign();
            setDescription('');
            setSuccessMessage('Item updated!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };
    
    // Submit orders
    const handleSubmitOrders = async () => {
        if (cartItems.length === 0) {
            setErrorMessage('Please add at least one item to your cart');
            return;
        }
        
        if (!name || !phone || !address) {
            setErrorMessage('Please fill in all required fields');
            return;
        }
        
        setErrorMessage('');
        setSuccessMessage('');
        setSubmittingOrders(true);
        
        try {
            const orderPromises = cartItems.map(async (item) => {
                const formData = new FormData();
                
                // Required fields
                formData.append('device', item.device);
                formData.append('quantity', item.quantity);
                // Use the item's type (which came from device item_status)
                formData.append('type', item.type || 'new');
                formData.append('delivery_date', deliveryDate);
                formData.append('name', name);
                formData.append('email', email);
                formData.append('phone', phone);
                formData.append('address', address);
                
                // Optional fields - only if they exist
                if (item.gender) formData.append('gender', item.gender);
                if (item.size) formData.append('size', item.size);
                if (item.color) formData.append('color', item.color);
                if (item.service_size_width) formData.append('service_size_width', item.service_size_width);
                if (item.service_size_height) formData.append('service_size_height', item.service_size_height);
                if (item.service_size) formData.append('service_size', item.service_size);
                if (shipDate) formData.append('ship_date', shipDate);
                if (item.description) formData.append('description', item.description);
                
                // Sample Design - available for all pages
                if (item.sampleDesignImage && item.sampleDesignImage instanceof File) {
                    formData.append('sample_design', item.sampleDesignImage);
                }
                
                // Front/Back Design - available for CLOTHING and SERVICE
                if (item.frontImage && item.frontImage instanceof File) {
                    formData.append('front', item.frontImage);
                }
                if (item.backImage && item.backImage instanceof File) {
                    formData.append('back', item.backImage);
                }
                
                // Left/Right Images - available for CLOTHING and SERVICE
                if (item.leftImage && item.leftImage instanceof File) {
                    formData.append('left_image', item.leftImage);
                }
                if (item.rightImage && item.rightImage instanceof File) {
                    formData.append('right_image', item.rightImage);
                }
                
                return api.post('orders/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            });
            
            await Promise.all(orderPromises);
            
            setSuccessMessage(`${cartItems.length} order(s) placed successfully!`);
            
            cartItems.forEach(item => {
                if (item.frontPreview) URL.revokeObjectURL(item.frontPreview);
                if (item.backPreview) URL.revokeObjectURL(item.backPreview);
                if (item.leftPreview) URL.revokeObjectURL(item.leftPreview);
                if (item.rightPreview) URL.revokeObjectURL(item.rightPreview);
                if (item.sampleDesignPreview) URL.revokeObjectURL(item.sampleDesignPreview);
            });
            setCartItems([]);
            
            setTimeout(() => {
                navigate('/order-history');
            }, 3000);
        } catch (error) {
            console.error('Error placing orders:', error);
            const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
            setErrorMessage(`Failed to place orders: ${errorMsg}`);
        } finally {
            setSubmittingOrders(false);
        }
    };
    
    const handleBack = () => {
        if (deviceIdFromParams) navigate(-1);
        else navigate('/');
    };
    
    const getPercentageColor = (percentage) => {
        if (percentage > 100) return 'error';
        if (percentage < 100) return 'success';
        return 'info';
    };
    
    const getPercentageIcon = (percentage) => {
        if (percentage > 100) return <TrendingUpIcon />;
        if (percentage < 100) return <TrendingDownIcon />;
        return <DiscountIcon />;
    };
    
    // ============ RENDER ============
    if (loading) {
        return (
            <Box className="order-loading-container">
                <Container maxWidth="lg">
                    <Paper className="loading-paper">
                        <LinearProgress />
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="h6">Loading device details...</Typography>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        );
    }
    
    if (error) {
        return (
            <Box className="order-page">
                <Container maxWidth="md">
                    <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
                        <Typography variant="h5" color="error" gutterBottom>
                            {error}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Please go back and select a device to order.
                        </Typography>
                        <Button 
                            variant="contained" 
                            onClick={() => navigate(-1)}
                            startIcon={<ArrowBackIcon />}
                        >
                            Go Back
                        </Button>
                    </Paper>
                </Container>
            </Box>
        );
    }
    
    if (!isAuthenticated) {
        return (
            <Box className="order-page">
                <Container maxWidth="md">
                    <Fade in timeout={500}>
                        <Box>
                            <Box className="order-nav-top">
                                <Button startIcon={<ArrowBackIcon />} onClick={handleBack} className="nav-btn-back-order">Back</Button>
                                <Button startIcon={<HomeIcon />} onClick={() => navigate('/')} className="nav-btn-home-order">Home</Button>
                            </Box>
                            <Paper className="auth-required-paper">
                                <Box className="auth-required-content">
                                    <Avatar className="auth-icon"><LoginIcon /></Avatar>
                                    <Typography variant="h4" className="auth-title">Login Required</Typography>
                                    <Typography variant="body1" className="auth-message">
                                        You must be logged in to place an order.
                                    </Typography>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className="auth-buttons">
                                        <Button variant="contained" startIcon={<LoginIcon />} component={Link} to="/login">Login</Button>
                                        <Button variant="outlined" startIcon={<PersonAddIcon />} component={Link} to="/signup">Sign Up</Button>
                                    </Stack>
                                </Box>
                            </Paper>
                        </Box>
                    </Fade>
                </Container>
            </Box>
        );
    }
    
    return (
        <Box className="order-page">
            <Container maxWidth="lg">
                <Fade in timeout={500}>
                    <Box>
                        {/* Navigation */}
                        <Box className="order-nav-top">
                            <Button startIcon={<ArrowBackIcon />} onClick={handleBack} className="nav-btn-back-order">Back</Button>
                            <Button startIcon={<HomeIcon />} onClick={() => navigate('/')} className="nav-btn-home-order">Home</Button>
                        </Box>
                        
                        {/* Header */}
                        <Box className="order-header">
                            <Typography variant="h2" className="order-title">Place Your Order</Typography>
                            <Typography variant="body1" className="order-subtitle">
                                {selectedDevice ? `Ordering: ${selectedDevice.name}` : 'Add items to cart with custom options'}
                            </Typography>
                        </Box>
                        
                        {/* Device Info Card */}
                        {selectedDevice && (
                            <Paper sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={8}>
                                        <Typography variant="h5" fontWeight="bold">{selectedDevice.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Category: {selectedDevice.page} | Price: ETB {selectedDevice.price?.toLocaleString() || selectedDevice.price}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Status: {selectedDevice.item_status || 'New'} | Stock: {selectedDevice.stock || 'Unlimited'}
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                            <Chip 
                                                size="small" 
                                                label={`Type: ${selectedDevice.item_status || 'New'}`}
                                                sx={{ backgroundColor: '#e3f2fd' }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                                        <Chip 
                                            label={selectedDevice.page} 
                                            sx={{ 
                                                backgroundColor: selectedDevice.page === 'MATERIAL' ? '#e3f2fd' : 
                                                               selectedDevice.page === 'CLOTHING' ? '#fce4ec' : 
                                                               selectedDevice.page === 'SERVICE' ? '#e8f5e9' : '#f5f5f5',
                                                fontWeight: 'bold'
                                            }} 
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        )}
                        
                        <Paper className="order-form-paper">
                            {successMessage && <Alert severity="success" className="order-alert success-alert">{successMessage}</Alert>}
                            {errorMessage && <Alert severity="error" className="order-alert error-alert">{errorMessage}</Alert>}
                            {(uploadingImages || submittingOrders) && <LinearProgress sx={{ mb: 2 }} />}
                            
                            {/* Customize Order */}
                            {selectedDevice && (
                                <Grow in>
                                    <Box className="step-content">
                                        <Typography variant="h6" className="step-title">Customize Your Item</Typography>
                                        
                                        <Grid container spacing={3}>
                                            {/* ====== GENDER - Hidden for MATERIAL and SERVICE ====== */}
                                            {shouldShowField(selectedDevice.page, 'gender') && (
                                                <Grid item xs={12}>
                                                    <FormControl component="fieldset" className="option-group">
                                                        <FormLabel component="legend">Gender / Fit</FormLabel>
                                                        <RadioGroup row value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                                                            {genderOptions.map(option => (
                                                                <FormControlLabel 
                                                                    key={option.value}
                                                                    value={option.value}
                                                                    control={<Radio />}
                                                                    label={option.label}
                                                                />
                                                            ))}
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid>
                                            )}
                                            
                                            {/* ====== SIZE - Hidden for MATERIAL and SERVICE ====== */}
                                            {shouldShowField(selectedDevice.page, 'size') && (
                                                <Grid item xs={12}>
                                                    <FormControl component="fieldset" className="option-group">
                                                        <FormLabel component="legend">Size</FormLabel>
                                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                            {sizeOptions.map(option => (
                                                                <ToggleButton                                                                    key={option.value}
                                                                    value={option.value}
                                                                    selected={selectedSize === option.value}
                                                                    onChange={() => setSelectedSize(option.value)}
                                                                    className={`size-btn ${selectedSize === option.value ? 'active' : ''}`}
                                                                >
                                                                    {option.label}
                                                                </ToggleButton>
                                                            ))}
                                                        </Box>
                                                    </FormControl>
                                                </Grid>
                                            )}
                                            
                                            {/* ====== COLOR - Always shown ====== */}
                                            <Grid item xs={12}>
                                                <FormControl component="fieldset" className="option-group">
                                                    <FormLabel component="legend">Color</FormLabel>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        {colorOptions.map(option => (
                                                            <Tooltip key={option.value} title={option.label}>
                                                                <Box
                                                                    className={`color-swatch ${selectedColor === option.value ? 'active' : ''}`}
                                                                    sx={{
                                                                        backgroundColor: option.colorCode,
                                                                        width: 40,
                                                                        height: 40,
                                                                        borderRadius: '50%',
                                                                        cursor: 'pointer',
                                                                        border: selectedColor === option.value ? '3px solid #0046be' : '2px solid #ddd',
                                                                        transition: 'all 0.2s ease'
                                                                    }}
                                                                    onClick={() => setSelectedColor(option.value)}
                                                                />
                                                            </Tooltip>
                                                        ))}
                                                    </Box>
                                                </FormControl>
                                            </Grid>
                                            
                                            {/* ====== SERVICE SIZES - Only for SERVICE ====== */}
                                            {shouldShowField(selectedDevice.page, 'service_sizes') && (
                                                <>
                                                    <Grid item xs={12}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1 }}>
                                                            Service Dimensions
                                                        </Typography>
                                                    </Grid>

                                                    <Grid item xs={12} sm={4}>
                                                        <TextField
                                                            label="Width (meters)"
                                                            type="number"
                                                            value={serviceSizeWidth}
                                                            onChange={(e) => setServiceSizeWidth(e.target.value)}
                                                            fullWidth
                                                            variant="outlined"
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start"><StraightenIcon /></InputAdornment>
                                                            }}
                                                            helperText="Enter width in meters"
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={4}>
                                                        <TextField
                                                            label="Height (meters)"
                                                            type="number"
                                                            value={serviceSizeHeight}
                                                            onChange={(e) => setServiceSizeHeight(e.target.value)}
                                                            fullWidth
                                                            variant="outlined"
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start"><StraightenIcon /></InputAdornment>
                                                            }}
                                                            helperText="Enter height in meters"
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} sm={4}>
                                                        <TextField
                                                            label="Total Size (sq meters)"
                                                            value={serviceSize}
                                                            fullWidth
                                                            variant="outlined"
                                                            InputProps={{
                                                                readOnly: true,
                                                                startAdornment: <InputAdornment position="start"><CropSquareIcon /></InputAdornment>
                                                            }}
                                                            helperText="Calculated automatically (Width × Height)"
                                                        />
                                                    </Grid>
                                                </>
                                            )}
                                            
                                            {/* ====== QUANTITY - Always shown ====== */}
                                            <Grid item xs={12} sm={6}>
                                                <FormControl component="fieldset" className="option-group">
                                                    <FormLabel component="legend">Quantity</FormLabel>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                                                            <RemoveIcon />
                                                        </IconButton>
                                                        <Typography variant="h5" sx={{ minWidth: 50, textAlign: 'center' }}>{quantity}</Typography>
                                                        <IconButton onClick={() => setQuantity(quantity + 1)}>
                                                            <AddIcon />
                                                        </IconButton>
                                                    </Box>
                                                </FormControl>
                                            </Grid>
                                            
                                            {/* ====== SAMPLE DESIGN - Available for ALL pages ====== */}
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                                    Sample Design <span style={{ fontWeight: 'normal', color: '#666' }}>(Optional)</span>
                                                </Typography>
                                                <Paper className="image-upload-paper" sx={{ p: 2, textAlign: 'center', border: '2px dashed #ccc', borderRadius: 2 }}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleSampleDesignChange}
                                                        style={{ display: 'none' }}
                                                        id="sample-design-upload"
                                                    />
                                                    <label htmlFor="sample-design-upload">
                                                        <Button
                                                            variant="outlined"
                                                            component="span"
                                                            startIcon={<CloudUploadIcon />}
                                                            fullWidth
                                                        >
                                                            Upload Sample Design
                                                        </Button>
                                                    </label>
                                                    
                                                    {sampleDesignError && (
                                                        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                                                            {sampleDesignError}
                                                        </Typography>
                                                    )}
                                                    
                                                    {sampleDesignPreview && (
                                                        <Box sx={{ mt: 2, position: 'relative' }}>
                                                            <img 
                                                                src={sampleDesignPreview} 
                                                                alt="Sample design preview" 
                                                                style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 8, cursor: 'pointer' }}
                                                                onClick={() => openImagePreview(sampleDesignPreview, 'Sample Design')}
                                                            />
                                                            <IconButton
                                                                size="small"
                                                                sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                                                                onClick={removeSampleDesign}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                            <Tooltip title="View Full Size">
                                                                <IconButton
                                                                    size="small"
                                                                    sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                                                                    onClick={() => openImagePreview(sampleDesignPreview, 'Sample Design')}
                                                                >
                                                                    <VisibilityIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    )}
                                                </Paper>
                                            </Grid>
                                            
                                            {/* ====== DESIGN IMAGES (Front, Back, Left, Right) - Available for CLOTHING and SERVICE ====== */}
                                            {shouldShowField(selectedDevice.page, 'design_images') && (
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                                        Design Images <span style={{ fontWeight: 'normal', color: '#666' }}>(Optional)</span>
                                                    </Typography>
                                                    <Grid container spacing={2}>
                                                        {/* Front Image Upload */}
                                                        <Grid item xs={12} sm={6}>
                                                            <Paper className="image-upload-paper" sx={{ p: 2, textAlign: 'center', border: '2px dashed #ccc', borderRadius: 2 }}>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleFrontImageChange}
                                                                    style={{ display: 'none' }}
                                                                    id="front-image-upload"
                                                                />
                                                                <label htmlFor="front-image-upload">
                                                                    <Button
                                                                        variant="outlined"
                                                                        component="span"
                                                                        startIcon={<CloudUploadIcon />}
                                                                        fullWidth
                                                                    >
                                                                        Upload Front Design
                                                                    </Button>
                                                                </label>
                                                                
                                                                {frontImageError && (
                                                                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                                                                        {frontImageError}
                                                                    </Typography>
                                                                )}
                                                                
                                                                {frontPreview && (
                                                                    <Box sx={{ mt: 2, position: 'relative' }}>
                                                                        <img 
                                                                            src={frontPreview} 
                                                                            alt="Front design preview" 
                                                                            style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain', borderRadius: 8, cursor: 'pointer' }}
                                                                            onClick={() => openImagePreview(frontPreview, 'Front Design')}
                                                                        />
                                                                        <IconButton
                                                                            size="small"
                                                                            sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                                                                            onClick={removeFrontImage}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                        <Tooltip title="View Full Size">
                                                                            <IconButton
                                                                                size="small"
                                                                                sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                                                                                onClick={() => openImagePreview(frontPreview, 'Front Design')}
                                                                            >
                                                                                <VisibilityIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Box>
                                                                )}
                                                            </Paper>
                                                        </Grid>
                                                        
                                                        {/* Back Image Upload */}
                                                        <Grid item xs={12} sm={6}>
                                                            <Paper className="image-upload-paper" sx={{ p: 2, textAlign: 'center', border: '2px dashed #ccc', borderRadius: 2 }}>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleBackImageChange}
                                                                    style={{ display: 'none' }}
                                                                    id="back-image-upload"
                                                                />
                                                                <label htmlFor="back-image-upload">
                                                                    <Button
                                                                        variant="outlined"
                                                                        component="span"
                                                                        startIcon={<CloudUploadIcon />}
                                                                        fullWidth
                                                                    >
                                                                        Upload Back Design
                                                                    </Button>
                                                                </label>
                                                                
                                                                {backImageError && (
                                                                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                                                                        {backImageError}
                                                                    </Typography>
                                                                )}
                                                                
                                                                {backPreview && (
                                                                    <Box sx={{ mt: 2, position: 'relative' }}>
                                                                        <img 
                                                                            src={backPreview} 
                                                                            alt="Back design preview" 
                                                                            style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain', borderRadius: 8, cursor: 'pointer' }}
                                                                            onClick={() => openImagePreview(backPreview, 'Back Design')}
                                                                        />
                                                                        <IconButton
                                                                            size="small"
                                                                            sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                                                                            onClick={removeBackImage}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                        <Tooltip title="View Full Size">
                                                                            <IconButton
                                                                                size="small"
                                                                                sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                                                                                onClick={() => openImagePreview(backPreview, 'Back Design')}
                                                                            >
                                                                                <VisibilityIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Box>
                                                                )}
                                                            </Paper>
                                                        </Grid>

                                                        {/* Left Image Upload */}
                                                        <Grid item xs={12} sm={6}>
                                                            <Paper className="image-upload-paper" sx={{ p: 2, textAlign: 'center', border: '2px dashed #ccc', borderRadius: 2 }}>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleLeftImageChange}
                                                                    style={{ display: 'none' }}
                                                                    id="left-image-upload"
                                                                />
                                                                <label htmlFor="left-image-upload">
                                                                    <Button
                                                                        variant="outlined"
                                                                        component="span"
                                                                        startIcon={<CloudUploadIcon />}
                                                                        fullWidth
                                                                    >
                                                                        Upload Left Design
                                                                    </Button>
                                                                </label>
                                                                
                                                                {leftImageError && (
                                                                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                                                                        {leftImageError}
                                                                    </Typography>
                                                                )}
                                                                
                                                                {leftPreview && (
                                                                    <Box sx={{ mt: 2, position: 'relative' }}>
                                                                        <img 
                                                                            src={leftPreview} 
                                                                            alt="Left design preview" 
                                                                            style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain', borderRadius: 8, cursor: 'pointer' }}
                                                                            onClick={() => openImagePreview(leftPreview, 'Left Design')}
                                                                        />
                                                                        <IconButton
                                                                            size="small"
                                                                            sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                                                                            onClick={removeLeftImage}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                        <Tooltip title="View Full Size">
                                                                            <IconButton
                                                                                size="small"
                                                                                sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                                                                                onClick={() => openImagePreview(leftPreview, 'Left Design')}
                                                                            >
                                                                                <VisibilityIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Box>
                                                                )}
                                                            </Paper>
                                                        </Grid>

                                                        {/* Right Image Upload */}
                                                        <Grid item xs={12} sm={6}>
                                                            <Paper className="image-upload-paper" sx={{ p: 2, textAlign: 'center', border: '2px dashed #ccc', borderRadius: 2 }}>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleRightImageChange}
                                                                    style={{ display: 'none' }}
                                                                    id="right-image-upload"
                                                                />
                                                                <label htmlFor="right-image-upload">
                                                                    <Button
                                                                        variant="outlined"
                                                                        component="span"
                                                                        startIcon={<CloudUploadIcon />}
                                                                        fullWidth
                                                                    >
                                                                        Upload Right Design
                                                                    </Button>
                                                                </label>
                                                                
                                                                {rightImageError && (
                                                                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                                                                        {rightImageError}
                                                                    </Typography>
                                                                )}
                                                                
                                                                {rightPreview && (
                                                                    <Box sx={{ mt: 2, position: 'relative' }}>
                                                                        <img 
                                                                            src={rightPreview} 
                                                                            alt="Right design preview" 
                                                                            style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain', borderRadius: 8, cursor: 'pointer' }}
                                                                            onClick={() => openImagePreview(rightPreview, 'Right Design')}
                                                                        />
                                                                        <IconButton
                                                                            size="small"
                                                                            sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                                                                            onClick={removeRightImage}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                        <Tooltip title="View Full Size">
                                                                            <IconButton
                                                                                size="small"
                                                                                sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                                                                                onClick={() => openImagePreview(rightPreview, 'Right Design')}
                                                                            >
                                                                                <VisibilityIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Box>
                                                                )}
                                                            </Paper>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            )}
                                            
                                            {/* ====== DELIVERY DATE - Always shown ====== */}
                                            <Grid item xs={12}>
                                                <TextField
                                                    select
                                                    label="Delivery Time"
                                                    value={deliveryDate}
                                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                                    fullWidth
                                                    variant="outlined"
                                                    helperText={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                            {getPercentageIcon(calculatedPercentage)}
                                                            {calculatedPercentage > 100 ? `Extra charge: +${calculatedPercentage - 100}%` : 
                                                             calculatedPercentage < 100 ? `Discount: -${100 - calculatedPercentage}%` : 'Standard pricing'}
                                                        </Box>
                                                    }
                                                >
                                                    {deliveryDateOptions.map(option => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            
                                            {/* ====== PRICE SUMMARY ====== */}
                                            <Grid item xs={12}>
                                                <Card className="price-summary-card">
                                                    <CardContent>
                                                        <Typography variant="subtitle1" className="summary-title">Item Price Summary</Typography>
                                                        <Box className="summary-row">
                                                            <Typography variant="body2">Base Price ({quantity} item{quantity !== 1 ? 's' : ''}):</Typography>
                                                            <Typography variant="body2" fontWeight="bold">ETB {baseTotal.toLocaleString()}</Typography>
                                                        </Box>
                                                        <Box className="summary-row">
                                                            <Typography variant="body2">Adjustment:</Typography>
                                                            <Chip icon={getPercentageIcon(calculatedPercentage)} label={calculatedPercentage > 100 ? `+${calculatedPercentage - 100}%` : calculatedPercentage < 100 ? `-${100 - calculatedPercentage}%` : '0%'} size="small" color={getPercentageColor(calculatedPercentage)} />
                                                        </Box>
                                                        <Divider className="summary-divider" />
                                                        <Box className="summary-row total-row">
                                                            <Typography variant="h6" fontWeight="bold">Item Total:</Typography>
                                                            <Typography variant="h5" className="total-price">ETB {finalTotal.toLocaleString()}</Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                        
                                        <Box className="step-actions">
                                            <Button onClick={handleBack} className="step-prev-btn">Back</Button>
                                            <Button 
                                                onClick={addToCart} 
                                                variant="contained" 
                                                className="add-to-cart-btn" 
                                                startIcon={<AddShoppingCartIcon />}
                                                disabled={uploadingImages}
                                            >
                                                {uploadingImages ? 'Processing...' : 'Add to Cart'}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Grow>
                            )}
                            
                            {/* Cart Review Section */}
                            {cartItems.length > 0 && (
                                <Box sx={{ mt: 4 }}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>Cart Items</Typography>
                                    <TableContainer component={Paper} className="cart-table">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>Item Type</strong></TableCell>
                                                    <TableCell><strong>Options</strong></TableCell>
                                                    <TableCell><strong>Designs</strong></TableCell>
                                                    <TableCell align="center"><strong>Qty</strong></TableCell>
                                                    <TableCell align="right"><strong>Price</strong></TableCell>
                                                    <TableCell align="center"><strong>Actions</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {cartItems.map((item) => {
                                                    const displayFields = getDisplayFields(item.devicePage);
                                                    return (
                                                        <TableRow key={item.id}>
                                                            <TableCell>
                                                                <Typography variant="body2" fontWeight="bold">{item.deviceName}</Typography>
                                                                <Typography variant="caption" color="text.secondary" display="block">
                                                                    Type: {item.type}
                                                                </Typography>
                                                                <Chip 
                                                                    size="small" 
                                                                    label={item.devicePage} 
                                                                    sx={{ 
                                                                        mt: 0.5,
                                                                        backgroundColor: 
                                                                            item.devicePage === 'MATERIAL' ? '#e3f2fd' : 
                                                                            item.devicePage === 'CLOTHING' ? '#fce4ec' : 
                                                                            item.devicePage === 'SERVICE' ? '#e8f5e9' : '#f5f5f5'
                                                                    }} 
                                                                />
                                                                {displayFields.showServiceSizes && item.service_size_width && item.service_size_height && (
                                                                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 500, color: '#2e7d32' }}>
                                                                        {item.service_size_width}m × {item.service_size_height}m = {item.service_size || (item.service_size_width * item.service_size_height)}m²
                                                                    </Typography>
                                                                )}
                                                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                                                    Status: {item.itemStatus || 'New'}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                                    {displayFields.showGender && item.gender && (
                                                                        <Chip size="small" label={`Gender: ${item.gender}`} sx={{ mr: 0.5, mb: 0.5 }} />
                                                                    )}
                                                                    {displayFields.showSize && item.size && (
                                                                        <Chip size="small" label={`Size: ${item.size}`} sx={{ mr: 0.5, mb: 0.5 }} />
                                                                    )}
                                                                    <Chip size="small" label={`Color: ${item.color}`} sx={{ backgroundColor: colorOptions.find(c => c.value === item.color)?.colorCode || '#000000', color: ['white', 'yellow'].includes(item.color) ? '#000000' : '#ffffff', mb: 0.5 }} />
                                                                    {displayFields.showServiceSizes && item.service_size && (
                                                                        <Chip size="small" label={`Area: ${item.service_size} m²`} sx={{ mr: 0.5, mb: 0.5, backgroundColor: '#e8f5e9' }} />
                                                                    )}
                                                                    <Chip size="small" label={`Delivery: ${deliveryDateOptions.find(d => d.value === item.delivery_date)?.label || item.delivery_date}`} sx={{ mr: 0.5, mb: 0.5, backgroundColor: '#fff3e0' }} />
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                                    {item.sampleDesignPreview && (
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <Chip size="small" label="Sample Design" sx={{ backgroundColor: '#e3f2fd' }} />
                                                                            <Tooltip title="View Sample Design">
                                                                                <IconButton size="small" onClick={() => openImagePreview(item.sampleDesignPreview, 'Sample Design')}>
                                                                                    <ImageIcon fontSize="small" />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </Box>
                                                                    )}
                                                                    {displayFields.showDesignImages && (
                                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                            {item.frontPreview && (
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                                    <Chip size="small" label="Front" sx={{ backgroundColor: '#fce4ec' }} />
                                                                                    <Tooltip title="View Front Design">
                                                                                        <IconButton size="small" onClick={() => openImagePreview(item.frontPreview, 'Front Design')}>
                                                                                            <ImageIcon fontSize="small" />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </Box>
                                                                            )}
                                                                            {item.backPreview && (
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                                    <Chip size="small" label="Back" sx={{ backgroundColor: '#fce4ec' }} />
                                                                                    <Tooltip title="View Back Design">
                                                                                        <IconButton size="small" onClick={() => openImagePreview(item.backPreview, 'Back Design')}>
                                                                                            <ImageIcon fontSize="small" />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </Box>
                                                                            )}
                                                                            {item.leftPreview && (
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                                    <Chip size="small" label="Left" sx={{ backgroundColor: '#e8f5e9' }} />
                                                                                    <Tooltip title="View Left Design">
                                                                                        <IconButton size="small" onClick={() => openImagePreview(item.leftPreview, 'Left Design')}>
                                                                                            <ImageIcon fontSize="small" />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </Box>
                                                                            )}
                                                                            {item.rightPreview && (
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                                    <Chip size="small" label="Right" sx={{ backgroundColor: '#e8f5e9' }} />
                                                                                    <Tooltip title="View Right Design">
                                                                                        <IconButton size="small" onClick={() => openImagePreview(item.rightPreview, 'Right Design')}>
                                                                                            <ImageIcon fontSize="small" />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </Box>
                                                                            )}
                                                                            {!item.frontPreview && !item.backPreview && !item.leftPreview && !item.rightPreview && (
                                                                                <Typography variant="caption" color="text.secondary">No designs uploaded</Typography>
                                                                            )}
                                                                        </Box>
                                                                    )}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="center">{item.quantity}</TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="body2" fontWeight="bold">
                                                                    ETB {item.total_price.toLocaleString()}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary" display="block">
                                                                    Base: ETB {item.base_price.toLocaleString()}
                                                                </Typography>
                                                                {item.calculated_percentage !== 100 && (
                                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                                        {item.calculated_percentage > 100 ? '+' : ''}{item.calculated_percentage - 100}% adjustment
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <IconButton size="small" onClick={() => openEditDialog(item)}>
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton size="small" color="error" onClick={() => removeFromCart(item.id)}>
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                <TableRow>
                                                    <TableCell colSpan={4} align="right">
                                                        <Typography variant="h6" fontWeight="bold">Total:</Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="h6" fontWeight="bold" color="primary">
                                                            ETB {cartTotal.toLocaleString()}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell />
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    
                                    {/* Customer Information */}
                                    <Typography variant="h6" className="step-title" sx={{ mt: 3 }}>Shipping Information</Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                label="Full Name" 
                                                value={name} 
                                                onChange={(e) => setName(e.target.value)} 
                                                fullWidth 
                                                required 
                                                variant="outlined" 
                                                InputProps={{ startAdornment: <PersonAddIcon sx={{ mr: 1, color: '#0046be' }} /> }} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                label="Email Address" 
                                                type="email" 
                                                value={email} 
                                                onChange={(e) => setEmail(e.target.value)} 
                                                fullWidth 
                                                required 
                                                variant="outlined" 
                                                InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: '#0046be' }} /> }} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                label="Phone Number" 
                                                value={phone} 
                                                onChange={(e) => setPhone(e.target.value)} 
                                                fullWidth 
                                                required 
                                                variant="outlined" 
                                                InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1, color: '#0046be' }} /> }} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                label="Shipping Address" 
                                                value={address} 
                                                onChange={(e) => setAddress(e.target.value)} 
                                                fullWidth 
                                                required 
                                                variant="outlined" 
                                                multiline 
                                                rows={2} 
                                                InputProps={{ startAdornment: <LocationOnIcon sx={{ mr: 1, color: '#0046be' }} /> }} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                label="Expected Ship Date" 
                                                type="date" 
                                                value={shipDate} 
                                                onChange={(e) => setShipDate(e.target.value)} 
                                                fullWidth 
                                                variant="outlined" 
                                                InputLabelProps={{ shrink: true }} 
                                                inputProps={{ min: new Date().toISOString().split('T')[0] }} 
                                                helperText="Select when you expect the order to be shipped" 
                                                InputProps={{ startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: '#0046be' }} /> }} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                label="Description" 
                                                value={description} 
                                                onChange={(e) => setDescription(e.target.value)} 
                                                fullWidth 
                                                variant="outlined" 
                                                multiline 
                                                rows={2} 
                                                InputProps={{ startAdornment: <DescriptionIcon sx={{ mr: 1, color: '#0046be' }} /> }} 
                                                helperText="Optional: Any additional details about your order"
                                            />
                                        </Grid>
                                    </Grid>
                                    
                                    <Box className="step-actions">
                                        <Button 
                                            onClick={handleSubmitOrders} 
                                            variant="contained" 
                                            className="step-submit-btn" 
                                            disabled={cartItems.length === 0 || !name || !phone || !address || submittingOrders}
                                        >
                                            {submittingOrders ? 'Placing Orders...' : `Place ${cartItems.length} Order${cartItems.length !== 1 ? 's' : ''} (ETB ${cartTotal.toLocaleString()})`}
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Paper>
                        
                        {/* Bottom Navigation */}
                        <Box className="order-nav-bottom">
                            <Button startIcon={<ArrowBackIcon />} onClick={handleBack} variant="contained" className="bottom-nav-back">Back to Items</Button>
                            <Button startIcon={<HomeIcon />} onClick={() => navigate('/')} variant="contained" className="bottom-nav-home">Go to Homepage</Button>
                        </Box>
                    </Box>
                </Fade>
            </Container>
            
            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Cart Item</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        {editingItem && (
                            <>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Device: {editingItem.deviceName} | Status: {editingItem.itemStatus || 'New'}
                                </Typography>
                            </>
                        )}
                        
                        {editingItem && shouldShowField(editingItem.devicePage, 'gender') && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <FormLabel>Gender</FormLabel>
                                <RadioGroup row value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                                    {genderOptions.map(option => (
                                        <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                        
                        {editingItem && shouldShowField(editingItem.devicePage, 'size') && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <FormLabel>Size</FormLabel>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {sizeOptions.map(option => (
                                        <ToggleButton 
                                            key={option.value} 
                                            value={option.value} 
                                            selected={selectedSize === option.value} 
                                            onChange={() => setSelectedSize(option.value)}
                                        >
                                            {option.label}
                                        </ToggleButton>
                                    ))}
                                </Box>
                            </FormControl>
                        )}
                        
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <FormLabel>Color</FormLabel>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {colorOptions.map(option => (
                                    <Box 
                                        key={option.value} 
                                        className={`color-swatch ${selectedColor === option.value ? 'active' : ''}`} 
                                        sx={{ backgroundColor: option.colorCode, width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', border: selectedColor === option.value ? '3px solid #0046be' : '2px solid #ddd' }} 
                                        onClick={() => setSelectedColor(option.value)} 
                                    />
                                ))}
                            </Box>
                        </FormControl>
                        
                        {editingItem && shouldShowField(editingItem.devicePage, 'service_sizes') && (
                            <>
                                <TextField 
                                    label="Width (meters)" 
                                    type="number" 
                                    value={serviceSizeWidth} 
                                    onChange={(e) => setServiceSizeWidth(e.target.value)} 
                                    fullWidth 
                                    sx={{ mb: 2 }} 
                                />
                                <TextField 
                                    label="Height (meters)" 
                                    type="number" 
                                    value={serviceSizeHeight} 
                                    onChange={(e) => setServiceSizeHeight(e.target.value)} 
                                    fullWidth 
                                    sx={{ mb: 2 }} 
                                />
                                <TextField 
                                    label="Total Size (sq meters)" 
                                    value={serviceSize} 
                                    onChange={(e) => setServiceSize(e.target.value)} 
                                    fullWidth 
                                    sx={{ mb: 2 }} 
                                />
                            </>
                        )}
                        
                        <TextField 
                            label="Quantity" 
                            type="number" 
                            value={quantity} 
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
                            fullWidth 
                            sx={{ mb: 2 }} 
                            inputProps={{ min: 1 }} 
                        />
                        
                        {/* Type is read-only - display only */}
                        {editingItem && (
                            <TextField
                                label="Type"
                                value={editingItem.type || 'New'}
                                fullWidth
                                variant="outlined"
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                                helperText="Type is determined by the device status"
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={updateCartItem} variant="contained">Update Item</Button>
                </DialogActions>
            </Dialog>
            
            {/* Image Preview Dialog */}
            <Dialog open={previewDialogOpen} onClose={() => setPreviewDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{previewImageTitle}</DialogTitle>
                <DialogContent sx={{ textAlign: 'center' }}>
                    <img src={previewImageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderForm;