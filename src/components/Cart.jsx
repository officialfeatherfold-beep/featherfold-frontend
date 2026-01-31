import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  CreditCard,
  Truck,
  Shield,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { apiService } from '../services/api';
import { razorpayService } from '../services/razorpay';
import { cartUtils } from '../utils/dataUtils';

const Cart = ({ cart, onClose, onUpdateCart, user }) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCart, setCurrentCart] = useState(cart || []);
  const [storeSettings, setStoreSettings] = useState({
    taxRate: 18,
    standardShippingFee: 50,
    freeShippingThreshold: 500
  });

  // Sync with cart utilities
  useEffect(() => {
    setCurrentCart(cart || []);
  }, [cart]);

  useEffect(() => {
    const savedPromo = localStorage.getItem('featherfold_promo');
    if (!savedPromo) return;
    try {
      const parsed = JSON.parse(savedPromo);
      if (parsed?.code && parsed?.percent) {
        setPromoCode(parsed.code);
        setAppliedPromo({ code: parsed.code, percent: Number(parsed.percent) });
      }
    } catch (error) {
      console.error('Invalid promo data in storage');
    }
  }, []);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('adminSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setStoreSettings({
          taxRate: Number(parsed.taxRate ?? 18),
          standardShippingFee: Number(parsed.standardShippingFee ?? 50),
          freeShippingThreshold: Number(parsed.freeShippingThreshold ?? 500)
        });
      }
    } catch (error) {
      console.error('Failed to load admin settings');
    }
  }, []);

  const subtotal = currentCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.standardShippingFee;
  const gst = subtotal * (storeSettings.taxRate / 100);
  const total = subtotal + shipping + gst - discount;

  const updateQuantity = (id, newQuantity, options = {}) => {
    if (newQuantity === 0) {
      removeFromCart(id, options);
    } else {
      cartUtils.updateQuantity(id, newQuantity, options);
      const updatedCart = cartUtils.getCart();
      setCurrentCart(updatedCart);
      if (onUpdateCart) onUpdateCart(updatedCart);
    }
  };

  const removeFromCart = (id, options = {}) => {
    cartUtils.removeFromCart(id, options);
    const updatedCart = cartUtils.getCart();
    setCurrentCart(updatedCart);
    if (onUpdateCart) onUpdateCart(updatedCart);
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      alert('Please enter a promo code');
      return;
    }
    try {
      const data = await apiService.validatePromo(promoCode.trim());
      const percent = Number(data.discountPercent || 0);
      const discountAmount = subtotal * (percent / 100);
      setDiscount(discountAmount);
      setAppliedPromo({ code: data.code, percent });
      localStorage.setItem('featherfold_promo', JSON.stringify({ code: data.code, percent }));
      alert(`${percent}% discount applied!`);
    } catch (err) {
      setAppliedPromo(null);
      setDiscount(0);
      localStorage.removeItem('featherfold_promo');
      alert(err.message || 'Invalid promo code');
    }
  };

  useEffect(() => {
    if (!appliedPromo?.percent) {
      setDiscount(0);
      return;
    }
    const discountAmount = subtotal * (Number(appliedPromo.percent) / 100);
    setDiscount(discountAmount);
  }, [subtotal, appliedPromo]);

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to continue with checkout');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create order first
      const orderData = {
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          type: item.type,
          mattressThickness: item.mattressThickness
        })),
        shippingAddress: {
          street: '123 Demo Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          phone: '+918168587844'
        },
        totalAmount: total
      };

      const orderResponse = await apiService.createOrder(orderData);
      
      if (orderResponse.success) {
        // Process payment with Razorpay
            await razorpayService.processPayment(
          total,
          {
            orderId: orderResponse.order.id,
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: '+918168587844'
          },
          async (paymentResponse) => {
            // Payment successful
            alert('Order placed successfully! You will receive tracking details shortly.');
            onUpdateCart([]);
            localStorage.removeItem('featherfold_promo');
            onClose();
            setIsProcessing(false);
          },
          (error) => {
            // Payment failed
            console.error('Payment error:', error);
            alert(`Payment failed: ${error}`);
            setIsProcessing(false);
          }
        );
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Cart Panel */}
        <motion.div
          className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-hidden"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some FeatherFold products to get started!</p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="glassmorphism p-4 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex space-x-4">
                      {/* Product Image */}
                      <div 
                        className="w-20 h-20 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: item.color?.hex || (typeof item.color === 'string' ? item.color : null) || '#f3f4f6' }}
                      >
                        <span className="text-2xl">🛏️</span>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          {item.name}
                        </h4>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>Size: {item.size} • Type: {item.type}</p>
                          <p>Color: {item.color?.name || typeof item.color === 'string' ? item.color : 'Default'}</p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="w-8 text-center font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">
                              ₹{item.price * item.quantity}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 rounded hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 p-6 space-y-4">
              {/* Promo Code */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={applyPromoCode}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                >
                  Apply
                </button>
              </div>

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">₹{gst.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-purple-600">₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>Free Delivery</span>
                </div>
              </div>

              {/* Checkout Button */}
              <motion.button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Checkout</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {/* User Discount Notice */}
              {user && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">
                    10% discount applied for logged-in users
                  </span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Cart;
