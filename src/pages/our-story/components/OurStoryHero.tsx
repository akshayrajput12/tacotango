import { motion } from 'framer-motion';

export const OurStoryHero = () => {
  return (
    <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <div className="mt-1 sm:mt-2 md:mt-2 mb-6 sm:mb-8">
        <div 
          className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] rounded-2xl overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.3), rgba(101, 67, 33, 0.4)), url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2047&q=80')`
          }}
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
                Our Story
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-white/90 max-w-2xl mx-auto"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Discover the journey that started with a simple dream and grew into a beloved community gathering place.
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* The Beginning Section - Merged into Hero */}
      <div className="mt-4 sm:mt-6 mb-6 sm:mb-8">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6"
            style={{ fontFamily: 'Raleway, sans-serif' }}
          >
            The Beginning
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            The Daily Grind was founded in 2010 by Sarah and David, two passionate coffee enthusiasts with a dream of creating a 
            community hub centered around exceptional coffee and delicious food. Their journey began with a small, cozy space in the 
            heart of the city, where they meticulously crafted each cup and dish with love and care.
          </motion.p>
        </div>
      </div>
    </section>
  );
};
