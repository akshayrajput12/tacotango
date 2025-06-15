import React from 'react';
import { motion } from 'framer-motion';

const WhatMakesUsUnique: React.FC = () => {
  return (
    <section className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto">
        {/* What Makes Us Unique Section */}
        <div className="mt-6 mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6"
              style={{ fontFamily: 'Raleway, sans-serif' }}
            >
              What Makes Us Unique
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              At TacoTango, we go beyond just serving tacos and Mexican food. We offer a curated experience that combines exceptional
              quality, a vibrant atmosphere, and a commitment to sustainability. Our unique selling points include our authentic Mexican
              recipes, locally sourced ingredients, community events, and personalized service.
            </motion.p>
          </div>
        </div>

        {/* Unique Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-6 sm:mb-8 md:mb-10"
        >
          <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] xl:h-[32rem] overflow-hidden rounded-2xl shadow-lg">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Coffee shop interior with customers enjoying the warm atmosphere"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>


    </section>
  );
};

export default WhatMakesUsUnique;
