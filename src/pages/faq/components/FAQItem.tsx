import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, answer, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      className="border border-gray-200 rounded-lg mb-4 overflow-hidden bg-white shadow-sm transition-all duration-300"
    >
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
        whileHover={{
          backgroundColor: "#f9fafb",
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.995 }}
      >
        <span
          className="text-gray-900 font-medium text-sm sm:text-base pr-4"
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
          className="flex-shrink-0 ml-4"
          whileHover={{
            scale: 1.1,
            color: "#f97316"
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors duration-200"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.04, 0.62, 0.23, 0.98]
            }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="px-6 pb-4 pt-2 border-t border-gray-100 bg-gradient-to-r from-orange-50/30 to-amber-50/30"
            >
              <p
                className="text-gray-700 leading-relaxed text-sm sm:text-base"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                {answer}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
