import { motion } from 'framer-motion';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { usePublicReviews } from '../../../hooks/useReviews';
import { ReviewAvatar } from '../../../components/Avatar';

export const ReviewsList = forwardRef<{ refetch: () => void }, {}>((_, ref) => {
  const { reviews, loading, error, refetch } = usePublicReviews();
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());

  // Expose refetch function to parent component
  useImperativeHandle(ref, () => ({
    refetch
  }));

  const handleLike = (reviewId: string) => {
    if (likedReviews.has(reviewId)) {
      setLikedReviews(prev => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
    } else {
      setLikedReviews(prev => new Set(prev).add(reviewId));
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-orange-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <div className="text-center py-12">
          <p className="text-red-600">Error loading reviews: {error}</p>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: 'Raleway, sans-serif' }}>
            No reviews yet
          </h3>
          <p className="text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
            Be the first to share your experience!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              style={{ backgroundColor: '#FCFAF7' }}
            >
              {/* Review Header */}
              <div className="flex items-start space-x-4 mb-4">
                <ReviewAvatar
                  name={review.customerName}
                  size="md"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className="font-semibold text-gray-900"
                      style={{ fontFamily: 'Raleway, sans-serif' }}
                    >
                      {review.customerName}
                    </h3>
                    <span
                      className="text-sm text-gray-500"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <p
                className="text-gray-700 leading-relaxed mb-4"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                "{review.reviewText}"
              </p>

              {/* Review Actions */}
              <div className="flex items-center space-x-6">
                <motion.button
                  onClick={() => handleLike(review.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 transition-colors duration-200 ${
                    likedReviews.has(review.id)
                      ? 'text-green-600'
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill={likedReviews.has(review.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    {likedReviews.has(review.id) ? 'Liked' : 'Like'}
                  </span>
                </motion.button>

                <div className="flex items-center space-x-2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span
                    className="text-sm"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    Verified Customer
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

ReviewsList.displayName = 'ReviewsList';
