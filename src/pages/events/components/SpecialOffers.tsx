import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { goToReservation } from '../../../utils/navigation';

export const SpecialOffers = () => {
  const [expandedOffer, setExpandedOffer] = useState<number | null>(null);
  const offers = [
    {
      id: 1,
      title: 'Happy Hour',
      description: 'Enjoy discounted drinks and appetizers every weekday from 4 PM to 6 PM.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800',
      buttonColor: 'bg-amber-600 hover:bg-amber-700',
      details: {
        timing: 'Monday to Friday, 4:00 PM - 6:00 PM',
        discount: '25% off on all beverages and 20% off on appetizers',
        validUntil: 'Valid until December 31, 2024',
        terms: [
          'Valid only during specified hours',
          'Cannot be combined with other offers',
          'Dine-in only',
          'Subject to availability'
        ],
        popularItems: ['Craft Beer', 'Wine Selection', 'Nachos', 'Wings', 'Bruschetta']
      }
    },
    {
      id: 2,
      title: 'Student Discount',
      description: 'Students get 10% off their entire order with a valid student ID.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-800',
      buttonColor: 'bg-orange-600 hover:bg-orange-700',
      details: {
        timing: 'Available all day, every day',
        discount: '10% off on entire bill',
        validUntil: 'Valid throughout the academic year',
        terms: [
          'Valid student ID required',
          'One discount per student per visit',
          'Cannot be combined with other offers',
          'Valid for undergraduate and graduate students'
        ],
        popularItems: ['Coffee & Pastries', 'Study Combo Meals', 'Group Study Packages', 'Late Night Snacks']
      }
    },
    {
      id: 3,
      title: 'Loyalty Program',
      description: 'Join our loyalty program and earn points for every purchase. Redeem points for discounts and free items.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      textColor: 'text-rose-800',
      buttonColor: 'bg-rose-600 hover:bg-rose-700',
      details: {
        timing: 'Earn points with every purchase',
        discount: 'Earn 1 point per ₹10 spent',
        validUntil: 'Points never expire',
        terms: [
          '100 points = ₹50 discount',
          'Birthday bonus: 2x points',
          'Referral bonus: 50 points',
          'VIP status at 1000 points'
        ],
        popularItems: ['Free Coffee (200 pts)', 'Free Dessert (300 pts)', 'Free Meal (500 pts)', 'VIP Experience (1000 pts)']
      }
    }
  ];

  const toggleExpanded = (offerId: number) => {
    setExpandedOffer(expandedOffer === offerId ? null : offerId);
  };

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

        <div className="space-y-8">
          {offers.map((offer, index) => (
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
