import { motion } from 'framer-motion';

interface AboutUsProps {
  onLearnMore?: () => void;
}

export const AboutUs = ({ onLearnMore }: AboutUsProps) => {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 about-us-section" style={{ backgroundColor: '#F5F1EC' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        {/* About Us Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          About Us
        </motion.h2>

        {/* Description Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl mb-8"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          The Daily Grind is more than just a cafe; it's a community hub where coffee lovers and food enthusiasts come together. Our journey began with a simple idea: to create a space where quality coffee meets a warm, inviting atmosphere. Learn more about our mission, values, and the team behind your favorite brews.
        </motion.p>

        {/* Learn More About Us Button */}
        <motion.button
          onClick={onLearnMore}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{
            scale: 1.02,
            backgroundColor: "#e8ddd6"
          }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-base text-gray-800 border border-gray-300 hover:border-gray-400"
          style={{ backgroundColor: '#F2EBE8' }}
        >
          Learn More About Us
        </motion.button>
      </motion.div>

      {/* Custom CSS for consistent 1024px-1144px sizing */}
      <style>{`
        .about-us-section {
          padding-left: 2rem;
          padding-right: 2rem;
        }

        @media (min-width: 640px) {
          .about-us-section {
            padding-left: 3rem;
            padding-right: 3rem;
          }
        }

        @media (min-width: 768px) {
          .about-us-section {
            padding-left: 4rem;
            padding-right: 4rem;
          }
        }

        @media (min-width: 1024px) and (max-width: 1144px) {
          .about-us-section {
            padding-left: 6rem;
            padding-right: 6rem;
          }
        }

        @media (min-width: 1145px) and (max-width: 1279px) {
          .about-us-section {
            padding-left: 6rem;
            padding-right: 6rem;
          }
        }

        @media (min-width: 1280px) {
          .about-us-section {
            padding-left: 8rem;
            padding-right: 8rem;
          }
        }

        @media (min-width: 1536px) {
          .about-us-section {
            padding-left: 10rem;
            padding-right: 10rem;
          }
        }
      `}</style>
    </section>
  );
};
