import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, DollarSign, Truck, Check, Clock, X, ArrowLeft, Home, ShoppingBag } from 'lucide-react';
import Header from './Header';
import { apiService } from '../services/api';

const CustomerOrdersPage = ({ user, onCartOpen, onAuthOpen, onLogout, onAdminOpen, cartCount, totalPrice, onNavigate }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching orders for user:', user?.id || 'guest');
        const response = await apiService.getOrders(user?.id || 'guest');
        console.log('📦 Orders API response:', response);
        const sortedOrders = (response.orders || []).sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setOrders(sortedOrders);
        console.log('✅ Orders loaded and sorted:', sortedOrders.length, 'orders');
      } catch (error) {
        console.error('💥 Failed to fetch orders:', error);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'confirmed':
        return 'text-blue-600 bg-blue-50';
      case 'shipped':
        return 'text-purple-600 bg-purple-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <Check className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <Package className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
          currentView="orders"
          onNavigate={onNavigate}
        />
        <div className="container-custom py-24 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
          currentView="orders"
          onNavigate={onNavigate}
        />
        <div className="container-custom py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error Loading Orders</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
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
        currentView="orders"
        onNavigate={(view) => {
          if (view === 'orders') navigate('/orders');
          else if (view === 'products') navigate('/products');
          else if (view === 'home') navigate('/');
        }}
      />

      <div className="container-custom py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-purple-600" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">My Orders</h1>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Package className="w-5 h-5" />
                  Refresh Orders
                </motion.button>
                <motion.button
                  onClick={() => navigate('/products')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Continue Shopping
                </motion.button>
                <motion.button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="w-5 h-5" />
                  Go Home
                </motion.button>
              </div>
            </div>
          </motion.div>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Orders Yet</h2>
              <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping to see your orders here!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => navigate('/products')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Continue Shopping
                </motion.button>
                <motion.button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="w-5 h-5" />
                  Go Home
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-semibold">₹{order.total?.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Package className="w-4 h-4" />
                              <span>{order.items?.length || 0} items</span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Payment:</span> {order.paymentMethod}
                            </p>
                            {order.shippingAddress && (
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Delivery:</span> {order.shippingAddress.city}, {order.shippingAddress.state}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:ml-4">
                      <motion.button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details
                      </motion.button>
                      {order.status === 'delivered' && (
                        <motion.button
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Track Order
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.slice(0, 3).map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-gray-600">
                                Qty: {item.quantity} • Size: {item.size || 'Standard'} • Color: {(() => {
                                  if (!item.color) return 'Default';
                                  if (typeof item.color === 'string') return item.color;
                                  if (item.color.name) return item.color.name;
                                  return 'Default';
                                })()}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-gray-600 text-center pt-2">
                            +{order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrdersPage;
