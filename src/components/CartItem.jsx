import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <motion.div
      className="glassmorphism p-4 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex space-x-4">
        {/* Product Image */}
        <div className="w-20 h-20 rounded-lg flex items-center justify-center bg-gray-100">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-bedsheet.jpg';
              }}
            />
          ) : (
            <span className="text-2xl">🛏️</span>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm mb-1">
            {item.name}
          </h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Size: {item.selectedSize || item.size} • Type: {item.type}</p>
            <p>
              Color: {
                item.selectedColor?.name ||
                item.color?.name ||
                (typeof item.color === 'string' ? item.color : 'Default')
              }
            </p>
          </div>
          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </motion.button>
              <span className="w-8 text-center font-medium text-gray-900">
                {item.quantity}
              </span>
              <motion.button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </motion.button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">
                ₹{item.price * item.quantity}
              </span>
              <motion.button
                onClick={() => onRemove(item.id)}
                className="p-1 rounded hover:bg-red-50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
