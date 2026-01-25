// SKU Generation Utility
// Format: FF-{PRODUCT_ID}-{COLOR_CODE}-{SIZE_CODE}

const COLOR_CODES = {
  'beige': 'BG',
  'ivory': 'IV',
  'sage': 'SG',
  'blush': 'BL',
  'white': 'WT',
  'black': 'BK',
  'blue': 'BLU',
  'red': 'RD',
  'green': 'GR',
  'yellow': 'YW',
  'pink': 'PK',
  'purple': 'PL',
  'orange': 'OR',
  'brown': 'BR',
  'gray': 'GY',
  'grey': 'GY',
  'navy': 'NV',
  'cream': 'CR',
  'gold': 'GD',
  'silver': 'SV'
};

const SIZE_CODES = {
  'single': 'S',
  'double': 'D',
  'king': 'K',
  'queen': 'Q',
  'twin': 'T',
  'full': 'F',
  'xl': 'XL',
  'xxl': 'XX',
  'standard': 'STD',
  'large': 'LRG',
  'medium': 'MED',
  'small': 'SML'
};

/**
 * Generate SKU for a product with specific color and size
 * Format: {PRODUCT_PREFIX}{COLOR_PREFIX}{SIZE_PREFIX}{TIMESTAMP}{RANDOM}
 * @param {string} productName - Product name
 * @param {string} colorName - Color name
 * @param {string} size - Size name
 * @returns {string} Generated SKU
 */
export const generateSKU = (productName, colorName, size) => {
  // Create SKU from product name and timestamp
  const namePrefix = productName
    .replace(/[^a-zA-Z0-9]/g, '') // Remove special characters
    .toUpperCase()
    .slice(0, 4); // Take first 4 characters
  
  // Use a consistent timestamp for cart items (not real-time)
  const timestamp = 'CART'; // Cart identifier instead of timestamp
  const random = 'C'; // Cart identifier instead of random
  
  // Add variant code if provided
  let variantCode = 'XX';
  if (colorName && size) {
    const colorPrefix = colorName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 2);
    const sizePrefix = size.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 2);
    variantCode = colorPrefix + sizePrefix;
  } else if (colorName) {
    const colorPrefix = colorName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 2);
    variantCode = colorPrefix + 'XX';
  }
  
  return `${namePrefix}${variantCode}${timestamp}${random}`;
};

/**
 * Generate SKU from cart item
 * @param {Object} cartItem - Cart item object
 * @returns {string} Generated SKU
 */
export const generateSKUFromCartItem = (cartItem) => {
  const colorName = cartItem.selectedColor?.name || cartItem.selectedColor || 'unknown';
  const size = cartItem.selectedSize || 'standard';
  return generateSKU(cartItem.name, colorName, size);
};

/**
 * Parse SKU to extract product information
 * @param {string} sku - SKU string
 * @returns {Object} Parsed SKU information
 */
export const parseSKU = (sku) => {
  const parts = sku?.split('-');
  
  if (parts.length !== 3 || parts[0] !== 'FF') {
    return null;
  }
  
  return {
    brand: parts[0], // FF
    productId: parts[1],
    sizeCode: parts[2]
  };
};

/**
 * Get color name from color code
 * @param {string} colorCode - Color code from SKU
 * @returns {string} Color name or null
 */
export const getColorNameFromCode = (colorCode) => {
  const reverseMap = Object.entries(COLOR_CODES).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
  
  return reverseMap[colorCode] || null;
};

/**
 * Get size name from size code
 * @param {string} sizeCode - Size code from SKU
 * @returns {string} Size name or null
 */
export const getSizeNameFromCode = (sizeCode) => {
  const reverseMap = Object.entries(SIZE_CODES).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
  
  return reverseMap[sizeCode] || null;
};

/**
 * Add SKU to cart items
 * @param {Array} cartItems - Array of cart items
 * @returns {Array} Cart items with SKU added
 */
export const addSKUsToCartItems = (cartItems) => {
  return cartItems.map(item => ({
    ...item,
    sku: generateSKUFromCartItem(item)
  }));
};

/**
 * Add SKU to order items
 * @param {Array} orderItems - Array of order items
 * @returns {Array} Order items with SKU added
 */
export const addSKUsToOrderItems = (orderItems) => {
  return orderItems.map(item => ({
    ...item,
    sku: generateSKU(item.productId, item.selectedColor?.name || item.color, item.selectedSize || item.size)
  }));
};
