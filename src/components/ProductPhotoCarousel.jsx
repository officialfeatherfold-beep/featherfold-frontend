import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { buildProductUrl } from '../utils/routeUtils';
import { normalizeProduct, resolveImage } from '../utils/dataUtils';

const ProductPhotoCarousel = () => {
  const navigate = useNavigate();
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
        setFeaturedProducts(products.map((product) => normalizeProduct(product)));
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

  const handleProductClick = () => {
    const productId = currentProduct?.id || currentProduct?._id;
    if (!productId) return;
    navigate(buildProductUrl({ id: productId, name: product?.name }));
  };

  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 via-white to-white">
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
          <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="relative h-[60vh] max-h-[720px] min-h-[360px] w-full cursor-pointer md:h-[70vh]"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7 }}
                onClick={handleProductClick}
              >
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

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 text-white md:p-8">
                  <div className="text-base font-semibold tracking-wide text-white/80">
                    {productName}
                  </div>
                  <div className="mt-1 text-sm text-white/90">Click to view details →</div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                {currentIndex + 1} / {featuredProducts.length}
            </div>

            <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-purple-600 shadow-sm">
              Featured
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
