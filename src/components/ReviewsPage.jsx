import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  User,
  Filter,
  ChevronDown,
  Heart,
  ShoppingBag
} from 'lucide-react';
import Header from './Header';

// Move reviews outside component to prevent re-creation on every render
const REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    date: "2026-01-15",
    product: "Premium Cotton Bedsheet - King Size",
    title: "Absolutely Love It!",
    content: "The quality is exceptional! The fabric is so soft and fit is perfect. Worth every penny. Have been using it for 3 months now and it still looks brand new.",
    verified: true,
    helpful: 24,
    images: []
  },
  {
    id: 2,
    name: "Rahul Verma",
    rating: 5,
    date: "2026-01-12",
    product: "Percale Weave Bedsheet - Double Size",
    title: "Perfect for Indian Weather",
    content: "These bedsheets are perfect for our climate. Breathable and comfortable even during summers. The color hasn't faded after multiple washes. Very satisfied!",
    verified: true,
    helpful: 18,
    images: []
  },
  {
    id: 3,
    name: "Anjali Patel",
    rating: 4,
    date: "2026-01-10",
    product: "Sateen Finish Bedsheet - Single Size",
    title: "Luxurious Feel",
    content: "The sateen finish feels so luxurious! Only giving 4 stars because it took a week longer than expected to arrive. But the product quality is amazing.",
    verified: true,
    helpful: 15,
    images: []
  },
  {
    id: 4,
    name: "Vikram Singh",
    rating: 5,
    date: "2026-01-08",
    product: "Premium Cotton Bedsheet - King Size",
    title: "Better Than Expected",
    content: "I've tried many brands but FeatherFold is by far the best. The thread count is amazing and it feels like sleeping in a 5-star hotel.",
    verified: true,
    helpful: 32,
    images: []
  },
  {
    id: 5,
    name: "Kavita Reddy",
    rating: 5,
    date: "2026-01-05",
    product: "Percale Weave Bedsheet - King Size",
    title: "Excellent Customer Service",
    content: "Had a small issue with my order and their customer service resolved it immediately. The bedsheets themselves are fantastic - soft, durable, and beautiful.",
    verified: true,
    helpful: 21,
    images: []
  },
  {
    id: 6,
    name: "Amit Kumar",
    rating: 4,
    date: "2026-01-03",
    product: "Sateen Finish Bedsheet - Double Size",
    title: "Good Quality, Minor Issue",
    content: "Overall very happy with the purchase. The fabric quality is excellent. Only minor issue was that the pillowcases were slightly smaller than expected.",
    verified: true,
    helpful: 12,
    images: []
  },
  {
    id: 7,
    name: "Meera Joshi",
    rating: 5,
    date: "2026-01-01",
    product: "Premium Cotton Bedsheet - Single Size",
    title: "Perfect Gift",
    content: "Bought this as a gift for my sister and she absolutely loves it! The packaging was beautiful and the quality is outstanding. Will definitely order again.",
    verified: true,
    helpful: 19,
    images: []
  },
  {
    id: 8,
    name: "Rohit Gupta",
    rating: 5,
    date: "2025-12-28",
    product: "Percale Weave Bedsheet - King Size",
    title: "Worth the Investment",
    content: "Initially thought it was expensive, but after using it for 2 months, I can say it's worth every rupee. The quality speaks for itself.",
    verified: true,
    helpful: 28,
    images: []
  }
];

const ReviewsPage = ({ user, onCartOpen, onAuthOpen, onLogout, onAdminOpen, cartCount, totalPrice, onNavigate }) => {
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [helpfulCounts, setHelpfulCounts] = useState({});

  // Memoized renderStars function to prevent re-creation on every render
  const renderStars = useCallback((rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  }, []);

  // Handle helpful button click with optimistic update
  const handleHelpfulClick = useCallback((reviewId) => {
    setHelpfulCounts(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
  }, []);

  // Memoized filtered and sorted reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = REVIEWS.filter(review => {
      if (filterBy === 'all') return true;
      if (filterBy === '5star') return review.rating === 5;
      if (filterBy === '4star') return review.rating === 4;
      if (filterBy === 'verified') return review.verified;
      return true;
    });

    // Disable rating sort when filtering by rating to avoid UX confusion
    const canSortByRating = !['5star', '4star'].includes(filterBy);
    
    return filtered.sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'helpful') return (b.helpful + (helpfulCounts[b.id] || 0)) - (a.helpful + (helpfulCounts[a.id] || 0));
      if (sortBy === 'rating' && canSortByRating) return b.rating - a.rating;
      return 0;
    });
  }, [filterBy, sortBy, helpfulCounts]);

  // Memoized statistics
  const statistics = useMemo(() => {
    const averageRating = REVIEWS.reduce((sum, review) => sum + review.rating, 0) / REVIEWS.length;
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: REVIEWS.filter(r => r.rating === rating).length,
      percentage: (REVIEWS.filter(r => r.rating === rating).length / REVIEWS.length) * 100
    }));

    return {
      averageRating,
      totalReviews: REVIEWS.length,
      fiveStarPercentage: Math.round((REVIEWS.filter(r => r.rating === 5).length / REVIEWS.length) * 100),
      ratingDistribution
    };
  }, []);

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
        currentView="reviews"
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
            Customer Reviews
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Real feedback from real customers who love FeatherFold products
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-soft-lg p-8 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {statistics.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {renderStars(Math.round(statistics.averageRating))}
              </div>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {statistics.totalReviews}
              </div>
              <p className="text-gray-600">Total Reviews</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {statistics.fiveStarPercentage}%
              </div>
              <p className="text-gray-600">5-Star Reviews</p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {statistics.ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm text-gray-600">{rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-yellow-400 h-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filters and Sort */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Reviews</option>
              <option value="5star">5 Stars Only</option>
              <option value="4star">4 Stars Only</option>
              <option value="verified">Verified Only</option>
            </select>
            <Filter className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={['5star', '4star'].includes(filterBy)}
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating" disabled={['5star', '4star'].includes(filterBy)}>Highest Rating</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </motion.div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredAndSortedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index + 0.4 }}
              className="bg-white rounded-2xl shadow-soft-lg p-8"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{review.name}</h3>
                    {review.verified && (
                      <div className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full font-medium">
                        Verified Purchase
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span>{new Date(review.date).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <button 
                      onClick={() => handleHelpfulClick(review.id)}
                      className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({review.helpful + (helpfulCounts[review.id] || 0)})</span>
                    </button>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">Product: {review.product}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-soft-lg p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Join Happy Customers?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Experience the quality and comfort that our customers rave about. Your perfect bedsheet awaits!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => onNavigate && onNavigate('products')}
              className="px-6 py-3 bg-white text-purple-600 rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag className="w-5 h-5" />
              Shop Now
            </motion.button>
            <motion.button
              onClick={() => onNavigate && onNavigate('favorites')}
              className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="w-5 h-5" />
              View Favorites
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ReviewsPage;
