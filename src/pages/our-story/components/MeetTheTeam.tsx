import React from 'react';
import { motion } from 'framer-motion';

const MeetTheTeam: React.FC = () => {
  return (
    <section className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Meet the Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-10"
          >
            Meet the Team
          </motion.h2>
          
          {/* Team Members Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {/* Sarah */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -10 }}
              className="text-center"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="relative mb-4"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 mx-auto rounded-full overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                    alt="Maria - Co-founder & Head Chef"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              <motion.h3 
                whileHover={{ color: "#d97706" }}
                className="text-lg sm:text-xl font-semibold text-gray-900 mb-1"
              >
                Maria
              </motion.h3>
              <p className="text-sm sm:text-base text-gray-600">
                Co-founder & Head Chef
              </p>
            </motion.div>

            {/* David */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -10 }}
              className="text-center"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="relative mb-4"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 mx-auto rounded-full overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                    alt="Carlos - Co-founder & Manager"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              <motion.h3 
                whileHover={{ color: "#d97706" }}
                className="text-lg sm:text-xl font-semibold text-gray-900 mb-1"
              >
                Carlos
              </motion.h3>
              <p className="text-sm sm:text-base text-gray-600">
                Co-founder & Manager
              </p>
            </motion.div>

            {/* Emily */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -10 }}
              className="text-center"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="relative mb-4"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 mx-auto rounded-full overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                    alt="Sofia - Kitchen Manager"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              <motion.h3 
                whileHover={{ color: "#d97706" }}
                className="text-lg sm:text-xl font-semibold text-gray-900 mb-1"
              >
                Sofia
              </motion.h3>
              <p className="text-sm sm:text-base text-gray-600">
                Kitchen Manager
              </p>
            </motion.div>

            {/* Mark */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ y: -10 }}
              className="text-center"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="relative mb-4"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 mx-auto rounded-full overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                    alt="Diego - Sous Chef"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              <motion.h3 
                whileHover={{ color: "#d97706" }}
                className="text-lg sm:text-xl font-semibold text-gray-900 mb-1"
              >
                Diego
              </motion.h3>
              <p className="text-sm sm:text-base text-gray-600">
                Sous Chef
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MeetTheTeam;
