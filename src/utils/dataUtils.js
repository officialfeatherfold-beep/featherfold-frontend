// Centralized utility functions for consistent data handling
import { generateSKUFromCartItem } from './skuUtils';

// Color hex mapping for common colors
const COLOR_HEX_MAP = {
  'white': '#ffffff',
  'black': '#000000',
  'red': '#ff0000',
  'blue': '#0000ff',
  'green': '#00ff00',
  'yellow': '#ffff00',
  'purple': '#800080',
  'pink': '#ffc0cb',
  'orange': '#ffa500',
  'gray': '#808080',
  'grey': '#808080',
  'brown': '#964b00',
  'beige': '#f5f5dc',
  'ivory': '#fffff0',
  'cream': '#fffdd0',
  'navy': '#000080',
  'teal': '#008080',
  'cyan': '#00ffff',
  'magenta': '#ff00ff',
  'lime': '#32cd32',
  'maroon': '#800000',
  'olive': '#808000',
  'silver': '#c0c0c0',
  'gold': '#ffd700'
};

const getColorHex = (colorName) => {
  if (!colorName) return '#cccccc';
  const lowerName = colorName.toLowerCase();
  
  // If it's already a hex color, return as-is
  if (lowerName.startsWith('#')) return colorName;
  
  // Look up in our color map
  return COLOR_HEX_MAP[lowerName] || '#cccccc';
};

// Normalize colors to consistent format: { name: string; hex: string }
export const normalizeColors = (colors = []) => {
  if (!Array.isArray(colors)) return [];
  
  return colors.map(color => {
    if (typeof color === 'string') {
      return {
        name: color,
        hex: getColorHex(color)
      };
    }
    
    if (typeof color === 'object' && color !== null) {
      return {
        name: color.name || 'Unknown',
        hex: color.hex || getColorHex(color.value || color.name)
      };
    }
    
    return {
      name: 'Unknown',
      hex: '#cccccc'
    };
  });
};

// Image resolution utility
export const resolveImage = (img) => {
  // Handle null, undefined, or empty string
  if (!img || img.trim() === '') {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
  }
  
  // Check if img contains clearly invalid values
  const isInvalid = typeof img !== 'string' || 
                    img.trim() === '' ||
                    img === 'undefined' ||
                    img === 'null';
  
  if (isInvalid) {
    console.warn('Invalid image detected, using placeholder:', img);
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
  }
  
  // If it's already a full URL or data URL, return as-is (after HTTPS upgrade)
  if (img.startsWith('http') || img.startsWith('data:')) {
    if (img.startsWith('http://')) {
      const httpsUrl = img.replace('http://', 'https://');
      return httpsUrl;
    }
    return img;
  }
  
  // If it's a long string (likely base64), format as data URL
  if (img.length > 200) {
    return img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`;
  }
  
  // Otherwise, treat as relative path from backend
  if (img.startsWith('/api/placeholder/')) {
    // Return a proper placeholder SVG for missing images
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
  }
  
  // Use dynamic API base URL consistent with AdminDashboard
  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'https://featherfold-backendnew1-production.up.railway.app' 
    : 'https://featherfold-backendnew1-production.up.railway.app';
  
  return `${API_BASE}${img.startsWith('/') ? img : '/' + img}`;
};

// Get variant SKU from product variants
const getVariantSKU = async (product, colorName, size) => {
  // First try to find the SKU in product variants (new system)
  if (product.variants && Array.isArray(product.variants)) {
    const variant = product.variants.find(v => 
      v.color === colorName && v.size === size
    );
    if (variant && variant.sku) {
      return variant.sku;
    }
  }
  
  // If no variants found, try to fetch fresh product data
  try {
    const response = await fetch(`https://featherfold-backendnew1-production.up.railway.app/api/products/${product.id}`);
    const data = await response.json();
    if (data.product && data.product.variants) {
      const variant = data.product.variants.find(v => 
        v.color === colorName && v.size === size
      );
      if (variant && variant.sku) {
        return variant.sku;
      }
    }
  } catch (error) {
    console.error('Error fetching product for SKU:', error);
  }
  
  // Fallback to old SKU generation system
  return generateSKUFromCartItem({
    name: product.name,
    selectedColor: { name: colorName },
    selectedSize: size
  });
};

// Cart utilities
export const cartUtils = {
  getCart: () => {
    try {
      const cart = JSON.parse(localStorage.getItem('featherfold_cart') || '[]');
      // Ensure all existing cart items have correct SKUs from product variants
      const updatedCart = cart.map(item => {
        if (!item.sku || item.sku.includes('CARTC')) {
          // Try to get SKU from product variants
          item.sku = getVariantSKU(item, item.selectedColor?.name || 'unknown', item.selectedSize || 'standard');
        }
        return item;
      });
      
      // Save updated cart if any items were missing SKUs
      if (JSON.stringify(cart) !== JSON.stringify(updatedCart)) {
        localStorage.setItem('featherfold_cart', JSON.stringify(updatedCart));
      }
      
      return updatedCart;
    } catch (error) {
      console.error('Error parsing cart:', error);
      return [];
    }
  },

  saveCart: (cart) => {
    try {
      // Ensure all cart items have SKUs
      const updatedCart = cart.map(item => {
        if (!item.sku) {
          item.sku = generateSKUFromCartItem(item);
        }
        return item;
      });
      
      localStorage.setItem('featherfold_cart', JSON.stringify(updatedCart));
      // Dispatch cart update event for global reactivity
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: updatedCart }));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },

  addToCart: async (product, options = {}) => {
    const cart = cartUtils.getCart();
    const {
      quantity = 1,
      selectedSize = options.size || product.sizes?.[0] || 'standard',
      selectedColor = options.color || normalizeColors(product.colors)?.[0] || { name: 'Default', hex: '#cccccc' }
    } = options;

    // Normalize selectedColor to ensure consistent comparison
    const normalizedColor = typeof selectedColor === 'string' 
      ? { name: selectedColor, hex: getColorHex(selectedColor) }
      : selectedColor;

    // Check for existing item with ALL criteria (id, size, color, type, thickness)
    const existingItem = cart.find(item => 
      item.id === product.id && 
      item.selectedSize === selectedSize && 
      item.selectedColor?.name === normalizedColor.name &&
      item.selectedType === (options.type || product.type) &&
      item.mattressThickness === (options.mattressThickness || product.mattressThickness)
    );

    if (existingItem) {
      // Update existing item quantity instead of adding duplicate
      existingItem.quantity += quantity;
      // Generate/update SKU for existing item
      existingItem.sku = await getVariantSKU(product, normalizedColor.name, selectedSize);
      console.log('🛒 Updated existing item quantity from', existingItem.quantity - quantity, 'to', existingItem.quantity);
    } else {
      // Add new item
      console.log('🛒 Adding new item with quantity:', quantity);
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0], // ✅ IMPORTANT: Include image data 
        quantity,
        selectedSize,
        selectedColor: normalizedColor,
        fabric: product.fabric,
        type: options.type || product.type,
        mattressThickness: options.mattressThickness || product.mattressThickness
      };
      
      // Get the correct SKU from product variants
      newItem.sku = await getVariantSKU(product, normalizedColor.name, selectedSize);
      
      cart.push(newItem);
    }

    cartUtils.saveCart(cart);
    console.log('🛒 Cart after save:', cart);
    return cart;
  },

  removeFromCart: (productId, options = {}) => {
    const cart = cartUtils.getCart();
    const { selectedSize, selectedColor } = options;
    
    const updatedCart = cart.filter(item => {
      if (selectedSize && selectedColor) {
        return !(item.id === productId && 
                item.selectedSize === selectedSize && 
                item.selectedColor?.name === selectedColor.name);
      }
      return item.id !== productId;
    });

    cartUtils.saveCart(updatedCart);
    return updatedCart;
  },

  updateQuantity: (productId, quantity, options = {}) => {
    const cart = cartUtils.getCart();
    const { selectedSize, selectedColor } = options;
    
    const item = cart.find(item => {
      if (selectedSize && selectedColor) {
        return item.id === productId && 
               item.selectedSize === selectedSize && 
               item.selectedColor?.name === selectedColor.name;
      }
      return item.id === productId;
    });

    if (item) {
      item.quantity = Math.max(1, quantity);
      // Update SKU to ensure it's correct
      item.sku = getVariantSKU(item, item.selectedColor?.name || 'unknown', item.selectedSize || 'standard');
      cartUtils.saveCart(cart);
    }

    return cart;
  },

  getTotalItems: () => {
    return cartUtils.getCart().reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return cartUtils.getCart().reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  clearCart: () => {
    try {
      localStorage.removeItem('featherfold_cart');
      // Dispatch event for cart updates
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
      return [];
    } catch (error) {
      console.error('Error clearing cart:', error);
      return [];
    }
  }
};

// Wishlist utilities
export const wishlistUtils = {
  getWishlist: () => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch (error) {
      console.error('Error parsing wishlist:', error);
      return [];
    }
  },

  saveWishlist: (wishlist) => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      // Dispatch event for wishlist updates
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: wishlist }));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  },

  toggleWishlist: (productId) => {
    const wishlist = wishlistUtils.getWishlist();
    const updatedWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];

    wishlistUtils.saveWishlist(updatedWishlist);
    return updatedWishlist;
  },

  isInWishlist: (productId) => {
    return wishlistUtils.getWishlist().includes(productId);
  },

  clearWishlist: () => {
    try {
      localStorage.removeItem('wishlist');
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: [] }));
      return [];
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return [];
    }
  }
};

// Product data normalization
export const normalizeProduct = (product) => {
  if (!product) return null;

  const normalizeVariantImages = (variantImages = []) => {
    if (!Array.isArray(variantImages)) return [];
    return variantImages.map((variant) => ({
      ...variant,
      price: typeof variant.price === 'number' ? variant.price : undefined,
      sku: variant.sku || '',
      images: (variant.images || []).map(resolveImage)
    }));
  };

  return {
    ...product,
    id: product._id || product.id,
    colors: normalizeColors(product.colors),
    images: (product.images || []).map(resolveImage),
    variantImages: normalizeVariantImages(product.variantImages),
    sortOrder: typeof product.sortOrder === 'number' ? product.sortOrder : 0,
    // Handle stock/availability from MongoDB format
    availability: product.availability || product.stock || 10,
    // Handle price
    price: product.price || 0,
    originalPrice: product.originalPrice || 0
  };
};

// Export getColorHex for use in other components
export { getColorHex };
