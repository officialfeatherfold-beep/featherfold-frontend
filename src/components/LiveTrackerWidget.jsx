import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  TrendingUp,
  Navigation
} from 'lucide-react';

const LiveTrackerWidget = ({ order }) => {
  const [liveData, setLiveData] = useState({
    currentStatus: order?.status || 'processing',
    currentLocation: 'Processing Center',
    progress: 25,
    lastUpdate: new Date().toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    estimatedTime: '2-3 hours'
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        lastUpdate: new Date().toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        // Simulate progress updates
        progress: Math.min(prev.progress + 2, 100),
        // Simulate location updates for shipped orders
        ...(order?.status === 'shipped' && {
          currentLocation: prev.currentLocation === 'Mumbai-Pune Highway' 
            ? 'Pune Toll Plaza' 
            : 'Mumbai-Pune Highway'
        })
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [order?.status]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'shipped': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'quality': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ordered': return <Package className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'quality': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className={`p-4 border-b ${getStatusColor(liveData.currentStatus)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              {getStatusIcon(liveData.currentStatus)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Live Tracker</h3>
              <p className="text-xs opacity-75">Updated {liveData.lastUpdate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">LIVE</span>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="p-4">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Order Progress</span>
            <span className="font-semibold text-gray-900">{liveData.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${liveData.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Current Location */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Current Location</p>
              <p className="text-sm font-semibold text-gray-900">{liveData.currentLocation}</p>
            </div>
            <Navigation className="w-4 h-4 text-purple-600" />
          </div>
        </div>

        {/* Status Timeline */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Order Placed</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              liveData.currentStatus === 'processing' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              <Clock className={`w-3 h-3 ${
                liveData.currentStatus === 'processing' ? 'text-blue-600' : 'text-green-600'
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Processing</p>
              <p className="text-xs text-gray-500">
                {liveData.currentStatus === 'processing' ? 'In Progress' : 'Completed'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              ['shipped', 'delivered'].includes(liveData.currentStatus) ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Truck className={`w-3 h-3 ${
                ['shipped', 'delivered'].includes(liveData.currentStatus) ? 'text-green-600' : 'text-gray-400'
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Shipped</p>
              <p className="text-xs text-gray-500">
                ['shipped', 'delivered'].includes(liveData.currentStatus) ? 'In Transit' : 'Pending'
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              liveData.currentStatus === 'delivered' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <CheckCircle className={`w-3 h-3 ${
                liveData.currentStatus === 'delivered' ? 'text-green-600' : 'text-gray-400'
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Delivered</p>
              <p className="text-xs text-gray-500">
                {liveData.currentStatus === 'delivered' ? 'Completed' : 'Pending'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center space-x-1 p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-xs">
              <Navigation className="w-3 h-3" />
              <span>Track Map</span>
            </button>
            <button className="flex items-center justify-center space-x-1 p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all text-xs">
              <RefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveTrackerWidget;
