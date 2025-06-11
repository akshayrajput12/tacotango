import { motion } from 'framer-motion';

export const UpcomingEvents = () => {
  return (
    <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <div className="mt-6 mb-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6"
        >
          Upcoming Events
        </motion.h2>
        
        <div className="space-y-8">
          {/* First Event */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col lg:flex-row bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Event Image */}
            <div className="lg:w-1/2">
              <div className="relative h-64 sm:h-80 lg:h-72 xl:h-80">
                <img
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Live Music Night"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Dec 15
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p className="text-orange-600 text-sm sm:text-base font-medium mb-2">
                  Special Event
                </p>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  Live Music Night
                </h3>

                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-4">
                  Join us for an evening of soulful tunes and great vibes. Featuring local artists and a special menu.
                </p>

                <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    🕒 7:00 PM - 10:00 PM
                  </span>
                  <span className="flex items-center gap-1">
                    🎫 ₹500 per person
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full transition-all duration-200 shadow-lg text-sm sm:text-base"
                >
                  Learn More
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Second Event */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col lg:flex-row-reverse bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Event Image */}
            <div className="lg:w-1/2">
              <div className="relative h-64 sm:h-80 lg:h-72 xl:h-80">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Coffee Tasting Workshop"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Dec 22
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <p className="text-orange-600 text-sm sm:text-base font-medium mb-2">
                  Workshop
                </p>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  Coffee Tasting Workshop
                </h3>

                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-4">
                  Discover the art of coffee tasting with our expert baristas. Learn about different brewing methods and flavor profiles.
                </p>

                <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    🕒 2:00 PM - 4:00 PM
                  </span>
                  <span className="flex items-center gap-1">
                    🎫 ₹750 per person
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full transition-all duration-200 shadow-lg text-sm sm:text-base"
                >
                  Book Now
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* View All Events Button */}
        <div className="flex justify-center mt-8">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 sm:py-4 sm:px-10 rounded-full transition-all duration-200 shadow-lg text-sm sm:text-base border-2 border-orange-600 hover:border-orange-700"
          >
            View All Events
          </motion.button>
        </div>
      </div>
    </section>
  );
};
