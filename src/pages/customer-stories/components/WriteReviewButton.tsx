import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ReviewForm from '../../../components/ReviewForm';

interface WriteReviewButtonProps {
  onReviewSubmitted?: () => void;
}

export const WriteReviewButton: React.FC<WriteReviewButtonProps> = ({
  onReviewSubmitted
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSuccess = () => {
    setShowModal(false);
    setShowSuccessMessage(true);

    // Trigger refresh of reviews list
    if (onReviewSubmitted) {
      onReviewSubmitted();
    }

    // Hide success message after 4 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 4000);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Success Message */}
            <AnimatePresence>
              {showSuccessMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800" style={{ fontFamily: 'Raleway, sans-serif' }}>
                        Review Submitted Successfully!
                      </h3>
                      <p className="text-green-700 text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>
                        Thank you for sharing your experience. Your review is pending approval.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Write Review Button */}
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

      {/* Review Form Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <ReviewForm
                onSuccess={handleSuccess}
                onCancel={handleCancel}
                className="shadow-2xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
