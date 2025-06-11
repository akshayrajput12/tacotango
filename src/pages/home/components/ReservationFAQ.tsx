import { motion } from 'framer-motion';
import { useState } from 'react';
import { goToFAQ } from '../../../utils/navigation';

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.01,
        boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.1)"
      }}
      className="border border-gray-200 rounded-lg mb-3 overflow-hidden bg-white shadow-sm"
    >
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
        whileHover={{ backgroundColor: "#f9fafb" }}
        whileTap={{ scale: 0.995 }}
      >
        <span 
          className="text-gray-900 font-medium text-sm sm:text-base pr-3"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          {question}
        </span>
        <motion.div
          animate={{ 
            rotate: isExpanded ? 180 : 0,
            color: isExpanded ? "#f97316" : "#6b7280"
          }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
          whileHover={{ scale: 1.1, color: "#f97316" }}
        >
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </motion.button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-4 pb-3 pt-1 border-t border-gray-100 bg-orange-50/30">
            <p 
              className="text-gray-700 leading-relaxed text-sm"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              {answer}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export const ReservationFAQ = () => {
  const reservationFAQs = [
    {
      question: 'How can I make a reservation?',
      answer: 'You can make a reservation through our website or by calling us directly. We recommend booking in advance, especially for weekends and special events.'
    },
    {
      question: 'Is there a cancellation policy?',
      answer: 'Yes, we have a 24-hour cancellation policy. Please cancel your reservation at least 24 hours in advance to avoid any charges.'
    },
    {
      question: 'Can I request a specific table?',
      answer: 'While we cannot guarantee specific tables, we will do our best to accommodate your preferences. Please mention any special requests when making your reservation.'
    }
  ];

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 reservation-faq-section" style={{ backgroundColor: '#F5F1EC' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl"
      >
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Reservation Questions
        </motion.h2>

        {/* Description Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl mb-8"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          Quick answers to common reservation questions. For more detailed information, visit our complete FAQ page.
        </motion.p>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          {reservationFAQs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </motion.div>

        {/* View All FAQs Button */}
        <motion.button
          onClick={goToFAQ}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{
            scale: 1.02,
            backgroundColor: "#ede4df"
          }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base text-gray-800"
          style={{ backgroundColor: '#F2EBE8' }}
        >
          View All FAQs
        </motion.button>
      </motion.div>

      {/* Custom CSS for consistent styling */}
      <style>{`
        .reservation-faq-section {
          padding-left: 2rem;
          padding-right: 2rem;
        }

        @media (min-width: 640px) {
          .reservation-faq-section {
            padding-left: 3rem;
            padding-right: 3rem;
          }
        }

        @media (min-width: 768px) {
          .reservation-faq-section {
            padding-left: 4rem;
            padding-right: 4rem;
          }
        }

        @media (min-width: 1024px) and (max-width: 1144px) {
          .reservation-faq-section {
            padding-left: 6rem;
            padding-right: 6rem;
          }
        }

        @media (min-width: 1145px) and (max-width: 1279px) {
          .reservation-faq-section {
            padding-left: 6rem;
            padding-right: 6rem;
          }
        }

        @media (min-width: 1280px) {
          .reservation-faq-section {
            padding-left: 8rem;
            padding-right: 8rem;
          }
        }

        @media (min-width: 1536px) {
          .reservation-faq-section {
            padding-left: 10rem;
            padding-right: 10rem;
          }
        }
      `}</style>
    </section>
  );
};
