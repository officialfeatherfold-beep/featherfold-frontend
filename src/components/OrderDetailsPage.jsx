import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Calendar, Truck, Check, Clock, Home, ShoppingBag } from 'lucide-react';
import Header from './Header';
import { apiService } from '../services/api';

const OrderDetailsPage = ({ user, onCartOpen, onAuthOpen, onLogout, onAdminOpen, cartCount, totalPrice }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching order details for:', orderId);
        
        const response = await apiService.getOrder(orderId);
        console.log('📦 Order details response:', response);
        setOrder(response.order);
        setTrackingError('');
        if (response?.order?.shiprocketAwb || response?.order?.shiprocketShipmentId) {
          await refreshTracking(response.order.id);
        }
      } catch (error) {
        console.error('💥 Failed to fetch order details:', error);
        if (error.message.includes('Invalid or expired token')) {
          setError('Your session has expired. Please log in again to view order details.');
        } else {
          setError('Failed to load order details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const refreshTracking = async (id) => {
    try {
      setTrackingLoading(true);
      setTrackingError('');
      const data = await apiService.getOrderTracking(id);
      if (data?.order) {
        setOrder(data.order);
      }
      if (data?.error) {
        setTrackingError(data.error);
      }
    } catch (error) {
      setTrackingError('Failed to refresh tracking');
    } finally {
      setTrackingLoading(false);
    }
  };

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
        return <ArrowLeft className="w-4 h-4" />;
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
  const hasAwb = Boolean(order?.shiprocketAwb && String(order.shiprocketAwb).trim() && !/pending/i.test(String(order.shiprocketAwb)));

  if (loading) {
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
          currentView="orders"
          onNavigate={(view) => {
            if (view === 'orders') navigate('/orders');
            else if (view === 'products') navigate('/products');
            else if (view === 'home') navigate('/');
          }}
        />
        <div className="container-custom py-24 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-feather-200 border-t-feather-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
          currentView="orders"
          onNavigate={(view) => {
            if (view === 'orders') navigate('/orders');
            else if (view === 'products') navigate('/products');
            else if (view === 'home') navigate('/');
          }}
        />
        <div className="container-custom py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <ArrowLeft className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error Loading Order</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {error.includes('session has expired') && (
                  <button
                    onClick={() => onAuthOpen && onAuthOpen()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Log In Again
                  </button>
                )}
                <button
                  onClick={() => navigate('/orders')}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back to Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        currentView="orders"
        onNavigate={(view) => {
          if (view === 'orders') navigate('/orders');
          else if (view === 'products') navigate('/products');
          else if (view === 'home') navigate('/');
        }}
      />

      <div className="container-custom py-24">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
            whileHover={{ x: 5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </motion.button>

          {/* Order Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
                <p className="text-lg text-gray-600">Order ID: {orderId}</p>
              </div>
              <div className="text-right">
                <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="text-sm">Order Date</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div>
                  <p className="text-sm">Total Amount</p>
                  <p className="font-medium">₹{order.total?.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Package className="w-5 h-5" />
                <div>
                  <p className="text-sm">Items</p>
                  <p className="font-medium">{order.items?.length || 0} products</p>
                </div>
              </div>
            </div>
          </motion.div>

          

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5YWEwYTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZTwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                    ) : (
                      <Package className="w-8 h-8 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} • Size: {item.size || 'Standard'} • Color: {(() => {
                        const color = item.selectedColor || item.color;
                        if (!color) return 'Default';
                        if (typeof color === 'string') return color;
                        if (color.name) return color.name;
                        return 'Default';
                      })()} • Type: {item.type || 'Standard'}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Shipping & Payment Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Address</h2>
              {order.shippingAddress && (
                <div className="space-y-2 text-gray-600">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.email}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className="font-medium capitalize">{order.paymentStatus || 'Pending'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">₹{order.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shipping Tracking */}
          {order?.shiprocketAwb || order?.shiprocketShipmentId || order?.shiprocketOrderId ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Live Tracking</h2>
                <button
                  onClick={() => refreshTracking(order.id)}
                  disabled={trackingLoading}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  {trackingLoading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700 mb-4">
                <div>
                  <p className="text-gray-500">Shiprocket Order ID</p>
                  <p className="font-medium">{order.shiprocketOrderId || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">AWB</p>
                  <p className="font-medium">{order.shiprocketAwb || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Courier</p>
                  <p className="font-medium">{order.shiprocketCourier || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium">{order.shiprocketStatus || (order.shiprocketAwb ? 'Awaiting updates' : 'Shipment created • AWB pending')}</p>
                </div>
              </div>
              {!order.shiprocketAwb && (
                <p className="text-xs text-slate-500 mb-3">
                  Shipment has been created in Shiprocket. AWB will appear after courier assignment/pickup.
                </p>
              )}
              {order.shiprocketTrackingUrl && (
                <a
                  href={order.shiprocketTrackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-feather-600 hover:text-feather-700 font-medium"
                >
                  Open Tracking Page →
                </a>
              )}
              {trackingError && hasAwb && (
                <p className="text-sm text-red-600 mt-2">{trackingError}</p>
              )}
              {Array.isArray(order.shiprocketTrackingEvents) && order.shiprocketTrackingEvents.length > 0 && (
                <div className="mt-4 space-y-2">
                  {order.shiprocketTrackingEvents.slice(0, 6).map((event, idx) => (
                    <div key={idx} className="text-sm text-gray-600 border-b border-gray-100 pb-2">
                      <p className="font-medium text-gray-800">{event.activity || event.status || 'Update'}</p>
                      <p>{event.date || event.timestamp || ''} {event.location ? `• ${event.location}` : ''}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : null}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <motion.button
              onClick={() => navigate('/orders')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </motion.button>
            <motion.button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-feather-600 text-white rounded-lg hover:bg-feather-700 transition-colors inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </motion.button>
            <motion.button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-4 h-4" />
              Home
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
