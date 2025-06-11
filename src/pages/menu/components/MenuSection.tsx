import { motion } from 'framer-motion';
import { MenuCard } from './MenuCard';

interface MenuItemType {
  title: string;
  description: string;
  image: string;
  price: string;
  ingredients: string[];
  prepTime: string;
  calories: number;
  rating: number;
}

interface MenuSectionProps {
  title: string;
  items: MenuItemType[];
}

export const MenuSection: React.FC<MenuSectionProps> = ({ title, items }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6"
        style={{ fontFamily: 'Raleway, sans-serif' }}
      >
        {title}
      </motion.h2>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {items.map((item, index) => (
          <MenuCard key={item.title} item={item} index={index} />
        ))}
      </div>
    </motion.section>
  );
};
