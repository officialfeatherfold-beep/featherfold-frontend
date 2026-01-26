// Base configuration for FeatherFold frontend
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://featherfold-backendnew1-production.up.railway.app/api";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://featherfold-backendnew1-production.up.railway.app/api";

// Railway backend URL for production
export const RAILWAY_URL = 'https://featherfold-backendnew1-production.up.railway.app';

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  GOOGLE_AUTH: '/api/auth/google',
  
  // Products
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id) => `/api/products/${id}`,
  
  // Orders
  ORDERS: '/api/orders',
  ORDER_BY_ID: (id) => `/api/orders/${id}`,
  
  // Payment
  CREATE_ORDER: '/api/payment/create-order',
  VERIFY_PAYMENT: '/api/payment/verify',
  
  // User
  USER_PROFILE: '/api/user/profile',
  USER_ADDRESSES: '/api/addresses',
  
  // Admin
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_ORDERS: '/api/admin/orders',
  
  // Health
  HEALTH: '/api/health'
};

// Helper function to build full URLs
export const buildUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
