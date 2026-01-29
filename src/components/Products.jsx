import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  Share2,
  Check,
  Zap,
  Shield,
  Truck,
  Clock,
  Sparkles,
  Filter,
  Search,
  Grid,
  List,
  X,
  Plus,
  Minus,
  Eye,
  RefreshCw
} from 'lucide-react';
import { apiService } from '../services/api';
import { wishlistUtils, cartUtils, normalizeProduct, resolveImage } from '../utils/dataUtils';

const Products = ({ user, onAddToCart, onNavigate }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('position');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    setWishlist(wishlistUtils.getWishlist());
    
    // Listen for wishlist updates
    const handleWishlistUpdate = (e) => {
      setWishlist(e.detail || wishlistUtils.getWishlist());
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching products from backend...');
      
      const response = await apiService.getProducts();
      console.log('📦 Raw API response:', response);

      const productsData = response.products || response || [];
      console.log('📊 Products data:', productsData);
      
      // Normalize product data
      const normalizedProducts = productsData.map(normalizeProduct);
      console.log('🎨 Normalized products:', normalizedProducts);
      
      setProducts(normalizedProducts);
      setFilteredProducts(normalizedProducts);
      console.log('✅ Products loaded successfully:', normalizedProducts.length, 'products');
    } catch (error) {
      console.error('💥 Error fetching products:', error);
      console.log('🔄 Using sample products instead');
      const sampleProducts = getSampleProducts();
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts);
      console.log('✅ Sample products loaded:', sampleProducts.length, 'products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (product) => {
    try {
      const safeProduct = normalizeProduct(product);
      await cartUtils.addToCart(safeProduct);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const getSampleProducts = () => [
    {
      _id: 'sample-1',
      id: 'sample-1',
      name: 'FeatherFold™ Ultra-Soft Premium Cotton Bedsheet Set',
      price: 2999,
      originalPrice: 3999,
      description: 'Experience luxury with our premium cotton bedsheets',
      images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4='],
      category: 'Bedsheets',
      brand: 'FeatherFold',
      availability: 50,
      sizes: ['Queen', 'King'],
      colors: ['White', 'Ivory'],
      fabric: 'Cotton',
      features: ['400 Thread Count', 'Fade-Resistant'],
      isNew: true,
      rating: 4.8,
      reviews: 256
    },
    {
      _id: 'sample-2',
      id: 'sample-2',
      name: 'FeatherFold™ Egyptian Cotton Luxury Collection',
      price: 3499,
      originalPrice: 4499,
      description: 'Indulge in the finest Egyptian cotton',
      images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4='],
      category: 'Bedsheets',
      brand: 'FeatherFold',
      availability: 30,
      sizes: ['Queen', 'King'],
      colors: ['White', 'Sage'],
      fabric: 'Egyptian Cotton',
      features: ['800 Thread Count', 'Temperature Regulating'],
      isNew: false,
      rating: 4.9,
      reviews: 189
    },
    {
      _id: 'sample-3',
      id: 'sample-3',
      name: 'FeatherFold™ Memory Foam Pillow Set',
      price: 1299,
      originalPrice: 1799,
      description: 'Ergonomic memory foam pillows for perfect neck support',
      images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4='],
      category: 'Pillows',
      brand: 'FeatherFold',
      availability: 75,
      sizes: ['Standard'],
      colors: ['White', 'Blue'],
      fabric: 'Memory Foam',
      features: ['Cooling Gel', 'Hypoallergenic'],
      isNew: true,
      rating: 4.6,
      reviews: 142
    },
    {
      _id: 'sample-4',
      id: 'sample-4',
      name: 'FeatherFold™ Luxury Duvet Cover',
      price: 2199,
      originalPrice: 2899,
      description: 'Premium duvet cover with hidden zipper closure',
      images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4='],
      category: 'Duvet Covers',
      brand: 'FeatherFold',
      availability: 40,
      sizes: ['Queen', 'King'],
      colors: ['Gray', 'Navy', 'Beige'],
      fabric: 'Microfiber',
      features: ['Wrinkle-Resistant', 'Easy Care'],
      isNew: false,
      rating: 4.7,
      reviews: 98
    },
    {
      _id: 'sample-5',
      id: 'sample-5',
      name: 'FeatherFold™ Silk Pillowcases Set',
      price: 899,
      originalPrice: 1299,
      description: '100% pure silk pillowcases for hair and skin benefits',
      images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4='],
      category: 'Pillowcases',
      brand: 'FeatherFold',
      availability: 60,
      sizes: ['Standard', 'Queen'],
      colors: ['Champagne', 'Black', 'Pink'],
      fabric: 'Silk',
      features: ['Anti-Aging', 'Temperature Regulating'],
      isNew: true,
      rating: 4.9,
      reviews: 312
    },
    {
      _id: 'sample-6',
      id: 'sample-6',
      name: 'FeatherFold™ Weighted Blanket',
      price: 3999,
      originalPrice: 4999,
      description: 'Therapeutic weighted blanket for better sleep',
      images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4='],
      category: 'Blankets',
      brand: 'FeatherFold',
      availability: 25,
      sizes: ['Throw', 'Queen'],
      colors: ['Gray', 'Navy'],
      fabric: 'Cotton & Glass Beads',
      features: ['7-Layer Construction', 'Removable Cover'],
      isNew: false,
      rating: 4.5,
      reviews: 67
    }
  ];

  // Filter and sort products
  useEffect(() => {
    // ✅ FIX 1: Always clone before sorting to prevent state mutation
    let filtered = [...products];
    
    console.log('🔍 Filtering products:', {
      searchTerm,
      selectedCategory,
      selectedSort,
      totalProducts: products.length
    });

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product => {
        const nameMatch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const descMatch = product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = product.category?.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || descMatch || categoryMatch;
      });
      console.log('🔍 Search results:', filtered.length, 'products found');
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
      console.log('🔍 Category filter results:', filtered.length, 'products found');
    }

    // ✅ FIX 2-4: Corrected sorting logic with numeric safety
    filtered.sort((a, b) => {
      console.log('🔄 Sorting products:', selectedSort, {
        productA: { name: a.name, price: a.price, rating: a.rating, isNew: a.isNew },
        productB: { name: b.name, price: b.price, rating: b.rating, isNew: b.isNew }
      });
      
      switch (selectedSort) {
        case 'position':
          return Number(a.sortOrder || 0) - Number(b.sortOrder || 0);

        case 'name':
          return a.name.localeCompare(b.name);
        
        case 'price-low':
          // ✅ FIX 4: Numeric-safe price sort
          return Number(a.price || 0) - Number(b.price || 0);
        
        case 'price-high':
          // ✅ FIX 4: Numeric-safe price sort
          return Number(b.price || 0) - Number(a.price || 0);
        
        case 'rating':
          // ✅ FIX 3: Force numeric rating
          return Number(b.rating || 0) - Number(a.rating || 0);
        
        case 'newest':
          // ✅ FIX 2: Correct Newest First logic
          if (a.isNew !== b.isNew) {
            return a.isNew ? -1 : 1;
          }
          return 0; // Keep stable order for same isNew status
        
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    console.log('🔄 Filtering complete:', {
      filteredCount: filtered.length,
      viewMode,
      searchTerm,
      selectedCategory,
      selectedSort
    });
  }, [products, searchTerm, selectedCategory, selectedSort]);

  const categories = [
    'all',
    ...new Set(
      products
        .map(p => p.category)
    )
  ];

  const toggleWishlist = (productId) => {
    const updatedWishlist = wishlistUtils.toggleWishlist(productId);
    setWishlist(updatedWishlist);
    
    // Dispatch wishlist update event for global reactivity
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const openQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const ProductCard = ({ product, viewMode }) => {
    console.log('🎨 ProductCard rendering with viewMode:', viewMode);
    const isInWishlist = wishlist.includes(product.id);
    const discount = product.originalPrice > product.price 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    console.log('🖼️ ProductCard rendering:', {
      productId: product.id,
      productName: product.name,
      images: product.images,
      imageCount: product.images?.length || 0,
      firstImage: product.images?.[0]
    });

    return (
      <Link to={`/products/${product.id}`} className="block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: viewMode === 'grid' ? -5 : 0 }}
          className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer ${
            viewMode === 'list' ? 'flex gap-6 p-6' : ''
          }`}
        >
        {/* Product Image */}
        <div className={`relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ${
          viewMode === 'list' ? 'w-48 h-48 flex-shrink-0 rounded-xl' : 'aspect-square'
        }`}>
          {product.isNew && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 left-4 z-10 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
            >
              NEW
            </motion.div>
          )}
          
          {discount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-4 right-4 z-10 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full"
            >
              -{discount}%
            </motion.div>
          )}

          <img
            src={resolveImage(product.images[0])}
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-300"
            onError={(e) => {
              console.error('Image failed to load:', product.images[0]);
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
            }}
            onLoad={() => {
              console.log('✅ Image loaded successfully:', product.images[0]);
            }}
          />
          
          {/* Quick Actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Navigate using React Router
                navigate(`/products/${product.id}`);
              }}
              className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors mr-4"
              title="View Details"
            >
              <Eye className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-800'}`} />
            </button>
            <div className="absolute bottom-4 left-4 right-4 text-white text-center pointer-events-none">
              <p className="text-sm font-medium">Click to View Details</p>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className={`${viewMode === 'list' ? 'flex-1 p-0' : 'p-6'}`}>
          <div className="mb-3">
            <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
              {product.brand}
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-2xl font-bold text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${
                product.availability > 10 
                  ? 'bg-green-100 text-green-700' 
                  : product.availability > 0 
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {product.availability > 10 ? 'In Stock' : 
                 product.availability > 0 ? `Only ${product.availability} left` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {product.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-gray-500 self-center">+{product.colors.length - 3}</span>
            )}
          </div>

          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart(product);
            }}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
              product.availability > 0
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={{ scale: product.availability > 0 ? 1.02 : 1 }}
            whileTap={{ scale: product.availability > 0 ? 0.98 : 1 }}
            disabled={product.availability === 0}
          >
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span>{product.availability > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
            </div>
          </motion.button>
        </div>
      </motion.div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Products Section */}
      <section className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Search and Filters */}
          <div className="mb-8 mt-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    console.log('🔍 Search input changed:', e.target.value);
                    setSearchTerm(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Category Filter */}
                <div className="flex flex-col text-sm">
                  <label className="mb-1 text-gray-600 font-medium">
                    Category
                  </label>

                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        console.log('🔍 Category changed:', e.target.value);
                        setSelectedCategory(e.target.value);
                      }}
                      className="pl-9 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Categories</option>
                      {categories
                        .filter(c => c !== 'all')
                        .map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Sort */}
                <div className="flex flex-col text-sm">
                  <label className="mb-1 text-gray-600 font-medium">
                    Sort By
                  </label>
                  <select
                    value={selectedSort}
                    onChange={(e) => {
                      console.log('🔄 Sort changed:', e.target.value);
                      setSelectedSort(e.target.value);
                    }}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="position">Position</option>
                    <option value="name">Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => {
                      console.log('🔄 Grid button clicked');
                      setViewMode('grid');
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      console.log('🔄 List button clicked');
                      setViewMode('list');
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Our Products
              </h1>
              <p className="text-lg text-gray-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="flex gap-4">
              {filteredProducts.length === 0 && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
              
              <button
                onClick={() => {
                  console.log('🔄 Manual refresh triggered');
                  fetchProducts();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Products
              </button>
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                : 'space-y-6'
            }>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    console.log('🔄 Clearing filters - Browse All Products clicked');
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Browse All Products
                </button>
                
                {/* Debug Info for Empty State */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Debug Info:</h4>
                  <p className="text-sm text-yellow-700">
                    Total Products: {products.length}<br/>
                    Filtered Products: {filteredProducts.length}<br/>
                    Search Term: "{searchTerm}"<br/>
                    Category: "{selectedCategory}"<br/>
                    Sort: "{selectedSort}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsQuickViewOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>
                <button
                  onClick={() => setIsQuickViewOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img
                    src={resolveImage(selectedProduct.images[0])}
                    alt={selectedProduct.name}
                    className="w-full h-80 object-contain bg-gray-100 p-4 rounded-xl"
                  />
                </div>
                
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Price:</span>
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{selectedProduct.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Category:</span>
                        <p className="font-medium">{selectedProduct.category}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Fabric:</span>
                        <p className="font-medium">{selectedProduct.fabric}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Available Sizes:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedProduct.sizes.map((size, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Available Colors:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedProduct.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                    <div className="space-y-2">
                      {selectedProduct.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setIsQuickViewOpen(false);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={selectedProduct.availability === 0}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
