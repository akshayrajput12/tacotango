import { motion } from 'framer-motion';
import { usePublicGallery } from '../hooks/useGallery';
import type { GalleryImage as DatabaseGalleryImage } from '../services/galleryService';

interface GalleryProps {
  showTitle?: boolean;
  maxImages?: number;
  className?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

// Transform database image to match component's expected format
const transformToLegacyFormat = (image: DatabaseGalleryImage) => ({
  id: parseInt(image.id.slice(-8), 16), // Convert UUID to number for legacy compatibility
  src: image.url,
  alt: image.alt
});

export const Gallery = ({
  showTitle = true,
  maxImages,
  className = "",
  showViewAll = false,
  onViewAll
}: GalleryProps) => {
  // Use the database hook
  const { images, loading } = usePublicGallery();

  // Use database images only
  const galleryImages = images.map(transformToLegacyFormat);


  const imagesToShow = maxImages ? galleryImages.slice(0, maxImages) : galleryImages;

  // Show loading state
  if (loading) {
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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no images
  if (!loading && galleryImages.length === 0) {
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
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Gallery Images</h3>
              <p className="text-gray-600 mb-4">There are currently no images to display.</p>
              <p className="text-sm text-gray-500">Add images through the admin panel to see them here.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
          {imagesToShow.map((image) => (
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
