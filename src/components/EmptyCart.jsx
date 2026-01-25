import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

const EmptyCart = ({ onNavigate }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingBag className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
      <p className="text-gray-600 mb-6">Add some FeatherFold products to get started!</p>
      <motion.button
        onClick={() => onNavigate && onNavigate('products')}
        className="px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Continue Shopping
      </motion.button>
    </motion.div>
  );
};

export default EmptyCart;
