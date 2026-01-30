import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  ArrowLeft,
  Plus,
  Minus,
  X,
  Loader2
} from 'lucide-react';
import { wishlistUtils, cartUtils, normalizeProduct, resolveImage } from '../utils/dataUtils';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [groupProducts, setGroupProducts] = useState([]);
  const [hoverImage, setHoverImage] = useState('');

  // Use dynamic API base URL consistent with AdminDashboard
  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'https://featherfold-backendnew1-production.up.railway.app' 
    : 'https://featherfold-backendnew1-production.up.railway.app';

  const normalizeValue = (value) => (value || '').toString().toLowerCase();

  const resolveVariantMatch = (variants, color, size) => {
    if (!variants.length) return null;
    const colorValue = normalizeValue(color);
    const sizeValue = normalizeValue(size);

    let match = variants.find((variant) =>
      normalizeValue(variant.variantColor) === colorValue
      && normalizeValue(variant.variantSize) === sizeValue
    );

    if (!match && colorValue) {
      match = variants.find((variant) => normalizeValue(variant.variantColor) === colorValue);
    }

    if (!match && sizeValue) {
      match = variants.find((variant) => normalizeValue(variant.variantSize) === sizeValue);
    }

    return match || null;
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const variants = groupProducts.length ? groupProducts : [];
    const match = resolveVariantMatch(variants, color, selectedSize || product?.variantSize);
    if (match && match.id && match.id !== product?.id) {
      navigate(`/products/${match.id}`);
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    const variants = groupProducts.length ? groupProducts : [];
    const match = resolveVariantMatch(variants, selectedColor || product?.variantColor, size);
    if (match && match.id && match.id !== product?.id) {
      navigate(`/products/${match.id}`);
    }
  };

  const getVariantImages = (productData, colorValue, sizeValue) => {
    if (!productData?.variantImages || productData.variantImages.length === 0) {
      return null;
    }

    const normalizeColor = (value) => (value || '').toString().toLowerCase();
    const normalizeSize = (value) => (value || '').toString().toLowerCase();
    const selectedColorValue = normalizeColor(colorValue);
    const selectedSizeValue = normalizeSize(sizeValue);

    const matched = productData.variantImages.find((variant) => {
      const variantColor = normalizeColor(variant.color || variant.colorValue || variant.name);
      const variantSize = normalizeSize(variant.size);
      return variantColor === selectedColorValue && variantSize === selectedSizeValue;
    });

    if (matched?.images?.length) {
      return matched.images;
    }

    const colorMatch = productData.variantImages.find((variant) => {
      const variantColor = normalizeColor(variant.color || variant.colorValue || variant.name);
      return variantColor === selectedColorValue;
    });

    if (colorMatch?.images?.length) {
      return colorMatch.images;
    }

    return null;
  };

  const findVariantImageIndex = (productData, colorValue, sizeValue) => {
    if (!productData?.images || productData.images.length === 0) return 0;

    const images = productData.images;
    const lowerImages = images.map((img) => (img || '').toString().toLowerCase());

    const colorCandidates = [];
    if (colorValue) {
      colorCandidates.push(colorValue.toString().toLowerCase());
    }
    if (productData.colors && productData.colors.length > 0) {
      const matchedColor = productData.colors.find((c) => {
        if (typeof c === 'string') {
          return c.toLowerCase() === colorValue?.toString().toLowerCase();
        }
        return (
          c.value?.toLowerCase() === colorValue?.toString().toLowerCase() ||
          c.name?.toLowerCase() === colorValue?.toString().toLowerCase()
        );
      });
      if (matchedColor && typeof matchedColor !== 'string') {
        if (matchedColor.name) colorCandidates.push(matchedColor.name.toLowerCase());
        if (matchedColor.value) colorCandidates.push(matchedColor.value.toLowerCase());
      }
    }

    const sizeCandidates = [];
    if (sizeValue) sizeCandidates.push(sizeValue.toString().toLowerCase());

    const matchesColor = (img) => colorCandidates.some((c) => c && img.includes(c));
    const matchesSize = (img) => sizeCandidates.some((s) => s && img.includes(s));

    // Prefer image matching both color and size
    let idx = lowerImages.findIndex((img) => matchesColor(img) && matchesSize(img));
    if (idx !== -1) return idx;

    // Fallback to color-only
    idx = lowerImages.findIndex((img) => matchesColor(img));
    if (idx !== -1) return idx;

    // Fallback to size-only
    idx = lowerImages.findIndex((img) => matchesSize(img));
    if (idx !== -1) return idx;

    return 0;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/products/${id}`);
        const data = await response.json();
        
        if (data.product) {
          // Normalize product data
          const normalizedProduct = normalizeProduct(data.product);
          setProduct(normalizedProduct);
          console.log('Product data:', normalizedProduct);
          
          // Check if product is wishlisted
          setIsWishlisted(wishlistUtils.isInWishlist(normalizedProduct.id));
          
          if (normalizedProduct.variantSize) {
            setSelectedSize(normalizedProduct.variantSize);
          } else if (normalizedProduct.sizes && normalizedProduct.sizes.length > 0) {
            setSelectedSize(normalizedProduct.sizes[0]);
          }

          if (normalizedProduct.variantColor) {
            setSelectedColor(normalizedProduct.variantColor);
          } else if (normalizedProduct.colors && normalizedProduct.colors.length > 0) {
            const firstColor = normalizedProduct.colors[0];
            const colorValue = typeof firstColor === 'string' ? firstColor : firstColor.value || firstColor;
            setSelectedColor(colorValue);
          }
        } else {
          navigate('/products');
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchGroup = async () => {
      if (!product?.variantGroupId) {
        setGroupProducts([]);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/products/group/${product.variantGroupId}`);
        const data = await response.json();
        const normalized = (data.products || []).map(normalizeProduct);
        setGroupProducts(normalized);
      } catch (error) {
        console.error('Failed to fetch group products:', error);
        setGroupProducts([]);
      }
    };

    fetchGroup();
  }, [product?.variantGroupId]);

  useEffect(() => {
    if (!product) return;
    if (groupProducts.length > 0) {
      setSelectedImageIndex(0);
      return;
    }

    const variantImages = getVariantImages(product, selectedColor, selectedSize);
    if (variantImages?.length) {
      setSelectedImageIndex(0);
      return;
    }

    const idx = findVariantImageIndex(product, selectedColor, selectedSize);
    setSelectedImageIndex(idx);
  }, [product, selectedColor, selectedSize, groupProducts.length]);

  const currentVariant = (product?.variantImages || []).find((variant) => {
    return normalizeValue(variant.color) === normalizeValue(selectedColor)
      && normalizeValue(variant.size) === normalizeValue(selectedSize);
  });

  const groupVariants = groupProducts.length ? groupProducts : [];
  const activeVariantProduct = resolveVariantMatch(groupVariants, selectedColor, selectedSize);

  const baseImages = groupProducts.length
    ? (activeVariantProduct?.images || product?.images || [])
    : (getVariantImages(product, selectedColor, selectedSize) || product?.images || []);

  const displayImages = hoverImage
    ? [hoverImage, ...baseImages.filter((img) => img !== hoverImage)]
    : baseImages;

  const variantThumbnailItems = groupProducts.length
    ? groupVariants.map((variant) => ({
        id: variant.id,
        color: variant.variantColor,
        size: variant.variantSize,
        image: variant.images?.[0]
      })).filter((item) => item.image)
    : (product?.variantImages || []).map((variant) => ({
        color: variant.color,
        size: variant.size,
        image: variant.images?.[0],
        price: variant.price,
        sku: variant.sku
      })).filter((item) => item.image);

  const displayPrice = groupProducts.length
    ? (activeVariantProduct?.price || product?.price)
    : (typeof currentVariant?.price === 'number' ? currentVariant.price : product?.price);

  const displaySku = groupProducts.length
    ? (activeVariantProduct?.sku || product?.sku || '')
    : (currentVariant?.sku || product?.sku || '');

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    
    try {
      // Use unified cart utility
      await cartUtils.addToCart(product, {
        quantity,
        selectedSize: selectedSize || product.sizes?.[0],
        selectedColor: selectedColor || product.colors?.[0]
      });
      
      // Dispatch cart update event for global reactivity
      window.dispatchEvent(new Event("cartUpdated"));
      
      setTimeout(() => {
        setAddingToCart(false);
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    setTimeout(() => {
      navigate('/cart');
    }, 500);
  };

  const handleWishlist = () => {
    if (!product) return;
    
    wishlistUtils.toggleWishlist(product.id);
    setIsWishlisted(!isWishlisted);
    
    // Dispatch wishlist update event for global reactivity
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const handleShare = () => {
    if (!product) return;
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Helper function to get color hex
  const getColorHex = (colorValue) => {
    const colorMap = {
      'white': '#ffffff',
      'ivory': '#fffff0',
      'beige': '#f5f5dc',
      'cream': '#fffdd0',
      'gray': '#808080',
      'charcoal': '#36454f',
      'black': '#000000',
      'blue': '#0000ff',
      'navy': '#000080',
      'sky-blue': '#87ceeb',
      'green': '#008000',
      'sage': '#9caf88',
      'olive': '#808000',
      'pink': '#ffc0cb',
      'blush': '#ffb6c1',
      'rose': '#ff007f',
      'red': '#ff0000',
      'burgundy': '#800020',
      'purple': '#800080',
      'lavender': '#e6e6fa'
    };
    return colorMap[colorValue?.toLowerCase()] || colorValue;
  };

  const colors = groupProducts.length
    ? Array.from(new Set(groupProducts.map((item) => item.variantColor).filter(Boolean)))
        .map((color) => ({ name: color, hex: getColorHex(color) || '#ffffff' }))
    : (product?.colors?.length
        ? product.colors.map(color => {
            if (typeof color === 'string') {
              return { name: color, hex: getColorHex(color) || '#ffffff' };
            }
            return { name: color.name || color.value, hex: getColorHex(color.value || color.hex) || '#ffffff' };
          })
        : [
            { name: 'White', hex: '#ffffff' },
            { name: 'Ivory', hex: '#fffff0' },
            { name: 'Sage Green', hex: '#9caf88' }
          ]);

  const sizes = groupProducts.length
    ? Array.from(new Set(groupProducts.map((item) => item.variantSize).filter(Boolean)))
    : (product?.sizes?.length
        ? product.sizes
        : ['Queen', 'King']);

  const features = [
    { icon: Sparkles, text: '400 Thread Count Luxury' },
    { icon: Shield, text: 'Fade-Resistant Colors' },
    { icon: Truck, text: 'Free Shipping on Orders ₹500+' },
    { icon: Clock, text: 'Delivery in 3-5 Business Days' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/products')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 p-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Products</span>
        </motion.button>

        {product && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Product Images */}
            <div className="grid lg:grid-cols-2 gap-6 items-start p-4">
              {/* Main Image */}
              <div className="relative">
                <div className="bg-gray-100 border border-gray-200 rounded-xl overflow-hidden h-[260px] lg:h-[300px]">
                  {displayImages?.[selectedImageIndex] ? (
                    <img
                      src={resolveImage(displayImages[selectedImageIndex])}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        console.error('Main image failed to load:', displayImages[selectedImageIndex]);
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">🛏️</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Thumbnails */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
                <div className="grid grid-cols-3 gap-2">
                  {displayImages?.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      onMouseEnter={() => setSelectedImageIndex(index)}
                      className={`relative border-2 rounded-lg overflow-hidden transition-all aspect-square ${
                        selectedImageIndex === index 
                          ? 'border-purple-500 ring-2 ring-purple-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={resolveImage(image)}
                        alt={`${product.name} - Image ${index + 1}`}
                        className={`w-full h-full object-cover rounded-lg transition-all duration-200 ${
                          selectedImageIndex === index
                            ? 'ring-2 ring-teal-500 ring-offset-2'
                            : 'hover:opacity-80'
                        }`}
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/100/100';
                        }}
                      />
                      {selectedImageIndex === index && (
                        <div className="absolute top-1 right-1 bg-purple-500 text-white rounded-full p-1">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4 lg:p-6">
              <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column - Product Details */}
                <div className="lg:col-span-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 -mt-2">{product.name}</h1>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.reviews} reviews
                    </span>
                  </div>

                  {displaySku && (
                    <div className="text-xs text-gray-500 mb-4">
                      SKU: <span className="font-mono">{displaySku}</span>
                    </div>
                  )}

                  {/* Description */}
                  <div className="mb-8">
                    <p className="text-gray-700 leading-relaxed">
                      {product.description || 'Premium quality bedding product designed for ultimate comfort and style.'}
                    </p>
                  </div>

                  {variantThumbnailItems.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Variant Preview</h3>
                      <div className="flex flex-wrap gap-2">
                        {variantThumbnailItems.map((variant) => (
                          <button
                            key={`${variant.color}-${variant.size}`}
                            onClick={() => {
                              if (groupProducts.length && variant.id) {
                                navigate(`/products/${variant.id}`);
                                return;
                              }
                              if (variant.color) handleColorChange(variant.color);
                              if (variant.size) handleSizeChange(variant.size);
                              setSelectedImageIndex(0);
                            }}
                            onMouseEnter={() => {
                              if (variant.image) setHoverImage(variant.image);
                              setSelectedImageIndex(0);
                            }}
                            onMouseLeave={() => setHoverImage('')}
                            className="border border-gray-200 rounded-lg overflow-hidden w-16 h-16 hover:border-purple-500 transition"
                            title={`${variant.color} • ${variant.size}`}
                          >
                            <img
                              src={resolveImage(variant.image)}
                              alt={`${variant.color}-${variant.size}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <feature.icon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Color</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => {
                            console.log('Selected color:', color.name);
                            handleColorChange(color.name);
                          }}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            selectedColor === color.name 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div 
                            className="w-full h-8 rounded-md mb-2 border border-gray-300"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-xs text-gray-700">{color.name}</span>
                          {selectedColor === color.name && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Size</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            console.log('Selected size:', size);
                            handleSizeChange(size);
                          }}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            selectedSize === size 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-sm font-medium">{size}</span>
                          {selectedSize === size && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Buy Box */}
                <div className="lg:col-span-1">
                  <div className="lg:sticky lg:top-16">
                    <div className="bg-gray-50 rounded-2xl p-6">
                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="text-2xl lg:text-3xl font-bold text-gray-900">₹{(displayPrice || 0).toLocaleString('en-IN')}</span>
                          {product.originalPrice && product.originalPrice > (displayPrice || product.price) && (
                            <span className="text-lg lg:text-xl text-gray-500 line-through">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        {product.availability <= 10 && (
                          <div className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-full inline-block">
                            Only {product.availability} left!
                          </div>
                        )}
                      </div>

                      {/* Quantity Selection */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantity</h3>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="px-4 py-2 text-lg font-semibold">{quantity}</span>
                          <button
                            onClick={() => setQuantity(Math.min(product.availability, quantity + 1))}
                            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-4 mb-6">
                        <button
                          onClick={handleAddToCart}
                          disabled={addingToCart || product.availability === 0 || !selectedColor || !selectedSize}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold transition-all hover:from-purple-700 hover:to-pink-700 shadow-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingToCart ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Adding...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <ShoppingCart className="w-5 h-5" />
                              <span>{product.availability > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                            </div>
                          )}
                        </button>
                        <button
                          onClick={handleBuyNow}
                          disabled={product.availability === 0 || !selectedColor || !selectedSize}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold transition-all hover:from-green-700 hover:to-emerald-700 shadow-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span>{product.availability > 0 ? 'Buy Now' : 'Out of Stock'}</span>
                        </button>
                      </div>

                      {/* Secondary Actions */}
                      <div className="flex gap-4">
                        <button
                          onClick={handleWishlist}
                          className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                            isWishlisted
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          aria-label="Add to wishlist"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                            }`}
                          />
                        </button>
                        <button 
                          onClick={handleShare}
                          className="flex-1 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all"
                          aria-label="Share product"
                        >
                          <Share2 className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
