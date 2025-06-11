import { motion } from 'framer-motion';

interface AboutUsProps {
  onLearnMore?: () => void;
}

export const AboutUs = ({ onLearnMore }: AboutUsProps) => {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40" style={{ backgroundColor: '#F5F1EC' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl"
      >
        {/* About Us Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          About Us
        </motion.h2>

        {/* Description Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-4xl"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          Cafex is more than just a cafe; it's a community hub where coffee lovers and food enthusiasts come together. Our journey began with a simple idea: to create a space where quality coffee meets a warm, inviting atmosphere. Learn more about our mission, values, and the team behind your favorite brews.
        </motion.p>

        {/* Learn More About Us Button */}
        <motion.button
          onClick={onLearnMore}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{
            scale: 1.02,
            backgroundColor: "#ede4df"
          }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base text-gray-800"
          style={{ backgroundColor: '#F2EBE8' }}
        >
          Learn More About Us
        </motion.button>
      </motion.div>
    </section>
  );
};
