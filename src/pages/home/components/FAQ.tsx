import { motion } from 'framer-motion';

interface FAQProps {
  onViewFAQs?: () => void;
}

export const FAQ = ({ onViewFAQs }: FAQProps) => {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 faq-section" style={{ backgroundColor: '#F5F1EC' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl"
      >
        {/* FAQ Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Frequently Asked Questions
        </motion.h2>

        {/* Description Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-4xl"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          Have questions about our menu, reservations, or events? Find answers to common inquiries and get the information you need to make the most of your visit to Cafex.
        </motion.p>

        {/* View FAQs Button */}
        <motion.button
          onClick={onViewFAQs}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{
            scale: 1.02,
            backgroundColor: "#ede4df"
          }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base text-gray-800"
          style={{ backgroundColor: '#F2EBE8' }}
        >
          View FAQs
        </motion.button>
      </motion.div>

      {/* Custom CSS for consistent 1024px-1144px sizing */}
      <style>{`
        .faq-section {
          padding-left: 2rem;
          padding-right: 2rem;
        }

        @media (min-width: 640px) {
          .faq-section {
            padding-left: 3rem;
            padding-right: 3rem;
          }
        }

        @media (min-width: 768px) {
          .faq-section {
            padding-left: 4rem;
            padding-right: 4rem;
          }
        }

        @media (min-width: 1024px) and (max-width: 1144px) {
          .faq-section {
            padding-left: 6rem;
            padding-right: 6rem;
          }
        }

        @media (min-width: 1145px) and (max-width: 1279px) {
          .faq-section {
            padding-left: 6rem;
            padding-right: 6rem;
          }
        }

        @media (min-width: 1280px) {
          .faq-section {
            padding-left: 8rem;
            padding-right: 8rem;
          }
        }

        @media (min-width: 1536px) {
          .faq-section {
            padding-left: 10rem;
            padding-right: 10rem;
          }
        }
      `}</style>
    </section>
  );
};
