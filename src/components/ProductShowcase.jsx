import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  Share2, 
  Check,
  Zap,
  Shield,
  Truck,
  Clock,
  Sparkles
} from 'lucide-react';
import { apiService } from '../services/api';
import { resolveImage } from '../utils/dataUtils';

const ProductShowcase = ({ 
  product,
  selectedColor, 
  selectedSize, 
  selectedType, 
  onColorChange, 
  onSizeChange, 
  onTypeChange, 
  onAddToCart,
  user 
}) => {
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showcaseProduct, setShowcaseProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  const colors = [
    { name: 'White', value: '#ffffff', hex: '#ffffff' },
    { name: 'Mist Grey', value: '#d4d4d8', hex: '#d4d4d8' },
    { name: 'Sage Green', value: '#87a96b', hex: '#87a96b' },
    { name: 'Rose Petal', value: '#fbc4ab', hex: '#fbc4ab' },
    { name: 'Lavender', value: '#e9d5ff', hex: '#e9d5ff' },
    { name: 'Ocean Blue', value: '#60a5fa', hex: '#60a5fa' }
  ];

  const sizes = [
    { name: 'Queen', dimensions: '228 × 254 cm', price: 2999 },
    { name: 'King', dimensions: '274 × 274 cm', price: 3499 }
  ];

  const types = [
    { name: 'Flat Sheet', description: 'Traditional style with elastic corners' },
    { name: 'Fitted Sheet', description: '360° elastic for perfect fit' }
  ];

  const features = [
    { icon: Sparkles, text: '400 Thread Count Luxury' },
    { icon: Shield, text: 'Fade-Resistant Colors' },
    { icon: Truck, text: 'Free Shipping on Orders ₹500+' },
    { icon: Clock, text: 'Delivery in 3-5 Business Days' }
  ];

  const normalizedPropProduct = useMemo(() => {
    if (!product) return null;
    return {
      ...product,
      id: product._id || product.id
    };
  }, [product]);

  const displayProduct = normalizedPropProduct || showcaseProduct;

  useEffect(() => {
    let cancelled = false;

    const fetchShowcaseProduct = async () => {
      try {
        if (normalizedPropProduct?.id) return;

        const response = await apiService.getProducts();
        const productsData = response?.products || response || [];
        const firstWithId = Array.isArray(productsData)
          ? productsData.find((p) => p && (p._id || p.id))
          : null;

        if (!firstWithId || cancelled) return;

        setShowcaseProduct({
          ...firstWithId,
          id: firstWithId._id || firstWithId.id
        });
      } catch (e) {
        if (cancelled) return;
        setShowcaseProduct(null);
      } finally {
        if (cancelled) return;
        setLoadingProduct(false);
      }
    };

    fetchShowcaseProduct();

    return () => {
      cancelled = true;
    };
  }, [normalizedPropProduct]);

  const handleViewDetails = () => {
    const productId = displayProduct?.id;
    if (!productId) return;
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = () => {
    const productToAdd = {
      name: displayProduct?.name || 'FeatherFold™ Ultra-Soft Premium Cotton Bedsheet Set',
      price: sizes.find(s => s.name === selectedSize)?.price || displayProduct?.price || 3499,
      image: displayProduct?.images?.[0] || '/api/placeholder/400/300',
      id: displayProduct?.id || 'showcase-product',
      category: displayProduct?.category || 'Bedsheets',
      brand: displayProduct?.brand || 'FeatherFold'
    };
    
    onAddToCart(productToAdd);
    setIsAdded(true);
    
    setTimeout(() => setIsAdded(false), 3000);
  };

  const currentPrice = sizes.find(s => s.name === selectedSize)?.price || displayProduct?.price || 3499;
  const discountPrice = user ? currentPrice * 0.9 : currentPrice; // 10% discount for logged-in users

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            The FeatherFold Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cloud-soft texture, perfect fit guarantee, and all-season comfort
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Product Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div
              className={`relative rounded-3xl overflow-hidden shadow-2xl ${displayProduct?.id ? 'cursor-pointer' : 'cursor-default opacity-75'}`}
              onClick={() => {
                if (!displayProduct?.id) return;
                handleViewDetails();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!displayProduct?.id) return;
                  handleViewDetails();
                }
              }}
            >
              <div 
                className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                style={{ backgroundColor: selectedColor }}
              >
                <div className="text-center p-8">
                  <div className="w-64 h-64 mx-auto mb-4 bg-white/20 rounded-2xl backdrop-blur-sm overflow-hidden">
                    {displayProduct?.images?.[0] ? (
                      <img
                        src={resolveImage(displayProduct.images[0])}
                        alt={displayProduct.name || 'FeatherFold™ Bedsheet'}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error('Showcase image failed to load:', displayProduct.images[0]);
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                        <span className="text-6xl">🛏️</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 font-medium">{displayProduct?.name || 'FeatherFold™ Bedsheet'}</p>
                  <p className="text-gray-600 text-sm">{selectedSize} • {selectedType}</p>
                </div>
              </div>
              
              {/* Floating badges */}
              <motion.div
                className="absolute top-4 left-4 glassmorphism px-4 py-2 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-sm font-medium text-gray-700">Premium Quality</span>
              </motion.div>
              
              <motion.div
                className="absolute top-4 right-4 glassmorphism px-4 py-2 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <span className="text-sm font-medium text-gray-700">Bestseller</span>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center space-x-4 mt-6">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsWishlisted(!isWishlisted);
                }}
                className="p-3 glassmorphism rounded-full hover:bg-white/30 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-3 glassmorphism rounded-full hover:bg-white/30 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="w-6 h-6 text-gray-700" />
              </motion.button>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {displayProduct?.name || 'FeatherFold™ Ultra-Soft Premium Cotton Bedsheet Set'}
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">4.9 (2,847 reviews)</span>
              </div>
              
              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <div>
                  <span className="text-3xl font-bold text-gray-900">₹{discountPrice}</span>
                  {user && (
                    <span className="ml-2 text-lg text-gray-500 line-through">₹{currentPrice}</span>
                  )}
                </div>
                {user && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    10% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Color</h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {colors.map((color) => (
                  <motion.button
                    key={color.value}
                    onClick={() => onColorChange(color.value)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      selectedColor === color.value 
                        ? 'border-purple-500 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div 
                      className="w-full h-8 rounded-md mb-2 border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs text-gray-700">{color.name}</span>
                    {selectedColor === color.value && (
                      <motion.div
                        className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Size</h4>
              <div className="grid grid-cols-2 gap-4">
                {sizes.map((size) => (
                  <motion.button
                    key={size.name}
                    onClick={() => onSizeChange(size.name)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedSize === size.name 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{size.name}</div>
                      <div className="text-sm text-gray-600">{size.dimensions}</div>
                      <div className="text-lg font-bold text-purple-600 mt-1">₹{size.price}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Type Selection */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Sheet Type</h4>
              <div className="grid grid-cols-2 gap-4">
                {types.map((type) => (
                  <motion.button
                    key={type.name}
                    onClick={() => onTypeChange(type.name.toLowerCase().replace(' ', ''))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedType === type.name.toLowerCase().replace(' ', '') 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{type.name}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <feature.icon className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleViewDetails}
              className="w-full py-3 rounded-xl font-semibold text-gray-900 bg-white border-2 border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md mb-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Details
            </motion.button>

            <motion.button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                isAdded 
                  ? 'bg-green-500' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              } shadow-lg hover:shadow-xl`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isAdded ? (
                <div className="flex items-center justify-center space-x-2">
                  <Check className="w-5 h-5" />
                  <span>Added to Cart!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </div>
              )}
            </motion.button>

            {/* Trust Indicators */}
            <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Instant Checkout</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4 text-blue-500" />
                <span>Free Delivery</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
