import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ChevronDown,
  Cloud,
  Star,
  Zap,
  Shield
} from 'lucide-react';

const HeroSection = ({ isPlaying, onPlayToggle, onNavigate }) => {
  const { scrollYProgress } = useScroll();
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 300]));
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
          {/* Simulated video background with animated gradient */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                'linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #667eea 100%)',
                'linear-gradient(45deg, #f093fb 0%, #f5576c 25%, #667eea 50%, #764ba2 75%, #f093fb 100%)',
                'linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #667eea 100%)'
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm floating"
        style={{ y: useSpring(useTransform(scrollYProgress, [0, 1], [0, -100])) }}
      />
      <motion.div
        className="absolute top-40 right-20 w-16 h-16 bg-white/15 rounded-full backdrop-blur-sm floating"
        style={{ y: useSpring(useTransform(scrollYProgress, [0, 1], [0, -150])) }}
        transition={{ delay: 0.2 }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm floating"
        style={{ y: useSpring(useTransform(scrollYProgress, [0, 1], [0, -200])) }}
        transition={{ delay: 0.4 }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 container mx-auto px-4 text-center"
        style={{ y, opacity }}
      >
        {/* Trust Badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glassmorphism px-4 py-2 rounded-full flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Instant Checkout</span>
          </div>
          <div className="glassmorphism px-4 py-2 rounded-full flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">Secure Payments</span>
          </div>
          <div className="glassmorphism px-4 py-2 rounded-full flex items-center space-x-2">
            <Cloud className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Live Tracking</span>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="block">FeatherFold™</span>
          <span className="block text-3xl md:text-5xl mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ultra-Soft Premium Cotton
          </span>
          <span className="block text-2xl md:text-3xl mt-2 text-gray-700 font-normal">
            Bedsheet Set (Double/King Size)
          </span>
        </motion.h1>

        {/* Brand Hook */}
        <motion.p
          className="text-xl md:text-2xl text-gray-700 mb-8 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          "Sleep on Clouds. Experience the FeatherFold Touch."
        </motion.p>

        {/* Rating */}
        <motion.div
          className="flex items-center justify-center space-x-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-gray-700 font-medium">4.9</span>
          <span className="text-gray-500">(2,847 reviews)</span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={() => onNavigate && onNavigate('products')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Shop Now - 10% OFF
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-20 left-2/5 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="flex flex-col items-center space-y-2 text-gray-600"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>

      {/* Overlay Text */}
      <motion.div
        className="absolute bottom-20 right-10 glassmorphism px-6 py-3 rounded-xl hidden md:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
      >
        <p className="text-sm font-medium text-gray-700">
          Woven with 400 Thread Count Grace
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
