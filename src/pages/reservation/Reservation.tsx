import { motion } from 'framer-motion';
import { useState } from 'react';

export const ReservationPage = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: ''
  });

  const [errors, setErrors] = useState({
    date: '',
    time: '',
    guests: ''
  });

  const timeSlots = [
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', 
    '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  const guestOptions = [
    '1 Guest', '2 Guests', '3 Guests', '4 Guests', '5 Guests', 
    '6 Guests', '7 Guests', '8 Guests', '9 Guests', '10+ Guests'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      date: '',
      time: '',
      guests: ''
    };

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }
    if (!formData.guests) {
      newErrors.guests = 'Please select number of guests';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleFindTable = () => {
    if (validateForm()) {
      // Handle successful form submission
      alert(`Table reservation request:\nDate: ${formData.date}\nTime: ${formData.time}\nGuests: ${formData.guests}`);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#FCFAF7' }}>
      <div className="max-w-2xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 sm:p-12"
        >
          {/* Header */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8"
          >
            Reserve a Table
          </motion.h1>

          {/* Date Field */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <label className="block text-gray-700 font-medium mb-3">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.date}
                min={today}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Select Date"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </motion.div>

          {/* Time Field */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6"
          >
            <label className="block text-gray-700 font-medium mb-3">
              Time
            </label>
            <div className="relative">
              <select
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time}</p>
            )}
          </motion.div>

          {/* Number of Guests Field */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <label className="block text-gray-700 font-medium mb-3">
              Number of Guests
            </label>
            <div className="relative">
              <select
                value={formData.guests}
                onChange={(e) => handleInputChange('guests', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white ${
                  errors.guests ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select</option>
                {guestOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.guests && (
              <p className="text-red-500 text-sm mt-1">{errors.guests}</p>
            )}
          </motion.div>

          {/* Find a Table Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-end"
          >
            <motion.button
              onClick={handleFindTable}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 8px 25px rgba(234, 88, 12, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-orange-600 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-700 transition-all duration-300 shadow-lg"
            >
              Find a Table
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
