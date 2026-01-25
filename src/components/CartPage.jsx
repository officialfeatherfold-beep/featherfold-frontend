import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Header from './Header';
import { cartUtils } from '../utils/dataUtils';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import EmptyCart from './EmptyCart';

const CartPage = ({ user, onCartOpen, onAuthOpen, onLogout, onAdminOpen, cartCount, totalPrice, onNavigate }) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCart, setCurrentCart] = useState([]);
  const [error, setError] = useState(null);

  // Listen to cart changes
  useEffect(() => {
    const handleCartUpdate = () => {
      setCurrentCart(cartUtils.getCart() || []);
    };

    // Listen for cart updates
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Initial load
    handleCartUpdate();

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const subtotal = currentCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping - discount;

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(id);
    } else {
      cartUtils.updateQuantity(id, newQuantity);
    }
  };

  const removeFromCart = (id) => {
    cartUtils.removeFromCart(id);
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      setError('Please enter a promo code');
      return;
    }

    if (promoCode.toUpperCase() === 'FIRST10') {
      setDiscount(subtotal * 0.1);
      setError(null);
    } else {
      setError('Invalid promo code');
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      setError('Please login to continue with checkout');
      return;
    }

    if (currentCart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // Simply redirect to checkout page with proper navigation
      onNavigate && onNavigate('checkout');
    } catch (error) {
      console.error('Checkout error:', error);
      setError('Failed to proceed to checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-ivory to-white">
      <Header 
        user={user}
        cartCount={cartCount}
        onCartOpen={onCartOpen}
        onAuthOpen={onAuthOpen}
        onLogout={onLogout}
        onAdminOpen={onAdminOpen}
        totalPrice={totalPrice}
        currentView="cart"
        onNavigate={onNavigate}
      />

      <div className="container-custom py-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-8"
        >
          Shopping Cart
        </motion.h1>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-red-700">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-8">
          {currentCart.length === 0 ? (
            <div className="lg:col-span-3">
              <EmptyCart onNavigate={onNavigate} />
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="space-y-4">
                  {currentCart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              </div>

              {/* Cart Sidebar */}
              <div className="lg:col-span-1">
                <OrderSummary
                  items={currentCart}
                  subtotal={subtotal}
                  shipping={shipping}
                  total={total}
                  promoCode={promoCode}
                  setPromoCode={setPromoCode}
                  applyPromoCode={applyPromoCode}
                  discount={discount}
                  isProcessing={isProcessing}
                  onCheckout={handleCheckout}
                  user={user}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
