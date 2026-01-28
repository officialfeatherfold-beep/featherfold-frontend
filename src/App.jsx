import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Cloud, 
  Shield, 
  Truck, 
  Star, 
  ShoppingBag, 
  Menu, 
  X,
  ChevronRight,
  Check,
  Zap,
  Heart,
  User,
  MapPin,
  Clock,
  MessageCircle,
  Play,
  Pause,
  Package,
  Grid
} from 'lucide-react';
import { apiService, handleGoogleCallback } from './services/api';
import { makeUserAdmin, setDevAdmin } from './utils/adminUtils';
import { wishlistUtils, cartUtils } from './utils/dataUtils';

// Core Components
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductPhotoCarousel from './components/ProductPhotoCarousel';
import Products from './components/Products';
import ProductDetails from './components/ProductDetails';
import MattressConfigurator from './components/MattressConfigurator';
import ColorSwatcher from './components/ColorSwatcher';
import TrustSignals from './components/TrustSignals';
import FAQSection from './components/FAQSection';

// Cart & Checkout Components
import Cart from './components/Cart';
import CheckoutPage from './components/CheckoutPage';
import OrderSummary from './components/OrderSummary';

// Page Components
import OrderSuccessPage from './components/OrderSuccessPage';
import CustomerOrdersPage from './components/CustomerOrdersPage';
import OrderDetailsPage from './components/OrderDetailsPage';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import FavoritesPageNew from './components/FavoritesPageNew';
import FeaturesPage from './components/FeaturesPage';
import ReviewsPage from './components/ReviewsPage';
import FAQPage from './components/FAQPage';
import CartPage from './components/CartPage';
import ContactPage from './components/ContactPage';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import GoogleCallback from './pages/GoogleCallback';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [selectedSize, setSelectedSize] = useState('king');
  const [selectedType, setSelectedType] = useState('fitted');
  const [mattressThickness, setMattressThickness] = useState(8);
  const [backgroundColor, setBackgroundColor] = useState('#f8fafc');
  const [isPlaying, setIsPlaying] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Determine current view based on URL path
  const getCurrentView = () => {
    if (location.pathname.startsWith('/admin')) return 'admin';
    if (location.pathname.startsWith('/products/')) return 'product-details';
    if (location.pathname === '/products') return 'products';
    if (location.pathname === '/favorites') return 'favorites';
    if (location.pathname === '/features') return 'features';
    if (location.pathname === '/reviews') return 'reviews';
    if (location.pathname === '/faq') return 'faq';
    if (location.pathname === '/contact') return 'contact';
    if (location.pathname === '/forgot-password') return 'forgot-password';
    if (location.pathname === '/reset-password') return 'reset-password';
    if (location.pathname === '/cart') return 'cart';
    if (location.pathname === '/checkout') return 'checkout';
    if (location.pathname === '/orders') return 'orders';
    if (location.pathname.startsWith('/order-success')) return 'order-success';
    return 'home';
  };
  
  const currentView = getCurrentView();

  useEffect(() => {
    // Test API connection
    apiService.testConnection().then(() => {
      console.log('API is accessible');
    }).catch(error => {
      console.error('API not accessible:', error);
    });

    // Check for Google OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('token')) {
      console.log('🔍 Google OAuth URL params found:', urlParams.toString());
      const authResult = handleGoogleCallback();
      console.log('🔍 Google OAuth auth result:', authResult);
      if (authResult.success) {
        // Check if user should be admin
        const userWithAdmin = makeUserAdmin(authResult.user);
        console.log('🔍 User after makeUserAdmin:', userWithAdmin);
        setUser(userWithAdmin);
        apiService.setToken(authResult.token);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        console.error('❌ Google OAuth failed:', authResult.error);
      }
    } else {
      console.log('🔍 No Google OAuth token in URL, checking saved user...');
      // Check for saved user
      const savedUser = localStorage.getItem('featherfold_user');
      const savedToken = localStorage.getItem('featherfold_token');
      
      console.log('🔍 Saved user from localStorage:', savedUser);
      console.log('🔍 Saved token from localStorage:', savedToken ? 'exists' : 'missing');
      
      if (savedUser && savedToken) {
        const parsedUser = JSON.parse(savedUser);
        console.log('🔍 Parsed saved user:', parsedUser);
        // Check if user should be admin
        const userWithAdmin = makeUserAdmin(parsedUser);
        console.log('🔍 User after makeUserAdmin (saved):', userWithAdmin);
        setUser(userWithAdmin);
        apiService.setToken(savedToken);
      }
    }
  }, []);

  const handleLogin = (userData, token) => {
    console.log('🔍 handleLogin called with:', { userData, token: token ? 'exists' : 'missing' });
    // Check if user should be admin
    const userWithAdmin = makeUserAdmin(userData);
    console.log('🔍 User after makeUserAdmin (login):', userWithAdmin);
    setUser(userWithAdmin);
    localStorage.setItem('featherfold_user', JSON.stringify(userWithAdmin));
    if (token) {
      apiService.setToken(token);
    }
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    console.log('handleLogout called');
    wishlistUtils.clearWishlist();
    cartUtils.clearCart();
    setUser(null);
    localStorage.removeItem('featherfold_user');
    localStorage.removeItem('featherfold_token');
    apiService.removeToken();
    console.log('Logout cleanup completed');
  };

  const navigateToView = (view) => {
    if (view === 'home') {
      navigate('/');
    } else if (view === 'products') {
      navigate('/products');
    } else if (view === 'admin') {
      navigate('/admin');
    } else if (view === 'favorites') {
      navigate('/favorites');
    } else if (view === 'features') {
      navigate('/features');
    } else if (view === 'reviews') {
      navigate('/reviews');
    } else if (view === 'faq') {
      navigate('/faq');
    } else if (view === 'contact') {
      navigate('/contact');
    } else if (view === 'cart') {
      navigate('/cart');
    } else if (view === 'checkout') {
      navigate('/checkout');
    } else if (view === 'orders') {
      navigate('/orders');
    } else if (view === 'order-success') {
      navigate('/order-success');
    }
  };

  const getTotalItems = () => {
    return cartUtils.getTotalItems();
  };

  const getTotalPrice = () => {
    return cartUtils.getTotalPrice();
  };

  // Sync local cart state with utilities
  useEffect(() => {
    const updateCartState = () => {
      // Update React state to trigger re-renders
      setCartCount(cartUtils.getTotalItems());
    };

    updateCartState();
    window.addEventListener('cartUpdated', updateCartState);

    return () => {
      window.removeEventListener('cartUpdated', updateCartState);
    };
  }, []);

  useEffect(() => {
    const updateFavoritesState = () => {
      try {
        setFavoritesCount(wishlistUtils.getWishlist().length);
      } catch {
        setFavoritesCount(0);
      }
    };

    updateFavoritesState();
    window.addEventListener('wishlistUpdated', updateFavoritesState);

    return () => {
      window.removeEventListener('wishlistUpdated', updateFavoritesState);
    };
  }, []);

  return (
    <div 
      className="min-h-screen transition-all duration-1000 ease-in-out"
      style={{ backgroundColor }}
    >
      <Routes>
        {/* Home Route */}
        <Route path="/" element={
          <>
            <Header 
              user={user}
              cartCount={cartCount}
              favoritesCount={favoritesCount}
              onCartOpen={() => setIsCartOpen(true)}
              onAuthOpen={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
              onAdminOpen={() => setIsAdminOpen(true)}
              totalPrice={getTotalPrice()}
              currentView="home"
              onNavigate={navigateToView}
            />  
            <main>
            <HeroSection 
                isPlaying={isPlaying}
                onPlayToggle={() => setIsPlaying(!isPlaying)}
                onNavigate={navigateToView}
              />
              
              <ProductPhotoCarousel />
              
              <MattressConfigurator 
                selectedType={selectedType}
                mattressThickness={mattressThickness}
                onTypeChange={setSelectedType}
                onThicknessChange={setMattressThickness}
              />
              
              <ColorSwatcher 
                selectedColor={selectedColor}
                onColorChange={(color) => {
                  setSelectedColor(color);
                  setBackgroundColor(color);
                }}
              />
              
              <FAQSection />
            </main>
          </>
        } />

        {/* Products List Route */}
        <Route path="/products" element={
          <>
            <Header 
              user={user}
              cartCount={cartCount}
              favoritesCount={favoritesCount}
              onCartOpen={() => setIsCartOpen(true)}
              onAuthOpen={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
              onAdminOpen={() => setIsAdminOpen(true)}
              totalPrice={getTotalPrice()}
              currentView="products"
              onNavigate={navigateToView}
            />
            <main>
              <Products 
                user={user}
                onNavigate={navigateToView}
              />
            </main>
          </>
        } />

        {/* Product Details Route */}
        <Route path="/products/:id" element={
          <>
            <Header 
              user={user}
              cartCount={cartCount}
              favoritesCount={favoritesCount}
              onCartOpen={() => setIsCartOpen(true)}
              onAuthOpen={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
              onAdminOpen={() => setIsAdminOpen(true)}
              totalPrice={getTotalPrice()}
              currentView="products"
              onNavigate={navigateToView}
            />
            <main>
              <ProductDetails />
            </main>
          </>
        } />

        {/* Favorites Route */}
        <Route path="/favorites" element={
          <>
            <FavoritesPageNew 
              user={user}
              cartCount={cartCount}
              favoritesCount={favoritesCount}
              onCartOpen={() => setIsCartOpen(true)}
              onAuthOpen={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
              onAdminOpen={() => setIsAdminOpen(true)}
              totalPrice={getTotalPrice()}
              onNavigate={navigateToView}
            />
          </>
        } />

        {/* Features Route */}
        <Route path="/features" element={
          <>
            <FeaturesPage 
              user={user}
              cartCount={cartCount}
              favoritesCount={favoritesCount}
              onCartOpen={() => setIsCartOpen(true)}
              onAuthOpen={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
              onAdminOpen={() => setIsAdminOpen(true)}
              totalPrice={getTotalPrice()}
              onNavigate={navigateToView}
            />
          </>
        } />

        {/* Reviews Route */}
        <Route path="/reviews" element={
          <>
            <ReviewsPage 
              user={user}
              cartCount={cartCount}
              favoritesCount={favoritesCount}
              onCartOpen={() => setIsCartOpen(true)}
              onAuthOpen={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
              onAdminOpen={() => setIsAdminOpen(true)}
              totalPrice={getTotalPrice()}
              onNavigate={navigateToView}
            />
          </>
        } />

        {/* FAQ Route */}
        <Route path="/faq" element={
          <>
            <FAQPage 
              user={user}
              cartCount={cartCount}
              favoritesCount={favoritesCount}
              onCartOpen={() => setIsCartOpen(true)}
              onAuthOpen={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
              onAdminOpen={() => setIsAdminOpen(true)}
              totalPrice={getTotalPrice()}
              onNavigate={navigateToView}
            />
          </>
        } />

        {/* Cart Route */}
        <Route path="/cart" element={
          <>
            <CartPage 
              user={user}
              cartCount={cartCount}
              favoritesCount={favoritesCount}
              onCartOpen={() => setIsCartOpen(true)}
              onAuthOpen={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
              onAdminOpen={() => setIsAdminOpen(true)}
              totalPrice={getTotalPrice()}
              onNavigate={navigateToView}
            />
          </>
        } />

        {/* Checkout Route */}
        <Route path="/checkout" element={
          <>
            <CheckoutPage 
              user={user}
              cartCount={cartCount}
              favoritesCount={favoritesCount}
              onCartOpen={() => setIsCartOpen(true)}
              onAuthOpen={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
              onAdminOpen={() => setIsAdminOpen(true)}
              totalPrice={getTotalPrice()}
              onNavigate={navigateToView}
            />
          </>
        } />

        {/* Order Success Route */}
        <Route path="/order-success" element={
          <>
            <OrderSuccessPage 
              user={user}
              cartCount={cartCount}
              favoritesCount={favoritesCount}
              onCartOpen={() => setIsCartOpen(true)}
              onAuthOpen={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
              onAdminOpen={() => setIsAdminOpen(true)}
              totalPrice={getTotalPrice()}
              onNavigate={navigateToView}
            />
          </>
        } />

        {/* Customer Orders Route */}
        <Route path="/orders" element={
          <>
            <CustomerOrdersPage 
              user={user}
              cartCount={cartCount}
              favoritesCount={favoritesCount}
              onCartOpen={() => setIsCartOpen(true)}
              onAuthOpen={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
              onAdminOpen={() => setIsAdminOpen(true)}
              totalPrice={getTotalPrice()}
              onNavigate={navigateToView}
            />
          </>
        } />

        {/* Order Details Route */}
        <Route path="/orders/:orderId" element={
          <>
            <OrderDetailsPage 
              user={user}
              cartCount={cartCount}
              favoritesCount={favoritesCount}
              onCartOpen={() => setIsCartOpen(true)}
              onAuthOpen={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
              onAdminOpen={() => setIsAdminOpen(true)}
              totalPrice={getTotalPrice()}
              onNavigate={navigateToView}
            />
          </>
        } />

        {/* Forgot Password Route */}
        <Route path="/forgot-password" element={
          <>
            <ForgotPassword />
          </>
        } />

        {/* Reset Password Route */}
        <Route path="/reset-password" element={
          <>
            <ResetPassword />
          </>
        } />

        {/* Google Callback Route */}
        <Route path="/google/callback" element={
          <GoogleCallback />
        } />

        {/* Contact Route */}
        <Route path="/contact" element={
          <>
            <ContactPage 
              user={user}
              cartCount={cartCount}
              favoritesCount={favoritesCount}
              onCartOpen={() => setIsCartOpen(true)}
              onAuthOpen={() => setIsAuthOpen(true)}
              onLogout={handleLogout}
              onAdminOpen={() => setIsAdminOpen(true)}
              totalPrice={getTotalPrice()}
              onNavigate={navigateToView}
            />
          </>
        } />

        {/* Admin Dashboard Route */}
        <Route path="/admin" element={
          <ProtectedRoute user={user} requiredRole="admin">
            <>
              <Header 
                user={user}
                cartCount={cartCount}
                favoritesCount={favoritesCount}
                onCartOpen={() => setIsCartOpen(true)}
                onAuthOpen={() => setIsAuthOpen(true)}
                onLogout={handleLogout}
                onAdminOpen={() => setIsAdminOpen(true)}
                totalPrice={getTotalPrice()}
                currentView="admin"
                onNavigate={navigateToView}
              />
              <AdminDashboard 
                user={user}
                onLogout={handleLogout}
              />
            </>
          </ProtectedRoute>
        } />
      </Routes>

      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal 
            onClose={() => setIsAuthOpen(false)}
            onLogin={handleLogin}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <Cart 
            cart={cartUtils.getCart()}
            onClose={() => setIsCartOpen(false)}
            onUpdateCart={(cart) => cartUtils.saveCart(cart)}
            user={user}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
