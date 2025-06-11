import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const WriteReviewButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    review: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: '', review: '' });
      setRating(0);

      // Hide success message and close modal after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setShowModal(false);
      }, 2000);
    }, 1000);
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <motion.button
          key={index}
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          className="text-2xl focus:outline-none transition-colors duration-200"
        >
          <span
            className={`${
              starValue <= (hoverRating || rating)
                ? 'text-orange-400'
                : 'text-gray-300'
            }`}
          >
            ★
          </span>
        </motion.button>
      );
    });
  };

  return (
    <>
      <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={() => setShowModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 shadow-lg"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              Write Your Review
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Review Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: '#FCFAF7' }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: 'Raleway, sans-serif' }}
                >
                  Write Your Review
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {!showSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block text-sm font-medium text-gray-900 mb-2"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      required
                      className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                      style={{ 
                        backgroundColor: '#F5F0ED',
                        fontFamily: 'Lato, sans-serif'
                      }}
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label 
                      className="block text-sm font-medium text-gray-900 mb-2"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {renderStars()}
                    </div>
                  </div>

                  {/* Review Field */}
                  <div>
                    <label 
                      htmlFor="review" 
                      className="block text-sm font-medium text-gray-900 mb-2"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      Your Review
                    </label>
                    <textarea
                      id="review"
                      name="review"
                      value={formData.review}
                      onChange={handleInputChange}
                      placeholder="Share your experience..."
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 resize-none"
                      style={{ 
                        backgroundColor: '#F5F0ED',
                        fontFamily: 'Lato, sans-serif'
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || rating === 0}
                      whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </motion.button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="text-green-600 text-5xl mb-4">✓</div>
                  <h3 
                    className="text-xl font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: 'Raleway, sans-serif' }}
                  >
                    Thank You!
                  </h3>
                  <p 
                    className="text-gray-700"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    Your review has been submitted successfully.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
