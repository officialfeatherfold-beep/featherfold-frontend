import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { resolveImage, normalizeProduct } from '../utils/dataUtils';

const ProductShowcase = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotationSeconds, setRotationSeconds] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/products/featured');
        if (!response.ok) {
          setFeaturedProducts([]);
          return;
        }
        const data = await response.json();
        const products = Array.isArray(data?.products) ? data.products : [];
        const seconds = Number.isFinite(Number(data?.rotationSeconds)) ? Number(data.rotationSeconds) : 5;

        setRotationSeconds(seconds);
        const normalizedProducts = products.map((p) => normalizeProduct(p));
        setFeaturedProducts(normalizedProducts);
      } catch (error) {
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  useEffect(() => {
    if (featuredProducts.length <= 1) return;

    const ms = Math.max(2000, Math.min(60000, Math.round(rotationSeconds * 1000)));
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, ms);

    return () => clearInterval(interval);
  }, [featuredProducts, rotationSeconds]);

  const handleProductClick = () => {
    const product = featuredProducts[currentIndex];
    const productId = product?.id;
    if (!productId) return;
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="aspect-video max-w-6xl mx-auto bg-gray-200 rounded-3xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  const currentProduct = featuredProducts[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Click on any product to view details
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
              onClick={handleProductClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleProductClick();
                }
              }}
            >
              {currentProduct?.images?.[0] ? (
                <img
                  src={resolveImage(currentProduct.images[0])}
                  alt={currentProduct.name || 'Product'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjZjdmN2Y3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                  <span className="text-8xl">🛏️</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {currentProduct?.name || 'Product'}
                  </h3>
                  <p className="text-lg opacity-90">
                    Click to view details →
                  </p>
                </div>
              </div>

              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-gray-700">
                  {currentIndex + 1} / {featuredProducts.length}
                </span>
              </div>

              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-purple-600">
                  Featured
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {featuredProducts.length > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-purple-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
