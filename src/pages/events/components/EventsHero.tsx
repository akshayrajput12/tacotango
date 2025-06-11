import { motion } from 'framer-motion';

export const EventsHero = () => {
  return (
    <motion.section
      className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="mt-6 mb-8">
        <motion.div
          className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] rounded-2xl overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.3), rgba(101, 67, 33, 0.4)), url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 sm:px-6 md:px-8 max-w-4xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                Upcoming Events
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-white/90 max-w-2xl mx-auto"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Explore our calendar of events, special offers, and themed nights. Join us for unique experiences and delicious treats.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full transition-all duration-200 shadow-lg text-sm sm:text-base"
              >
                View Calendar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
