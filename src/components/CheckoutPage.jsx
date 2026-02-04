import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, Shield, User, MapPin, Phone, Mail, Check, Loader2, Lock, ShoppingBag } from 'lucide-react';
import Header from './Header';
import { cartUtils } from '../utils/dataUtils';
import { apiService } from '../services/api';

// Validation functions
const formatPhoneNumber = (value) => {
  return value.replace(/\D/g, '');
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name) => {
  return name.trim().length >= 2;
};

const validateAddress = (address) => {
  return address.trim().length >= 10;
};

const validatePincode = (pincode) => {
  return /^\d{6}$/.test(pincode);
};

const steps = [
  { id: 1, name: "Address", completed: false },
  { id: 2, name: "Payment", completed: false },
  { id: 3, name: "Review", completed: false },
];

const CheckoutPage = ({ user, onCartOpen, onAuthOpen, onLogout, onAdminOpen, cartCount, totalPrice, onNavigate }) => {
  const [currentCart, setCurrentCart] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [promoInfo, setPromoInfo] = useState(null);
  const [storeSettings, setStoreSettings] = useState({
    taxRate: 18,
    standardShippingFee: 50,
    freeShippingThreshold: 500
  });
  
  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'razorpay'
  });

  // Load cart data and saved data
  useEffect(() => {
    const handleCartUpdate = () => {
      setCurrentCart(cartUtils.getCart() || []);
    };

    // Load saved addresses and payment methods
    const loadSavedData = () => {
      try {
        const savedAddrs = localStorage.getItem('featherfold_addresses');
        if (savedAddrs) {
          setSavedAddresses(JSON.parse(savedAddrs));
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    handleCartUpdate();
    loadSavedData();

    const savedPromo = localStorage.getItem('featherfold_promo');
    if (savedPromo) {
      try {
        const parsed = JSON.parse(savedPromo);
        if (parsed?.code && parsed?.percent) {
          setPromoInfo({ code: parsed.code, percent: Number(parsed.percent) });
        }
      } catch (error) {
        console.error('Invalid promo data');
      }
    }

    try {
      const savedSettings = localStorage.getItem('adminSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setStoreSettings({
          taxRate: Number(parsed.taxRate ?? 18),
          standardShippingFee: Number(parsed.standardShippingFee ?? 50),
          freeShippingThreshold: Number(parsed.freeShippingThreshold ?? 500)
        });
      }
    } catch (error) {
      console.error('Failed to load admin settings');
    }

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const subtotal = currentCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = promoInfo?.percent ? subtotal * (Number(promoInfo.percent) / 100) : 0;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const gst = taxableSubtotal * (storeSettings.taxRate / 100);
  const shipping = taxableSubtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.standardShippingFee;
  const total = taxableSubtotal + gst + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Format specific fields
    if (name === 'phone') {
      processedValue = formatPhoneNumber(value);
    }
    
    setFormData({ ...formData, [name]: processedValue });
  };

  const handleSavedAddressSelect = (addressId) => {
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      setFormData({
        ...formData,
        name: address.name,
        email: address.email || formData.email,
        phone: address.phone || formData.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode
      });
    }
  };

  const handleSavedPaymentSelect = () => {};

  const validateStep1 = () => {
    const errors = [];
    
    if (!validateName(formData.name)) {
      errors.push('Name must be at least 2 characters');
    }
    if (!validateEmail(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    if (formatPhoneNumber(formData.phone).length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }
    if (!validateAddress(formData.address)) {
      errors.push('Address must be at least 10 characters');
    }
    if (formData.city.trim().length < 2) {
      errors.push('City must be at least 2 characters');
    }
    if (formData.state.trim().length < 2) {
      errors.push('State must be at least 2 characters');
    }
    if (!validatePincode(formData.pincode)) {
      errors.push('PIN code must be exactly 6 digits');
    }
    
    if (errors.length > 0) {
      setError(errors[0]); // Show first error
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      return; // Error is already set in validateStep1
    }
    if (currentStep === 2 && !formData.paymentMethod) {
      setError("Please select a payment method");
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
    setError(null);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    setError(null);
  };

  const handleRazorpayPayment = async (paymentMethodOverride) => {
    try {
      setProcessing(true);
      const method = paymentMethodOverride || formData.paymentMethod || 'razorpay';

      // Create order on backend
      const orderData = await apiService.createPaymentOrder({
        amount: Math.round(total),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          userId: user?.id || 'guest',
          items: currentCart.length,
          paymentMethod: method,
        },
      });

      if (!orderData.orderId) {
        throw new Error('Failed to create payment order');
      }

      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY;
      if (!razorpayKeyId) {
        throw new Error('Razorpay key not configured');
      }

      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FeatherFold',
        description: 'Order Payment',
        order_id: orderData.orderId,
        handler: async function (response) {
          // Verify payment
          const verifyData = await apiService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyData.success) {
            // Create order in database
            await createOrder(method, response.razorpay_payment_id);
          } else {
            setError('Payment verification failed. Please contact support.');
            setProcessing(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#8b6a4d',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        setError('Payment failed. Please try again.');
        setProcessing(false);
      });
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const createOrder = async (paymentMethod, paymentId) => {
    try {
      const orderData = await apiService.createOrder({
        items: currentCart.map((item) => ({
          productId: item.id,
          name: item.name,
          size: item.selectedSize,
          color: item.selectedColor,
          sku: item.sku,
          price: item.price,
          quantity: item.quantity,
        })),
        userId: user?.id || 'guest',
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod,
        paymentId,
        total: Math.round(total),
        promoCode: promoInfo?.code,
        discountPercent: promoInfo?.percent,
        discountAmount: Math.round(discountAmount),
      });

      if (orderData.order) {
        // Clear cart
        cartUtils.clearCart();
        localStorage.removeItem('featherfold_promo');
        setPromoInfo(null);
        
        // Redirect to order success page
        onNavigate('order-success');
        window.location.href = `/order-success?orderId=${orderData.order.id}`;
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      setError('Failed to create order. Please contact support.');
      setProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep1()) {
      setError('Please complete all required fields');
      return;
    }

    if (!formData.paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    // Always route through Razorpay as requested
    await handleRazorpayPayment(formData.paymentMethod);
  };

  if (currentCart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-ivory to-white">
        <Header 
          user={user}
          cartCount={cartCount}
          onCartOpen={onCartOpen}
          onAuthOpen={onAuthOpen}
          onLogout={onLogout}
          onAdminOpen={onAdminOpen}
          totalPrice={totalPrice}
          currentView="checkout"
          onNavigate={onNavigate}
        />
        
        <div className="container-custom py-24">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-12"
            >
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add some items to your cart before proceeding to checkout.</p>
              <button
                onClick={() => onNavigate('products')}
                className="bg-feather-600 text-white px-6 py-3 rounded-lg hover:bg-feather-700 transition-colors"
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-ivory to-white">
      <Header 
        user={user}
        cartCount={cartCount}
        onCartOpen={onCartOpen}
        onAuthOpen={onAuthOpen}
        onLogout={onLogout}
        onAdminOpen={onAdminOpen}
        totalPrice={totalPrice}
        currentView="checkout"
        onNavigate={onNavigate}
      />

      <div className="container-custom py-24">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {steps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  currentStep >= stepItem.id
                    ? "bg-black text-white border-2 border-black"
                    : "bg-gray-200 text-gray-600 border-2 border-gray-300"
                }`}>
                  {stepItem.id}
                </div>
                <span
                  className={`ml-3 text-sm font-medium ${
                    currentStep >= stepItem.id ? "text-black font-semibold" : "text-gray-500"
                  }`}
                >
                  {stepItem.name}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-3 ${
                      currentStep > stepItem.id ? "bg-black" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                {/* Step 1: Address */}
                {currentStep === 1 && (
                  <div>
                    <div className="flex items-center mb-8">
                      <div className="w-12 h-12 bg-feather-100 rounded-full flex items-center justify-center mr-4">
                        <MapPin className="w-6 h-6 text-feather-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
                        <p className="text-gray-600">Where should we deliver your order?</p>
                      </div>
                    </div>
                    
                    {/* Saved Addresses */}
                    {savedAddresses.length > 0 && (
                      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                          <Shield className="w-5 h-5 mr-2 text-blue-600" />
                          Quick Address Selection
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {savedAddresses.map((addr) => (
                            <div
                              key={addr.id}
                              className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-feather-400 hover:shadow-md transition-all cursor-pointer"
                              onClick={() => handleSavedAddressSelect(addr.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-semibold text-gray-800">{addr.name}</p>
                                  <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                                  <p className="text-sm text-gray-600">
                                    {addr.city}, {addr.state} - {addr.pincode}
                                  </p>
                                </div>
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <p className="text-sm text-blue-700 font-medium">
                            💡 Click an address above to use it, or fill in a new one below
                          </p>
                        </div>
                      </div>
                    )}

                    <div className={`space-y-6 ${savedAddresses.length > 0 ? 'border-t-2 border-gray-200 pt-8' : ''}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-feather-500 focus:border-transparent transition-all"
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-feather-500 focus:border-transparent transition-all"
                              placeholder="your.email@example.com"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-feather-500 focus:border-transparent transition-all"
                              placeholder="9876543210"
                              maxLength={10}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Street Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                            rows={3}
                            placeholder="Enter your complete street address"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-feather-500 focus:border-transparent transition-all"
                            placeholder="Enter your city"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            State <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-feather-500 focus:border-transparent transition-all"
                            placeholder="Enter your state"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            PIN Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-feather-500 focus:border-transparent transition-all"
                            placeholder="Enter 6-digit PIN code"
                            maxLength={6}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-6">
                        <button
                          onClick={handleNext}
                          className="bg-gradient-to-r from-feather-600 to-feather-700 text-white px-8 py-4 rounded-xl hover:from-feather-700 hover:to-feather-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
                        >
                          Continue to Payment
                          <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <div>
                    <div className="flex items-center mb-8">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <CreditCard className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                        <p className="text-gray-600">Choose how you'd like to pay</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800 text-lg">Select Payment Type</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div
                            className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.paymentMethod === 'razorpay'
                                ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                            onClick={() => setFormData({...formData, paymentMethod: 'razorpay'})}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <CreditCard className="w-8 h-8 text-green-600 mr-3" />
                                <div>
                                  <p className="font-semibold text-gray-800">Online Payment</p>
                                  <p className="text-sm text-gray-600">UPI, Cards, Net Banking</p>
                                </div>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                formData.paymentMethod === 'razorpay' ? 'border-green-500' : 'border-gray-300'
                              }`}>
                                {formData.paymentMethod === 'razorpay' && (
                                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div
                            className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.paymentMethod === 'cod'
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                            onClick={() => setFormData({...formData, paymentMethod: 'cod'})}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-blue-600 font-bold text-sm">₹</span>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">Cash on Delivery</p>
                                  <p className="text-sm text-gray-600">Pay when you receive</p>
                                </div>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                formData.paymentMethod === 'cod' ? 'border-blue-500' : 'border-gray-300'
                              }`}>
                                {formData.paymentMethod === 'cod' && (
                                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {formData.paymentMethod === 'razorpay' && (
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                          <h3 className="font-semibold text-gray-800 mb-2">Payment via Razorpay</h3>
                          <p className="text-sm text-gray-600">
                            You will be redirected to the Razorpay secure checkout to complete payment.
                          </p>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-6">
                        <button
                          onClick={handlePrevStep}
                          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors font-medium"
                        >
                          <ArrowLeft className="w-5 h-5 mr-2" />
                          Back to Address
                        </button>
                        <button
                          onClick={handleNext}
                          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
                        >
                          Continue to Review
                          <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Order Review */}
                {currentStep === 3 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <Shield className="w-6 h-6 text-feather-600 mr-3" />
                      <h2 className="text-2xl font-semibold text-gray-800">Review Your Order</h2>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Address Review */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-feather-600 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800">{formData.name}</p>
                            <p className="text-sm text-gray-600">{formData.address}</p>
                            <p className="text-sm text-gray-600">
                              {formData.city}, {formData.state} - {formData.pincode}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              <Phone className="w-4 h-4 inline mr-1" />
                              {formData.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Review */}
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
                        <div className="flex items-center gap-3">
                          {formData.paymentMethod === "razorpay" && (
                            <>
                              <CreditCard className="w-5 h-5 text-gray-600" />
                              <span>Card / UPI / Net Banking</span>
                            </>
                          )}
                          {formData.paymentMethod === "cod" && (
                            <>
                              <div className="w-5 h-5 bg-green-500 rounded text-white text-xs font-bold flex items-center justify-center">
                                ₹
                              </div>
                              <span>Cash on Delivery</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-4 pt-6">
                        <button
                          onClick={handlePrevStep}
                          className="flex-1 border border-gray-300 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                          disabled={processing}
                        >
                          <ArrowLeft className="w-5 h-5 inline mr-2" />
                          Back to Payment
                        </button>
                        <button
                          onClick={handlePlaceOrder}
                          disabled={processing}
                          className="flex-1 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          {processing ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock className="w-5 h-5" />
                              Place Order
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-feather-500 to-feather-600 rounded-full flex items-center justify-center mr-3">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
                </div>
                
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {currentCart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} • {item.size || 'Standard'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">₹{item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4 mb-6 pt-6 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="text-gray-900 font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-medium">
                        Discount {promoInfo?.code ? `(${promoInfo.code})` : ''}
                      </span>
                      <span className="text-green-600 font-semibold">-₹{Math.round(discountAmount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">GST (18%)</span>
                    <span className="text-gray-900 font-semibold">₹{gst.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Shipping</span>
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-green-600 font-bold">
                        {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(0)}`}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-feather-50 to-feather-100 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-feather-700 font-medium">Total Amount</p>
                      <p className="text-xs text-feather-600">Including all taxes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-feather-900">₹{total.toFixed(0)}</p>
                    </div>
                  </div>
                </div>

                {promoInfo?.code && discountAmount > 0 && (
                  <div className="flex items-center text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    Promo applied: {promoInfo.code} ({promoInfo.percent}%)
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                    <Shield className="w-4 h-4 mr-2 text-green-600" />
                    <span className="font-medium text-green-700">100% Secure Checkout</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <Truck className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-medium text-blue-700">Free Shipping on All Orders</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                    <Check className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="font-medium text-purple-700">Quality Guaranteed</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
