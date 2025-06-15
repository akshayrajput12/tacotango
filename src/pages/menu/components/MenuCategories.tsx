import { motion } from 'framer-motion';

interface MenuCategoriesProps {
  categories?: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const MenuCategories: React.FC<MenuCategoriesProps> = ({
  categories = ['Breakfast', 'Lunch', 'Dinner', 'Drinks'],
  activeCategory,
  onCategoryChange
}) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 mb-6 sm:mb-8"
    >
      {categories.map((category, index) => (
        <motion.button
          key={category}
          onClick={() => onCategoryChange(category)}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
            activeCategory === category
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
          }`}
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          {category}
        </motion.button>
      ))}
    </motion.div>
  );
};
