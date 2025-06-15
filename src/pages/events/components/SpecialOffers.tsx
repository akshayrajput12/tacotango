import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { goToReservation } from '../../../utils/navigation';
import { useFeaturedSpecialOffers } from '../../../hooks/useSpecialOffers';

export const SpecialOffers = () => {
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);

  // Use the database hook for featured offers
  const { offers: databaseOffers, loading, error } = useFeaturedSpecialOffers();

  // Transform database offers to match the expected format
  const offers = databaseOffers.map(offer => ({
    id: offer.id,
    title: offer.title,
    description: offer.description,
    image: offer.image,
    bgColor: offer.bgColor,
    borderColor: offer.borderColor,
    textColor: offer.textColor,
    buttonColor: offer.buttonColor,
    details: {
      timing: offer.timing,
      discount: offer.discount,
      validUntil: `Valid until ${new Date(offer.validUntil).toLocaleDateString()}`,
      terms: offer.terms,
      popularItems: offer.popularItems
    }
  }));

  // Use database offers or show empty state
  const displayOffers = offers.length > 0 ? offers : [];

  const toggleExpanded = (offerId: string) => {
    setExpandedOffer(expandedOffer === offerId ? null : offerId);
  };

  // Show loading state
  if (loading) {
    return (
      <motion.section
        className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mt-12 mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: '#2c1810'
            }}
          >
            Special Offers
          </motion.h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </motion.section>
    );
  }

  // Show empty state if no offers
  if (!loading && displayOffers.length === 0) {
    return (
      <motion.section
        className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mt-12 mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: '#2c1810'
            }}
          >
            Special Offers
          </motion.h2>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Special Offers Available</h3>
              <p className="text-gray-600 mb-4">Check back soon for exciting deals and promotions!</p>
              <p className="text-sm text-gray-500">New offers are added through the admin panel.</p>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mt-12 mb-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">Error loading offers: {error}</p>
          </div>
        )}

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8"
          style={{
            fontFamily: 'Playfair Display, serif',
            color: '#2c1810'
          }}
        >
          Special Offers
        </motion.h2>

        <div className="space-y-8">
          {displayOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 + 0.4 }}
              whileHover={{
                y: -5,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                transition: { duration: 0.3 }
              }}
              className={`flex flex-col lg:flex-row ${offer.bgColor} ${offer.borderColor} border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {/* Offer Content */}
              <div className="lg:w-2/3 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.6 }}
                >
                  <h3 
                    className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-4 ${offer.textColor}`}
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {offer.title}
                  </h3>

                  <p 
                    className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-6"
                    style={{ fontFamily: 'Raleway, sans-serif' }}
                  >
                    {offer.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      onClick={goToReservation}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.8 }}
                      className={`${offer.buttonColor} text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-lg text-sm sm:text-base`}
                    >
                      Book Table
                    </motion.button>

                    <motion.button
                      onClick={() => toggleExpanded(offer.id)}
                      whileHover={{
                        scale: 1.05,
                        borderColor: "#6b7280",
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.9 }}
                      className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800 font-semibold py-3 px-6 rounded-full transition-all duration-200 text-sm sm:text-base"
                    >
                      {expandedOffer === offer.id ? 'Show Less' : 'Learn More'}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedOffer === offer.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-gray-200"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Offer Details */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Offer Details</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p><span className="font-medium">Timing:</span> {offer.details.timing}</p>
                            <p><span className="font-medium">Discount:</span> {offer.details.discount}</p>
                            <p><span className="font-medium">Valid Until:</span> {offer.details.validUntil}</p>
                          </div>
                        </div>

                        {/* Popular Items */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Popular Items</h4>
                          <div className="flex flex-wrap gap-2">
                            {offer.details.popularItems.map((item, itemIndex) => (
                              <span
                                key={itemIndex}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${offer.bgColor} ${offer.textColor}`}
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Terms and Conditions */}
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-800 mb-3">Terms & Conditions</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {offer.details.terms.map((term, termIndex) => (
                            <li key={termIndex} className="flex items-start">
                              <span className="text-gray-400 mr-2">•</span>
                              {term}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Offer Image */}
              <div className="lg:w-1/3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.7 }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                  className="relative h-64 sm:h-80 lg:h-full min-h-[300px] overflow-hidden"
                >
                  <motion.img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.9 }}
                  ></motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p 
            className="text-gray-600 text-lg mb-6"
            style={{ fontFamily: 'Raleway, sans-serif' }}
          >
            Don't miss out on these amazing offers! Terms and conditions apply.
          </p>
          
          <motion.button
            onClick={goToReservation}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-200 shadow-lg text-lg"
          >
            Reserve Your Table Now
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};
