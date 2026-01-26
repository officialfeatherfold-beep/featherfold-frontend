import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Heart, 
  ShoppingCart,
  Sparkles,
  Shield,
  Truck
} from 'lucide-react';
import { apiService } from '../services/api';
import { resolveImage } from '../utils/dataUtils';

const FeaturedProductsCarousel = ({ onAddToCart, user, onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const featuredProducts = [
    {
      id: 'featured-1',
      name: 'FeatherFold™ Premium Cotton Bedsheet',
      price: 3499,
      originalPrice: 4999,
      image: '/api/placeholder/400/300',
      rating: 4.9,
      reviews: 2847,
      badge: 'Bestseller',
      badgeColor: 'bg-purple-500',
      features: ['400 Thread Count', 'Ultra-Soft', 'All-Season Comfort']
    },
    {
      id: 'featured-2', 
      name: 'FeatherFold™ Luxury Pillow Set',
      price: 1299,
      originalPrice: 1899,
      image: '/api/placeholder/400/300',
      rating: 4.8,
      reviews: 1523,
      badge: 'New Arrival',
      badgeColor: 'bg-green-500',
      features: ['Hypoallergenic', 'Premium Fill', 'Machine Washable']
    },
    {
      id: 'featured-3',
      name: 'FeatherFold™ Comforter Duvet',
      price: 4999,
      originalPrice: 6999,
      image: '/api/placeholder/400/300',
      rating: 4.9,
      reviews: 892,
      badge: 'Limited Edition',
      badgeColor: 'bg-red-500',
      features: ['Premium Fill', 'Temperature Control', 'Luxury Feel']
    },
    {
      id: 'featured-4',
      name: 'FeatherFold™ Bath Towel Set',
      price: 1999,
      originalPrice: 2999,
      image: '/api/placeholder/400/300',
      rating: 4.7,
      reviews: 634,
      badge: 'Hot Deal',
      badgeColor: 'bg-orange-500',
      features: ['Quick Dry', 'Ultra Absorbent', 'Soft Touch']
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.getProducts();
        const productsData = response?.products || response || [];
        
        if (Array.isArray(productsData) && productsData.length > 0) {
          // Use real products and merge with featured data
          const enhancedProducts = productsData.slice(0, 4).map((product, index) => ({
            ...product,
            id: product._id || product.id,
            ...featuredProducts[index]
          }));
          setProducts(enhancedProducts);
        } else {
          // Fallback to featured products
          setProducts(featuredProducts);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts(featuredProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleAddToCart = (product) => {
    const productToAdd = {
      name: product.name,
      price: product.price,
      image: product.image,
      id: product.id,
      category: product.category || 'Featured',
      brand: product.brand || 'FeatherFold'
    };
    
    onAddToCart(productToAdd);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Featured Products
            </h2>
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our handpicked selection of premium FeatherFold products
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 lg:-translate-x-12 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 lg:translate-x-12 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
            aria-label="Next product"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Products Grid */}
          <div className="overflow-hidden">
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <AnimatePresence>
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Product Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`${product.badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                        {product.badge}
                      </span>
                    </div>

                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <img
                        src={resolveImage(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                      
                      {/* Quick Actions */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all hover:scale-110"
                          aria-label="Add to wishlist"
                        >
                          <Heart className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Features */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {product.features?.slice(0, 2).map((feature, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                        {product.originalPrice && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => onNavigate && onNavigate('products')}
                          className="flex-1 py-2 px-4 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          View Details
                        </motion.button>
                        <motion.button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium flex items-center justify-center gap-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-purple-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Premium Quality</h4>
            <p className="text-sm text-gray-600">400+ Thread Count</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Quality Assured</h4>
            <p className="text-sm text-gray-600">100% Satisfaction</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Fast Delivery</h4>
            <p className="text-sm text-gray-600">3-5 Business Days</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Loved by All</h4>
            <p className="text-sm text-gray-600">5000+ Happy Customers</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProductsCarousel;
