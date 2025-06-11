import { motion } from 'framer-motion';

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

interface MenuCardProps {
  item: MenuItemType;
  index: number;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, index }) => {
  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border border-gray-100 w-full"
      whileHover={{ y: -2, scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Price badge - always visible */}
        <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
          {item.price}
        </div>

        {/* Mobile info overlay - always visible on small screens */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:hidden">
          <div className="text-white">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">⏱ {item.prepTime}</span>
              <span className="font-semibold">🔥 {item.calories} cal</span>
            </div>
          </div>
        </div>

        {/* Desktop hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block" />

        {/* Desktop hover details */}
        <div className="absolute inset-0 p-2 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex">
          <div className="bg-white/95 backdrop-blur-sm rounded-md p-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-orange-600">⏱ {item.prepTime}</span>
              <span className="text-xs font-semibold text-green-600">🔥 {item.calories} cal</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-800">Rating:</p>
              <div className="flex items-center">
                <div className="flex text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'fill-current' : 'fill-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-600 ml-1">{item.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 sm:p-3">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 line-clamp-1" style={{ fontFamily: 'Raleway, sans-serif' }}>
          {item.title}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2" style={{ fontFamily: 'Lato, sans-serif' }}>
          {item.description}
        </p>

        {/* Mobile rating - always visible */}
        <div className="mt-2 flex items-center justify-between sm:hidden">
          <div className="flex text-orange-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'fill-current' : 'fill-gray-300'}`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">{item.rating}</span>
        </div>
      </div>
    </motion.div>
  );
};
