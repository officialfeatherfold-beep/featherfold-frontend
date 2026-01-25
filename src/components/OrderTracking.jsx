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
  ArrowRight
} from 'lucide-react';

const OrderTracking = () => {
  const [orderStatus, setOrderStatus] = useState('processing');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Warehouse - Mumbai');

  useEffect(() => {
    // Simulate order status updates
    const timer = setTimeout(() => {
      setOrderStatus('shipped');
      setCurrentLocation('In Transit - Pune Highway');
    }, 5000);

    // Calculate estimated delivery (3 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    setEstimatedDelivery(deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }));

    return () => clearTimeout(timer);
  }, []);

  const orderSteps = [
    {
      id: 'ordered',
      title: 'Order Placed',
      description: 'Your order has been received',
      icon: Package,
      time: 'Today, 2:30 PM',
      completed: true,
      color: 'green'
    },
    {
      id: 'processing',
      title: 'Processing',
      description: 'FeatherFold is being hand-picked',
      icon: Cloud,
      time: 'Today, 3:00 PM',
      completed: orderStatus !== 'ordered',
      current: orderStatus === 'processing',
      color: 'blue'
    },
    {
      id: 'quality',
      title: 'Quality Check',
      description: 'Quality Check: Passed',
      icon: Shield,
      time: 'Today, 4:00 PM',
      completed: ['shipped', 'delivered'].includes(orderStatus),
      color: 'purple'
    },
    {
      id: 'shipped',
      title: 'Shipped',
      description: 'In Transit via BlueDart',
      icon: Truck,
      time: orderStatus === 'shipped' ? 'Today, 6:00 PM' : 'Tomorrow, 10:00 AM',
      completed: orderStatus === 'delivered',
      current: orderStatus === 'shipped',
      color: 'orange'
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Successfully delivered to your address',
      icon: Home,
      time: estimatedDelivery,
      completed: orderStatus === 'delivered',
      color: 'green'
    }
  ];

  const trackingEvents = [
    {
      time: '6:00 PM',
      title: 'Package picked up',
      description: 'Your package has been picked up by BlueDart courier',
      location: 'Mumbai Warehouse'
    },
    {
      time: '5:30 PM',
      title: 'Package dispatched',
      description: 'Your FeatherFold bedsheet is on its way',
      location: 'Mumbai Hub'
    },
    {
      time: '4:00 PM',
      title: 'Quality check completed',
      description: 'All quality checks passed successfully',
      location: 'Quality Control'
    },
    {
      time: '3:00 PM',
      title: 'Order processing started',
      description: 'Your order is being prepared',
      location: 'Processing Center'
    },
    {
      time: '2:30 PM',
      title: 'Order confirmed',
      description: 'Payment received and order confirmed',
      location: 'System'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'shipped': return 'text-orange-600 bg-orange-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Order Journey Visualizer
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your FeatherFold journey from our warehouse to your doorstep
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Tracking Timeline */}
          <div className="lg:col-span-2">
            <motion.div
              className="glassmorphism p-8 rounded-3xl"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Order #FF2024112847</h3>
                  <p className="text-gray-600">FeatherFold™ Ultra-Soft Premium Cotton Bedsheet Set</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-medium ${getStatusColor(orderStatus)}`}>
                  {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
                
                {orderSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className="relative flex items-start mb-8 last:mb-0"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Icon */}
                    <motion.div
                      className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? `bg-${step.color}-100 text-${step.color}-600` 
                          : step.current
                          ? 'bg-purple-100 text-purple-600 ring-4 ring-purple-200'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                      animate={step.current ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <step.icon className="w-8 h-8" />
                      {step.completed && (
                        <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-green-500 bg-white rounded-full" />
                      )}
                    </motion.div>

                    {/* Content */}
                    <div className="ml-6 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className={`text-lg font-semibold ${
                            step.completed || step.current ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {step.title}
                          </h4>
                          <p className={`text-sm ${
                            step.completed || step.current ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {step.description}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                          {step.time}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Estimated Delivery */}
              <motion.div
                className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Estimated Delivery</h4>
                    <p className="text-2xl font-bold text-purple-600">{estimatedDelivery}</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Live Location */}
            <motion.div
              className="glassmorphism p-6 rounded-2xl"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <Navigation className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Live Location</h3>
              </div>
              
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-green-100 rounded-xl mb-4 relative overflow-hidden">
                {/* Map Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-red-500 mx-auto mb-2 animate-pulse" />
                    <p className="text-sm font-medium text-gray-700">{currentLocation}</p>
                  </div>
                </div>
                
                {/* Animated Route Line */}
                <motion.div
                  className="absolute top-1/2 left-0 right-0 h-0.5 bg-purple-400"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 3, ease: 'easeOut' }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>

              <button className="w-full py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center space-x-2">
                <Navigation className="w-4 h-4" />
                <span>Track on Map</span>
              </button>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="glassmorphism p-6 rounded-2xl"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all flex items-center justify-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-medium">Ping Delivery Partner</span>
                </button>
                <button className="w-full p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span className="font-medium">Call Support</span>
                </button>
              </div>
            </motion.div>

            {/* Recent Events */}
            <motion.div
              className="glassmorphism p-6 rounded-2xl"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {trackingEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                        <span className="text-xs text-gray-500">{event.time}</span>
                      </div>
                      <p className="text-xs text-gray-600">{event.description}</p>
                      <p className="text-xs text-purple-600 mt-1">{event.location}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderTracking;
