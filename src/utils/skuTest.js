// Test utility for SKU generation
import { generateSKU, generateSKUFromCartItem, parseSKU } from './skuUtils';

// Test function to verify SKU generation
export const testSKUGeneration = () => {
  console.log('🧪 Testing SKU Generation...');
  
  // Test 1: Basic SKU generation
  const testCases = [
    {
      productId: '1',
      color: 'beige',
      size: 'single',
      expected: 'FF-001-BG-S'
    },
    {
      productId: '12',
      color: 'ivory',
      size: 'king',
      expected: 'FF-012-IV-K'
    },
    {
      productId: '5',
      color: 'sage',
      size: 'double',
      expected: 'FF-005-SG-D'
    }
  ];
  
  testCases.forEach((testCase, index) => {
    const sku = generateSKU(testCase.productId, testCase.color, testCase.size);
    const passed = sku === testCase.expected;
    console.log(`Test ${index + 1}: ${passed ? '✅' : '❌'} - Expected: ${testCase.expected}, Got: ${sku}`);
  });
  
  // Test 2: Cart item SKU generation
  const cartItem = {
    id: '1',
    selectedColor: { name: 'beige' },
    selectedSize: 'single'
  };
  
  const cartSKU = generateSKUFromCartItem(cartItem);
  console.log(`Cart SKU Test: ${cartSKU === 'FF-001-BG-S' ? '✅' : '❌'} - Got: ${cartSKU}`);
  
  // Test 3: SKU parsing
  const parsedSKU = parseSKU('FF-001-BG-S');
  const parseExpected = {
    brand: 'FF',
    productId: '001',
    colorCode: 'BG',
    sizeCode: 'S'
  };
  
  const parsePassed = JSON.stringify(parsedSKU) === JSON.stringify(parseExpected);
  console.log(`Parse SKU Test: ${parsePassed ? '✅' : '❌'} - Expected: ${JSON.stringify(parseExpected)}, Got: ${JSON.stringify(parsedSKU)}`);
  
  console.log('🏁 SKU Generation Tests Complete');
};

// Run tests in development mode
if (process.env.NODE_ENV === 'development') {
  // Uncomment to run tests immediately
  // testSKUGeneration();
}
