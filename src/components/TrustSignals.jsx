import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Truck, 
  RefreshCw, 
  Award,
  Zap,
  Heart,
  CheckCircle,
  Star
} from 'lucide-react';

const TrustSignals = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Powered by Razorpay with 256-bit encryption",
      color: "text-green-600"
    },
    {
      icon: Truck,
      title: "Live Tracking",
      description: "Real-time SMS and WhatsApp updates",
      color: "text-blue-600"
    },
    {
      icon: RefreshCw,
      title: "30-Day Returns",
      description: "Hassle-free returns and exchanges",
      color: "text-purple-600"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "400 thread count luxury grade cotton",
      color: "text-yellow-600"
    },
    {
      icon: Zap,
      title: "Instant Checkout",
      description: "1-tap Google login experience",
      color: "text-red-600"
    },
    {
      icon: Heart,
      title: "Customer Love",
      description: "4.9/5 rating from 2,847+ reviews",
      color: "text-pink-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose FeatherFold?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the perfect blend of luxury, comfort, and convenience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="glassmorphism p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 ${feature.color}`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Trust Banner */}
        <motion.div
          className="mt-16 glassmorphism p-8 rounded-3xl border border-purple-100"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Trusted by 50,000+ Happy Customers
              </h3>
              <p className="text-gray-600">
                Join thousands who've transformed their sleep experience
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">4.9</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">50K+</div>
                <div className="text-sm text-gray-600">Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSignals;
