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
    <section className="py-16 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            Featured Products
          </h2>
          <p className="mt-3 text-base text-gray-500 md:text-lg">
            Click on any product to view details
          </p>
        </div>

        <div className="relative w-full">
          <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="relative grid min-h-[420px] w-full grid-cols-1 md:grid-cols-[1.05fr_1fr]"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7 }}
              >
                <div className="relative h-full min-h-[320px] bg-gradient-to-br from-gray-50 to-gray-100 md:min-h-[420px]">
                  <img
                    src={currentProduct.url}
                    alt={currentProduct.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjZjdmN2Y3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMzIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

                  <div className="absolute bottom-0 left-0 w-full p-6 text-white md:p-8">
                    <div className="text-sm font-semibold uppercase tracking-wide text-white/80">
                      Featured
                    </div>
                    <div className="mt-1 text-2xl font-bold md:text-3xl">
                      {currentProduct.title}
                    </div>
                    <button
                      onClick={() => onNavigate && onNavigate('products')}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white/95 transition hover:text-white"
                    >
                      Click to view details
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex h-full flex-col justify-center gap-6 p-6 md:p-10">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">
                      <Star className="h-4 w-4 fill-purple-600 text-purple-600" />
                      {currentProduct.rating} rating
                    </div>
                    <h3 className="mt-2 text-3xl font-extrabold text-gray-900 md:text-4xl">
                      {currentProduct.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Premium cotton bedding crafted for comfort, breathability, and everyday luxury.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-3xl font-extrabold text-gray-900">
                      ₹{currentProduct.price}
                    </div>
                    <div className="text-lg font-semibold text-gray-400 line-through">
                      ₹{Math.round(currentProduct.price * 1.3)}
                    </div>
                    <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                      {Math.round((1 - currentProduct.price / (currentProduct.price * 1.3)) * 100)}% OFF
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      onClick={() => onNavigate && onNavigate('products')}
                      className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:border-purple-200 hover:text-purple-700"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      onClick={() => onAddToCart && onAddToCart(currentProduct)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              {currentIndex + 1} / {productImages.length}
            </div>

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/60 bg-white/90 p-3 shadow-lg transition hover:scale-105 hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-gray-800" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/60 bg-white/90 p-3 shadow-lg transition hover:scale-105 hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-gray-800" />
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-2">
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
