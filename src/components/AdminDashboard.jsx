import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Package,
  LogOut,
  Menu,
  X,
  BarChart3,
  Settings,
  Mail,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Upload,
  Save,
  Eye,
  Home,
  Star,
  Phone,
  Calendar,
  Shield,
  UserCheck,
  UserX,
  RefreshCw,
  ChevronDown,
  Loader2,
  Minus,
  ShoppingBag as ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUp,
  ArrowDown,
  IndianRupee,
  User as UserIcon,
  Lock,
  Ban,
  Box,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown,
  Activity,
  PackageOpen,
  BarChart,
  Warehouse,
  Scale,
  Ruler,
  Tag,
  FileText,
  RefreshCw as RotateCcw
} from 'lucide-react';
import { apiService } from '../services/api';
import { resolveImage, getColorHex } from '../utils/dataUtils';

const AdminDashboard = ({ user, onLogout }) => {
  // Security check - redirect if not admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      window.location.href = '/';
    }
  }, [user]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    guestCheckout: true,
    storeName: 'FeatherFold',
    contactEmail: 'officialfeatherfold@gmail.com',
    phoneNumber: '+91 8168587844',
    currency: 'INR',
    freeShippingThreshold: 500,
    standardShippingFee: 40,
    deliveryTime: '3-5 business days',
    taxEnabled: true,
    taxRate: 18
  });
  const [saveStatus, setSaveStatus] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0
  });
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [promos, setPromos] = useState([]);
  const [products, setProducts] = useState([]);
  const [productOrderIds, setProductOrderIds] = useState([]);
  const [productOrderSaving, setProductOrderSaving] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [promoSaving, setPromoSaving] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoForm, setPromoForm] = useState({
    code: '',
    percent: 10,
    startDate: '',
    endDate: '',
    maxUses: 100,
    codeLength: 8
  });
  
  // SKU management state
  const [skuSearchTerm, setSkuSearchTerm] = useState('');
  const [searchedProduct, setSearchedProduct] = useState(null);
  const [skuSearchLoading, setSkuSearchLoading] = useState(false);
  const [skuSearchError, setSkuSearchError] = useState(null);
  const [editingSkuData, setEditingSkuData] = useState(null);
  const [skuEditMode, setSkuEditMode] = useState(false);
  
  // Additional SKU fields state
  const [skuExtendedData, setSkuExtendedData] = useState({
    reserved: 15,
    warehouse: 'Panipat FC',
    lowStockAlert: 50,
    fulfillmentType: 'FBA',
    minPrice: 2199,
    maxPrice: 2999,
    gstApplied: true,
    gstRate: 12,
    weight: 1.2,
    dimensions: '30 × 25 × 5 cm',
    returnable: true,
    courier: 'Ekart / Amazon'
  });
  
  // Product management state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [featuredProductIds, setFeaturedProductIds] = useState([]);
  const [featuredRotationSeconds, setFeaturedRotationSeconds] = useState(5);
  const [featuredAddProductId, setFeaturedAddProductId] = useState('');
  const [featuredSaving, setFeaturedSaving] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: 'FeatherFold',
    sku: '',
    variantGroupId: '',
    variantColor: '',
    variantSize: '',
    price: '',
    originalPrice: '',
    category: '',
    sizes: [],
    colors: [],
    fabric: 'Cotton', // Default fabric
    availability: '',
    description: '',
    features: [],
    careInstructions: [],
    images: [],
    variantImages: [] // { color, size, images: [] }
  });
  
  // User management state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'https://featherfold-backendnew1-production.up.railway.app' 
    : 'https://featherfold-backendnew1-production.up.railway.app';
  
  // Predefined options
  const CATEGORIES = [
    'Bedsheets', 'Pillow Covers', 'Duvet Covers', 'Comforters', 
    'Blankets', 'Mattress Protectors', 'Cushions', 'Towels', 
    'Bathrobes', 'Other'
  ];
  
  const FABRICS = [
    'Cotton', 'Egyptian Cotton', 'Pima Cotton', 'Sateen', 
    'Percale', 'Linen', 'Silk', 'Polyester', 'Microfiber', 
    'Bamboo', 'Tencel', 'Velvet', 'Flannel', 'Jersey'
  ];
  
  const SIZES = [
    'Single', 'Twin', 'Double', 'Full', 'Queen', 
    'King', 'California King', 'Super King'
  ];
  
  const COLORS = [
    { name: 'White', value: 'white', class: 'bg-white' },
    { name: 'Ivory', value: 'ivory', class: 'bg-ivory' },
    { name: 'Beige', value: 'beige', class: 'bg-beige' },
    { name: 'Cream', value: 'cream', class: 'bg-cream' },
    { name: 'Gray', value: 'gray', class: 'bg-gray' },
    { name: 'Charcoal', value: 'charcoal', class: 'bg-charcoal' },
    { name: 'Black', value: 'black', class: 'bg-black' },
    { name: 'Blue', value: 'blue', class: 'bg-blue' },
    { name: 'Navy', value: 'navy', class: 'bg-navy' },
    { name: 'Sky Blue', value: 'sky-blue', class: 'bg-sky-blue' },
    { name: 'Green', value: 'green', class: 'bg-green' },
    { name: 'Sage', value: 'sage', class: 'bg-sage' },
    { name: 'Olive', value: 'olive', class: 'bg-olive' },
    { name: 'Pink', value: 'pink', class: 'bg-pink' },
    { name: 'Blush', value: 'blush', class: 'bg-blush' },
    { name: 'Rose', value: 'rose', class: 'bg-rose' },
    { name: 'Red', value: 'red', class: 'bg-red' },
    { name: 'Burgundy', value: 'burgundy', class: 'bg-burgundy' },
    { name: 'Purple', value: 'purple', class: 'bg-purple' },
    { name: 'Lavender', value: 'lavender', class: 'bg-lavender' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch {
        // ignore invalid settings
      }
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setSaveStatus('Settings saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching dashboard data...');
      
      const token = localStorage.getItem('featherfold_token');
      const currentUser = JSON.parse(localStorage.getItem('featherfold_user') || '{}');
      console.log('🔑 Token found:', token ? 'YES' : 'NO');
      console.log('👤 Current user:', currentUser);
      console.log('👤 Is admin?', currentUser.isAdmin);
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Fetch products (public endpoint)
      console.log('📦 Fetching products...');
      const productsResponse = await fetch(`${API_BASE}/api/products`);
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        const validatedProducts = (productsData.products || []).map((product) => ({
          ...product,
          price: product.price || 0,
          originalPrice: product.originalPrice || product.price || 0,
          availability: product.availability || 0,
          brand: product.brand || 'FeatherFold',
          category: product.category || '',
          sizes: product.sizes || [],
          colors: product.colors || [],
          fabric: product.fabric || '',
          description: product.description || '',
          features: product.features || [],
          careInstructions: product.careInstructions || [],
          images: product.images && product.images.length > 0 && !product.images[0].includes('🛏️') ? product.images : [],
          isNew: product.isNew || false
        }));
        setProducts(validatedProducts);
        syncProductOrder(validatedProducts);
      }

      try {
        const featuredResponse = await fetch(`${API_BASE}/api/admin/featured-products`, { headers });
        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          setFeaturedProductIds(Array.isArray(featuredData.productIds) ? featuredData.productIds : []);
          setFeaturedRotationSeconds(Number.isFinite(Number(featuredData.rotationSeconds)) ? Number(featuredData.rotationSeconds) : 5);
        }
      } catch (e) {
        // ignore featured fetch errors
      }
      
      // Fetch users and orders (protected endpoints)
      console.log('👥 Fetching users...');
      const usersResponse = await fetch(`${API_BASE}/api/admin/users/enhanced`, { headers });
      console.log('👥 Users response status:', usersResponse.status);
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      } else if (usersResponse.status === 401) {
        const errorData = await usersResponse.json();
        console.error('👥 Users auth error:', errorData);
        setError('Invalid or expired token. Please log in again.');
        localStorage.removeItem('featherfold_token');
        localStorage.removeItem('featherfold_user');
        onLogout();
        return;
      } else if (usersResponse.status === 403) {
        const errorData = await usersResponse.json();
        console.error('👥 Admin access error:', errorData);
        setError('Admin access required. Your account may not have admin privileges.');
        return;
      }
      
      console.log('🛒 Fetching orders...');
      const ordersResponse = await fetch(`${API_BASE}/api/admin/orders`, { headers });
      console.log('🛒 Orders response status:', ordersResponse.status);
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        // Sort orders by createdAt (latest → oldest)
        const sortedOrders = [...(ordersData.orders || [])].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      } else if (ordersResponse.status === 403) {
        const errorData = await ordersResponse.json();
        console.error('🛒 Orders admin access error:', errorData);
        setError('Admin access required for orders. Your account may not have admin privileges.');
        return;
      }

      console.log('✉️ Fetching messages...');
      const messagesResponse = await fetch(`${API_BASE}/api/admin/messages`, { headers });
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData.messages || []);
      }

      try {
        console.log('🏷️ Fetching promo codes...');
        const promosResponse = await fetch(`${API_BASE}/api/admin/promo`, { headers });
        if (promosResponse.ok) {
          const promosData = await promosResponse.json();
          setPromos(promosData.promos || []);
        }
      } catch (e) {
        console.warn('Failed to fetch promo codes', e);
      }
      
      // Fetch analytics from dedicated API
      console.log('📊 Fetching analytics...');
      const analyticsResponse = await fetch(`${API_BASE}/api/admin/analytics`, { headers });
      console.log('📊 Analytics response status:', analyticsResponse.status);
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        const transformedAnalytics = {
          totalRevenue: analyticsData.stats.totalRevenue,
          totalOrders: analyticsData.stats.totalOrders,
          totalUsers: analyticsData.stats.totalUsers,
          conversionRate: analyticsData.conversionRate.current,
          revenue: analyticsData.revenue,
          orders: analyticsData.orders,
          users: analyticsData.users,
          conversionRateData: analyticsData.conversionRate,
          charts: analyticsData.charts,
          recentOrders: analyticsData.recentOrders?.slice(0, 3) || [],
          topProducts: products.slice(0, 3)
        };
        setAnalytics(transformedAnalytics);
        
        // Update stats for backward compatibility
        setStats({
          totalUsers: analyticsData.stats.totalUsers,
          totalOrders: analyticsData.stats.totalOrders,
          totalRevenue: analyticsData.stats.totalRevenue,
          totalProducts: products.length
        });
      } else if (analyticsResponse.status === 403) {
        const errorData = await analyticsResponse.json();
        console.error('📊 Analytics admin access error:', errorData);
        setError('Admin access required for analytics. Your account may not have admin privileges.');
        return;
      } else {
        // Fallback to client-side calculation if API fails
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const totalOrders = orders.length;
        const totalUsers = users.length;
        const conversionRate = totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(1) : '0';
        
        const fallbackAnalytics = {
          totalRevenue,
          totalOrders,
          totalUsers,
          conversionRate: parseFloat(conversionRate),
          recentOrders: orders.slice(0, 3),
          topProducts: products.slice(0, 3)
        };
        
        setAnalytics(fallbackAnalytics);
        setStats({
          totalUsers,
          totalOrders,
          totalRevenue,
          totalProducts: products.length
        });
      }
      
    } catch (error) {
      console.error('💥 Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeaturedProduct = () => {
    if (!featuredAddProductId) return;
    if (featuredProductIds.includes(featuredAddProductId)) return;
    setFeaturedProductIds((prev) => [...prev, featuredAddProductId]);
    setFeaturedAddProductId('');
  };

  const moveFeaturedProduct = (index, direction) => {
    setFeaturedProductIds((prev) => {
      const next = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const removeFeaturedProduct = (id) => {
    setFeaturedProductIds((prev) => prev.filter((x) => x !== id));
  };

  const handleSaveFeaturedProducts = async () => {
    try {
      const token = localStorage.getItem('featherfold_token');
      if (!token) {
        setError('Please login to update featured products');
        return;
      }

      setFeaturedSaving(true);

      const response = await fetch(`${API_BASE}/api/admin/featured-products`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productIds: featuredProductIds,
          rotationSeconds: featuredRotationSeconds
        })
      });

      if (response.ok) {
        const data = await response.json();
        setFeaturedProductIds(Array.isArray(data.productIds) ? data.productIds : []);
        setFeaturedRotationSeconds(Number.isFinite(Number(data.rotationSeconds)) ? Number(data.rotationSeconds) : featuredRotationSeconds);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update featured products');
      }
    } catch (error) {
      setError('Error updating featured products: ' + (error?.message || 'Unknown error'));
    } finally {
      setFeaturedSaving(false);
    }
  };

  // Helper functions for color and size management
  const addColor = (colorValue) => {
    const colorObj = COLORS.find(c => c.value === colorValue);
    if (colorObj && !productForm.colors.some(c => c.value === colorValue)) {
      setProductForm({...productForm, colors: [...productForm.colors, colorObj]});
    }
  };

  const removeColor = (colorValue) => {
    setProductForm({...productForm, colors: productForm.colors.filter(c => c.value !== colorValue)});
  };

  const toggleSize = (size) => {
    if (productForm.sizes.includes(size)) {
      setProductForm({...productForm, sizes: productForm.sizes.filter(s => s !== size)});
    } else {
      setProductForm({...productForm, sizes: [...productForm.sizes, size]});
    }
  };
  
  const resetProductForm = () => {
    setProductForm({
      name: '',
      brand: 'FeatherFold',
      sku: '',
      variantGroupId: '',
      variantColor: '',
      variantSize: '',
      price: '',
      originalPrice: '',
      category: '',
      sizes: [],
      colors: [],
      fabric: 'Cotton',
      availability: '',
      description: '',
      features: [],
      careInstructions: [],
      images: [],
      variantImages: []
    });
    setIsAddingProduct(false);
    setEditingProduct(null);
  };
  
  const resetFormOnly = () => {
    console.log('🧹 Resetting form to empty state');
    setProductForm({
      name: '',
      brand: 'FeatherFold',
      sku: '',
      variantGroupId: '',
      variantColor: '',
      variantSize: '',
      price: '',
      originalPrice: '',
      category: '',
      sizes: ['Single'], // Default size
      colors: [COLORS[0]], // Default color
      fabric: 'Cotton', // Default fabric
      availability: '',
      description: '',
      features: [],
      careInstructions: [],
      images: [],
      variantImages: []
    });
  };

  const syncProductOrder = (nextProducts) => {
    const sorted = [...nextProducts].sort((a, b) => {
      const orderDiff = Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
      if (orderDiff !== 0) return orderDiff;
      return (a.name || '').localeCompare(b.name || '');
    });
    setProductOrderIds(sorted.map((p) => p.id));
  };

  const moveProductOrder = (productId, direction) => {
    setProductOrderIds((prev) => {
      const currentIndex = prev.indexOf(productId);
      if (currentIndex === -1) return prev;
      const nextIndex = currentIndex + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      const temp = next[currentIndex];
      next[currentIndex] = next[nextIndex];
      next[nextIndex] = temp;
      return next;
    });
  };

  const setProductOrderPosition = (productId, position) => {
    setProductOrderIds((prev) => {
      const currentIndex = prev.indexOf(productId);
      if (currentIndex === -1) return prev;
      const clamped = Math.max(1, Math.min(prev.length, position));
      const next = [...prev];
      next.splice(currentIndex, 1);
      next.splice(clamped - 1, 0, productId);
      return next;
    });
  };

  const handleSaveProductOrder = async () => {
    try {
      const token = localStorage.getItem('featherfold_token');
      if (!token) {
        setError('Please login to update product order');
        return;
      }

      setProductOrderSaving(true);
      const response = await fetch(`${API_BASE}/api/admin/products/order`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderedIds: productOrderIds })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update product order');
        return;
      }

      setProducts((prev) => prev.map((product) => ({
        ...product,
        sortOrder: productOrderIds.indexOf(product.id) + 1
      })));
    } catch (error) {
      setError('Error updating product order: ' + (error?.message || 'Unknown error'));
    } finally {
      setProductOrderSaving(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const token = localStorage.getItem('featherfold_token');
    if (!token) {
      setError('Please login to manage messages');
      return;
    }

    const confirmDelete = confirm('Delete this message?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE}/api/admin/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete message');
        return;
      }

      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (error) {
      setError('Error deleting message: ' + (error?.message || 'Unknown error'));
    }
  };

  // Auto-generate SKU function
  const generateSku = (productName, colorName = null, size = null) => {
    // Create SKU from product name and timestamp
    const namePrefix = productName
      .replace(/[^a-zA-Z0-9]/g, '') // Remove special characters
      .toUpperCase()
      .slice(0, 4); // Take first 4 characters
    
    const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp
    const random = Math.random().toString(36).substring(2, 3).toUpperCase(); // 1 random char
    
    // Add variant code if provided
    let variantCode = 'XX';
    if (colorName && size) {
      const colorPrefix = colorName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 2);
      const sizePrefix = size.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 2);
      variantCode = colorPrefix + sizePrefix;
    } else if (colorName) {
      const colorPrefix = colorName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 2);
      variantCode = colorPrefix + 'XX';
    }
    
    return `${namePrefix}${variantCode}${timestamp}${random}`;
  };

  const normalizeColors = (colors) => {
    if (!Array.isArray(colors)) {
      return [];
    }
    return colors
      .map((color) => {
        if (!color) return null;
        if (typeof color === 'string') {
          const value = color.toLowerCase().replace(/\s+/g, '-');
          return { name: color, value, class: '' };
        }
        return color;
      })
      .filter(Boolean);
  };

  // Generate variants for all color + size combinations
  const generateVariants = (productName, colors, sizes) => {
    const variants = [];
    const normalizedColors = normalizeColors(colors);
    if (normalizedColors && sizes) {
      normalizedColors.forEach(color => {
        sizes.forEach(size => {
          variants.push({
            size: size,
            color: color.name,
            colorValue: color.value,
            colorClass: color.class,
            sku: generateSku(productName, color.name, size),
            availability: Math.floor(Math.random() * 50) + 10
          });
        });
      });
    }
    return variants;
  };

  // Product management functions
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    // Check if payload is too large before sending
    const payloadSize = JSON.stringify(productForm).length;
    if (payloadSize > 5000000) { // 5MB limit
      setError(`Payload too large (${Math.round(payloadSize/1024/1024)}MB). Please remove some images or use smaller images.`);
      return;
    }
    
    // Validation to satisfy backend requirements
    const normalizedColors = normalizeColors(productForm.colors);
    const missingFields = [];
    if (!productForm.name) missingFields.push('Product Name');
    if (!productForm.price) missingFields.push('Price');
    if (!productForm.description) missingFields.push('Description');
    if (!productForm.fabric) missingFields.push('Fabric');
    if (!productForm.sizes || productForm.sizes.length === 0) missingFields.push('Sizes');
    if (!normalizedColors || normalizedColors.length === 0) missingFields.push('Colors');
    
    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }
    
    console.log('✅ Validation passed, proceeding with API call');
    
    // Auto-generate SKU if not provided
    const finalSku = productForm.sku.trim() || generateSku(productForm.name);
    
    // Generate variants for each color + size combination
    const finalVariants = generateVariants(productForm.name, normalizedColors, productForm.sizes);
    
    if (!productForm.sku.trim()) {
      console.log('🏷️ Auto-generated main SKU:', finalSku, 'for product:', productForm.name);
      console.log('🔄 Generated variants:', finalVariants.length, 'combinations');
      console.log('🎨 Generated variant SKUs:', finalVariants.map(v => `${v.color}-${v.size}: ${v.sku}`));
    }
    
    try {
      const token = localStorage.getItem('featherfold_token');
      console.log('🔑 Token found:', token ? 'Yes' : 'No');
      
      if (!token) {
        setError('Please login to add products');
        return;
      }

      const requestData = {
        ...productForm,
        colors: normalizedColors,
        sku: finalSku,
        variants: finalVariants,
        price: parseFloat(productForm.price),
        originalPrice: parseFloat(productForm.originalPrice),
        availability: parseInt(productForm.availability)
      };

      const response = await fetch(`${API_BASE}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      console.log('📡 Response status:', response.status);
      
      if (response.status === 413) {
        setError('Payload too large! Please use smaller images (max 1MB each, max 5 images total)');
        return;
      }
      
      const responseData = await response.json();
      console.log('📦 Response data:', responseData);

      if (response.ok) {
        setIsAddingProduct(false);
        resetProductForm();
        // Refresh dashboard data to update products list
        fetchDashboardData();
        // Clear SKU search if the added product matches the search
        if (skuSearchTerm && responseData.sku && responseData.sku.toLowerCase() === skuSearchTerm.toLowerCase()) {
          setSearchedProduct(responseData);
        }
      } else {
        console.error('❌ Error response:', responseData);
        setError(responseData.error || 'Failed to add product');
      }
    } catch (error) {
      console.error('💥 Error adding product:', error);
      setError('Error adding product: ' + (error?.message || 'Unknown error'));
    }
  };
  
  // SKU management functions
  const handleSkuSearch = async () => {
    if (!skuSearchTerm.trim()) {
      setSkuSearchError('Please enter a SKU ID');
      return;
    }

    setSkuSearchLoading(true);
    setSkuSearchError(null);
    setSearchedProduct(null);

    try {
      // First try to find in local products array (main SKU)
      const localProduct = products.find(p => 
        p.sku && p.sku.toLowerCase() === skuSearchTerm.toLowerCase().trim()
      );

      if (localProduct) {
        setSearchedProduct(localProduct);
        setEditingSkuData(localProduct);
        // Load extended data from product if available
        if (localProduct.reserved !== undefined) {
          setSkuExtendedData({
            reserved: localProduct.reserved || 15,
            warehouse: localProduct.warehouse || 'Panipat FC',
            lowStockAlert: localProduct.lowStockAlert || 50,
            fulfillmentType: localProduct.fulfillmentType || 'FBA',
            minPrice: localProduct.minPrice || 2199,
            maxPrice: localProduct.maxPrice || 2999,
            gstApplied: localProduct.gstApplied !== undefined ? localProduct.gstApplied : true,
            gstRate: localProduct.gstRate || 12,
            weight: localProduct.weight || 1.2,
            dimensions: localProduct.dimensions || '30 × 25 × 5 cm',
            returnable: localProduct.returnable !== undefined ? localProduct.returnable : true,
            courier: localProduct.courier || 'Ekart / Amazon'
          });
        }
      } else {
        // Try to find in variants locally
        const localVariant = products.find(p => 
          p.variants && p.variants.some(variant => 
            variant.sku && variant.sku.toLowerCase() === skuSearchTerm.toLowerCase().trim()
          )
        );
        
        if (localVariant) {
          const variant = localVariant.variants.find(variant => 
            variant.sku && variant.sku.toLowerCase() === skuSearchTerm.toLowerCase().trim()
          );
          const productWithVariant = {
            ...localVariant,
            isVariant: true,
            variantInfo: {
              color: variant.color,
              size: variant.size,
              colorValue: variant.colorValue,
              colorClass: variant.colorClass,
              variantSku: variant.sku,
              availability: variant.availability
            }
          };
          setSearchedProduct(productWithVariant);
          setEditingSkuData(productWithVariant);
          // Load extended data from variant if available
          if (variant.reserved !== undefined) {
            setSkuExtendedData({
              reserved: variant.reserved || 15,
              warehouse: variant.warehouse || 'Panipat FC',
              lowStockAlert: variant.lowStockAlert || 50,
              fulfillmentType: variant.fulfillmentType || 'FBA',
              minPrice: variant.minPrice || 2199,
              maxPrice: variant.maxPrice || 2999,
              gstApplied: variant.gstApplied !== undefined ? variant.gstApplied : true,
              gstRate: variant.gstRate || 12,
              weight: variant.weight || 1.2,
              dimensions: variant.dimensions || '30 × 25 × 5 cm',
              returnable: variant.returnable !== undefined ? variant.returnable : true,
              courier: variant.courier || 'Ekart / Amazon'
            });
          }
        } else {
          // If not found locally, try API
          const token = localStorage.getItem('featherfold_token');
          const response = await fetch(`${API_BASE}/api/admin/products/sku/${skuSearchTerm.trim()}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const product = await response.json();
            setSearchedProduct(product);
            setEditingSkuData(product);
            // Load extended data from API response if available
            setSkuExtendedData({
              reserved: product.reserved || 15,
              warehouse: product.warehouse || 'Panipat FC',
              lowStockAlert: product.lowStockAlert || 50,
              fulfillmentType: product.fulfillmentType || 'FBA',
              minPrice: product.minPrice || 2199,
              maxPrice: product.maxPrice || 2999,
              gstApplied: product.gstApplied !== undefined ? product.gstApplied : true,
              gstRate: product.gstRate || 12,
              weight: product.weight || 1.2,
              dimensions: product.dimensions || '30 × 25 × 5 cm',
              returnable: product.returnable !== undefined ? product.returnable : true,
              courier: product.courier || 'Ekart / Amazon'
            });
          } else {
            setSkuSearchError('Product not found with this SKU ID');
          }
        }
      }
    } catch (error) {
      console.error('Error searching SKU:', error);
      setSkuSearchError('Failed to search product. Please try again.');
    } finally {
      setSkuSearchLoading(false);
    }
  };

  const handleSkuUpdate = async (field, value) => {
    if (!editingSkuData) return;
    
    const updatedData = { ...editingSkuData };
    
    if (editingSkuData.isVariant) {
      // Update variant-specific data
      updatedData.variantInfo = { ...updatedData.variantInfo, [field]: value };
    } else {
      // Update main product data
      updatedData[field] = value;
    }
    
    setEditingSkuData(updatedData);
  };

  const handleExtendedDataUpdate = (field, value) => {
    setSkuExtendedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSkuChanges = async () => {
    if (!editingSkuData) return;
    
    try {
      const token = localStorage.getItem('featherfold_token');
      const productId = editingSkuData.id;
      
      let updateData;
      if (editingSkuData.isVariant) {
        // Update variant data with extended fields
        updateData = {
          variants: editingSkuData.variants?.map(v => 
            v.sku === editingSkuData.variantInfo.variantSku 
              ? { 
                  ...v, 
                  ...editingSkuData.variantInfo,
                  // Add extended fields to variant
                  reserved: skuExtendedData.reserved,
                  warehouse: skuExtendedData.warehouse,
                  lowStockAlert: skuExtendedData.lowStockAlert,
                  fulfillmentType: skuExtendedData.fulfillmentType,
                  minPrice: skuExtendedData.minPrice,
                  maxPrice: skuExtendedData.maxPrice,
                  gstApplied: skuExtendedData.gstApplied,
                  gstRate: skuExtendedData.gstRate,
                  weight: skuExtendedData.weight,
                  dimensions: skuExtendedData.dimensions,
                  returnable: skuExtendedData.returnable,
                  courier: skuExtendedData.courier
                }
              : v
          )
        };
      } else {
        // Update main product data with all fields
        updateData = {
          price: parseFloat(editingSkuData.price) || 0,
          originalPrice: parseFloat(editingSkuData.originalPrice) || 0,
          availability: parseInt(editingSkuData.availability) || 0,
          // Add all extended fields
          reserved: skuExtendedData.reserved,
          warehouse: skuExtendedData.warehouse,
          lowStockAlert: skuExtendedData.lowStockAlert,
          fulfillmentType: skuExtendedData.fulfillmentType,
          minPrice: skuExtendedData.minPrice,
          maxPrice: skuExtendedData.maxPrice,
          gstApplied: skuExtendedData.gstApplied,
          gstRate: skuExtendedData.gstRate,
          weight: skuExtendedData.weight,
          dimensions: skuExtendedData.dimensions,
          returnable: skuExtendedData.returnable,
          courier: skuExtendedData.courier
        };
      }
      
      console.log('🔄 Saving SKU data:', updateData);
      
      const response = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      console.log('📡 Save response status:', response.status);
      
      if (response.ok) {
        const updatedProduct = await response.json();
        console.log('✅ Save response:', updatedProduct);
        setSearchedProduct(updatedProduct);
        setEditingSkuData(updatedProduct);
        setSkuEditMode(false);
        alert('SKU data updated successfully!');
        // Refresh products list
        fetchDashboardData();
      } else {
        const errorData = await response.json();
        console.error('❌ Save error:', errorData);
        alert(`Failed to update SKU data: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('💥 Error updating SKU:', error);
      alert('Error updating SKU data: ' + (error?.message || 'Unknown error'));
    }
  };

  const cancelSkuEdit = () => {
    setEditingSkuData(searchedProduct);
    setSkuEditMode(false);
  };

  const getSkuStatus = (product) => {
    const stock = product.isVariant ? product.variantInfo.availability : product.availability;
    if (stock <= 0) return { status: 'OUT_OF_STOCK', color: 'red', icon: AlertTriangle };
    if (stock < 10) return { status: 'LOW_STOCK', color: 'yellow', icon: AlertTriangle };
    return { status: 'ACTIVE', color: 'green', icon: CheckCircle };
  };

  const calculatePerformanceMetrics = (product) => {
    // Mock performance data - in real app, this would come from analytics API
    return {
      ordersLast30Days: Math.floor(Math.random() * 200) + 20,
      unitsSold: Math.floor(Math.random() * 300) + 50,
      returns: Math.floor(Math.random() * 10),
      conversionRate: (Math.random() * 5 + 2).toFixed(1)
    };
  };
  
  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('featherfold_token');
      const response = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.ok) {
        resetProductForm();
      } else {
        setError('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Error deleting product');
    }
  };

  const handleUpdateProduct = async (productId) => {
    try {
      const token = localStorage.getItem('featherfold_token');
      console.log('🔑 Token found:', token ? 'Yes' : 'No');
      
      if (!token) {
        setError('Please login to update products');
        return;
      }

      console.log('📝 Updating product:', productId);
      console.log('📝 Form data:', productForm);
      
      // Auto-generate SKU if not provided
      const finalSku = productForm.sku.trim() || generateSku(productForm.name);
      
      // Generate variants for each color + size combination
      const normalizedColors = normalizeColors(productForm.colors);
      const finalVariants = generateVariants(productForm.name, normalizedColors, productForm.sizes);
      
      if (!productForm.sku.trim()) {
        console.log('🏷️ Auto-generated main SKU on update:', finalSku, 'for product:', productForm.name);
        console.log('🔄 Updated variants:', finalVariants.length, 'combinations');
      }
      
      const response = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...productForm,
          colors: normalizedColors,
          sku: finalSku,
          variants: finalVariants,
          price: parseFloat(productForm.price),
          originalPrice: parseFloat(productForm.originalPrice),
          availability: parseInt(productForm.availability)
        })
      });

      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const updatedProduct = await response.json();
        console.log('✅ Update response:', updatedProduct);
        setProducts(products.map(p => p.id === productId ? updatedProduct : p));
        setEditingProduct(null);
        resetProductForm();
        // Update SKU search if the updated product matches the search
        if (searchedProduct && searchedProduct.id === productId) {
          setSearchedProduct(updatedProduct);
        }
        alert('Product updated successfully!');
      } else {
        console.error('❌ Update response:', response);
        setError('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Error updating product: ' + (error?.message || 'Unknown error'));
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;

    console.log('📁 Files selected:', files.length);
    
    const imageArray = [...productForm.images];

    const resizeImage = (file, maxSize = 1400, quality = 0.8) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const targetWidth = Math.round(img.width * scale);
          const targetHeight = Math.round(img.height * scale);

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas not supported'));
            return;
          }
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to resize image'));
                return;
              }
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Invalid image'));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file size (limit to 5MB per image)
      if (file.size > 5 * 1024 * 1024) {
        alert(`Image ${file.name} is too large. Please use images smaller than 5MB.`);
        continue;
      }
      
      // Limit number of images to prevent payload too large
      if (imageArray.length >= 5) {
        alert('Maximum 5 images allowed per product');
        return;
      }
      
      try {
        const resizedFile = await resizeImage(file);

        // Upload image to backend first
        const formData = new FormData();
        formData.append('image', resizedFile);
        
        console.log(`📤 Uploading image ${i + 1}:`, resizedFile.name);
        
        const response = await fetch(`${API_BASE}/api/admin/upload-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('featherfold_token')}`
          },
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ Upload response:', result);
        
        // Store the returned image URL (not base64)
        if (result.imageUrl) {
          const safeImageUrl = result.imageUrl.replace(/^http:\/\//i, 'https://');
          imageArray.push(safeImageUrl);
          setProductForm({...productForm, images: imageArray});
        }
        
      } catch (error) {
        console.error('❌ Image upload error:', error);
        alert(`Failed to upload ${file.name}: ${error.message}`);
      }
    }
  };


  const removeImage = (index) => {
    setProductForm((prevProductForm) => ({
      ...prevProductForm,
      images: prevProductForm.images.filter((_, i) => i !== index),
    }));
  };
  
  // Order management functions
  const handleConfirmOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('featherfold_token');
      const response = await fetch(`${API_BASE}/api/orders/${orderId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Order confirmed successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to confirm order');
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Error confirming order');
    }
  };

  const handleCancelOrder = async (orderId) => {
    const reason = prompt('Please enter cancellation reason:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('featherfold_token');
      const response = await fetch(`${API_BASE}/api/admin/cancel-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, reason })
      });

      if (response.ok) {
        alert('Order cancelled successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error cancelling order');
    }
  };
  
  // User management functions
  const handleSuspendUser = async (userId, suspend) => {
    try {
      const token = localStorage.getItem('featherfold_token');
      const response = await fetch(`${API_BASE}/api/admin/users/${userId}/suspend`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ suspended: suspend })
      });

      if (response.ok) {
        alert(`User ${suspend ? 'suspended' : 'unsuspended'} successfully`);
      } else {
        alert(`Failed to ${suspend ? 'suspend' : 'unsuspend'} user`);
      }
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('Error updating user status');
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) {
      alert('Please enter a new password');
      return;
    }

    setResetLoading(true);
    try {
      const token = localStorage.getItem('featherfold_token');
      const response = await fetch(`${API_BASE}/api/admin/users/${selectedUser.id}/reset-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      });

      if (response.ok) {
        alert('Password reset successfully');
        setShowPasswordResetModal(false);
        setNewPassword('');
        setSelectedUser(null);
      } else {
        alert('Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error resetting password');
    } finally {
      setResetLoading(false);
    }
  };


  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const openPasswordResetModal = (user) => {
    setSelectedUser(user);
    setShowPasswordResetModal(true);
    setNewPassword('');
  };

  const generatePromoCode = () => {
    const length = Math.max(4, Math.min(16, Number(promoForm.codeLength) || 8));
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < length; i += 1) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setPromoForm((prev) => ({ ...prev, code }));
  };

  const handleCreatePromo = async () => {
    setPromoError('');
    const token = localStorage.getItem('featherfold_token');
    if (!token) {
      setPromoError('Please login to manage promo codes');
      return;
    }

    if (!promoForm.code || !promoForm.percent) {
      setPromoError('Code and discount percent are required');
      return;
    }

    try {
      setPromoSaving(true);
      const response = await fetch(`${API_BASE}/api/admin/promo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: promoForm.code.trim().toUpperCase(),
          percent: Number(promoForm.percent),
          startDate: promoForm.startDate || null,
          endDate: promoForm.endDate || null,
          maxUses: Number(promoForm.maxUses) || null
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setPromoError(data?.error || 'Failed to create promo code');
        return;
      }

      setPromos((prev) => [data.promo, ...prev]);
      setPromoForm((prev) => ({
        ...prev,
        code: ''
      }));
    } catch (err) {
      console.error('Promo create error', err);
      setPromoError('Failed to create promo code');
    } finally {
      setPromoSaving(false);
    }
  };

  const handleDeletePromo = async (code) => {
    const token = localStorage.getItem('featherfold_token');
    if (!token) {
      setPromoError('Please login to manage promo codes');
      return;
    }

    if (!confirm(`Delete promo code "${code}"?`)) return;

    try {
      const response = await fetch(`${API_BASE}/api/admin/promo/${encodeURIComponent(code)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPromos((prev) => prev.filter((promo) => promo.code !== code));
      } else {
        const data = await response.json();
        setPromoError(data?.error || 'Failed to delete promo code');
      }
    } catch (err) {
      console.error('Promo delete error', err);
      setPromoError('Failed to delete promo code');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'promos', label: 'Promos', icon: Tag },
    { id: 'sku', label: 'SKU Management', icon: Search },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
      className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const orderedProducts = productOrderIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);
  const unorderedProducts = products.filter((product) => !productOrderIds.includes(product.id));
  const displayProducts = [...orderedProducts, ...unorderedProducts];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between">
                <div>
                  <span className="font-medium">Error:</span> {error}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      console.log('🔧 Manual retry triggered');
                      setError(null);
                    }}
                    className="ml-4 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => setError(null)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
            
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                    (analytics?.revenue?.percentage ?? 0) >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                  }`}>
                    {(analytics?.revenue?.percentage ?? 0) >= 0 ? '+' : ''}{analytics?.revenue?.percentage ?? 0}%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">₹{(analytics?.totalRevenue || 0).toLocaleString('en-IN')}</h3>
                <p className="text-slate-500 text-sm mt-1">Total Revenue</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                    (analytics?.orders?.percentage ?? 0) >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                  }`}>
                    {(analytics?.orders?.percentage ?? 0) >= 0 ? '+' : ''}{analytics?.orders?.percentage ?? 0}%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{analytics?.totalOrders || 0}</h3>
                <p className="text-slate-500 text-sm mt-1">Total Orders</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                    (analytics?.users?.percentage ?? 0) >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                  }`}>
                    {(analytics?.users?.percentage ?? 0) >= 0 ? '+' : ''}{analytics?.users?.percentage ?? 0}%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{analytics?.totalUsers || 0}</h3>
                <p className="text-slate-500 text-sm mt-1">Registered Users</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                    (analytics?.conversionRateData?.percentage ?? 0) >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                  }`}>
                    {(analytics?.conversionRateData?.percentage ?? 0) >= 0 ? '+' : ''}{analytics?.conversionRateData?.percentage ?? 0}%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{analytics?.conversionRate || 0}%</h3>
                <p className="text-slate-500 text-sm mt-1">Conversion Rate</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {analytics?.recentOrders && analytics.recentOrders.length > 0 ? (
                    analytics.recentOrders.map((order, index) => (
                      <div key={order.id} className={`flex items-center justify-between p-3 rounded-xl ${
                        index === 0 ? "bg-indigo-50 border border-indigo-200" : "bg-slate-50"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index === 0 ? "bg-indigo-100" : "bg-blue-100"
                          }`}>
                            <ShoppingCart className={`w-5 h-5 ${index === 0 ? "text-indigo-600" : "text-blue-600"}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-900">Order #{order.id}</p>
                              {index === 0 && (
                                <span className="px-2 py-1 bg-indigo-500 text-white text-xs font-medium rounded-full">
                                  Latest
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className="text-lg font-semibold text-slate-900">₹{(order.total || 0).toLocaleString('en-IN')}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-8">No recent orders</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Products</h3>
                <div className="space-y-3">
                  {analytics?.topProducts && analytics.topProducts.length > 0 ? (
                    analytics.topProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{product.name}</p>
                            <p className="text-sm text-slate-500">{(product.availability || 0)} in stock</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <ArrowUp className="w-4 h-4" />
                          <span className="text-sm font-medium">12%</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-4">No products found</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'users':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Users</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6">
                {users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-medium text-slate-900">User</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Joined</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users
                          .filter(user => 
                            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((user) => (
                          <tr key={user.id} className="border-b hover:bg-slate-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold">
                                    {user.name?.charAt(0) || 'U'}
                                  </span>
                                </div>
                                <span className="font-medium text-slate-900">{user.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{user.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {user.isAdmin ? 'Admin' : 'User'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.suspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                              }`}>
                                {user.suspended ? 'Suspended' : 'Active'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openUserModal(user)}
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openPasswordResetModal(user)}
                                  className="text-orange-600 hover:text-orange-800 p-1 rounded hover:bg-orange-50"
                                  title="Reset Password"
                                >
                                  <Lock className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleSuspendUser(user.id, !user.suspended)}
                                  className={`${user.suspended ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'} p-1 rounded hover:bg-red-50`}
                                  title={user.suspended ? 'Unsuspend User' : 'Suspend User'}
                                >
                                  {user.suspended ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-12">No users found.</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 'orders':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Orders</h3>
              </div>
              <div className="p-6">
                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Order ID</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Customer</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Total</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr key={order.id} className={`border-b hover:bg-slate-50 ${
                            index === 0 ? "border-indigo-500 bg-indigo-50" : "border-slate-100"
                          }`}>
                            <td className="py-3 px-4 font-medium text-slate-900">
                              <div className="flex items-center gap-2">
                                #{order.id}
                                {index === 0 && (
                                  <span className="px-2 py-1 bg-indigo-500 text-white text-xs font-medium rounded-full">
                                    Latest
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {order.userId === 'guest' ? 'Guest Customer' : order.userId}
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900">₹{order.total?.toLocaleString('en-IN') || 0}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {order.status || 'unknown'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2 flex-wrap">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowOrderDetails(true);
                                  }}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs"
                                >
                                  View Details
                                </button>
                                {(order.status === 'pending' || order.status === 'confirmed') && (
                                  <>
                                    {order.status === 'pending' && (
                                      <button
                                        onClick={() => handleConfirmOrder(order.id)}
                                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs"
                                      >
                                        Confirm
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleCancelOrder(order.id)}
                                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                )}
                                {order.status === 'completed' && (
                                  <span className="text-xs text-green-600 font-medium">✓ Completed</span>
                                )}
                                {order.status === 'cancelled' && (
                                  <span className="text-xs text-red-600 font-medium">✗ Cancelled</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-12">No orders found.</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 'messages':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Contact Messages</h3>
                <span className="text-sm text-slate-500">{messages.length} total</span>
              </div>
              <div className="p-6 space-y-4">
                {messages.length === 0 ? (
                  <p className="text-slate-500 text-center py-12">No messages yet.</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{msg.name}</p>
                          <p className="text-sm text-slate-600">{msg.email}{msg.phone ? ` · ${msg.phone}` : ''}</p>
                          {msg.subject && (
                            <p className="text-sm text-slate-500">Subject: {msg.subject}</p>
                          )}
                        </div>
                        <div className="text-sm text-slate-500">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                        </div>
                      </div>
                      <p className="text-slate-700 mt-3 whitespace-pre-wrap">{msg.message}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <a
                          href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject || 'FeatherFold Support'}`)}&body=${encodeURIComponent(`Hi ${msg.name},\n\nThanks for reaching out.\n\n`)}`
                          }
                          className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                        >
                          Reply
                        </a>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        );

      case 'promos':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Promo Codes</h3>
                  <p className="text-sm text-slate-500">Create discounts and control duration + usage limits.</p>
                </div>
              </div>

              {promoError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {promoError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoForm.code}
                      onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="SAVE10"
                    />
                    <button
                      type="button"
                      onClick={generatePromoCode}
                      className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Discount (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={promoForm.percent}
                    onChange={(e) => setPromoForm({ ...promoForm, percent: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Max Uses</label>
                  <input
                    type="number"
                    min="1"
                    value={promoForm.maxUses}
                    onChange={(e) => setPromoForm({ ...promoForm, maxUses: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={promoForm.startDate}
                    onChange={(e) => setPromoForm({ ...promoForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={promoForm.endDate}
                    onChange={(e) => setPromoForm({ ...promoForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Code Length</label>
                  <input
                    type="number"
                    min="4"
                    max="16"
                    value={promoForm.codeLength}
                    onChange={(e) => setPromoForm({ ...promoForm, codeLength: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end mb-8">
                <button
                  onClick={handleCreatePromo}
                  disabled={promoSaving}
                  className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {promoSaving ? 'Saving...' : 'Create Promo Code'}
                </button>
              </div>

              <div className="space-y-3">
                {promos.length === 0 ? (
                  <p className="text-slate-500 text-center py-6">No promo codes yet.</p>
                ) : (
                  promos.map((promo) => (
                    <div key={promo.code} className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="min-w-[200px]">
                        <p className="font-semibold text-slate-900">{promo.code}</p>
                        <p className="text-sm text-slate-500">
                          {promo.percent}% off · {promo.uses || 0}/{promo.maxUses || '∞'} uses
                        </p>
                      </div>
                      <div className="text-sm text-slate-500">
                        {promo.startDate ? new Date(promo.startDate).toLocaleDateString() : 'No start'} → {promo.endDate ? new Date(promo.endDate).toLocaleDateString() : 'No end'}
                      </div>
                      <button
                        onClick={() => handleDeletePromo(promo.code)}
                        className="px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        );

      case 'products':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Products</h3>
                  <button 
                    onClick={() => {
                      resetFormOnly();
                      setIsAddingProduct(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-shadow flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6 p-4 border border-slate-200 rounded-xl bg-white">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h4 className="font-semibold text-slate-900">Products Order (Products Page)</h4>
                      <p className="text-sm text-slate-600">Set the exact position for each product. Position 1 appears first.</p>
                    </div>
                    <button
                      onClick={handleSaveProductOrder}
                      disabled={productOrderSaving || productOrderIds.length === 0}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Order
                    </button>
                  </div>
                </div>
                <div className="mb-6 p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h4 className="font-semibold text-slate-900">Featured Products (Homepage Carousel)</h4>
                      <p className="text-sm text-slate-600">These products rotate on the homepage. Clicking a slide opens the product page.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-slate-700">
                        Rotation (sec)
                      </label>
                      <input
                        type="number"
                        min={2}
                        max={60}
                        value={featuredRotationSeconds}
                        onChange={(e) => setFeaturedRotationSeconds(Number(e.target.value))}
                        className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={handleSaveFeaturedProducts}
                        disabled={featuredSaving}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3 flex-wrap">
                    <select
                      value={featuredAddProductId}
                      onChange={(e) => setFeaturedAddProductId(e.target.value)}
                      className="flex-1 min-w-[240px] px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a product to add…</option>
                      {products
                        .filter((p) => p?.id && !featuredProductIds.includes(p.id))
                        .map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <button
                      onClick={handleAddFeaturedProduct}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {featuredProductIds.length === 0 ? (
                      <p className="text-sm text-slate-500">No featured products selected. Add at least 1 product and click Save.</p>
                    ) : (
                      featuredProductIds.map((id, index) => {
                        const product = products.find((p) => p.id === id);
                        return (
                          <div key={id} className="flex items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                                {product?.images?.[0] ? (
                                  <img src={resolveImage(product.images[0])} alt={product?.name || 'Product'} className="w-full h-full object-contain" />
                                ) : (
                                  <Package className="w-5 h-5 text-slate-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-slate-900 truncate">{product?.name || id}</p>
                                <p className="text-xs text-slate-500 truncate">{id}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => moveFeaturedProduct(index, -1)}
                                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100"
                                title="Move up"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => moveFeaturedProduct(index, 1)}
                                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100"
                                title="Move down"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeFeaturedProduct(id)}
                                className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                                title="Remove"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {displayProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayProducts.map((product, index) => (
                      <div key={product.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                        <div className="aspect-square bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                          {editingProduct === product.id ? (
                            <div className="relative">
                              <img 
                                src={resolveImage(product.images[0])}
                                alt={product.name} 
                                className="w-full h-full object-contain rounded-lg" 
                              />
                              <button
                                onClick={() => setEditingProduct(null)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                                title="Stop editing"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="relative group">
                              <img 
                                src={resolveImage(product.images[0])}
                                alt={product.name} 
                                className="w-full h-full object-contain rounded-lg" 
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center">
                                <button
                                  onClick={() => setEditingProduct(product)}
                                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 z-10"
                                  title="Edit product"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-2">{product.name}</h4>
                        <p className="text-sm text-slate-600 mb-2">{product.brand}</p>
                        {product.sku && (
                          <p className="text-xs text-slate-500 mb-2 font-mono bg-slate-100 px-2 py-1 rounded">ID: {product.sku}</p>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-blue-600">₹{product.price}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-slate-500 line-through">₹{product.originalPrice}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-slate-500">Stock: {product.availability || 0}</span>
                          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full">
                            {product.category || 'Uncategorized'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-slate-500">Position</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={1}
                              max={displayProducts.length}
                              value={index + 1}
                              onChange={(e) => setProductOrderPosition(product.id, Number(e.target.value))}
                              className="w-16 px-2 py-1 border border-slate-200 rounded text-xs text-slate-700"
                            />
                            <button
                              onClick={() => moveProductOrder(product.id, -1)}
                              disabled={index === 0}
                              className="p-1 rounded border border-slate-200 disabled:opacity-40"
                              title="Move up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => moveProductOrder(product.id, 1)}
                              disabled={index === displayProducts.length - 1}
                              className="p-1 rounded border border-slate-200 disabled:opacity-40"
                              title="Move down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setProductForm({
                                name: product.name,
                                brand: product.brand,
                                sku: product.sku || '',
                                variantGroupId: product.variantGroupId || '',
                                variantColor: product.variantColor || '',
                                variantSize: product.variantSize || '',
                                price: product.price.toString(),
                                originalPrice: product.originalPrice?.toString() || '',
                                category: product.category || '',
                                sizes: product.sizes || [],
                                colors: product.colors || [],
                                fabric: product.fabric || '',
                                availability: product.availability?.toString() || '',
                                description: product.description || '',
                                features: product.features || [],
                                careInstructions: product.careInstructions || [],
                                images: product.images || [],
                                variantImages: product.variantImages || []
                              });
                            }}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4">No products found.</p>
                    <button 
                      onClick={() => {
                        resetFormOnly();
                        setIsAddingProduct(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-shadow flex items-center gap-2 mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Product
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 'sku':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">SKU Management - Product Control Panel</h3>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={skuSearchTerm}
                      onChange={(e) => {
                        setSkuSearchTerm(e.target.value);
                        setSkuSearchError(null);
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleSkuSearch()}
                      placeholder="Enter SKU ID to search product..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleSkuSearch}
                    disabled={skuSearchLoading}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2 disabled:opacity-50"
                  >
                    {skuSearchLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    Search SKU
                  </button>
                </div>
                {skuSearchError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {skuSearchError}
                  </div>
                )}
              </div>
            </div>

            {searchedProduct ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="space-y-6">
                  {/* TOP SECTION — Product Snapshot */}
                  <div className="flex items-center gap-6">
                    {/* Product Thumbnail */}
                    <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      {searchedProduct.images && searchedProduct.images.length > 0 ? (
                        <img
                          src={resolveImage(searchedProduct.images[0])}
                          alt={searchedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-slate-300" />
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900 mb-2">{searchedProduct.name}</h2>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-slate-500" />
                          <span className="font-mono text-sm bg-blue-100 px-3 py-1 rounded">
                            {searchedProduct.isVariant ? searchedProduct.variantInfo.variantSku : searchedProduct.sku}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500">Product ID:</span>
                          <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                            {searchedProduct.id}
                          </span>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        {(() => {
                          const statusInfo = getSkuStatus(searchedProduct);
                          const StatusIcon = statusInfo.icon;
                          return (
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-700`}>
                              <StatusIcon className="w-3 h-3" />
                              <span>{statusInfo.status.replace('_', ' ')}</span>
                            </div>
                          );
                        })()}
                        {searchedProduct.isVariant && (
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            Variant: {searchedProduct.variantInfo.color} - {searchedProduct.variantInfo.size}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {!skuEditMode ? (
                        <button
                          onClick={() => setSkuEditMode(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit SKU
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={saveSkuChanges}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={cancelSkuEdit}
                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSearchedProduct(null)}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* SECTION 1 — SKU INFORMATION */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-blue-600" />
                        SKU Details
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">SKU ID</label>
                            <p className="font-mono text-sm bg-white px-3 py-2 rounded mt-1">
                              {searchedProduct.isVariant ? searchedProduct.variantInfo.variantSku : searchedProduct.sku}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Parent SKU</label>
                            <p className="font-mono text-sm bg-white px-3 py-2 rounded mt-1">
                              {searchedProduct.isVariant ? searchedProduct.sku : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Variant</label>
                            <p className="text-sm text-slate-900 mt-1">
                              {searchedProduct.isVariant 
                                ? `Color = ${searchedProduct.variantInfo.color}, Size = ${searchedProduct.variantInfo.size}`
                                : 'Main Product'
                              }
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Size</label>
                            <p className="text-sm text-slate-900 mt-1">
                              {searchedProduct.isVariant ? searchedProduct.variantInfo.size : 
                               searchedProduct.sizes?.join(', ') || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Material</label>
                            <p className="text-sm text-slate-900 mt-1">{searchedProduct.fabric || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Thread Count</label>
                            <p className="text-sm text-slate-900 mt-1">300</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2 — INVENTORY CONTROL */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Warehouse className="w-5 h-5 text-green-600" />
                        Inventory Control
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-slate-600">Available Stock</label>
                          {skuEditMode ? (
                            <input
                              type="number"
                              value={editingSkuData.isVariant ? editingSkuData.variantInfo.availability : editingSkuData.availability}
                              onChange={(e) => handleSkuUpdate('availability', parseInt(e.target.value) || 0)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              min="0"
                            />
                          ) : (
                            <p className="text-xl font-bold text-slate-900 mt-1">
                              {searchedProduct.isVariant ? searchedProduct.variantInfo.availability : searchedProduct.availability} units
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Reserved</label>
                            {skuEditMode ? (
                              <input
                                type="number"
                                value={skuExtendedData.reserved}
                                onChange={(e) => handleExtendedDataUpdate('reserved', parseInt(e.target.value) || 0)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                              />
                            ) : (
                              <p className="text-sm text-slate-900 mt-1">{skuExtendedData.reserved}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Warehouse</label>
                            {skuEditMode ? (
                              <select
                                value={skuExtendedData.warehouse}
                                onChange={(e) => handleExtendedDataUpdate('warehouse', e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="Panipat FC">Panipat FC</option>
                                <option value="Delhi FC">Delhi FC</option>
                                <option value="Mumbai FC">Mumbai FC</option>
                                <option value="Bangalore FC">Bangalore FC</option>
                              </select>
                            ) : (
                              <p className="text-sm text-slate-900 mt-1">{skuExtendedData.warehouse}</p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Low Stock Alert</label>
                            {skuEditMode ? (
                              <input
                                type="number"
                                value={skuExtendedData.lowStockAlert}
                                onChange={(e) => handleExtendedDataUpdate('lowStockAlert', parseInt(e.target.value) || 0)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                              />
                            ) : (
                              <p className="text-sm text-slate-900 mt-1">{skuExtendedData.lowStockAlert}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Fulfillment Type</label>
                            {skuEditMode ? (
                              <select
                                value={skuExtendedData.fulfillmentType}
                                onChange={(e) => handleExtendedDataUpdate('fulfillmentType', e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="FBA">FBA</option>
                                <option value="FBM">FBM</option>
                              </select>
                            ) : (
                              <p className="text-sm text-slate-900 mt-1">{skuExtendedData.fulfillmentType}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3 — PRICING & TAX */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-purple-600" />
                        Pricing & Tax
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">MRP</label>
                            {skuEditMode ? (
                              <input
                                type="number"
                                value={editingSkuData.originalPrice || ''}
                                onChange={(e) => handleSkuUpdate('originalPrice', parseFloat(e.target.value) || 0)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                step="0.01"
                              />
                            ) : (
                              <p className="text-lg font-semibold text-slate-900 mt-1">₹{searchedProduct.originalPrice || searchedProduct.price}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Selling Price</label>
                            {skuEditMode ? (
                              <input
                                type="number"
                                value={editingSkuData.price || ''}
                                onChange={(e) => handleSkuUpdate('price', parseFloat(e.target.value) || 0)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                step="0.01"
                              />
                            ) : (
                              <p className="text-lg font-bold text-blue-600 mt-1">₹{searchedProduct.price}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Discount</label>
                          <p className="text-sm text-slate-900 mt-1">
                            {searchedProduct.originalPrice && searchedProduct.originalPrice > searchedProduct.price
                              ? `${Math.round(((searchedProduct.originalPrice - searchedProduct.price) / searchedProduct.originalPrice) * 100)}%`
                              : '0%'
                            }
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">GST Applied</label>
                            {skuEditMode ? (
                              <select
                                value={skuExtendedData.gstApplied ? 'yes' : 'no'}
                                onChange={(e) => handleExtendedDataUpdate('gstApplied', e.target.value === 'yes')}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </select>
                            ) : (
                              <p className="text-sm text-green-600 mt-1">Yes ({skuExtendedData.gstRate}%)</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Min Price</label>
                            {skuEditMode ? (
                              <input
                                type="number"
                                value={skuExtendedData.minPrice}
                                onChange={(e) => handleExtendedDataUpdate('minPrice', parseFloat(e.target.value) || 0)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                step="0.01"
                              />
                            ) : (
                              <p className="text-sm text-slate-900 mt-1">₹{skuExtendedData.minPrice}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Max Price</label>
                            {skuEditMode ? (
                              <input
                                type="number"
                                value={skuExtendedData.maxPrice}
                                onChange={(e) => handleExtendedDataUpdate('maxPrice', parseFloat(e.target.value) || 0)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                step="0.01"
                              />
                            ) : (
                              <p className="text-sm text-slate-900 mt-1">₹{skuExtendedData.maxPrice}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4 — VARIANT RELATIONSHIP */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <PackageOpen className="w-5 h-5 text-orange-600" />
                        Variants
                      </h3>
                      <div className="space-y-2">
                        {searchedProduct.variants && searchedProduct.variants.length > 0 ? (
                          <>
                            <p className="text-sm text-slate-600 mb-2">
                              Parent SKU: {searchedProduct.sku}
                            </p>
                            {searchedProduct.variants.map((variant, index) => (
                              <div 
                                key={index} 
                                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                                  searchedProduct.isVariant && searchedProduct.variantInfo.variantSku === variant.sku
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'bg-white border-slate-200 hover:bg-slate-50'
                                }`}
                                onClick={() => {
                                  // Handle variant selection
                                  const variantProduct = {
                                    ...searchedProduct,
                                    isVariant: true,
                                    variantInfo: {
                                      color: variant.color,
                                      size: variant.size,
                                      colorValue: variant.colorValue,
                                      colorClass: variant.colorClass,
                                      variantSku: variant.sku,
                                      availability: variant.availability
                                    }
                                  };
                                  setSearchedProduct(variantProduct);
                                  setEditingSkuData(variantProduct);
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-4 h-4 flex items-center justify-center">
                                    <div className={`w-2 h-2 rounded-full ${
                                      searchedProduct.isVariant && searchedProduct.variantInfo.variantSku === variant.sku
                                        ? 'bg-blue-600'
                                        : 'bg-gray-300'
                                    }`} />
                                  </div>
                                  <span className="font-medium text-slate-900">{variant.color}</span>
                                  <span className="text-sm text-slate-600">({variant.size})</span>
                                  <span className="font-mono text-xs bg-purple-100 px-2 py-1 rounded">
                                    {variant.sku}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-slate-600">Stock: {variant.availability}</span>
                                  {searchedProduct.isVariant && searchedProduct.variantInfo.variantSku === variant.sku && (
                                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Current</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <p className="text-slate-500">No variants available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* SECTION 5 — ORDER & PERFORMANCE */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <BarChart className="w-5 h-5 text-indigo-600" />
                        Performance (Last 30 Days)
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Orders</label>
                            <p className="text-xl font-bold text-slate-900 mt-1">
                              {calculatePerformanceMetrics(searchedProduct).ordersLast30Days}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Units Sold</label>
                            <p className="text-xl font-bold text-slate-900 mt-1">
                              {calculatePerformanceMetrics(searchedProduct).unitsSold}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Returns</label>
                            <p className="text-xl font-bold text-red-600 mt-1">
                              {calculatePerformanceMetrics(searchedProduct).returns}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Conversion Rate</label>
                            <p className="text-xl font-bold text-green-600 mt-1">
                              {calculatePerformanceMetrics(searchedProduct).conversionRate}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 6 — LOGISTICS & RETURNS */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-teal-600" />
                        Logistics & Returns
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Weight (kg)</label>
                            {skuEditMode ? (
                              <input
                                type="number"
                                value={skuExtendedData.weight}
                                onChange={(e) => handleExtendedDataUpdate('weight', parseFloat(e.target.value) || 0)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                step="0.1"
                              />
                            ) : (
                              <p className="text-sm text-slate-900 mt-1">{skuExtendedData.weight} kg</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Dimensions</label>
                            {skuEditMode ? (
                              <input
                                type="text"
                                value={skuExtendedData.dimensions}
                                onChange={(e) => handleExtendedDataUpdate('dimensions', e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="L × W × H cm"
                              />
                            ) : (
                              <p className="text-sm text-slate-900 mt-1">{skuExtendedData.dimensions}</p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Returnable</label>
                            {skuEditMode ? (
                              <select
                                value={skuExtendedData.returnable ? 'yes' : 'no'}
                                onChange={(e) => handleExtendedDataUpdate('returnable', e.target.value === 'yes')}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </select>
                            ) : (
                              <p className="text-sm text-green-600 mt-1">Yes</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Courier</label>
                            {skuEditMode ? (
                              <select
                                value={skuExtendedData.courier}
                                onChange={(e) => handleExtendedDataUpdate('courier', e.target.value)}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="Ekart / Amazon">Ekart / Amazon</option>
                                <option value="Delhivery">Delhivery</option>
                                <option value="Blue Dart">Blue Dart</option>
                                <option value="Xpressbees">Xpressbees</option>
                                <option value="Self Ship">Self Ship</option>
                              </select>
                            ) : (
                              <p className="text-sm text-slate-900 mt-1">{skuExtendedData.courier}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="text-center py-16">
                  <Search className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Amazon/Flipkart Style SKU Management</h3>
                  <p className="text-slate-500 mb-8 max-w-2xl mx-auto">
                    Enter a SKU ID to access the comprehensive Product Control Panel with inventory management, 
                    pricing controls, variant relationships, performance analytics, and logistics information.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        );

      case 'analytics':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Analytics Overview</h3>
                {analytics ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl border border-slate-100 bg-gradient-to-br from-blue-50 to-white">
                      <p className="text-sm text-slate-500">Total Revenue</p>
                      <p className="mt-2 text-2xl font-bold text-blue-700">₹{(analytics?.totalRevenue || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-gradient-to-br from-green-50 to-white">
                      <p className="text-sm text-slate-500">Total Orders</p>
                      <p className="mt-2 text-2xl font-bold text-green-700">{analytics.totalOrders}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-gradient-to-br from-purple-50 to-white">
                      <p className="text-sm text-slate-500">Total Users</p>
                      <p className="mt-2 text-2xl font-bold text-purple-700">{analytics.totalUsers}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-gradient-to-br from-orange-50 to-white">
                      <p className="text-sm text-slate-500">Conversion Rate</p>
                      <p className="mt-2 text-2xl font-bold text-orange-700">{analytics.conversionRate}%</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-12">Loading analytics data...</p>
                )}
              </div>

              {analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
                    <h4 className="text-md font-semibold text-slate-900 mb-4">Revenue (Last 7 Days)</h4>
                    <div className="h-48">
                      {(() => {
                        const data = analytics?.charts?.revenueByDay || [];
                        const values = data.map((point) => point.value || 0);
                        const maxValue = Math.max(1, ...values);
                        const points = data.map((point, index) => {
                          const x = (index / Math.max(1, data.length - 1)) * 100;
                          const y = 100 - (point.value / maxValue) * 100;
                          return `${x},${y}`;
                        }).join(' ');

                        return (
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <polyline
                              fill="none"
                              stroke="#7c3aed"
                              strokeWidth="2"
                              points={points}
                            />
                            {data.map((point, index) => {
                              const x = (index / Math.max(1, data.length - 1)) * 100;
                              const y = 100 - (point.value / maxValue) * 100;
                              return (
                                <g key={point.date}>
                                  <circle cx={x} cy={y} r="2" fill="#7c3aed" />
                                  <text x={x} y={Math.max(4, y - 4)} textAnchor="middle" fontSize="4" fill="#4b5563">
                                    {Math.round(point.value)}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        );
                      })()}
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-3">
                      {(analytics?.charts?.revenueByDay || []).map((point) => (
                        <span key={point.date}>{point.date.slice(5)}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
                    <h4 className="text-md font-semibold text-slate-900 mb-4">Orders & Users (Last 7 Days)</h4>
                    <div className="h-48">
                      {(() => {
                        const ordersData = analytics?.charts?.ordersByDay || [];
                        const usersData = analytics?.charts?.usersByDay || [];
                        const maxValue = Math.max(
                          1,
                          ...ordersData.map((point) => point.value || 0),
                          ...usersData.map((point) => point.value || 0)
                        );

                        return (
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            {ordersData.map((point, index) => {
                              const barWidth = 100 / Math.max(1, ordersData.length) - 2;
                              const x = index * (100 / Math.max(1, ordersData.length)) + 1;
                              const height = (point.value / maxValue) * 80;
                              const y = 90 - height;
                              return (
                                <g key={`orders-${point.date}`}>
                                  <rect x={x} y={y} width={barWidth / 2} height={height} fill="#3b82f6" />
                                  <text x={x + barWidth / 4} y={Math.max(6, y - 2)} textAnchor="middle" fontSize="3.5" fill="#374151">
                                    {point.value}
                                  </text>
                                </g>
                              );
                            })}
                            {usersData.map((point, index) => {
                              const barWidth = 100 / Math.max(1, usersData.length) - 2;
                              const x = index * (100 / Math.max(1, usersData.length)) + 1 + barWidth / 2;
                              const height = (point.value / maxValue) * 80;
                              const y = 90 - height;
                              return (
                                <g key={`users-${point.date}`}>
                                  <rect x={x} y={y} width={barWidth / 2} height={height} fill="#10b981" />
                                  <text x={x + barWidth / 4} y={Math.max(6, y - 2)} textAnchor="middle" fontSize="3.5" fill="#374151">
                                    {point.value}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        );
                      })()}
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-3">
                      {(analytics?.charts?.ordersByDay || []).map((point) => (
                        <span key={point.date}>{point.date.slice(5)}</span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Orders</span>
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Users</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h4 className="text-md font-semibold text-slate-900 mb-4">Recent Orders</h4>
                    <div className="space-y-3">
                      {(analytics.recentOrders || []).length > 0 ? (
                        analytics.recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                            <div>
                              <p className="text-sm font-medium text-slate-900">#{order.id}</p>
                              <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-sm font-semibold text-slate-900">₹{(order.total || 0).toLocaleString('en-IN')}</div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500">No recent orders</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h4 className="text-md font-semibold text-slate-900 mb-4">Top Products</h4>
                    <div className="space-y-3">
                      {(analytics.topProducts || []).length > 0 ? (
                        analytics.topProducts.map((product) => (
                          <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
                                {product.images?.[0] ? (
                                  <img src={resolveImage(product.images[0])} alt={product.name} className="w-full h-full object-contain" />
                                ) : (
                                  <Package className="w-4 h-4 text-slate-400" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900">{product.name}</p>
                                <p className="text-xs text-slate-500">Stock: {product.availability || 0}</p>
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-slate-900">₹{(product.price || 0).toLocaleString('en-IN')}</div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500">No products found</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Store Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Store Name</label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => handleSettingChange('storeName', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={settings.phoneNumber}
                      onChange={(e) => handleSettingChange('phoneNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="INR">₹ INR</option>
                      <option value="USD">$ USD</option>
                      <option value="EUR">€ EUR</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Operational Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Maintenance Mode</p>
                      <p className="text-sm text-slate-500">Temporarily disable customer access</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Email Notifications</p>
                      <p className="text-sm text-slate-500">Send order confirmations</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Guest Checkout</p>
                      <p className="text-sm text-slate-500">Allow guest purchases</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.guestCheckout}
                      onChange={(e) => handleSettingChange('guestCheckout', e.target.checked)}
                      className="h-5 w-5"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Shipping & Tax</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Free Shipping Threshold</label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => handleSettingChange('freeShippingThreshold', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Standard Shipping Fee</label>
                    <input
                      type="number"
                      value={settings.standardShippingFee}
                      onChange={(e) => handleSettingChange('standardShippingFee', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Delivery Time</label>
                    <input
                      type="text"
                      value={settings.deliveryTime}
                      onChange={(e) => handleSettingChange('deliveryTime', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={settings.taxRate}
                      onChange={(e) => handleSettingChange('taxRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    {saveStatus && (
                      <span className="text-green-600 text-sm font-medium">✅ {saveStatus}</span>
                    )}
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{menuItems.find(item => item.id === activeTab)?.label}</h3>
              <p className="text-slate-600">This section is under development.</p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          className={`bg-white shadow-lg h-screen sticky top-0 ${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}
          initial={false}
          animate={{ width: isSidebarOpen ? 256 : 0 }}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Add New Product</h3>
                <button
                  onClick={() => setIsAddingProduct(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU (Optional - Auto-generated if empty)</label>
                    <input
                      type="text"
                      name="sku"
                      value={productForm.sku}
                      onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Leave empty to auto-generate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Variant Group ID</label>
                    <input
                      type="text"
                      name="variantGroupId"
                      value={productForm.variantGroupId}
                      onChange={(e) => setProductForm({...productForm, variantGroupId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Same ID for all color/size pages"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Variant Color (for this page)</label>
                    <input
                      type="text"
                      name="variantColor"
                      value={productForm.variantColor}
                      onChange={(e) => setProductForm({...productForm, variantColor: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Beige, Lemon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Variant Size (for this page)</label>
                    <input
                      type="text"
                      name="variantSize"
                      value={productForm.variantSize}
                      onChange={(e) => setProductForm({...productForm, variantSize: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Single, Queen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({...productForm, originalPrice: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fabric</label>
                    <select
                      name="fabric"
                      value={productForm.fabric}
                      onChange={(e) => setProductForm({...productForm, fabric: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                    >
                      {FABRICS.map(fabric => (
                        <option key={fabric} value={fabric}>{fabric}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                    <input
                      type="number"
                      name="availability"
                      value={productForm.availability}
                      onChange={(e) => setProductForm({...productForm, availability: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
                    <input
                      type="text"
                      name="features"
                      value={productForm.features.join(', ')}
                      onChange={(e) => setProductForm({...productForm, features: e.target.value.split(', ').filter(f => f.trim())})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Care Instructions (comma-separated)</label>
                    <input
                      type="text"
                      name="careInstructions"
                      value={productForm.careInstructions.join(', ')}
                      onChange={(e) => setProductForm({...productForm, careInstructions: e.target.value.split(', ').filter(f => f.trim())})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sizes (comma-separated)</label>
                    <input
                      type="text"
                      name="sizes"
                      value={productForm.sizes.join(', ')}
                      onChange={(e) => setProductForm({...productForm, sizes: e.target.value.split(/,\s*/).map(s => s.trim()).filter(f => f.trim())})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                    <div className="space-y-3">
                      {/* Multi-select dropdown */}
                      <div className="relative">
                        <select
                          multiple
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          size="6"
                          value={productForm.colors.map(c => c.value)}
                          onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                            const selectedColors = selectedValues.map(value => 
                              COLORS.find(c => c.value === value)
                            ).filter(Boolean);
                            setProductForm({...productForm, colors: selectedColors});
                          }}
                        >
                          {COLORS.map(color => (
                            <option key={color.value} value={color.value}>
                              {color.name}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple colors</p>
                      </div>
                      
                      {/* Selected colors display */}
                      {productForm.colors.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {productForm.colors.map((color, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {color.name}
                              <button
                                type="button"
                                onClick={() => removeColor(color.value)}
                                className="ml-1 text-blue-500 hover:text-blue-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="product-images"
                      />
                      <label
                        htmlFor="product-images"
                        className="px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Images
                      </label>
                    </div>
                    
                    {productForm.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {productForm.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={resolveImage(image)}
                              alt={`Product image ${index + 1}`}
                              className="w-20 h-20 object-contain rounded-lg border border-slate-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddingProduct(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      console.log('🔘 Submit button clicked!');
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                  >
                    Add Product
                  </button>
                </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Edit Product</h3>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    resetProductForm();
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateProduct(editingProduct.id);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU (Optional - Auto-generated if empty)</label>
                    <input
                      type="text"
                      name="sku"
                      value={productForm.sku}
                      onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Leave empty to auto-generate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({...productForm, originalPrice: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fabric</label>
                    <select
                      name="fabric"
                      value={productForm.fabric}
                      onChange={(e) => setProductForm({...productForm, fabric: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                    >
                      {FABRICS.map(fabric => (
                        <option key={fabric} value={fabric}>{fabric}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                    <input
                      type="number"
                      name="availability"
                      value={productForm.availability}
                      onChange={(e) => setProductForm({...productForm, availability: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
                    <input
                      type="text"
                      name="features"
                      value={productForm.features.join(', ')}
                      onChange={(e) => setProductForm({...productForm, features: e.target.value.split(', ').filter(f => f.trim())})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Care Instructions (comma-separated)</label>
                    <input
                      type="text"
                      name="careInstructions"
                      value={productForm.careInstructions.join(', ')}
                      onChange={(e) => setProductForm({...productForm, careInstructions: e.target.value.split(', ').filter(f => f.trim())})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sizes (comma-separated)</label>
                    <input
                      type="text"
                      name="sizes"
                      value={productForm.sizes.join(', ')}
                      onChange={(e) => setProductForm({...productForm, sizes: e.target.value.split(/,\s*/).map(s => s.trim()).filter(f => f.trim())})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                    <div className="space-y-3">
                      {/* Multi-select dropdown */}
                      <div className="relative">
                        <select
                          multiple
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          size="6"
                          value={productForm.colors.map(c => c.value)}
                          onChange={(e) => {
                            const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                            const selectedColors = selectedValues.map(value => 
                              COLORS.find(c => c.value === value)
                            ).filter(Boolean);
                            setProductForm({...productForm, colors: selectedColors});
                          }}
                        >
                          {COLORS.map(color => (
                            <option key={color.value} value={color.value}>
                              {color.name}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple colors</p>
                      </div>
                      
                      {/* Selected colors display */}
                      {productForm.colors.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {productForm.colors.map((color, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {color.name}
                              <button
                                type="button"
                                onClick={() => removeColor(color.value)}
                                className="ml-1 text-blue-500 hover:text-blue-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="edit-product-images"
                      />
                      <label
                        htmlFor="edit-product-images"
                        className="px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Images
                      </label>
                    </div>
                    
                    {productForm.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {productForm.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={resolveImage(image)}
                              alt={`Product image ${index + 1}`}
                              className="w-20 h-20 object-contain rounded-lg border border-slate-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      resetProductForm();
                    }}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                  >
                    Update Product
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Details Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{selectedUser.name}</h4>
                    <p className="text-slate-600">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-slate-500">Role</span>
                    <p className="font-medium">{selectedUser.isAdmin ? 'Admin' : 'User'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Status</span>
                    <p className="font-medium">{selectedUser.suspended ? 'Suspended' : 'Active'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Joined</span>
                    <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Last Login</span>
                    <p className="font-medium">{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowUserModal(false);
                      openPasswordResetModal(selectedUser);
                    }}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {showPasswordResetModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Reset Password</h3>
                <button
                  onClick={() => setShowPasswordResetModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-4">
                    Reset password for <strong>{selectedUser.name}</strong> ({selectedUser.email})
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowPasswordResetModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetPassword}
                    disabled={resetLoading || !newPassword}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resetLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Resetting...
                      </div>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderDetails && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowOrderDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Order Details</h3>
                    <p className="text-sm text-slate-500 mt-1">Order #{selectedOrder.id}</p>
                  </div>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Customer</p>
                    <p className="font-medium text-slate-900">
                      {selectedOrder.userId === 'guest' ? 'Guest Customer' : selectedOrder.userId}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Order Date</p>
                    <p className="font-medium text-slate-900">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                    <p className="font-medium text-slate-900">₹{selectedOrder.total?.toLocaleString('en-IN') || 0}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Order Items</h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left p-4 font-medium text-slate-700">Product</th>
                          <th className="text-left p-4 font-medium text-slate-700">SKU</th>
                          <th className="text-left p-4 font-medium text-slate-700">Color</th>
                          <th className="text-left p-4 font-medium text-slate-700">Size</th>
                          <th className="text-right p-4 font-medium text-slate-700">Price</th>
                          <th className="text-center p-4 font-medium text-slate-700">Qty</th>
                          <th className="text-right p-4 font-medium text-slate-700">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((item, index) => (
                          <tr key={index} className="border-t border-slate-200">
                            <td className="p-4">
                              <div>
                                <p className="font-medium text-slate-900">{item.name}</p>
                                <p className="text-sm text-slate-500">{item.fabric || 'Standard'}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-mono text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {item.sku || 'N/A'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded border border-slate-300"
                                  style={{ 
                                    backgroundColor: typeof item.color === 'string' ? 
                                      getColorHex(item.color) : 
                                      typeof item.selectedColor === 'string' ? 
                                        getColorHex(item.selectedColor) : 
                                        item.color?.hex || item.selectedColor?.hex || '#ccc'
                                  }}
                                />
                                <span className="text-sm text-slate-700">
                                  {item.color?.name || item.selectedColor?.name || item.color || item.selectedColor || 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-slate-700">
                                {item.selectedSize || item.size || 'N/A'}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <span className="text-slate-900">₹{item.price?.toLocaleString('en-IN') || 0}</span>
                            </td>
                            <td className="p-4 text-center">
                              <span className="text-slate-900">{item.quantity || 1}</span>
                            </td>
                            <td className="p-4 text-right font-medium">
                              ₹{(item.price * item.quantity)?.toLocaleString('en-IN') || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Shipping Address</h4>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="space-y-1 text-sm text-slate-600">
                        <p>{selectedOrder.shippingAddress.street}</p>
                        <p>
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                        </p>
                        <p>{selectedOrder.shippingAddress.country}</p>
                        {selectedOrder.shippingAddress.phone && (
                          <p>Phone: {selectedOrder.shippingAddress.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
