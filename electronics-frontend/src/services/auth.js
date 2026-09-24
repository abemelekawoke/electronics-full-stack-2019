// auth.js - Updated version
import axios from 'axios';

const API_URL = '/api/';

// Social Login URLs - These will now point to http://localhost/auth/...
export const GOOGLE_LOGIN_URL = `${API_URL}accounts/google/login/`;
export const FACEBOOK_LOGIN_URL = `${API_URL}auth/facebook/login/`;
export const LOGOUT_URL = `${API_URL}v1/logout/`;

export const checkAuthStatus = async () => {
    const storedUser = localStorage.getItem('user');
    
    try {
        // This will now call http://localhost/api/v1/check-auth/
        const response = await axios.get(`${API_URL}v1/check-auth/`, {
            withCredentials: true,
        });
        
        if (response.data && response.data.email) {
            const user = { email: response.data.email };
            localStorage.setItem('user', JSON.stringify(user));
            return true;
        } else {
            localStorage.removeItem('user');
            return false;
        }
    } catch (error) {
        console.log('Auth check API failed:', error.message);
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            return false;
        }
        return !!storedUser;
    }
};

export const checkAuthStatusLocal = () => {
    const user = localStorage.getItem('user');
    return !!user;
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getCurrentUserEmail = () => {
    const user = getCurrentUser();
    return user ? user.email : '';
};

export const getCSRFToken = () => {
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

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}auth/account/login/`, {
        email,
        password,
    }, {
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
        withCredentials: true,
    });
    
    const user = { email };
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
};

export const signup = async (email, password1, password2) => {
    const response = await axios.post(`${API_URL}auth/account/registration/`, {
        email,
        password1,
        password2,
    }, {
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
        withCredentials: true,
    });
    
    const user = { email };
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
};

// Logout - clears local storage and redirects to home
export const logout = async () => {
    // Clear local storage first
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Use custom logout endpoint
    try {
        await axios.get(`${API_URL}v1/logout/`, {
            withCredentials: true,
        });
    } catch (error) {
        console.log('Logout API error (ignoring):', error);
    }
};

export const socialLogin = (provider) => {
    if (provider === 'google') {
        window.location.href = GOOGLE_LOGIN_URL;
    } else if (provider === 'facebook') {
        window.location.href = FACEBOOK_LOGIN_URL;
    }
};

// Get authentication headers for API calls
export const getAuthHeaders = () => {
    return {
        'X-CSRFToken': getCSRFToken(),
        'Content-Type': 'application/json',
    };
};

// Check if user is authenticated and return user info
export const getAuthenticatedUser = async () => {
    try {
        const response = await axios.get(`${API_URL}v1/check-auth/`, {
            withCredentials: true,
        });
        if (response.data && response.data.email) {
            return {
                isAuthenticated: true,
                email: response.data.email,
                user: response.data
            };
        }
    } catch (error) {
        console.log('Not authenticated');
    }
    return {
        isAuthenticated: false,
        email: null,
        user: null
    };
};

// Refresh CSRF token (call this before important operations)
export const refreshCSRFToken = async () => {
    try {
        await axios.get(`${API_URL}v1/check-auth/`, {
            withCredentials: true,
        });
        return getCSRFToken();
    } catch (error) {
        console.error('Failed to refresh CSRF token:', error);
        return null;
    }
};

// Verify session is still valid before making review
export const verifySession = async () => {
    try {
        const response = await axios.get(`${API_URL}v1/check-auth/`, {
            withCredentials: true,
        });
        if (response.data && response.data.email) {
            // Update stored user
            const user = { email: response.data.email };
            localStorage.setItem('user', JSON.stringify(user));
            return true;
        }
        localStorage.removeItem('user');
        return false;
    } catch (error) {
        console.error('Session verification failed:', error);
        localStorage.removeItem('user');
        return false;
    }
};

// Get complete auth config for axios requests
export const getAuthConfig = () => {
    return {
        withCredentials: true,
        headers: {
            'X-CSRFToken': getCSRFToken(),
            'Content-Type': 'application/json',
        },
    };
};

// Ensure user is authenticated before making API calls
export const ensureAuthenticated = async () => {
    const isAuth = await checkAuthStatus();
    if (!isAuth) {
        window.location.href = '/login';
        return false;
    }
    return true;
};