import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { goToMenu } from '../../../utils/navigation';
import { usePublicMenu } from '../../../hooks/useMenu';
import type { MenuItem } from '../../../services/menuService';

// Legacy interface for backward compatibility
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

export const MenuHighlights: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [itemsPerView, setItemsPerView] = useState<number>(4);
  const trackRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  // Use the database hook
  const { featuredItems, loading, error } = usePublicMenu();

  // Transform database items to legacy format for component compatibility
  const menuItems: MenuItemType[] = featuredItems.map(transformToLegacyFormat);

  // Fallback data in case no featured items are available
  const fallbackMenuItems: MenuItemType[] = [
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
    }
  ];

  // Use database items if available, otherwise fallback
  const displayItems = menuItems.length > 0 ? menuItems : fallbackMenuItems;

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
      const maxIndex = Math.max(0, displayItems.length - newItemsPerView);
      if (currentIndex > maxIndex) {
        setCurrentIndex(maxIndex);
      }
    };

    handleResize(); // Initial setup
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, displayItems.length]);

  // Navigation functions
  const maxIndex = Math.max(0, displayItems.length - itemsPerView);

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

  // Show loading state
  if (loading) {
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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state with fallback
  if (error && displayItems.length === 0) {
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
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Unable to load menu items. Please try again later.</p>
            <motion.button
              onClick={goToMenu}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Full Menu
            </motion.button>
          </div>
        </div>
      </section>
    );
  }

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
          Menu Highlights {!loading && featuredItems.length === 0 && <span className="text-sm text-gray-500">(Sample Items)</span>}
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
              {displayItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex-shrink-0 border border-gray-100 w-full"
                  style={{
                    width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 15 / itemsPerView}px)`,
                    minWidth: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 15 / itemsPerView}px)`,
                  }}
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
            onClick={goToMenu}
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
      <style>{`
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
