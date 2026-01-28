import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Header from './Header';

const FAQPage = ({ user, onCartOpen, onAuthOpen, onLogout, onAdminOpen, cartCount, totalPrice, onNavigate }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Products",
      questions: [
        {
          q: "What materials are FeatherFold bedsheets made from?",
          a: "Our bedsheets are made from premium cotton, percale, and sateen fabrics, all carefully selected for their breathability, softness, and durability. Each fabric type is specifically chosen to provide optimal comfort for Indian weather conditions.",
        },
        {
          q: "What sizes are available?",
          a: "We offer bedsheets in three sizes: Single, Double, and King. All our products come as complete sets including a fitted sheet, flat sheet, and pillowcases (where applicable).",
        },
        {
          q: "Are your bedsheets suitable for sensitive skin?",
          a: "Yes! Our bedsheets are made from hypoallergenic materials and are free from harmful chemicals. The soft, breathable fabrics are gentle on sensitive skin and perfect for those with allergies or skin sensitivities.",
        },
        {
          q: "Do you offer samples or swatches?",
          a: "Currently, we don't offer physical samples, but we provide detailed product descriptions and high-quality images on our website. Our hassle-free return policy allows you to try products risk-free.",
        },
      ],
    },
    {
      category: "Orders & Shipping",
      questions: [
        {
          q: "How long does shipping take?",
          a: "Standard shipping takes 5-7 business days and is free on orders above ₹999. We also offer express shipping (2-3 days) for ₹199 and same-day delivery (₹299) in select metro cities if ordered before 12 PM.",
        },
        {
          q: "Do you ship internationally?",
          a: "Currently, we only ship within India. For international shipping inquiries, please contact us at hello@featherfold.com and we'll explore options for you.",
        },
        {
          q: "Can I track my order?",
          a: "Yes! Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your package in real-time using the tracking link provided.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit/debit cards, UPI, net banking, and cash on delivery (where available). All online payments are processed securely through Razorpay.",
        },
      ],
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          q: "What is your return policy?",
          a: "We offer a 7-day return policy for unused products in their original packaging with tags attached. Please see our Returns Policy page for complete details.",
        },
        {
          q: "How do I return a product?",
          a: "Contact us at officialfeatherfold@gmail.com or call +91 81685 87844 with your order number. We'll provide a return authorization number and arrange pickup (available in metro cities) or provide shipping instructions.",
        },
        {
          q: "How long do refunds take?",
          a: "Refunds are processed within 5-7 business days after we receive and verify the returned product. The refund will be credited to your original payment method.",
        },
        {
          q: "Are return shipping charges free?",
          a: "Yes! Return shipping is free for eligible returns. We provide pickup service in metro cities, or you can ship it back using our provided label.",
        },
      ],
    },
    {
      category: "Care & Maintenance",
      questions: [
        {
          q: "How should I care for my FeatherFold bedsheets?",
          a: "Machine wash in cold or lukewarm water with mild detergent, tumble dry on low heat, and iron on medium heat if needed. Avoid bleach and fabric softeners. See our Care Instructions page for detailed guidelines.",
        },
        {
          q: "Will bedsheets shrink after washing?",
          a: "Our bedsheets are pre-shrunk, but minimal shrinkage (2-3%) may occur after the first wash, which is normal for cotton fabrics. We recommend washing in cold water and avoiding high heat to minimize shrinkage.",
        },
        {
          q: "How often should I wash my bedsheets?",
          a: "We recommend washing your bedsheets every 1-2 weeks for optimal hygiene and freshness. For best results, follow the care instructions on the product label.",
        },
      ],
    },
    {
      category: "Account & Website",
      questions: [
        {
          q: "How do I create an account?",
          a: "You can create an account by clicking 'Sign In' in the header and using Google Sign-In. Alternatively, you can create an account during checkout. Having an account allows you to track orders, save addresses, and enjoy a faster checkout experience.",
        },
        {
          q: "Can I change my order after placing it?",
          a: "If you need to modify your order, please contact us immediately at officialfeatherfold@gmail.com or +91 81685 87844. We'll do our best to accommodate changes if your order hasn't been processed yet.",
        },
        {
          q: "I forgot my password. How do I reset it?",
          a: "If you signed in with Google, you can continue using Google Sign-In. For other account types, use the 'Forgot Password' link on the login page, or contact our support team for assistance.",
        },
        {
          q: "How do I unsubscribe from marketing emails?",
          a: "You can unsubscribe by clicking the unsubscribe link at the bottom of any marketing email, or by updating your email preferences in your account settings.",
        },
      ],
    },
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

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
        currentView="faq"
        onNavigate={onNavigate}
      />
      
      <main className="container-custom py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 text-lg">
              Find answers to common questions about our products, shipping, returns, and more.
            </p>
          </motion.div>

          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <motion.div 
                key={categoryIndex} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="bg-white rounded-2xl shadow-soft-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                  <h2 className="text-2xl font-display font-semibold text-white">
                    {category.category}
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {category.questions.map((faq, questionIndex) => {
                    const index = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === index;
                    return (
                      <div key={questionIndex} className="p-6">
                        <motion.button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full flex items-center justify-between gap-4 text-left"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <h3 className="text-lg font-semibold text-gray-900 pr-4">
                            {faq.q}
                          </h3>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </motion.div>
                        </motion.button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 text-gray-700 leading-relaxed pl-0"
                            >
                              {faq.a}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-soft-lg p-8 md:p-12 text-center text-white"
          >
            <h2 className="text-3xl font-display font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Our customer service team is here to help! Reach out to us and we'll get back to you as soon as possible.
            </p>
            <motion.button
              onClick={() => onNavigate && onNavigate('contact')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default FAQPage;
