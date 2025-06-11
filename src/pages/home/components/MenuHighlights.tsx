import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

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

export const MenuHighlights: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [itemsPerView, setItemsPerView] = useState<number>(4);
  const trackRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  const menuItems: MenuItemType[] = [
    {
      title: "Artisan Coffee",
      description: "Our coffee is sourced from the finest beans, roasted to perfection, and crafted with care.",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: "₹350",
      ingredients: ["Premium Arabica Beans", "Steamed Milk", "Natural Sweetener"],
      prepTime: "3-5 mins",
      calories: 120,
      rating: 4.8
    },
    {
      title: "Freshly Baked Delights",
      description: "Indulge in our daily selection of pastries, made with love and the freshest ingredients.",
      image: "https://images.unsplash.com/photo-1555507036-ab794f4afe5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: "₹250",
      ingredients: ["Organic Flour", "Fresh Butter", "Seasonal Fruits"],
      prepTime: "2-3 mins",
      calories: 280,
      rating: 4.9
    },
    {
      title: "Savory Bites",
      description: "Enjoy a variety of sandwiches, prepared with quality meats, cheeses, and homemade sauces.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: "₹680",
      ingredients: ["Artisan Bread", "Premium Meats", "Fresh Vegetables", "House Sauce"],
      prepTime: "8-10 mins",
      calories: 450,
      rating: 4.7
    },
    {
      title: "Sweet Treats",
      description: "Delicious desserts and cakes made fresh daily with premium ingredients.",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: "₹420",
      ingredients: ["Belgian Chocolate", "Fresh Cream", "Seasonal Berries"],
      prepTime: "5-7 mins",
      calories: 380,
      rating: 4.9
    },
    {
      title: "Healthy Options",
      description: "Fresh salads and nutritious bowls for a wholesome dining experience.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: "₹560",
      ingredients: ["Organic Greens", "Quinoa", "Avocado", "Nuts & Seeds"],
      prepTime: "5-6 mins",
      calories: 320,
      rating: 4.6
    },
    {
      title: "Specialty Drinks",
      description: "Unique beverages crafted with premium ingredients and creative flair.",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: "₹480",
      ingredients: ["Fresh Fruits", "Herbs", "Sparkling Water", "Natural Syrups"],
      prepTime: "4-6 mins",
      calories: 150,
      rating: 4.8
    },
    {
      title: "Breakfast Specials",
      description: "Start your day right with our hearty breakfast options and fresh ingredients.",
      image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: "₹740",
      ingredients: ["Farm Eggs", "Artisan Bread", "Fresh Herbs", "Seasonal Vegetables"],
      prepTime: "10-12 mins",
      calories: 520,
      rating: 4.7
    }
  ];

  // Responsive items per view calculation
  const getItemsPerView = (): number => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1023) return 2;
    if (window.innerWidth <= 1280) return 3;
    return 4;
  };

  // Update items per view on resize
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerView = getItemsPerView();
      setItemsPerView(newItemsPerView);

      // Reset to valid index if needed
      const maxIndex = Math.max(0, menuItems.length - newItemsPerView);
      if (currentIndex > maxIndex) {
        setCurrentIndex(maxIndex);
      }
    };

    handleResize(); // Initial setup
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, menuItems.length]);

  // Navigation functions
  const maxIndex = Math.max(0, menuItems.length - itemsPerView);

  const handleNext = (): void => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToSlide = (index: number): void => {
    if (index >= 0 && index <= maxIndex) {
      setCurrentIndex(index);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent): void => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (): void => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Calculate transform for carousel
  const getTransform = (): string => {
    const cardWidth = 100 / itemsPerView;
    return `translateX(-${currentIndex * cardWidth}%)`;
  };

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

        {/* Carousel Container */}
        <div className="relative mb-8">
          {/* Desktop Navigation Buttons */}
          <motion.button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="desktop-prev-btn absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-all duration-200 hidden sm:flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ transform: 'translateY(-50%) translateX(-50%)' }}
            whileHover={{ scale: currentIndex === 0 ? 1 : 1.1 }}
            whileTap={{ scale: currentIndex === 0 ? 1 : 0.9 }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="desktop-next-btn absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-all duration-200 hidden sm:flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ transform: 'translateY(-50%) translateX(50%)' }}
            whileHover={{ scale: currentIndex >= maxIndex ? 1 : 1.1 }}
            whileTap={{ scale: currentIndex >= maxIndex ? 1 : 0.9 }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Carousel Content */}
          <div className="carousel-container overflow-hidden rounded-2xl p-4">
            <div
              ref={trackRef}
              className="carousel-track flex gap-3 sm:gap-4 md:gap-5 transition-transform duration-500 ease-in-out"
              style={{ transform: getTransform() }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer flex-shrink-0 border border-orange-100"
                  style={{
                    width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 15 / itemsPerView}px)`,
                    minWidth: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 15 / itemsPerView}px)`,
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {item.price}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Item Details - appears on hover */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-orange-600">⏱ {item.prepTime}</span>
                          <span className="text-xs font-semibold text-green-600">🔥 {item.calories} cal</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-800">Ingredients:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.ingredients.slice(0, 2).map((ingredient, idx) => (
                              <span key={idx} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                {ingredient}
                              </span>
                            ))}
                            {item.ingredients.length > 2 && (
                              <span className="text-xs text-gray-500">+{item.ingredients.length - 2} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2" style={{ fontFamily: 'Raleway, sans-serif' }}>
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2" style={{ fontFamily: 'Lato, sans-serif' }}>
                      {item.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
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
              ))}
            </div>
          </div>

          {/* Mobile Navigation Buttons */}
          <div className="flex justify-center mt-4 space-x-4 sm:hidden">
            <motion.button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="mobile-prev-btn bg-orange-600 hover:bg-orange-700 text-white rounded-full p-2 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: currentIndex === 0 ? 1 : 1.1 }}
              whileTap={{ scale: currentIndex === 0 ? 1 : 0.9 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="mobile-next-btn bg-orange-600 hover:bg-orange-700 text-white rounded-full p-2 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: currentIndex >= maxIndex ? 1 : 1.1 }}
              whileTap={{ scale: currentIndex >= maxIndex ? 1 : 0.9 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          {/* Slider Indicators/Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'bg-orange-600 w-6'
                    : 'bg-orange-200 hover:bg-orange-300'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to slide ${index + 1}`}
              />
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
            View Full Menu
          </motion.button>
        </div>
      </div>

      {/* Custom CSS for responsive carousel */}
      <style jsx>{`
        .carousel-track {
          touch-action: pan-y;
          user-select: none;
          -webkit-overflow-scrolling: touch;
          will-change: transform;
        }

        /* Hide scrollbar */
        .carousel-track::-webkit-scrollbar {
          display: none;
        }

        .carousel-track {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Enhanced card styling */
        .carousel-track > div {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        /* Gradient background animation */
        .carousel-container {
          background: linear-gradient(-45deg, #fff5f5, #fef7ed, #fefce8, #f0fdf4);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Smooth transitions for mobile */
        @media (max-width: 768px) {
          .carousel-track {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }

        /* Improved hover effects */
        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }

        /* Better touch feedback */
        .carousel-track {
          cursor: grab;
        }

        .carousel-track:active {
          cursor: grabbing;
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .carousel-track {
            transition: none;
          }

          .carousel-container {
            animation: none;
          }
        }

        /* Loading state */
        .carousel-track img {
          transition: opacity 0.3s ease;
        }

        .carousel-track img:not([src]) {
          opacity: 0;
        }
      `}</style>
    </section>
  );
};
