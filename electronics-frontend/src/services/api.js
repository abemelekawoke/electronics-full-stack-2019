// src/services/api.js
import axios from 'axios';

const getCSRFToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

// ✅ baseURL is /api/v1/
const api = axios.create({
    baseURL: '/api/v1/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const csrfToken = getCSRFToken();
        if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        
        console.log(`Making ${config.method.toUpperCase()} request to:`, config.url);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log(`Response from ${response.config.url}:`, response.status);
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

// =============================================
// SETUPS API FUNCTIONS
// =============================================

export const getActiveAnnouncements = () => {
    return api.get('announcements/');
};

export const getActivePartners = () => {
    return api.get('partners/');
};

// =============================================
// DEVICE API FUNCTIONS
// URL: /api/v1/devices/
// =============================================

/**
 * Get all devices with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.page_size - Items per page
 * @param {string} params.page_type - 'products' or 'services'
 * @param {number} params.category - Category ID
 * @param {string} params.category_name - Category name
 * @param {string} params.search - Search term
 * @param {string} params.item_status - 'new', 'used', 'refurbished'
 * @param {string} params.ordering - Sort order
 */
export const getDevices = (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Pagination
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    
    // Filters
    if (params.page_type) queryParams.append('page_type', params.page_type);
    if (params.category) queryParams.append('category', params.category);
    if (params.category_name) queryParams.append('category_name', params.category_name);
    if (params.search) queryParams.append('search', params.search);
    if (params.item_status) queryParams.append('item_status', params.item_status);
    if (params.ordering) queryParams.append('ordering', params.ordering);
    
    const url = `devices/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(url);
};

/**
 * Get all products (MATERIAL and CLOTHING) with filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.page_size - Items per page
 * @param {number} params.category - Category ID
 * @param {string} params.search - Search term
 */
export const getProducts = (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Pagination
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    
    // Filters
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.ordering) queryParams.append('ordering', params.ordering);
    
    const url = `devices/products/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(url);
};

/**
 * Get all services (SERVICE) with filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.page_size - Items per page
 * @param {number} params.category - Category ID
 * @param {string} params.search - Search term
 */
export const getServices = (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Pagination
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    
    // Filters
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.ordering) queryParams.append('ordering', params.ordering);
    
    const url = `devices/services/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(url);
};

/**
 * Get device by ID
 */
export const getDevice = (id) => {
    return api.get(`devices/${id}/`);
};

/**
 * Get categories with device counts
 * @param {string} pageType - 'products' or 'services' or null for all
 */
export const getCategoriesWithCounts = (pageType = null) => {
    const url = `devices/categories/${pageType ? `?page_type=${pageType}` : ''}`;
    return api.get(url);
};

// =============================================
// CATEGORY API FUNCTIONS
// URL: /api/v1/categories/
// =============================================

export const getCategories = () => {
    return api.get('categories/');
};

// =============================================
// ORDER API FUNCTIONS
// =============================================

export const getOrders = (email) => {
    return api.get(`user-orders/?email=${encodeURIComponent(email)}`);
};

export const createOrder = (data) => {
    return api.post('orders/', data);
};

export const updateOrder = (id, data) => {
    return api.put(`orders/${id}/`, data);
};

export const getOrderBalance = (orderId) => {
    return api.get(`orders/${orderId}/balance/`);
};

export const uploadDepositReceipt = (orderId, file) => {
    const formData = new FormData();
    formData.append('deposit_receipt', file);
    return api.post(`orders/${orderId}/upload-deposit/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const uploadFinalPaymentReceipt = (orderId, file) => {
    const formData = new FormData();
    formData.append('final_payment_receipt', file);
    return api.post(`orders/${orderId}/upload-final-payment/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// =============================================
// REVIEW API FUNCTIONS
// =============================================

export const reviewApi = {
    getReviews: (orderId, email) => {
        return api.get(`reviews/?order_id=${orderId}&email=${encodeURIComponent(email)}`);
    },
    createReview: (data) => {
        return api.post('reviews/', data);
    },
    updateReview: (id, data) => {
        return api.put(`reviews/${id}/`, data);
    },
    deleteReview: (id) => {
        return api.delete(`reviews/${id}/`);
    },
    getOrderReviews: (orderId) => {
        return api.get(`orders/${orderId}/review/`);
    },
    createOrderReview: (orderId, data) => {
        return api.post(`orders/${orderId}/review/`, data);
    },
};

// =============================================
// NEWS API FUNCTIONS
// =============================================

export const getNews = () => {
    return api.get('news/');
};

export const getNewsDetail = (id) => {
    return api.get(`news/${id}/`);
};

// =============================================
// CONTACT API FUNCTIONS
// =============================================

export const sendContactMessage = (data) => {
    return api.post('contact/', data);
};

// Default export
export default api;