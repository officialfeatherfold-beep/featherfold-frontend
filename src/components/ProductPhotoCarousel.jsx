import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Camera,
  ShoppingCart,
  Heart,
  Star
} from 'lucide-react';
import { apiService } from '../services/api';
import { resolveImage } from '../utils/dataUtils';

const ProductPhotoCarousel = ({ onAddToCart, user, onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);

  const productImages = [
    {
      id: 1,
      url: '/api/placeholder/1200/600',
      title: 'FeatherFold Premium Bedsheet',
      price: 3499,
      rating: 4.9,
      category: 'Bedsheets'
    },
    {
      id: 2,
      url: '/api/placeholder/1200/600',
      title: 'Luxury Cotton Collection',
      price: 2999,
      rating: 4.8,
      category: 'Premium'
    },
    {
      id: 3,
      url: '/api/placeholder/1200/600',
      title: 'Complete Bedroom Set',
      price: 5999,
      rating: 4.9,
      category: 'Sets'
    },
    {
      id: 4,
      url: '/api/placeholder/1200/600',
      title: 'Designer Pillow Covers',
      price: 1299,
      rating: 4.7,
      category: 'Pillows'
    },
    {
      id: 5,
      url: '/api/placeholder/1200/600',
      title: 'Comforter Duvet Set',
      price: 4999,
      rating: 4.8,
      category: 'Comforters'
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.getProducts();
        const productsData = response?.products || response || [];
        if (Array.isArray(productsData) && productsData.length > 0) {
          setProducts(productsData.slice(0, 5));
        }
      } catch (error) {
        console.log('Using fallback product images');
      }
    };
    fetchProducts();
  }, []);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [currentIndex]);

  const currentProduct = productImages[currentIndex];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Full Width Carousel */}
        <div className="relative w-full">
          <div className="relative aspect-video md:aspect-[16/9] lg:aspect-[21/9] bg-black rounded-2xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="w-full h-full relative"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7 }}
              >
                <img
                  src={currentProduct.url}
                  alt={currentProduct.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjZjdmN2Y3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMzIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
                
                {/* Product Info Overlay */}
                <div className="absolute left-0 bottom-0 p-8 md:p-12 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        {currentProduct.category}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(currentProduct.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-white ml-2">{currentProduct.rating}</span>
                      </div>
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                      {currentProduct.title}
                    </h2>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-3xl md:text-4xl font-bold">
                        ₹{currentProduct.price}
                      </span>
                      <span className="text-xl text-gray-300 line-through">
                        ₹{Math.round(currentProduct.price * 1.3)}
                      </span>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {Math.round((1 - currentProduct.price / (currentProduct.price * 1.3)) * 100)}% OFF
                      </span>
                    </div>
                    
                    <div className="flex gap-4">
                      <motion.button
                        onClick={() => onNavigate && onNavigate('products')}
                        className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details
                      </motion.button>
                      <motion.button
                        onClick={() => onAddToCart && onAddToCart(currentProduct)}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </motion.button>
                    </div>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button
                    className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg hover:bg-white transition-all hover:scale-110 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg hover:bg-white transition-all hover:scale-110 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="mt-6 flex gap-3 overflow-x-auto justify-center">
            {productImages.map((product, index) => (
              <button
                key={product.id}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 relative group transition-all ${
                  index === currentIndex ? 'ring-3 ring-purple-600 scale-105' : ''
                }`}
              >
                <img
                  src={product.url}
                  alt={product.title}
                  className="w-24 h-16 object-cover rounded-lg transition-all group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjdmN2Y3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWc8L3RleHQ+PC9zdmc+';
                  }}
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-purple-600/20 rounded-lg" />
                )}
              </button>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-purple-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPhotoCarousel;
