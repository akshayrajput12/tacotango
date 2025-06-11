import { motion } from 'framer-motion';

export const OurLocation = () => {
  return (
    <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'Raleway, sans-serif' }}
          >
            Our Location
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-700 text-sm sm:text-base md:text-lg mb-8 max-w-3xl"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            Visit us at our cozy spot in the heart of the city. We're open daily from 7 AM to 10 PM, serving up your favorite brews and bites.
          </motion.p>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Address */}
              <div>
                <h3 
                  className="text-lg font-semibold text-gray-900 mb-2"
                  style={{ fontFamily: 'Raleway, sans-serif' }}
                >
                  Address
                </h3>
                <p
                  className="text-gray-700 text-sm sm:text-base"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  123 Main Street, Dehradun,<br />
                  Uttarakhand, India
                </p>
              </div>

              {/* Phone */}
              <div>
                <h3 
                  className="text-lg font-semibold text-gray-900 mb-2"
                  style={{ fontFamily: 'Raleway, sans-serif' }}
                >
                  Phone
                </h3>
                <p
                  className="text-gray-700 text-sm sm:text-base"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  +91 135-123-4567
                </p>
              </div>

              {/* Email */}
              <div>
                <h3 
                  className="text-lg font-semibold text-gray-900 mb-2"
                  style={{ fontFamily: 'Raleway, sans-serif' }}
                >
                  Email
                </h3>
                <p
                  className="text-gray-700 text-sm sm:text-base"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  info@cafex.com
                </p>
              </div>

              {/* Hours */}
              <div>
                <h3 
                  className="text-lg font-semibold text-gray-900 mb-2"
                  style={{ fontFamily: 'Raleway, sans-serif' }}
                >
                  Hours
                </h3>
                <div 
                  className="text-gray-700 text-sm sm:text-base space-y-1"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  <p>Monday - Friday: 7:00 AM - 10:00 PM</p>
                  <p>Saturday - Sunday: 8:00 AM - 11:00 PM</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg">
                {/* Map Placeholder - You can replace this with an actual map component */}
                <div 
                  className="w-full h-full bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`
                  }}
                >
                  {/* Map overlay with grid pattern to simulate map */}
                  <div className="absolute inset-0 bg-white/20">
                    <div className="w-full h-full" style={{
                      backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }}>
                      {/* Location marker */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Action Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg shadow-lg font-medium text-sm transition-all duration-200 hover:bg-white"
                style={{ fontFamily: 'Lato, sans-serif' }}
                onClick={() => {
                  // Open in Google Maps
                  window.open('https://maps.google.com/?q=123+Main+Street+Dehradun+Uttarakhand+India', '_blank');
                }}
              >
                View in Maps
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
