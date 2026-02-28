import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
  Heart,
  Leaf,
  ShieldCheck,
  Truck,
  Package,
  ChevronUp
} from 'lucide-react';

const Footer = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'Home', view: 'home' },
    { label: 'All Products', view: 'products' },
    { label: 'Features', view: 'features' },
    { label: 'Reviews', view: 'reviews' },
  ];

  const supportLinks = [
    { label: 'FAQ', view: 'faq' },
    { label: 'Contact Us', view: 'contact' },
    { label: 'Order Tracking', view: 'orders' },
    { label: 'Cart', view: 'cart' },
  ];

  const highlights = [
    { icon: Leaf, text: '100% Cotton' },
    { icon: ShieldCheck, text: 'Quality Assured' },
    { icon: Truck, text: 'Free Shipping' },
    { icon: Package, text: 'Easy Returns' },
  ];

  return (
    <footer className="relative bg-[#1a0f08] text-white overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-[#8b6f47] via-[#c9982e] to-[#8b6f47]" />

      {/* Highlights Bar */}
      <div className="bg-[#241811] border-b border-[#3d2e1e]/60">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlights.map((item, idx) => (
              <div key={idx} className="flex items-center justify-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-[#c9982e]/10 flex items-center justify-center group-hover:bg-[#c9982e]/20 transition-colors">
                  <item.icon className="w-5 h-5 text-[#c9982e]" />
                </div>
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-stone-200 shadow-sm overflow-hidden">
                <img
                  src="/logo.png"
                  alt="FeatherFold"
                  className="w-full h-full object-contain p-1"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">FeatherFold™</h3>
                <p className="text-xs text-[#c9982e]">Premium Cotton</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Experience the ultimate comfort with our ultra-soft premium cotton bedsheets. 
              Crafted with care for the perfect night's sleep.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#c9982e]/30 flex items-center justify-center transition-all hover:scale-110"
              >
                <Instagram className="w-4 h-4 text-white/80" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#c9982e]/30 flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="w-4 h-4 text-white/80" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#c9982e]/30 flex items-center justify-center transition-all hover:scale-110"
              >
                <Twitter className="w-4 h-4 text-white/80" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#c9982e] mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.view}>
                  <button
                    onClick={() => onNavigate && onNavigate(link.view)}
                    className="text-white/60 hover:text-[#e8c37d] transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#c9982e] mb-5">
              Customer Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.view}>
                  <button
                    onClick={() => onNavigate && onNavigate(link.view)}
                    className="text-white/60 hover:text-[#e8c37d] transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <a href="mailto:officialfeatherfold@gmail.com" className="flex items-center gap-2 text-white/50 hover:text-[#e8c37d] transition-colors text-sm">
                <Mail className="w-4 h-4 text-[#c9982e]/60" />
                officialfeatherfold@gmail.com
              </a>
              <a href="tel:+918168587844" className="flex items-center gap-2 text-white/50 hover:text-[#e8c37d] transition-colors text-sm">
                <Phone className="w-4 h-4 text-[#c9982e]/60" />
                +91 81685 87844
              </a>
              <div className="flex items-start gap-2 text-white/50 text-sm">
                <MapPin className="w-4 h-4 text-[#c9982e]/60 mt-0.5 shrink-0" />
                <span>India</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#c9982e] mb-5">
              Stay Updated
            </h4>
            <p className="text-white/50 text-sm mb-4">
              Subscribe for exclusive offers, new arrivals, and sleep tips.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c9982e]/50 focus:bg-white/8 transition-all"
                required
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-r from-[#b8892a] to-[#c9982e] rounded-lg flex items-center justify-center hover:from-[#9c7522] hover:to-[#b8892a] transition-all"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>
            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#c9982e] text-xs mt-2"
              >
                ✓ Thank you for subscribing!
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs text-center md:text-left">
              © 2026 FeatherFold™. All rights reserved. Established 2026.
            </p>
            <div className="flex items-center gap-1 text-white/30 text-xs">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-400 fill-red-400" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="absolute right-6 bottom-16 w-10 h-10 bg-[#c9982e]/20 hover:bg-[#c9982e]/40 border border-[#c9982e]/30 rounded-full flex items-center justify-center transition-all hover:scale-110"
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronUp className="w-5 h-5 text-[#c9982e]" />
      </motion.button>
    </footer>
  );
};

export default Footer;
