import { motion } from 'framer-motion';
import { useState } from 'react';

interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  review: string;
  likes: number;
  dislikes: number;
  avatar: string;
}

const reviewsData: Review[] = [
  {
    id: 1,
    name: 'Sophia Clark',
    date: '2023-08-15',
    rating: 5,
    review: 'Cafe Aroma is my go-to spot for a relaxing afternoon. The coffee is always perfect, and the staff are incredibly friendly. I especially love their outdoor seating area.',
    likes: 12,
    dislikes: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
  },
  {
    id: 2,
    name: 'Ethan Miller',
    date: '2023-07-22',
    rating: 4,
    review: 'I had a great experience at Cafe Aroma. The food was delicious, and the atmosphere was cozy. The only reason I\'m not giving it 5 stars is because the service was a bit slow.',
    likes: 8,
    dislikes: 3,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
  },
  {
    id: 3,
    name: 'Olivia Davis',
    date: '2023-06-10',
    rating: 5,
    review: 'Absolutely love Cafe Aroma! Their pastries are to die for, and the coffee is top-notch. It\'s the perfect place to catch up with friends or enjoy a quiet moment alone.',
    likes: 15,
    dislikes: 1,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 4,
    name: 'Liam Wilson',
    date: '2023-05-05',
    rating: 5,
    review: 'Cafe Aroma is a hidden gem! The coffee is rich and flavorful, and the staff are always welcoming. I highly recommend their breakfast menu.',
    likes: 10,
    dislikes: 1,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 5,
    name: 'Ava Thompson',
    date: '2023-04-18',
    rating: 5,
    review: 'I\'m a regular at Cafe Aroma, and it never disappoints. The atmosphere is warm and inviting, and the coffee is consistently excellent. Their sandwiches are also a must-try.',
    likes: 14,
    dislikes: 0,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80'
  },
  {
    id: 6,
    name: 'Noah Garcia',
    date: '2023-03-22',
    rating: 4,
    review: 'I had a pleasant experience at Cafe Aroma. The coffee was good, and the staff were friendly. The only reason I\'m not giving it 5 stars is because the prices are a bit high.',
    likes: 7,
    dislikes: 2,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
  }
];

export const ReviewsList = () => {
  const [reviews, setReviews] = useState(reviewsData);

  const handleLike = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, likes: review.likes + 1 }
        : review
    ));
  };

  const handleDislike = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, dislikes: review.dislikes + 1 }
        : review
    ));
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
      month: '2-digit',
      day: '2-digit'
    });
  };

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
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 
                      className="font-semibold text-gray-900"
                      style={{ fontFamily: 'Raleway, sans-serif' }}
                    >
                      {review.name}
                    </h3>
                    <span 
                      className="text-sm text-gray-500"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      {formatDate(review.date)}
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
                "{review.review}"
              </p>

              {/* Review Actions */}
              <div className="flex items-center space-x-6">
                <motion.button
                  onClick={() => handleLike(review.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span 
                    className="text-sm font-medium"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    {review.likes}
                  </span>
                </motion.button>

                <motion.button
                  onClick={() => handleDislike(review.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                  </svg>
                  <span 
                    className="text-sm font-medium"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    {review.dislikes}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
