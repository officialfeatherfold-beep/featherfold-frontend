import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  Truck, 
  Clock, 
  Sparkles,
  Heart,
  Award,
  RefreshCw,
  Users,
  Star,
  CheckCircle
} from 'lucide-react';
import Header from './Header';

const FeaturesPage = ({ user, onCartOpen, onAuthOpen, onLogout, onAdminOpen, cartCount, totalPrice, onNavigate }) => {
  const features = [
    {
      icon: Zap,
      title: "Premium Quality",
      description: "Made from the finest cotton fabrics with superior thread count for unmatched softness and durability.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Shield,
      title: "Hypoallergenic",
      description: "Safe for sensitive skin with anti-bacterial properties and chemical-free processing.",
      color: "from-green-400 to-teal-500"
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free delivery on orders above ₹999. Express and same-day delivery available in select cities.",
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: Clock,
      title: "Quick Delivery",
      description: "Standard shipping in 5-7 days, express in 2-3 days. Same-day delivery in metro cities.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: Sparkles,
      title: "Easy Care",
      description: "Machine washable, wrinkle-resistant, and color-fast fabrics for hassle-free maintenance.",
      color: "from-pink-400 to-rose-500"
    },
    {
      icon: Heart,
      title: "Customer Love",
      description: "Trusted by thousands of happy customers with 4.8+ star rating across all products.",
      color: "from-red-400 to-pink-500"
    }
  ];

  const materials = [
    {
      name: "Premium Cotton",
      description: "100% pure cotton with high thread count for ultimate comfort and breathability.",
      features: ["Breathable", "Soft", "Durable", "Hypoallergenic"]
    },
    {
      name: "Percale Weave",
      description: "Tight weave pattern that creates a crisp, cool feel perfect for warm climates.",
      features: ["Cool Touch", "Crisp Feel", "Durable", "Resists Pilling"]
    },
    {
      name: "Sateen Finish",
      description: "Luxurious silky-smooth finish with a subtle sheen for elegant bedrooms.",
      features: ["Silky Smooth", "Lustrous", "Wrinkle Resistant", "Luxurious Feel"]
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: "Quality Certified",
      description: "All our products meet international quality standards and are OEKO-TEX certified."
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "7-day hassle-free return policy with free pickup in major cities."
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Dedicated customer service team available to help with all your queries."
    },
    {
      icon: Star,
      title: "Trusted Brand",
      description: "Over 50,000 satisfied customers and counting with excellent reviews."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header 
        user={user}
        cartCount={cartCount}
        onCartOpen={onCartOpen}
        onAuthOpen={onAuthOpen}
        onLogout={onLogout}
        onAdminOpen={onAdminOpen}
        totalPrice={totalPrice}
        currentView="features"
        onNavigate={onNavigate}
      />
      
      <main className="container-custom py-20">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Why Choose FeatherFold?
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Experience the perfect blend of luxury, comfort, and durability with our premium bedsheets designed for Indian homes.
          </p>
        </motion.div>

        {/* Main Features */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Premium Features
            </h2>
            <p className="text-gray-600">
              Every detail crafted for your comfort and peace of mind
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl shadow-soft-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Materials Section */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Premium Materials
            </h2>
            <p className="text-gray-600">
              Only the finest fabrics make it to your bedroom
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {materials.map((material, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.5 }}
                className="bg-white rounded-2xl shadow-soft-lg p-8 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                  {material.name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {material.description}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {material.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Why Customers Love Us
            </h2>
            <p className="text-gray-600">
              We go beyond just selling bedsheets
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.8 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-soft-lg p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Experience Luxury?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their bedrooms with FeatherFold.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => onNavigate && onNavigate('products')}
              className="px-6 py-3 bg-white text-purple-600 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Now
            </motion.button>
            <motion.button
              onClick={() => onNavigate && onNavigate('favorites')}
              className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-medium hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Favorites
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default FeaturesPage;
