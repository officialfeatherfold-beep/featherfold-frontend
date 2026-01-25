import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Phone,
  MessageCircle,
  Navigation,
  Cloud,
  Shield,
  Home,
  ArrowRight,
  RefreshCw,
  Bell,
  TrendingUp
} from 'lucide-react';
import { apiService } from '../services/api';

const LiveOrderTracker = ({ orderId, user }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveTracking, setLiveTracking] = useState({});
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching live order details for:', orderId);
        
        const response = await apiService.getOrder(orderId);
        console.log('📦 Live order details response:', response);
        setOrder(response.order);
        
        // Calculate estimated delivery (3-5 business days from now)
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3);
        setEstimatedDelivery(deliveryDate.toLocaleDateString('en-IN', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        }));

        // Simulate live tracking data
        setLiveTracking({
          currentStatus: response.order?.status || 'processing',
          currentLocation: response.order?.status === 'shipped' ? 'Mumbai-Pune Highway' : 'Processing Center',
          progress: getProgressPercentage(response.order?.status),
          estimatedTime: response.order?.status === 'delivered' ? 'Delivered' : `${Math.floor(Math.random() * 24) + 2} hours`,
          lastUpdate: new Date().toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        });

      } catch (error) {
        console.error('💥 Failed to fetch live order details:', error);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  // Simulate real-time updates
  useEffect(() => {
    if (!order) return;

    const interval = setInterval(() => {
      setLiveTracking(prev => ({
        ...prev,
        lastUpdate: new Date().toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        // Simulate location updates for shipped orders
        ...(order?.status === 'shipped' && {
          currentLocation: prev.currentLocation === 'Mumbai-Pune Highway' 
            ? 'Pune Toll Plaza' 
            : 'Mumbai-Pune Highway',
          progress: Math.min(prev.progress + 5, 95)
        })
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [order]);

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'ordered': return 10;
      case 'processing': return 25;
      case 'quality': return 40;
      case 'shipped': return 70;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'shipped': return 'text-orange-600 bg-orange-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'quality': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ordered': return <Package className="w-5 h-5" />;
      case 'processing': return <Cloud className="w-5 h-5" />;
      case 'quality': return <Shield className="w-5 h-5" />;
      case 'shipped': return <Truck className="w-5 h-5" />;
      case 'delivered': return <Home className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="mt-4 text-lg font-medium text-gray-700">Loading live order tracking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
            <MessageCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">Tracking Error</h2>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600">The order you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Live Order Tracker</h1>
                <p className="text-sm text-gray-600">Real-time order journey visualization</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Order Summary Card */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Ordered: {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>Total: ₹{order.total?.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Payment: {order.paymentMethod}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Live Status Card */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                Live Status
              </h3>

              {/* Current Status */}
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}</h4>
                    <p className="text-sm text-gray-600">Last updated: {liveTracking.lastUpdate}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Order Progress</span>
                    <span>{liveTracking.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${liveTracking.progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Current Location */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-6 h-6 text-purple-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Current Location</h4>
                      <p className="text-lg font-bold text-purple-600">{liveTracking.currentLocation}</p>
                      <p className="text-sm text-gray-600">Est. arrival: {liveTracking.estimatedTime}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all">
                    <Phone className="w-4 h-4" />
                    <span>Call Support</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all">
                    <MessageCircle className="w-4 h-4" />
                    <span>Message Seller</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Journey Timeline */}
          <div className="lg:col-span-3">
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Journey Timeline</h3>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6 ml-6">
                  {/* Order Placed */}
                  <motion.div
                    className="relative flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="ml-6 flex-1">
                      <h4 className="text-base font-semibold text-gray-900">Order Placed</h4>
                      <p className="text-sm text-gray-600">Your order has been received and confirmed</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                  </motion.div>

                  {/* Processing */}
                  <motion.div
                    className="relative flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Cloud className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-6 flex-1">
                      <h4 className="text-base font-semibold text-gray-900">Processing</h4>
                      <p className="text-sm text-gray-600">FeatherFold is being hand-picked and quality checked</p>
                      <p className="text-xs text-gray-500">2-3 hours after order</p>
                    </div>
                  </motion.div>

                  {/* Quality Check */}
                  <motion.div
                    className="relative flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="ml-6 flex-1">
                      <h4 className="text-base font-semibold text-gray-900">Quality Check</h4>
                      <p className="text-sm text-gray-600">All quality checks passed successfully</p>
                      <p className="text-xs text-gray-500">24-48 hours after order</p>
                    </div>
                  </motion.div>

                  {/* Shipped */}
                  <motion.div
                    className="relative flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.status === 'shipped' ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      <Truck className={`w-5 h-5 ${
                        order.status === 'shipped' ? 'text-orange-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="ml-6 flex-1">
                      <h4 className="text-base font-semibold text-gray-900">Shipped</h4>
                      <p className="text-sm text-gray-600">In Transit via BlueDart Express</p>
                      <p className="text-xs text-gray-500">1-2 days after order</p>
                    </div>
                  </motion.div>

                  {/* Delivered */}
                  <motion.div
                    className="relative flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.status === 'delivered' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Home className={`w-5 h-5 ${
                        order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="ml-6 flex-1">
                      <h4 className="text-base font-semibold text-gray-900">Delivered</h4>
                      <p className="text-sm text-gray-600">Successfully delivered to your address</p>
                      <p className="text-xs text-gray-500">{estimatedDelivery}</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveOrderTracker;
