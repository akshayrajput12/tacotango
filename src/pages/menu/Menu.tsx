import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hero, MenuCategories, MenuSection } from './components';
import { usePublicMenu } from '../../hooks/useMenu';
import type { MenuItem } from '../../services/menuService';

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

// Transform MenuItem to MenuItemType for component compatibility
const transformToLegacyFormat = (item: MenuItem): MenuItemType => ({
  title: item.name,
  description: item.description,
  image: item.image,
  price: `₹${item.price}`,
  ingredients: item.ingredients,
  prepTime: item.prepTime,
  calories: item.calories,
  rating: item.rating
});

export const MenuPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('');

  // Use the database hook
  const { menuItems, categories, loading, error, getItemsByCategory } = usePublicMenu();

  // Set initial category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Fallback data for when database is not available
  const fallbackMenuData: { [key: string]: MenuItemType[] } = {
    Breakfast: [
      {
        title: "Sunrise Sandwich",
        description: "Egg, cheese, and your choice of bacon or sausage on a toasted English muffin.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹420",
        ingredients: ["Farm Fresh Eggs", "Artisan Cheese", "Choice of Bacon", "English Muffin"],
        prepTime: "8-10 mins",
        calories: 380,
        rating: 4.7
      }
    ],
    Coffee: [
      {
        title: "Artisan Coffee",
        description: "Our coffee is sourced from the finest beans, roasted to perfection, and crafted with care.",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹350",
        ingredients: ["Premium Arabica Beans", "Steamed Milk", "Natural Sweetener"],
        prepTime: "3-5 mins",
        calories: 120,
        rating: 4.8
      }
    ]
  };

  // Get current menu data - use database if available, otherwise fallback
  const getCurrentMenuData = (): { [key: string]: MenuItemType[] } => {
    if (loading || error || menuItems.length === 0) {
      return fallbackMenuData;
    }

    // Group database items by category
    const groupedData: { [key: string]: MenuItemType[] } = {};
    categories.forEach(category => {
      const categoryItems = getItemsByCategory(category);
      groupedData[category] = categoryItems.map(transformToLegacyFormat);
    });

    return groupedData;
  };

  const menuData = getCurrentMenuData();
  const availableCategories = Object.keys(menuData);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FCFAF7' }}>
        <Hero />
        <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
          <div className="mt-6 mb-8 flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCFAF7' }}>
      <Hero />

      <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <div className="mt-6 mb-8">
          <MenuCategories
            categories={availableCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {error && menuItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Unable to load menu items. Showing sample menu.</p>
            </div>
          )}

          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MenuSection
              title={activeCategory}
              items={menuData[activeCategory] || []}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

