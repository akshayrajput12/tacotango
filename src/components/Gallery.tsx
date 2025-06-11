import { motion } from 'framer-motion';

interface GalleryProps {
  showTitle?: boolean;
  maxImages?: number;
  className?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export const Gallery = ({
  showTitle = true,
  maxImages,
  className = "",
  showViewAll = false,
  onViewAll
}: GalleryProps) => {
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Modern cafe interior with minimalist design"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Warm wooden cafe interior"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Cozy dining area with wooden tables"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Elegant restaurant seating area"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Bright cafe with natural lighting"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1567521464027-f127ff144326?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Rustic cafe interior with warm ambiance"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Modern coffee shop design"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Comfortable seating area"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Stylish restaurant interior"
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Contemporary dining space"
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Intimate dining corner"
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Spacious cafe layout"
    },
    {
      id: 13,
      src: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Elegant restaurant bar area"
    },
    {
      id: 14,
      src: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Cozy corner seating"
    },
    {
      id: 15,
      src: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Modern restaurant interior"
    },
    {
      id: 16,
      src: "https://images.unsplash.com/photo-1481833761820-0509d3217039?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Beautiful dining room"
    },
    {
      id: 17,
      src: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Outdoor terrace dining"
    },
    {
      id: 18,
      src: "https://images.unsplash.com/photo-1586999768151-be3e09217445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      alt: "Luxury restaurant setting"
    }
  ];

  const imagesToShow = maxImages ? galleryImages.slice(0, maxImages) : galleryImages;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className={`relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 ${className}`}>
      <div className="mt-6 mb-8">
        {showTitle && (
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6"
          >
            Gallery
          </motion.h2>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
        >
          {imagesToShow.map((image, index) => (
            <motion.div
              key={image.id}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
              className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <motion.img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Description overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />

              <motion.div
                className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                initial={{ y: 10, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm font-medium leading-tight">{image.alt}</p>
              </motion.div>

              {/* View icon */}
              <motion.div
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {showViewAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center mt-8"
          >
            <motion.button
              onClick={onViewAll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-600 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              View All
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
