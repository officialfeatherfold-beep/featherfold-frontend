import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  User, 
  X, 
  Menu, 
  Zap, 
  Shield, 
  Truck,
  ChevronDown,
  LogOut,
  MapPin,
  Settings,
  Package,
  Heart
} from 'lucide-react';

const Header = ({ 
  user, 
  cartCount, 
  favoritesCount,
  onCartOpen, 
  onAuthOpen, 
  onLogout, 
  totalPrice,
  onAdminOpen,
  currentView,
  onNavigate
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 17) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    };

    handleScroll();
    updateGreeting();
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const freeShippingThreshold = 500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);
  const freeShippingProgress = Math.min(100, (totalPrice / freeShippingThreshold) * 100);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glassmorphism shadow-lg`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.button
              type="button"
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center gap-3 text-left shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center border border-purple-200 shadow-sm overflow-hidden">
                <img
                  src="/logo.png"
                  alt="FeatherFold"
                  className="w-full h-full object-contain p-1"
                  onError={() => setLogoFailed(true)}
                />
                {logoFailed && (
                  <span className="absolute inset-0 flex items-center justify-center text-purple-600 font-bold text-xl">
                    F
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">FeatherFold</h1>
                <p className="text-xs text-gray-600 whitespace-nowrap">Premium Cotton</p>
              </div>
            </motion.button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => onNavigate && onNavigate('home')}
                className={`text-gray-700 hover:text-purple-600 transition-colors font-medium ${
                  currentView === 'home' ? 'text-purple-600' : ''
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate && onNavigate('products')}
                className={`text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center space-x-2 ${
                  currentView === 'products' ? 'text-purple-600' : ''
                }`}
              >
                <Package className="w-4 h-4" />
                All Products
              </button>
              <button
                onClick={() => onNavigate && onNavigate('cart')}
                className={`text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center space-x-2 ${
                  currentView === 'cart' ? 'text-purple-600' : ''
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Cart
                {cartCount > 0 && (
                  <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-1 ml-2">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => onNavigate && onNavigate('favorites')}
                className={`text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center space-x-2 ${
                  currentView === 'favorites' ? 'text-purple-600' : ''
                }`}
              >
                <Heart className="w-4 h-4" />
                Favorites
                {favoritesCount > 0 && (
                  <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-1 ml-2">
                    {favoritesCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => onNavigate && onNavigate('features')}
                className={`text-gray-700 hover:text-purple-600 transition-colors font-medium ${
                  currentView === 'features' ? 'text-purple-600' : ''
                }`}
              >
                Features
              </button>
              <button
                onClick={() => onNavigate && onNavigate('reviews')}
                className={`text-gray-700 hover:text-purple-600 transition-colors font-medium ${
                  currentView === 'reviews' ? 'text-purple-600' : ''
                }`}
              >
                Reviews
              </button>
              <button
                onClick={() => onNavigate && onNavigate('faq')}
                className={`text-gray-700 hover:text-purple-600 transition-colors font-medium ${
                  currentView === 'faq' ? 'text-purple-600' : ''
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => onNavigate && onNavigate('contact')}
                className={`text-gray-700 hover:text-purple-600 transition-colors font-medium ${
                  currentView === 'contact' ? 'text-purple-600' : ''
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* User Section */}
              {user ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg glassmorphism hover:bg-white/30 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 hidden sm:block">
                      {greeting}, {user.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </motion.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="p-4 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <div className="p-2">
                          {user.isAdmin && (
                            <button 
                              onClick={() => {
                                console.log('🔧 Admin Dashboard button clicked!', { user, onNavigate });
                                onNavigate && onNavigate('admin');
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 rounded-lg flex items-center space-x-2"
                            >
                              <Settings className="w-4 h-4" />
                              <span>Admin Dashboard</span>
                            </button>
                          )}
                          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>Manage Addresses</span>
                          </button>
                          <button 
                            onClick={() => onNavigate && onNavigate('orders')}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Order History</span>
                          </button>
                          <button 
                            onClick={onLogout}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  onClick={onAuthOpen}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign In</span>
                </motion.button>
              )}

              {/* Cart Button */}
              <motion.button
                onClick={() => onNavigate && onNavigate('cart')}
                className="relative p-2 rounded-lg glassmorphism hover:bg-white/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="w-6 h-6 text-gray-700" />
                {cartCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg glassmorphism hover:bg-white/30 transition-all"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Free Shipping Progress Bar */}
          {totalPrice > 0 && totalPrice < freeShippingThreshold && (
            <motion.div
              className="mt-4 px-4 py-2 bg-green-50 rounded-lg border border-green-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-700 font-medium">
                  🎉 Add ₹{remainingForFreeShipping} more for FREE Shipping!
                </span>
                <Truck className="w-4 h-4 text-green-600" />
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${freeShippingProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => {onNavigate && onNavigate('home'); setIsMobileMenuOpen(false);}}
                  className={`block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-left ${
                    currentView === 'home' ? 'bg-purple-50 text-purple-600' : ''
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {onNavigate && onNavigate('products'); setIsMobileMenuOpen(false);}}
                  className={`block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-left flex items-center space-x-2 ${
                    currentView === 'products' ? 'bg-purple-50 text-purple-600' : ''
                  }`}
                >
                  <Package className="w-4 h-4" />
                  All Products
                </button>
                <button
                  onClick={() => {onNavigate && onNavigate('cart'); setIsMobileMenuOpen(false);}}
                  className={`block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-left flex items-center space-x-2 ${
                    currentView === 'cart' ? 'bg-purple-50 text-purple-600' : ''
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Cart
                  {cartCount > 0 && (
                    <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-1 ml-2">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {onNavigate && onNavigate('favorites'); setIsMobileMenuOpen(false);}}
                  className={`block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-left flex items-center space-x-2 ${
                    currentView === 'favorites' ? 'bg-purple-50 text-purple-600' : ''
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  Favorites
                </button>
                <button
                  onClick={() => {onNavigate && onNavigate('features'); setIsMobileMenuOpen(false);}}
                  className={`block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-left ${
                    currentView === 'features' ? 'bg-purple-50 text-purple-600' : ''
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => {onNavigate && onNavigate('reviews'); setIsMobileMenuOpen(false);}}
                  className={`block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-left ${
                    currentView === 'reviews' ? 'bg-purple-50 text-purple-600' : ''
                  }`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => {onNavigate && onNavigate('faq'); setIsMobileMenuOpen(false);}}
                  className={`block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-left ${
                    currentView === 'faq' ? 'bg-purple-50 text-purple-600' : ''
                  }`}
                >
                  FAQ
                </button>
                <button
                  onClick={() => {onNavigate && onNavigate('contact'); setIsMobileMenuOpen(false);}}
                  className={`block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-left ${
                    currentView === 'contact' ? 'bg-purple-50 text-purple-600' : ''
                  }`}
                >
                  Contact
                </button>
                {user && (
                  <button
                    onClick={() => {onNavigate && onNavigate('orders'); setIsMobileMenuOpen(false);}}
                    className={`block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-left flex items-center space-x-2 ${
                      currentView === 'orders' ? 'bg-purple-50 text-purple-600' : ''
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Order History
                  </button>
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
