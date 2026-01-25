import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Home, ShoppingBag, Loader2 } from 'lucide-react';
import Header from './Header';
import { apiService } from '../services/api';

function OrderSuccessContent({ user, onCartOpen, onAuthOpen, onLogout, onAdminOpen, cartCount, totalPrice, onNavigate }) {
  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Extract order ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('orderId');
    setOrderId(id);

    if (id) {
      // Fetch order details using apiService (with authentication)
      apiService.getOrder(id)
        .then((data) => {
          if (data.order) {
            setOrder(data.order);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch order:', error);
        });
    }
  }, []);

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
        currentView="order-success"
        onNavigate={onNavigate}
      />

      <div className="container-custom py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
            >
              Order Placed Successfully!
            </motion.h1>
            {orderId && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 mb-2"
              >
                Order ID: <span className="font-semibold">{orderId}</span>
              </motion.p>
            )}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600"
            >
              Thank you for your order. We've sent a confirmation email to your registered email address.
            </motion.p>
          </div>

          {order && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-soft-lg p-8 mb-8 text-left"
            >
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-display font-semibold text-gray-900">
                  Order Details
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-gray-900">₹{order.total?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold text-gray-900 capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold capitalize ${
                    order.status === 'pending' ? 'text-yellow-600' :
                    order.status === 'shipped' ? 'text-blue-600' :
                    order.status === 'delivered' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={() => orderId ? window.location.href = `/orders/${orderId}` : (onNavigate && onNavigate('orders'))}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Package className="w-5 h-5" />
              View Order Details
            </motion.button>
            <motion.button
              onClick={() => onNavigate && onNavigate('products')}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </motion.button>
            <motion.button
              onClick={() => onNavigate && onNavigate('home')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
              Go Home
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage(props) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Header 
          user={props.user}
          cartCount={props.cartCount}
          onCartOpen={props.onCartOpen}
          onAuthOpen={props.onAuthOpen}
          onLogout={props.onLogout}
          onAdminOpen={props.onAdminOpen}
          totalPrice={props.totalPrice}
          currentView="order-success"
          onNavigate={props.onNavigate}
        />
        <div className="container-custom py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    }>
      <OrderSuccessContent {...props} />
    </Suspense>
  );
}
