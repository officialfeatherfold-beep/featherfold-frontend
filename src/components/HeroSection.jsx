import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ImageSequence from './ImageSequence';
import {
  Zap,
  ShieldCheck,
  Eye,
  Star
} from 'lucide-react';

const HeroSection = ({ isPlaying, onPlayToggle, onNavigate }) => {
  const { scrollYProgress } = useScroll();
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 300]));
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Video Background Component */}
      <ImageSequence />

      {/* Overlay for better text readability and warm dark aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3d2e1e]/40 via-[#2c1810]/20 to-[#2c1810]/80 z-0" />


      {/* Main Content */}
      <motion.div
        className="relative z-10 container mx-auto px-4 text-center mt-16"
        style={{ y, opacity }}
      >
        {/* Trust Badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-[#2c1810]/40 border border-[#c9982e]/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-white/90">Instant Checkout</span>
          </div>
          <div className="bg-[#2c1810]/40 border border-[#c9982e]/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
            <ShieldCheck className="w-4 h-4 text-[#e8dcc8]" />
            <span className="text-sm font-medium text-white/90">Secure Payments</span>
          </div>
          <div className="bg-[#2c1810]/40 border border-[#c9982e]/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
            <Eye className="w-4 h-4 text-[#c9982e]" />
            <span className="text-sm font-medium text-white/90">Live Tracking</span>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="block text-white">FeatherFold™</span>
          <span className="block text-4xl md:text-5xl mt-2 bg-gradient-to-r from-[#e8c37d] to-[#b88645] bg-clip-text text-transparent drop-shadow-md">
            Ultra-Soft Premium Cotton
          </span>
          <span className="block text-2xl md:text-3xl mt-3 text-white/80 font-normal">
            Bedsheet Set (Double/King Size)
          </span>
        </motion.h1>

        {/* Brand Hook */}
        <motion.p
          className="text-xl md:text-2xl text-white/70 mb-8 font-light max-w-2xl mx-auto tracking-wide drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          "Sleep on Clouds. Experience<br/>the FeatherFold Touch."
        </motion.p>

        {/* Rating */}
        <motion.div
          className="flex items-center justify-center space-x-2 mb-10 drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#e8c37d] text-[#e8c37d]" />
            ))}
          </div>
          <div className="flex items-center space-x-2 ml-2">
            <span className="text-white/90 font-medium">4.5</span>
            <span className="text-white/40">|</span>
            <span className="text-white/60">738 reviews</span>
          </div>
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
            className="px-8 py-4 bg-gradient-to-r from-[#b8892a] to-[#c9982e] text-white font-semibold rounded-xl hover:from-[#9c7522] hover:to-[#b8892a] transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Shop Now - 10% OFF
          </motion.button>
        </motion.div>
      </motion.div>


    </section>
  );
};

export default HeroSection;

