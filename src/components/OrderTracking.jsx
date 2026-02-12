import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Package,
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  ShieldCheck,
  Home,
  ArrowLeft,
  RefreshCw,
  Calendar,
  IndianRupee
} from 'lucide-react';
import Header from './Header';
import { apiService } from '../services/api';

const OrderTracking = ({ user, cartCount, onCartOpen, onAuthOpen, onLogout, onAdminOpen, totalPrice, onNavigate }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingError, setTrackingError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const fetchTracking = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setTrackingError('');

      const orderResponse = await apiService.getOrder(orderId);
      const latestOrder = orderResponse?.order || null;
      setOrder(latestOrder);

      const trackingResponse = await apiService.getOrderTracking(orderId);
      setTracking(trackingResponse || null);
      if (trackingResponse?.order) {
        setOrder(trackingResponse.order);
      }
      if (trackingResponse?.error) {
        setTrackingError(trackingResponse.error);
      }
    } catch (error) {
      setTrackingError('Tracking fetch failed');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchTracking();
    }
  }, [orderId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTracking(true);
    setRefreshing(false);
  };

  const statusSteps = ['confirmed', 'shipped', 'delivered'];
  const orderStatus = order?.status || 'confirmed';
  const hasShipment = Boolean(order?.shiprocketAwb || order?.shiprocketShipmentId || order?.shiprocketOrderId);
  const trackingEvents = order?.shiprocketTrackingEvents || tracking?.events || [];

  const getStepStatus = (step) => {
    if (orderStatus === 'cancelled') return 'pending';
    if (step === 'confirmed') return 'completed';
    if (step === 'shipped') return orderStatus === 'shipped' || orderStatus === 'delivered' ? 'completed' : 'pending';
    if (step === 'delivered') return orderStatus === 'delivered' ? 'completed' : 'pending';
    return 'pending';
  };

  const stepConfig = [
    {
      id: 'confirmed',
      title: 'Order Confirmed',
      description: 'Payment received and order confirmed',
      icon: CheckCircle
    },
    {
      id: 'shipped',
      title: 'Shipped',
      description: hasShipment ? 'Shipment created with delivery partner' : 'Shipment will be created soon',
      icon: Truck
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Out for delivery and delivered',
      icon: Home
    }
  ];

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
            if (onNavigate) {
              onNavigate(view);
              return;
            }
            if (view === 'orders') navigate('/orders');
            else if (view === 'products') navigate('/products');
            else if (view === 'home') navigate('/');
          }}
        />
        <div className="container-custom py-24 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-feather-200 border-t-feather-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tracking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
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
            if (onNavigate) {
              onNavigate(view);
              return;
            }
            if (view === 'orders') navigate('/orders');
            else if (view === 'products') navigate('/products');
            else if (view === 'home') navigate('/');
          }}
        />
        <div className="container-custom py-24">
          <div className="max-w-2xl mx-auto text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn’t find this order. Please try again.</p>
            <button
              onClick={() => navigate('/orders')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Orders
            </button>
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
          if (onNavigate) {
            onNavigate(view);
            return;
          }
          if (view === 'orders') navigate('/orders');
          else if (view === 'products') navigate('/products');
          else if (view === 'home') navigate('/');
        }}
      />

      <div className="container-custom py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <motion.button
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              whileHover={{ x: 5 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Orders
            </motion.button>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Order Summary + Timeline */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
                    <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                      {order.status?.toUpperCase() || 'CONFIRMED'}
                    </span>
                    {order.shiprocketCourierName && (
                      <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                        {order.shiprocketCourierName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    <span>₹{order.total?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>{order.items?.length || 0} items</span>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl border border-gray-100 p-4">
                    <p className="text-xs text-gray-500 mb-1">AWB</p>
                    <p className="font-semibold text-gray-900">
                      {order.shiprocketAwb || 'AWB pending'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Shiprocket Order ID</p>
                    <p className="text-sm text-gray-700">
                      {order.shiprocketOrderId || 'Not assigned'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 p-4">
                    <p className="text-xs text-gray-500 mb-1">Tracking URL</p>
                    {order.shiprocketTrackingUrl ? (
                      <a
                        href={order.shiprocketTrackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-600 text-sm font-medium"
                      >
                        Open tracking page →
                      </a>
                    ) : (
                      <p className="text-sm text-gray-700">Tracking link pending</p>
                    )}
                  </div>
                </div>

                {trackingError && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    {trackingError}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Shipment Progress</h3>
                <div className="relative">
                  <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-100" />
                  <div className="space-y-6">
                    {stepConfig.map((step) => {
                      const stepStatus = getStepStatus(step.id);
                      const Icon = step.icon;
                      return (
                        <div key={step.id} className="flex items-start gap-4">
                          <div
                            className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                              stepStatus === 'completed'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{step.title}</p>
                            <p className="text-sm text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Shipment Events</h3>
                {trackingEvents.length === 0 ? (
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                    {hasShipment
                      ? 'Shipment created. Tracking events will appear once the courier scans the package.'
                      : 'Shipment has not been created yet.'}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {trackingEvents.map((event, index) => (
                      <div key={index} className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{event.status || event.title || 'Update'}</p>
                          <span className="text-xs text-gray-500">{event.date || event.time || ''}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.message || event.description || 'Tracking update received.'}</p>
                        {event.location && (
                          <p className="text-xs text-purple-600 mt-2">{event.location}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Live Card */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Navigation className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Live Tracking</h3>
                </div>
                <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center text-center px-4">
                  <div>
                    <MapPin className="w-10 h-10 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      {tracking?.currentLocation || 'Location will appear once the courier updates'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>Courier: <span className="font-medium text-gray-800">{order.shiprocketCourierName || 'Pending'}</span></p>
                  <p>AWB: <span className="font-medium text-gray-800">{order.shiprocketAwb || 'Pending'}</span></p>
                  <p>Status: <span className="font-medium text-gray-800">{order.status}</span></p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Chat with Support
                  </button>
                  <button className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
