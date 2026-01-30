import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Phone, 
  Mail,
  HelpCircle,
  Shield,
  Truck,
  Clock,
  RefreshCw
} from 'lucide-react';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const faqs = [
    {
      question: "Is the checkout safe?",
      answer: "Yes! We use Razorpay, India's leading secure payment gateway, featuring 256-bit encryption. Your payment information is never stored on our servers, and all transactions are PCI-DSS compliant.",
      icon: Shield,
      category: "Payment & Security"
    },
    {
      question: "How do I track my bedsheet?",
      answer: "After purchase, go to 'My Orders' in your account or click the tracking link sent to your registered email and WhatsApp. You'll get real-time updates from our warehouse to your doorstep.",
      icon: Truck,
      category: "Order & Delivery"
    },
    {
      question: "Does it fit high-depth mattresses?",
      answer: "Our fitted sheets are designed to fit mattresses up to 10 inches deep easily. The 360° high-tension elastic ensures a perfect fit without any messy bunching.",
      icon: HelpCircle,
      category: "Product Fit"
    },
    {
      question: "What is the thread count of your bedsheets?",
      answer: "Our bedsheets come in 210 TC to 400 TC (Luxury Grade). Higher thread count means softer, more durable fabric that gets better with every wash.",
      icon: HelpCircle,
      category: "Product Quality"
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 3-5 business days. Express delivery is available in select cities for next-day delivery. You'll receive real-time tracking updates.",
      icon: Clock,
      category: "Order & Delivery"
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day hassle-free return policy. If you're not satisfied with your purchase, you can return it for a full refund or exchange. No questions asked.",
      icon: RefreshCw,
      category: "Returns & Refunds"
    },
    {
      question: "How do I wash and care for my bedsheets?",
      answer: "Machine washable in cold water with mild detergent. Tumble dry on low heat. Do not bleach. Iron on medium heat if needed. Our fade-resistant technology keeps colors vibrant even after 50+ washes.",
      icon: HelpCircle,
      category: "Product Care"
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we ship within India. We're working on expanding to international markets. Sign up for our newsletter to get updates on international shipping.",
      icon: Truck,
      category: "Order & Delivery"
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://featherfold-backendnew1-production.up.railway.app/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          source: 'faq-section'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      setContactForm({ name: '', email: '', message: '' });
      alert('Thanks! Your message has been sent.');
    } catch (error) {
      console.error('Contact submit error:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about FeatherFold bedsheets
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="glassmorphism rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/30 transition-all"
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <faq.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {faq.question}
                        </h3>
                        <span className="text-sm text-purple-600 font-medium">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: activeIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    </motion.div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        className="px-6 pb-6"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="pl-11 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="lg:col-span-1">
            <motion.div
              className="glassmorphism p-8 rounded-2xl sticky top-24"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Still have questions?
                </h3>
                <p className="text-gray-600">
                  Our support team is here to help
                </p>
              </div>

              {/* Quick Contact Options */}
              <div className="space-y-3 mb-6">
                <a
                  href="tel:+918168587844"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/30 transition-all"
                >
                  <Phone className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">+91 81685 87844</span>
                </a>
                <a
                  href="mailto:officialfeatherfold@gmail.com"
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/30 transition-all"
                >
                  <Mail className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">officialfeatherfold@gmail.com</span>
                </a>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none transition-all resize-none"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>

              {/* Support Hours */}
              <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Support Hours</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-medium">9 AM - 8 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday - Sunday:</span>
                    <span className="font-medium">10 AM - 6 PM</span>
                  </div>
                </div>
              </div>

              {/* Live Chat Badge */}
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Live Chat Available</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Category Pills */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {categories.map((category) => (
            <span
              key={category}
              className="px-4 py-2 glassmorphism rounded-full text-sm font-medium text-gray-700"
            >
              {category}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
