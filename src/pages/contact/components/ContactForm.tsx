import { motion } from 'framer-motion';
import { useState } from 'react';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-gray-900 mb-2"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                style={{ 
                  backgroundColor: '#F5F0ED',
                  fontFamily: 'Lato, sans-serif'
                }}
              />
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-900 mb-2"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                style={{ 
                  backgroundColor: '#F5F0ED',
                  fontFamily: 'Lato, sans-serif'
                }}
              />
            </motion.div>

            {/* Subject Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label 
                htmlFor="subject" 
                className="block text-sm font-medium text-gray-900 mb-2"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Enter the subject"
                required
                className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                style={{ 
                  backgroundColor: '#F5F0ED',
                  fontFamily: 'Lato, sans-serif'
                }}
              />
            </motion.div>

            {/* Message Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label 
                htmlFor="message" 
                className="block text-sm font-medium text-gray-900 mb-2"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter your message"
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 resize-none"
                style={{ 
                  backgroundColor: '#F5F0ED',
                  fontFamily: 'Lato, sans-serif'
                }}
              />
              </motion.div>
            </div>

            {/* Right Column - Submit Button */}
            <div className="lg:col-span-1 flex flex-col justify-end">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex justify-center lg:justify-end"
              >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                className="px-8 py-3 rounded-full font-semibold text-white transition-all duration-200 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-xl"
                style={{
                  backgroundColor: '#C4A484',
                  fontFamily: 'Lato, sans-serif'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = '#B8956F';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = '#C4A484';
                  }
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
              </motion.div>
            </div>
          </form>

          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 p-4 rounded-lg text-center"
              style={{ backgroundColor: '#D4F4DD' }}
            >
              <p className="text-green-800 font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>
                Thank you for your message! We'll get back to you soon.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
