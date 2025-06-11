import { motion } from 'framer-motion';
import { FAQHero, FAQSection } from './components';

export const FAQPage = () => {
  const faqData = {
    'Reservations': [
      {
        question: 'How can I make a reservation?',
        answer: 'You can make a reservation through our website or by calling us directly. We recommend booking in advance, especially for weekends and special events.'
      },
      {
        question: 'Is there a cancellation policy?',
        answer: 'Yes, we have a 24-hour cancellation policy. Please cancel your reservation at least 24 hours in advance to avoid any charges. For large groups (8+ people), we require 48 hours notice.'
      },
      {
        question: 'Can I request a specific table?',
        answer: 'While we cannot guarantee specific tables, we will do our best to accommodate your preferences. Please mention any special requests when making your reservation, such as window seating or accessibility needs.'
      }
    ],
    'Services': [
      {
        question: 'Do you offer catering services?',
        answer: 'Yes, we provide catering for events of all sizes. Please contact us for a custom quote and menu options.'
      },
      {
        question: 'Is there parking available?',
        answer: 'Yes, we have a dedicated parking lot with complimentary parking for our guests. Valet parking is also available during peak hours and special events.'
      },
      {
        question: 'Do you have Wi-Fi?',
        answer: 'Yes, we provide complimentary Wi-Fi for all our guests. The network name and password are available from your server or at the host station.'
      }
    ],
    'Location': [
      {
        question: 'Where are you located?',
        answer: 'We are located at 123 Main Street, Anytown, USA. You can find a map and directions on our website.'
      },
      {
        question: 'What are your opening hours?',
        answer: 'We are open Monday through Sunday from 7:00 AM to 10:00 PM. Kitchen hours may vary, with last orders typically taken 30 minutes before closing.'
      }
    ],
    'Other': [
      {
        question: 'Do you have a loyalty program?',
        answer: 'Yes, we offer a loyalty program with exclusive benefits. Sign up on our website or in-store to start earning rewards.'
      },
      {
        question: 'How can I contact you?',
        answer: 'You can contact us by phone at (555) 123-4567, email us at info@cafex.com, or visit us in person. We are also active on social media for quick questions and updates.'
      }
    ]
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCFAF7' }}>
      <FAQHero />

      <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <div className="mt-6 mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid gap-8 lg:gap-12"
          >
            {Object.entries(faqData).map(([sectionTitle, faqs], sectionIndex) => (
              <FAQSection
                key={sectionTitle}
                title={sectionTitle}
                faqs={faqs}
                sectionIndex={sectionIndex}
              />
            ))}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-16 p-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100"
          >
            <div className="text-center">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                Still Have Questions?
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg mb-6"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Can't find what you're looking for? Our friendly team is here to help you with any questions or special requests.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.a
                  href="tel:+15551234567"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-full transition-colors duration-200"
                >
                  Call Us: (555) 123-4567
                </motion.a>
                <motion.a
                  href="mailto:info@cafex.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-full border border-gray-200 transition-colors duration-200"
                >
                  Email Us
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
