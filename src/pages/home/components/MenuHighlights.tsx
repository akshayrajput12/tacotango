import { motion } from 'framer-motion';
import { useEffect } from 'react';

export const MenuHighlights = () => {
  const menuItems = [
    {
      title: "Artisan Coffee",
      description: "Our coffee is sourced from the finest beans, roasted to perfection, and crafted with care.",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: "$4.50"
    },
    {
      title: "Freshly Baked Delights",
      description: "Indulge in our daily selection of pastries, made with love and the freshest ingredients.",
      image: "https://images.unsplash.com/photo-1555507036-ab794f4afe5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: "$3.25"
    },
    {
      title: "Savory Bites",
      description: "Enjoy a variety of sandwiches, prepared with quality meats, cheeses, and homemade sauces.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: "$8.75"
    },
    {
      title: "Sweet Treats",
      description: "Delicious desserts and cakes made fresh daily with premium ingredients.",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: "$5.50"
    },
    {
      title: "Healthy Options",
      description: "Fresh salads and nutritious bowls for a wholesome dining experience.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: "$7.25"
    },
    {
      title: "Specialty Drinks",
      description: "Unique beverages crafted with premium ingredients and creative flair.",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: "$6.00"
    },
    {
      title: "Breakfast Specials",
      description: "Start your day right with our hearty breakfast options and fresh ingredients.",
      image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: "$9.50"
    }
  ];

  useEffect(() => {
    // Carousel functionality
    const track = document.querySelector('.carousel-track') as HTMLElement;
    const cards = Array.from(track?.children || []) as HTMLElement[];
    const prevButton = document.querySelector('.prev-btn') as HTMLButtonElement;
    const nextButton = document.querySelector('.next-btn') as HTMLButtonElement;

    if (!track || !cards.length || !prevButton || !nextButton) return;

    // Determine card width and items per view
    const getItemsPerView = () => {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      if (window.innerWidth <= 1280) return 3;
      return 4;
    };

    let cardWidth = cards[0].getBoundingClientRect().width + 20;
    let currentIndex = 0;
    let itemsPerView = getItemsPerView();
    let maxIndex = Math.max(0, cards.length - itemsPerView);

    function moveTo(index: number) {
      track.style.transform = 'translateX(-' + (cardWidth * index) + 'px)';
      currentIndex = index;

      // Update button states
      prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
      nextButton.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    }

    const handleNext = () => {
      if (currentIndex < maxIndex) {
        moveTo(currentIndex + 1);
      }
    };

    const handlePrev = () => {
      if (currentIndex > 0) {
        moveTo(currentIndex - 1);
      }
    };

    const handleResize = () => {
      cardWidth = cards[0].getBoundingClientRect().width + 20;
      itemsPerView = getItemsPerView();
      maxIndex = Math.max(0, cards.length - itemsPerView);

      // Reset to valid index if needed
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }
      moveTo(currentIndex);
    };

    // Touch/swipe functionality for mobile
    let startX = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return;
      isDragging = false;

      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      // Minimum swipe distance
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    };

    // Event listeners
    nextButton.addEventListener('click', handleNext);
    prevButton.addEventListener('click', handlePrev);
    window.addEventListener('resize', handleResize);
    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchmove', handleTouchMove, { passive: false });
    track.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Initial setup
    moveTo(0);

    // Cleanup
    return () => {
      nextButton.removeEventListener('click', handleNext);
      prevButton.removeEventListener('click', handlePrev);
      window.removeEventListener('resize', handleResize);
      track.removeEventListener('touchstart', handleTouchStart);
      track.removeEventListener('touchmove', handleTouchMove);
      track.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

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
            className="prev-btn absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-all duration-200 hidden sm:flex items-center justify-center"
            style={{ transform: 'translateY(-50%) translateX(-50%)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            className="next-btn absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-all duration-200 hidden sm:flex items-center justify-center"
            style={{ transform: 'translateY(-50%) translateX(50%)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Carousel Content */}
          <div className="carousel-container overflow-hidden rounded-2xl p-4">
            <div className="carousel-track flex gap-3 sm:gap-4 md:gap-5 transition-transform duration-500 ease-in-out">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer flex-shrink-0 border border-orange-100"
                  style={{
                    width: 'calc(25% - 15px)', // Desktop: 4 cards
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Add to Cart Button - appears on hover */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-full bg-white/90 hover:bg-white text-orange-600 font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-200">
                        Add to Cart
                      </button>
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
                          <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">4.8</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Buttons */}
          <div className="flex justify-center mt-4 space-x-4 sm:hidden">
            <motion.button
              className="prev-btn bg-orange-600 hover:bg-orange-700 text-white rounded-full p-2 transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              className="next-btn bg-orange-600 hover:bg-orange-700 text-white rounded-full p-2 transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
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
        }

        @media (max-width: 768px) {
          .carousel-track > div {
            width: calc(100% - 15px) !important;
            min-width: calc(100% - 15px) !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .carousel-track > div {
            width: calc(50% - 15px) !important;
            min-width: calc(50% - 15px) !important;
          }
        }
        @media (min-width: 1025px) and (max-width: 1280px) {
          .carousel-track > div {
            width: calc(33.333% - 15px) !important;
            min-width: calc(33.333% - 15px) !important;
          }
        }
        @media (min-width: 1281px) {
          .carousel-track > div {
            width: calc(25% - 15px) !important;
            min-width: calc(25% - 15px) !important;
          }
        }

        /* Smooth scrolling for touch devices */
        .carousel-track {
          -webkit-overflow-scrolling: touch;
        }

        /* Hide scrollbar */
        .carousel-track::-webkit-scrollbar {
          display: none;
        }

        /* Enhanced card styling */
        .carousel-track > div {
          backdrop-filter: blur(10px);
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
      `}</style>
    </section>
  );
};
