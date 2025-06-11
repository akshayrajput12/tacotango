import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <div className="mt-6 mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Menu
        </motion.h1>
      </div>
    </section>
  );
};
