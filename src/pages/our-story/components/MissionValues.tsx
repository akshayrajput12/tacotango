import React from 'react';
import { motion } from 'framer-motion';

const MissionValues: React.FC = () => {
  return (
    <section className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16 md:mb-20"
        >
          <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] xl:h-[32rem] overflow-hidden rounded-2xl shadow-lg">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Coffee shop interior with warm lighting and cozy atmosphere"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Our Mission Section */}
        <div className="mt-6 mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6"
              style={{ fontFamily: 'Raleway, sans-serif' }}
            >
              Our Mission
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              At TacoTango, our mission is to create an extraordinary Mexican dining experience that brings people together. We are dedicated to
              serving authentic, fresh Mexican cuisine in a vibrant, welcoming environment where every guest feels at home. We believe
              in building meaningful connections within our community while supporting sustainable practices and local partnerships
              that make a positive impact.
            </motion.p>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mt-6 mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6"
              style={{ fontFamily: 'Raleway, sans-serif' }}
            >
              Our Values
            </motion.h2>

          {/* Values Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9fafb"
              }}
              className="bg-gray-50 p-6 sm:p-8 rounded-lg cursor-pointer transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Quality</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                We source the finest ingredients and spices, ensuring every taco meets our exceptional standards.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9fafb"
              }}
              className="bg-gray-50 p-6 sm:p-8 rounded-lg cursor-pointer transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Community</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                We foster connections and create a welcoming space where neighbors become friends over great coffee.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9fafb"
              }}
              className="bg-gray-50 p-6 sm:p-8 rounded-lg cursor-pointer transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Sustainability</h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                We're committed to environmental responsibility through ethical sourcing and eco-friendly practices.
              </p>
            </motion.div>
          </div>

            {/* Values Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              These values guide everything we do at TacoTango. From carefully selecting our fresh ingredients to creating meaningful
              connections with our guests, we're committed to excellence in every aspect of our business. Together, these principles
              help us build not just a restaurant, but a true community hub where quality, connection, and care come together.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionValues;
