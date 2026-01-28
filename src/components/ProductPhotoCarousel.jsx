import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { apiService } from '../services/api';
import { resolveImage, normalizeColors } from '../utils/dataUtils';

const ProductPhotoCarousel = ({ onAddToCart, user, onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [rotationSeconds, setRotationSeconds] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await apiService.request('/products/featured');
        const products = Array.isArray(response?.products) ? response.products : [];
        const seconds = Number.isFinite(Number(response?.rotationSeconds)) ? Number(response.rotationSeconds) : 5;
        setRotationSeconds(seconds);
        setFeaturedProducts(products);
      } catch (error) {
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === featuredProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? featuredProducts.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play carousel
  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const ms = Math.max(2000, Math.min(60000, Math.round(rotationSeconds * 1000)));
    const timer = setInterval(() => {
      nextImage();
    }, ms);

    return () => clearInterval(timer);
  }, [currentIndex, featuredProducts, rotationSeconds]);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="mb-10 text-center">
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-3" />
            <div className="h-6 bg-gray-200 rounded w-72 mx-auto" />
          </div>
          <div className="h-[420px] bg-gray-100 rounded-3xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  const currentProduct = featuredProducts[currentIndex];
  const productName = currentProduct?.name || 'Featured Product';
  const productPrice = currentProduct?.price || 0;
  const productOriginalPrice = currentProduct?.originalPrice || Math.round(productPrice * 1.3);
  const productColors = normalizeColors(currentProduct?.colors || []);
  const productSizes = Array.isArray(currentProduct?.sizes) && currentProduct.sizes.length > 0
    ? currentProduct.sizes
    : ['Queen', 'King'];

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
          <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="relative grid min-h-[420px] w-full grid-cols-1 md:grid-cols-[1.1fr_1fr]"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7 }}
              >
                <div className="relative h-full min-h-[320px] bg-gradient-to-br from-gray-50 to-gray-100 md:min-h-[420px]">
                  {currentProduct?.images?.[0] ? (
                    <img
                      src={resolveImage(currentProduct.images[0])}
                      alt={productName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjZjdmN2Y3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMzIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <span className="text-gray-400">Image Not Available</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

                  <div className="absolute bottom-0 left-0 w-full p-6 text-white md:p-8">
                    <div className="text-sm font-semibold uppercase tracking-wide text-white/80">
                      Featured
                    </div>
                    <div className="mt-1 text-2xl font-bold md:text-3xl">
                      {productName}
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
                    <h3 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
                      {productName}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span>4.9 (2,847 reviews)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-3xl font-extrabold text-gray-900">
                      ₹{productPrice}
                    </div>
                    <div className="text-lg font-semibold text-gray-400 line-through">
                      ₹{productOriginalPrice}
                    </div>
                    <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                      {Math.round((1 - productPrice / productOriginalPrice) * 100)}% OFF
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Choose Your Color</p>
                    <div className="flex flex-wrap gap-3">
                      {productColors.slice(0, 6).map((color) => (
                        <div key={color.name} className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-md" style={{ backgroundColor: color.hex }} />
                          </div>
                          <span className="text-xs text-slate-600">{color.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Select Size</p>
                    <div className="grid grid-cols-2 gap-3">
                      {productSizes.slice(0, 2).map((size) => (
                        <div key={size} className="rounded-xl border border-slate-200 p-3">
                          <p className="text-sm font-semibold text-slate-900">{size}</p>
                          <p className="text-xs text-slate-500">Premium fit</p>
                          <p className="text-sm font-bold text-purple-700 mt-2">₹{productPrice}</p>
                        </div>
                      ))}
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
            {featuredProducts.map((_, index) => (
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
