import { API_BASE_URL } from '../config.js';

// API service for backend communication
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('featherfold_token');
    console.log('API Service initialized with baseURL:', this.baseURL);
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('featherfold_token', token);
  }

  // Remove token
  removeToken() {
    this.token = null;
    localStorage.removeItem('featherfold_token');
  }

  // Get headers with authentication
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      console.log('Making API request to:', url, config);
      const response = await fetch(url, config);
      const data = await response.json();

      console.log('API response:', response.status, data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async resetPasswordWithToken(token, email, newPassword) {
    return this.request('/auth/reset-password-with-token', {
      method: 'POST',
      body: JSON.stringify({ token, email, newPassword }),
    });
  }

  async getProfile() {
    return this.request('/user/profile');
  }

  // Products
  async getProducts() {
    return this.request('/products');
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async checkInventory(color, size, type) {
    const params = new URLSearchParams({ color, size, type });
    return this.request(`/inventory/check?${params}`);
  }

  // Orders
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async validatePromo(code) {
    return this.request(`/promo/validate?code=${encodeURIComponent(code)}`);
  }

  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(settings) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  async getOrders(userId) {
    const endpoint = userId ? `/orders?userId=${userId}` : '/orders';
    return this.request(endpoint);
  }

  async getOrder(orderId) {
    // For guest users, use the guest endpoint
    const token = localStorage.getItem('featherfold_token');
    
    // Always try guest endpoint first for guest orders
    try {
      const url = `${this.baseURL}/orders/${orderId}/guest`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        return data;
      }
      
      // If guest endpoint returns 403 (not a guest order), try authenticated endpoint
      if (response.status === 403 && token) {
        return this.request(`/orders/${orderId}`);
      }
      
      throw new Error('Failed to fetch guest order');
    } catch (error) {
      // Only try authenticated endpoint if we have a valid token
      if (token) {
        return this.request(`/orders/${orderId}`);
      }
      
      throw error;
    }
  }

  // Payment
  async createPaymentOrder(amountOrPayload, currency = 'INR', receipt) {
    const payload = typeof amountOrPayload === 'object'
      ? amountOrPayload
      : { amount: amountOrPayload, currency, receipt };

    return this.request('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async verifyPayment(paymentData) {
    return this.request('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Test API connection
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      const data = await response.json();
      console.log('API connection test successful:', data);
      return data;
    } catch (error) {
      console.error('API connection test failed:', error);
      throw error;
    }
  }

  // Admin endpoints
  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async getAdminOrders() {
    return this.request('/admin/orders');
  }

  async getAdminAnalytics() {
    return this.request('/admin/analytics');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();

// Google OAuth
export const initiateGoogleAuth = () => {
  // Use environment variable if available, otherwise fall back to production backend
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://featherfold-backendnew1-production.up.railway.app/api';
  const authStart = `${baseUrl}/auth/google`;
  console.log('Initiating Google Auth with URL:', authStart);
  window.location.href = authStart;
};

// Handle Google OAuth callback
export const handleGoogleCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userData = urlParams.get('user');
  
  if (token && userData) {
    try {
      const user = JSON.parse(decodeURIComponent(userData));
      apiService.setToken(token);
      localStorage.setItem('featherfold_user', JSON.stringify(user));
      return { success: true, user, token };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return { success: false, error: 'Invalid user data' };
    }
  }
  
  return { success: false, error: 'No authentication data found' };
};
