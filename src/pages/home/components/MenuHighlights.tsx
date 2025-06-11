import { motion } from 'framer-motion';

export const MenuHighlights = () => {
  const menuItems = [
    {
      title: "Artisan Coffee",
      description: "Our coffee is sourced from the finest beans, roasted to perfection, and crafted with care.",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Freshly Baked Delights",
      description: "Indulge in our daily selection of pastries, made with love and the freshest ingredients.",
      image: "https://images.unsplash.com/photo-1555507036-ab794f4afe5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Savory Bites",
      description: "Enjoy a variety of sandwiches, prepared with quality meats, cheeses, and homemade sauces.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Sweet Treats",
      description: "Delicious desserts and cakes made fresh daily with premium ingredients.",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Healthy Options",
      description: "Fresh salads and nutritious bowls for a wholesome dining experience.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <div className="mt-6 mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Menu Highlights
        </motion.h2>
        
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative aspect-square">
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Raleway, sans-serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-3" style={{ fontFamily: 'Lato, sans-serif' }}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full transition-all duration-200 shadow-lg text-sm sm:text-base"
          >
            View All
          </motion.button>
        </div>
      </div>
    </section>
  );
};
