import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  Chrome,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { apiService, initiateGoogleAuth } from '../services/api';

const LoginPage = ({ onLogin }) => {
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
        const response = await apiService.login(formData.email, formData.password);
        if (response.message === 'Login successful' && response.user) {
          apiService.setToken(response.token);
          onLogin(response.user, response.token);
          navigate('/');
        } else {
          alert('Login failed. Please try again.');
        }
      } else {
        const response = await apiService.register(formData.name, formData.email, formData.password);
        if (response.message === 'User registered successfully' && response.user) {
          apiService.setToken(response.token);
          onLogin(response.user, response.token);
          navigate('/');
        } else {
          alert('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      alert(`${isLogin ? 'Login' : 'Registration'} failed: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    try {
      initiateGoogleAuth();
    } catch (error) {
      console.error('Google auth error:', error);
      setIsLoading(false);
      alert('Google login failed. Please try again or use email/password login.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left Brand Panel */}
        <div className="relative hidden md:flex flex-col justify-center bg-gradient-to-br from-purple-600 to-pink-600 text-white p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">FeatherFold</h2>
              <p className="text-white/80 text-sm">Premium Cotton</p>
            </div>
          </div>
          <h3 className="text-3xl font-semibold mb-4">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h3>
          <p className="text-white/80">
            Manage orders, save favorites, and unlock member-only discounts.
          </p>
        </div>

        {/* Right Form Panel */}
        <div className="relative p-6 sm:p-10">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div className="text-center mb-6 md:hidden">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {isLogin ? 'Welcome Back' : 'Join FeatherFold'}
            </h2>
          </div>

          {/* Form */}
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
            className="w-full py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center space-x-3 mb-6 text-sm sm:text-base"
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
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

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

          <div className="mt-6 p-4 bg-purple-50 rounded-xl">
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
    </div>
  );
};

export default LoginPage;
