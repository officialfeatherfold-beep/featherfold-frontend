import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  Chrome,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService, initiateGoogleAuth } from '../services/api';

const AuthModal = ({ onClose, onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting login with:', formData.email);
        const response = await apiService.login(formData.email, formData.password);
        console.log('Login response:', response);
        
        if (response.message === 'Login successful' && response.user) {
          apiService.setToken(response.token);
          onLogin(response.user, response.token);
        } else {
          console.error('Login failed:', response);
          alert('Login failed. Please try again.');
        }
      } else {
        console.log('Attempting registration with:', formData.email, formData.name);
        const response = await apiService.register(formData.name, formData.email, formData.password);
        console.log('Registration response:', response);
        
        if (response.message === 'User registered successfully' && response.user) {
          apiService.setToken(response.token);
          onLogin(response.user, response.token);
        } else {
          console.error('Registration failed:', response);
          alert('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error(isLogin ? 'Login error:' : 'Registration error:', error);
      alert(`${isLogin ? 'Login' : 'Registration'} failed: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    
    // Use proper Google OAuth
    try {
      initiateGoogleAuth();
    } catch (error) {
      console.error('Google auth error:', error);
      setIsLoading(false);
      alert('Google login failed. Please try again or use email/password login.\n\nAdmin: admin@featherfold.com / admin123\nPersonal: priyanshdhingra96@gmail.com / featherfold123');
    }
  };

  // Debug: Check if modal-root exists
  React.useEffect(() => {
    const modalRoot = document.getElementById('modal-root');
    console.log('Modal root found:', !!modalRoot, modalRoot);
    if (!modalRoot) {
      console.error('modal-root not found in DOM!');
    }
  }, []);

  // Get portal target with fallback
  const portalTarget = typeof document !== 'undefined' 
    ? document.getElementById('modal-root') || document.body 
    : null;

  console.log('Portal target:', portalTarget);

  if (!portalTarget) {
    console.error('No portal target available!');
    return null;
  }

  return createPortal(
      <div
        className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: 'none',
          zIndex: 999999,
          willChange: 'opacity'
        }}
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          style={{
            transform: 'none',
            maxHeight: '90vh',
            overflowY: 'auto',
            margin: 'auto',
            willChange: 'transform, opacity'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative h-32 bg-gradient-to-br from-purple-600 to-pink-600">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {isLogin ? 'Welcome Back' : 'Join FeatherFold'}
                </h2>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  isLogin 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  !isLogin 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center space-x-3 mb-6"
            >
              <Chrome className="w-5 h-5" />
              <span className="font-medium text-gray-700">
                {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
              </span>
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 border-gray-200 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/forgot-password');
                    }}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                )}
              </button>
            </form>

            {/* Benefits */}
            <div
              className="mt-6 p-4 bg-purple-50 rounded-xl"
              style={{
                opacity: 1,
                transform: 'translateY(0)'
              }}
            >
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {isLogin ? 'Welcome back!' : 'Join FeatherFold today'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {isLogin 
                      ? 'Get instant access to your orders and exclusive discounts.'
                      : 'Get 10% OFF your first order and exclusive member benefits.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
    portalTarget
  );
};

export default AuthModal;
