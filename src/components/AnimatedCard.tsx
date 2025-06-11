import { motion } from 'framer-motion';

interface AnimatedCardProps {
  title: string;
  description: string;
  delay?: number;
}

export const AnimatedCard = ({ title, description, delay = 0 }: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm mx-auto"
    >
      <motion.h3 
        className="text-xl font-bold text-gray-900 dark:text-white mb-3"
        whileHover={{ color: "#3B82F6" }}
      >
        {title}
      </motion.h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
      >
        Learn More
      </motion.button>
    </motion.div>
  );
};
