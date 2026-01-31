import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, Shield, ChevronRight, CheckCircle } from 'lucide-react';

const OrderSummary = ({ 
  items, 
  subtotal, 
  shipping, 
  tax,
  total, 
  promoCode, 
  setPromoCode, 
  applyPromoCode, 
  discount, 
  isProcessing, 
  onCheckout, 
  user,
  appliedPromo
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      {items.length > 0 && (
        <>
          {/* Promo Code */}
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            />
            <motion.button
              onClick={applyPromoCode}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Apply
            </motion.button>
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
            {typeof tax === 'number' && tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-900">₹{tax.toFixed(0)}</span>
              </div>
            )}
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
            onClick={onCheckout}
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

          {appliedPromo && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">
                Promo applied: {appliedPromo.code} ({appliedPromo.percent}%)
              </span>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default OrderSummary;
