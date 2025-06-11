import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export const InstagramFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const instagramPosts = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      title: "Perfect Latte Art",
      description: "Starting the day with beautiful coffee art and premium beans. Our skilled baristas create stunning designs that make every cup a work of art. ☕✨",
      instagramUrl: "https://www.instagram.com/p/example1/",
      likes: 234,
      comments: 12
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      title: "Fresh Pastries",
      description: "Delicious croissants and pastries baked fresh daily in our kitchen. Made with the finest ingredients and traditional techniques. 🥐🧡",
      instagramUrl: "https://www.instagram.com/p/example2/",
      likes: 189,
      comments: 8
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      title: "Cozy Interior",
      description: "Our warm and inviting dining space designed for relaxation and great conversations. Perfect ambiance for any occasion. 🏠💫",
      instagramUrl: "https://www.instagram.com/p/example3/",
      likes: 156,
      comments: 15
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      title: "Coffee Beans",
      description: "Premium quality beans roasted to perfection daily. Sourced directly from sustainable farms around the world. 🌍☕",
      instagramUrl: "https://www.instagram.com/p/example4/",
      likes: 298,
      comments: 22
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      title: "Gourmet Burger",
      description: "Our signature burger with fresh local ingredients, artisanal bun, and house-made sauces. A true culinary masterpiece! 🍔🔥",
      instagramUrl: "https://www.instagram.com/p/example5/",
      likes: 342,
      comments: 28
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      title: "Happy Customers",
      description: "Creating memorable dining experiences every day. Nothing makes us happier than seeing our guests enjoy their time here. 😊❤️",
      instagramUrl: "https://www.instagram.com/p/example6/",
      likes: 167,
      comments: 19
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      title: "Elegant Dining",
      description: "Fine dining experience in a sophisticated atmosphere. Perfect for special occasions and romantic evenings. 🍽️✨",
      instagramUrl: "https://www.instagram.com/p/example7/",
      likes: 278,
      comments: 31
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      title: "Weekend Brunch",
      description: "Special weekend brunch menu with artisanal dishes, fresh ingredients, and creative presentations. Join us every weekend! 🥞🍳",
      instagramUrl: "https://www.instagram.com/p/example8/",
      likes: 203,
      comments: 16
    }
  ];

  const itemsPerView = window.innerWidth >= 1024 ? 5 : window.innerWidth >= 768 ? 4 : window.innerWidth >= 640 ? 3 : 2;
  const maxIndex = Math.max(0, instagramPosts.length - itemsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= maxIndex) {
          return 0; // Loop back to start
        }
        return prev + 1;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => {
      if (prev >= maxIndex) return 0; // Loop to start
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => {
      if (prev <= 0) return maxIndex; // Loop to end
      return prev - 1;
    });
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const handlePostClick = (instagramUrl: string) => {
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <div className="mt-6 mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6"
        >
          Instagram
        </motion.h2>

        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Enhanced Navigation Buttons */}
          <motion.button
            onClick={prevSlide}
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 w-12 h-12 rounded-full bg-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:bg-orange-50 border border-gray-100"
          >
            <svg className="w-6 h-6 text-gray-700 hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            onClick={nextSlide}
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 w-12 h-12 rounded-full bg-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:bg-orange-50 border border-gray-100"
          >
            <svg className="w-6 h-6 text-gray-700 hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Carousel Indicators */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'bg-orange-600 w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Perfect Instagram Posts Carousel */}
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="flex gap-3 sm:gap-4 md:gap-5"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: -currentIndex * (100 / itemsPerView + 4) + '%', opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  opacity: { duration: 0.3 }
                }}
              >
                {instagramPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 aspect-square group cursor-pointer"
                    onClick={() => handlePostClick(post.instagramUrl)}
                  >
                    {/* Instagram Post Card */}
                    <motion.div
                      whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white"
                    >
                      {/* Main Image */}
                      <img
                        src={post.src}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Hover Overlay - Always present but invisible */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Content Card on Hover - Fully visible and interactive */}
                      <div className="absolute inset-0 flex flex-col justify-between p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">

                        {/* Click indicator */}
                        <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium">
                          Click to view
                        </div>
                        {/* Instagram Icon Header */}
                        <div className="flex justify-end items-start">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-100 scale-0 transition-transform duration-300">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                            </svg>
                          </div>
                        </div>

                        {/* Title and Description Card - Always visible on hover */}
                        <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/30 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <h4 className="text-white font-bold text-sm sm:text-base mb-2 leading-tight line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-white/90 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-3">
                            {post.description}
                          </p>

                          {/* Engagement Stats */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/30">
                            <span className="text-white/80 text-xs font-medium">❤️ {post.likes} likes</span>
                            <span className="text-white/80 text-xs font-medium">💬 {post.comments} comments</span>
                          </div>

                          {/* Instagram URL indicator */}
                          <div className="mt-2 text-center">
                            <span className="text-white/70 text-xs bg-white/10 px-2 py-1 rounded-full">
                              View on Instagram
                            </span>
                          </div>
                        </div>
                        </div>

                      {/* Elegant border glow */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500" />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
