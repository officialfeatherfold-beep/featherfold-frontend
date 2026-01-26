import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Star, 
  ArrowLeft,
  Search,
  Filter,
  Grid3X3,
  List,
  Sparkles,
  Shield,
  Truck
} from 'lucide-react';
import { wishlistUtils, cartUtils, normalizeProduct, resolveImage } from '../utils/dataUtils';
import Header from './Header';

const FavoritesPageNew = ({ 
  user, 
  onCartOpen, 
  onAuthOpen, 
  onLogout, 
  onAdminOpen, 
  cartCount, 
  totalPrice, 
  onNavigate 
}) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price-low', 'price-high'
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Use dynamic API base URL consistent with AdminDashboard
  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'https://featherfold-backendnew1-production.up.railway.app' 
    : 'https://featherfold-backendnew1-production.up.railway.app';

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        
        // Get wishlist IDs from localStorage
        const wishlist = wishlistUtils.getWishlist();
        
        if (wishlist.length === 0) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        // Fetch full product details for each wishlist item
        const productPromises = wishlist.map(async (productId) => {
          try {
            const response = await fetch(`${API_BASE}/api/products/${productId}`);
            
            if (!response.ok) {
              console.error(`Failed to fetch product ${productId}: ${response.status}`);
              return null;
            }
            
            const data = await response.json();
            return normalizeProduct(data.product || data);
          } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            return null;
          }
        });

        const products = await Promise.all(productPromises);
        const validProducts = products.filter(product => product !== null);
        
        setFavorites(validProducts);
      } catch (error) {
        console.error("Error loading favorites:", error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      loadFavorites();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  const removeFromFavorites = (productId) => {
    wishlistUtils.toggleWishlist(productId);
    
    setFavorites(prev =>
      prev.filter(p => String(p?.id) !== String(productId))
    );

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const addToCart = async (product) => {
    await cartUtils.addToCart(product, { quantity: 1 });
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Filter and sort favorites
  const filteredAndSortedFavorites = favorites
    .filter(product => {
      if (!product) return false;
      
      const matchesSearch = !searchTerm || 
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        !selectedCategory ||
        product?.fabric?.toLowerCase() === selectedCategory.toLowerCase() ||
        (product?.fabric && selectedCategory === 'cotton' && product.fabric.toLowerCase().includes('cotton'));
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a?.price || 0) - (b?.price || 0);
        case 'price-high':
          return (b?.price || 0) - (a?.price || 0);
        case 'name':
        default:
          return (a?.name || '').localeCompare(b?.name || '');
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Header 
          user={user}
          cartCount={cartCount}
          onCartOpen={onCartOpen}
          onAuthOpen={onAuthOpen}
          onLogout={onLogout}
          onAdminOpen={onAdminOpen}
          totalPrice={totalPrice}
          currentView="favorites"
          onNavigate={onNavigate}
        />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header 
        user={user}
        cartCount={cartCount}
        onCartOpen={onCartOpen}
        onAuthOpen={onAuthOpen}
        onLogout={onLogout}
        onAdminOpen={onAdminOpen}
        totalPrice={totalPrice}
        currentView="favorites"
        onNavigate={onNavigate}
      />
      
      <main className="container-custom py-8" style={{ paddingTop: '120px' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white fill-current" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-yellow-800" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              My Favorites
            </h1>
            <p className="text-gray-600 text-lg">
              {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </motion.div>

          {favorites.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Heart className="w-16 h-16 text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No favorites yet
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start adding products to your favorites to see them here. Click the heart icon on any product you love!
              </p>
              <button
                onClick={() => navigate('/products')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 inline-flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Products
              </button>
            </motion.div>
          ) : (
            <>
              {/* Filters and Controls */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 mb-8"
              >
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search favorites..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="all">All Categories</option>
                    <option value="cotton">Cotton</option>
                    <option value="silk">Silk</option>
                    <option value="linen">Linen</option>
                    <option value="polyester">Polyester</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-xl transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-xl transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Results Count */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 text-center"
              >
                <p className="text-gray-600">
                  Showing {filteredAndSortedFavorites.length} of {favorites.length} favorites
                </p>
              </motion.div>

              {/* Products Grid/List */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${viewMode}-${sortBy}-${selectedCategory}-${searchTerm}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                  }
                >
                  {filteredAndSortedFavorites.map((product, index) => (
                    viewMode === 'grid' ? (
                      /* Grid View */
                      <motion.div
                        key={product?.id || index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                      >
                        {/* Product Image */}
                        <div className="relative h-64 bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
                          {product?.images?.[0] ? (
                            <img 
                              src={resolveImage(product.images[0])}
                              alt={product?.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-6xl opacity-20">🛏️</div>
                            </div>
                          )}
                          
                          {/* Overlay Actions */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                              <button
                                onClick={() => addToCart(product)}
                                className="flex-1 bg-white text-gray-900 py-2 px-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                              >
                                <ShoppingBag className="w-4 h-4" />
                                Add to Cart
                              </button>
                              <button
                                onClick={() => removeFromFavorites(product?.id)}
                                className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Remove Button (Always Visible) */}
                          <button
                            onClick={() => removeFromFavorites(product?.id)}
                            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 transition-colors group-hover:scale-110"
                          >
                            <Heart className="w-5 h-5 text-red-500 fill-current" />
                          </button>

                          {/* Badge */}
                          {product?.isNew && (
                            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              New
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {product?.name || 'Unknown Product'}
                          </h3>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">(4.8)</span>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-2xl font-bold text-gray-900">₹{product?.price || 0}</span>
                              {product?.originalPrice && product.originalPrice > (product?.price || 0) && (
                                <span className="text-lg text-gray-500 line-through ml-2">
                                  ₹{product.originalPrice}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {product?.availability || product?.stock || 10} in stock
                            </div>
                          </div>

                          {/* Colors */}
                          <div className="flex gap-2 mb-4">
                            {(product?.colors || []).slice(0, 3).map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className={`w-6 h-6 rounded-full border-2 border-gray-200 ${
                                  typeof color === 'string' 
                                    ? `bg-${color.toLowerCase()}` 
                                    : color.class || 'bg-gray-200'
                                }`}
                                title={typeof color === 'string' ? color : color.name}
                              />
                            ))}
                            {(product?.colors || []).length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                +{(product?.colors || []).length - 3}
                              </div>
                            )}
                          </div>

                          {/* Features */}
                          <div className="flex gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              <span>Premium</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Truck className="w-3 h-3" />
                              <span>Free Shipping</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      /* List View */
                      <motion.div
                        key={product?.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                      >
                        <div className="flex gap-6">
                          {/* Product Image */}
                          <div className="w-32 h-32 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden flex-shrink-0">
                            {product?.images?.[0] ? (
                              <img 
                                src={resolveImage(product.images[0])}
                                alt={product?.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="text-3xl opacity-20">🛏️</div>
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {product?.name || 'Unknown Product'}
                              </h3>
                              <button
                                onClick={() => removeFromFavorites(product?.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                              >
                                <Heart className="w-5 h-5 fill-current" />
                              </button>
                            </div>

                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">(4.8)</span>
                              </div>
                              <span className="text-sm text-gray-600">
                                {product?.fabric || 'Premium Cotton'}
                              </span>
                              <span className="text-sm text-gray-600">
                                {product?.availability || product?.stock || 10} in stock
                              </span>
                            </div>

                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {product?.description || 'Premium quality product with exceptional comfort and style.'}
                            </p>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-2xl font-bold text-gray-900">₹{product?.price || 0}</span>
                                {product?.originalPrice && product.originalPrice > (product?.price || 0) && (
                                  <span className="text-lg text-gray-500 line-through ml-2">
                                    ₹{product.originalPrice}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => navigate(`/products/${product?.id}`)}
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => addToCart(product)}
                                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
                                >
                                  <ShoppingBag className="w-4 h-4" />
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* No Results */}
              {filteredAndSortedFavorites.length === 0 && favorites.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No matching favorites
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSortBy('name');
                    }}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default FavoritesPageNew;
