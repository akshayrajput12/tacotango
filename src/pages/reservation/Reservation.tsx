import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Icon Components
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);



// Custom Dropdown Component
interface CustomDropdownProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-trigger"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className={value ? 'text-selected' : 'text-placeholder'}>
          {value || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="dropdown-menu"
          >
            {options.map((option, index) => (
              <motion.button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`dropdown-option ${value === option ? 'selected' : ''}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(222, 181, 154, 0.1)' }}
              >
                {option}
                {value === option && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="check-icon"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Booking Confirmation Popup Component
interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    date: string;
    time: string;
    guests: string;
  };
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ isOpen, onClose, bookingData }) => {
  if (!isOpen) return null;

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #faf8f5 0%, #f5f2ed 100%)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(139, 115, 85, 0.15), 0 8px 16px rgba(139, 115, 85, 0.08)',
            border: '1px solid rgba(203, 180, 163, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 15, stiffness: 300 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: 'linear-gradient(135deg, #deb59a 0%, #c79a7b 100%)',
              boxShadow: '0 8px 20px rgba(222, 181, 154, 0.3)'
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </motion.div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-center mb-2"
            style={{
              fontFamily: 'Raleway, sans-serif',
              background: 'linear-gradient(135deg, #8b7355 0%, #6b5b47 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Reservation Confirmed!
          </motion.h3>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-6"
            style={{
              fontFamily: 'Lato, sans-serif',
              color: '#6b5b47',
              fontSize: '1rem'
            }}
          >
            Your table has been successfully reserved at Cafex. We look forward to serving you!
          </motion.p>

          {/* Booking Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl p-4 mb-6 space-y-4"
            style={{
              background: 'linear-gradient(135deg, rgba(222, 181, 154, 0.1) 0%, rgba(203, 180, 163, 0.1) 100%)',
              border: '1px solid rgba(203, 180, 163, 0.2)'
            }}
          >
            <div className="flex justify-between items-center">
              <span style={{ color: '#8b7355', fontWeight: '500', fontFamily: 'Lato, sans-serif' }}>Date:</span>
              <span style={{ color: '#4a3728', fontWeight: '600', fontFamily: 'Lato, sans-serif' }}>{formatDisplayDate(bookingData.date)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: '#8b7355', fontWeight: '500', fontFamily: 'Lato, sans-serif' }}>Time:</span>
              <span style={{ color: '#4a3728', fontWeight: '600', fontFamily: 'Lato, sans-serif' }}>{bookingData.time}</span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: '#8b7355', fontWeight: '500', fontFamily: 'Lato, sans-serif' }}>Guests:</span>
              <span style={{ color: '#4a3728', fontWeight: '600', fontFamily: 'Lato, sans-serif' }}>{bookingData.guests}</span>
            </div>
          </motion.div>

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #deb59a 0%, #c79a7b 100%)',
              color: '#4a3728',
              fontFamily: 'Lato, sans-serif',
              boxShadow: '0 4px 12px rgba(222, 181, 154, 0.3)',
              border: 'none'
            }}
          >
            Perfect! Thank You
          </motion.button>

          {/* Close X Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 transition-colors"
            style={{ color: '#8b7355' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ReservationHero = () => (
  <section className="relative mb-12">
    <div
      className="relative h-48 sm:h-56 md:h-64 lg:h-72 rounded-2xl overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.4), rgba(101, 67, 33, 0.5)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4 sm:px-6 md:px-8 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
            style={{ fontFamily: 'Raleway, sans-serif' }}
          >
            Reserve Your Table
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            Book your perfect dining experience at Cafex. Select your preferred date, time, and party size for an unforgettable culinary journey.
          </motion.p>
        </div>
      </div>
    </div>
  </section>
);

export const ReservationPage = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: ''
  });

  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const timeSlots = [
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM',
    '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM',
    '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  const guestOptions = [
    '1 Guest', '2 Guests', '3 Guests', '4 Guests', '5 Guests', '6 Guests'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookTable = async () => {
    if (formData.date && formData.time && formData.guests) {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSubmitting(false);
      setShowBookingConfirmation(true);

      // Reset form after successful booking
      setTimeout(() => {
        setFormData({ date: '', time: '', guests: '' });
      }, 2000);
    } else {
      // Show validation errors with animation
      const emptyFields = document.querySelectorAll('.field-group');
      emptyFields.forEach((field, index) => {
        setTimeout(() => {
          field.classList.add('shake');
          setTimeout(() => field.classList.remove('shake'), 500);
        }, index * 100);
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  const handleDateSelect = (day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day >= today) {
      setFormData(prev => ({ ...prev, date: day.toISOString().split('T')[0] }));
      setCalendarOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Select';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const isSelected = formData.date === dayDate.toISOString().split('T')[0];
      const isPast = dayDate < today;
      const isToday = dayDate.getTime() === today.getTime();

      let dayClasses = 'calendar-day';
      if (isPast) dayClasses += ' disabled';
      if (isSelected) dayClasses += ' selected';
      if (isToday && !isSelected) dayClasses += ' today';

      days.push(
        <button
          key={i}
          onClick={() => handleDateSelect(dayDate)}
          disabled={isPast}
          className={dayClasses}
        >
          {i}
        </button>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="calendar"
      >
        <div className="calendar-header">
          <button
            onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
            className="calendar-nav"
            aria-label="Previous month"
          >
            <ChevronLeftIcon />
          </button>
          <span>{new Date(year, month).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
          <button
            onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
            className="calendar-nav"
            aria-label="Next month"
          >
            <ChevronRightIcon />
          </button>
        </div>
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="calendar-grid">
          {days}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#faf8f5' }}>
      <section className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <ReservationHero />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="reserve-container"
        >
          <h2>Reserve a Table</h2>

          <div className="fields">
            {/* Date Field */}
            <motion.div
              className="field-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="res-date">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Date
              </label>
              <div className="input-wrapper date-wrapper">
                <motion.button
                  id="res-date"
                  onClick={() => setCalendarOpen(!isCalendarOpen)}
                  className="date-input"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={formData.date ? 'text-selected' : 'text-placeholder'}>
                    {formatDate(formData.date)}
                  </span>
                </motion.button>
                <AnimatePresence>
                  {isCalendarOpen && (
                    <motion.div
                      ref={calendarRef}
                      className="calendar-container"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderCalendar()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Time Field */}
            <motion.div
              className="field-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="res-time">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
                Time
              </label>
              <CustomDropdown
                id="res-time"
                value={formData.time}
                onChange={(value) => handleInputChange('time', value)}
                options={timeSlots}
                placeholder="Select Time"
              />
            </motion.div>

            {/* Guests Field */}
            <motion.div
              className="field-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="res-guests">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b7355" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Number of Guests
              </label>
              <CustomDropdown
                id="res-guests"
                value={formData.guests}
                onChange={(value) => handleInputChange('guests', value)}
                options={guestOptions}
                placeholder="Select Guests"
              />
            </motion.div>
          </div>

          <div className="button-container">
            <motion.button
              type="button"
              onClick={handleBookTable}
              whileHover={{ scale: 1.02, backgroundColor: "#cca084" }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className={`book-table-btn ${isSubmitting ? 'submitting' : ''}`}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block mr-2"
                />
              ) : null}
              {isSubmitting ? 'Booking...' : 'Book Table'}
            </motion.button>
          </div>
        </motion.div>

        {/* Booking Confirmation Popup */}
        <BookingConfirmation
          isOpen={showBookingConfirmation}
          onClose={() => setShowBookingConfirmation(false)}
          bookingData={formData}
        />
      </section>

      <style>{`
        /* Base resets & font */
        .reserve-container {
          max-width: 800px;
          margin: 0 auto;
          /* Two-column grid: fields on left, button on right */
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2rem;
          align-items: end; /* align button cell to bottom of left fields */
        }

        /* Title */
        .reserve-container h2 {
          grid-column: 1 / -1;
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
          font-family: 'Raleway', sans-serif;
          color: #1f1f1f;
        }

        /* Form Fields Column */
        .fields {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        /* Wrapper for date input */
        .input-wrapper {
          position: relative;
          width: 100%;
        }

        /* Date input styling */
        .date-input {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border: 2px solid #e3d8cf;
          border-radius: 12px;
          background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
          color: #333;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Lato', sans-serif;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          text-align: left;
        }

        .text-selected {
          color: #333;
        }

        .text-placeholder {
          color: #999;
        }

        .date-input:hover {
          border-color: #d4c4b8;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-1px);
        }

        .date-input:focus {
          outline: none;
          border-color: #cbb4a3;
          box-shadow: 0 0 0 3px rgba(203, 180, 163, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        /* Button Column */
        .button-container {
          /* To push button to bottom of left column fields */
          display: flex;
          align-items: flex-end;
        }

        .book-table-btn {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          color: #1f1f1f;
          background: linear-gradient(135deg, #deb59a 0%, #d4a574 100%);
          border: none;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          font-family: 'Lato', sans-serif;
          box-shadow: 0 4px 12px rgba(222, 181, 154, 0.3);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
        }

        .book-table-btn:hover {
          background: linear-gradient(135deg, #cca084 0%, #b8956b 100%);
          box-shadow: 0 6px 16px rgba(222, 181, 154, 0.4);
          transform: translateY(-1px);
        }

        .book-table-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .book-table-btn.submitting {
          background: linear-gradient(135deg, #a8a8a8 0%, #909090 100%);
        }

        /* Enhanced field styling */
        .field-group {
          position: relative;
        }

        .field-group.shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        /* Label animations */
        .field-group:hover label {
          color: #8b7355;
        }

        /* Focus states */
        .field-group:focus-within label {
          color: #8b7355;
          transform: translateY(-1px);
        }

        /* Custom Dropdown Styles */
        .custom-dropdown {
          position: relative;
          width: 100%;
        }

        .dropdown-trigger {
          width: 100%;
          padding: 0.75rem 1rem;
          padding-right: 2.5rem;
          font-size: 1rem;
          border: 2px solid #e3d8cf;
          border-radius: 12px;
          background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
          color: #333;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Lato', sans-serif;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
        }

        .dropdown-trigger:hover {
          border-color: #d4c4b8;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-1px);
        }

        .dropdown-trigger:focus {
          outline: none;
          border-color: #cbb4a3;
          box-shadow: 0 0 0 3px rgba(203, 180, 163, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%);
          border: 2px solid #e3d8cf;
          border-radius: 12px;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06);
          z-index: 1000;
          max-height: 200px;
          overflow-y: auto;
          backdrop-filter: blur(10px);
        }

        .dropdown-option {
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Lato', sans-serif;
          font-size: 0.95rem;
          color: #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dropdown-option:hover {
          background: rgba(222, 181, 154, 0.1);
          color: #8b7355;
        }

        .dropdown-option.selected {
          background: rgba(222, 181, 154, 0.15);
          color: #8b7355;
          font-weight: 500;
        }

        .dropdown-option:first-child {
          border-radius: 10px 10px 0 0;
        }

        .dropdown-option:last-child {
          border-radius: 0 0 10px 10px;
        }

        .check-icon {
          color: #8b7355;
        }

        /* Enhanced label styling with icons */
        .field-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: #4a5568;
          font-family: 'Lato', sans-serif;
          margin-bottom: 0.5rem;
          transition: all 0.2s ease;
        }

        .field-group label svg {
          flex-shrink: 0;
        }

        /* Responsive tweaks */
        @media (max-width: 600px) {
          .reserve-container {
            grid-template-columns: 1fr;
          }
          .button-container {
            justify-content: flex-start;
            margin-top: 1rem;
          }
        }

        /* Calendar Styles */
        .calendar-container {
          position: absolute;
          top: calc(100% + 12px);
          left: 0;
          z-index: 20;
          width: 320px;
        }

        .calendar {
          background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.08);
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          font-family: 'Raleway', sans-serif;
          font-size: 1.1rem;
        }

        .calendar-nav {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border: 1px solid #e2e8f0;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: #4a5568;
        }

        .calendar-nav:hover {
          background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 0.85rem;
          color: #718096;
          margin-bottom: 1rem;
          font-weight: 500;
          font-family: 'Lato', sans-serif;
        }

        .calendar-weekdays > div {
          padding: 0.5rem 0;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }

        .calendar-day {
          border: none;
          background-color: transparent;
          border-radius: 10px;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          font-weight: 500;
          color: #4a5568;
          position: relative;
        }

        .calendar-day:not(.disabled):not(.empty):hover {
          background: linear-gradient(135deg, #fdf2e9 0%, #fed7aa 100%);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(222, 181, 154, 0.3);
        }

        .calendar-day.selected {
          background: linear-gradient(135deg, #deb59a 0%, #c79a7b 100%);
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(222, 181, 154, 0.4);
          transform: translateY(-1px);
        }

        .calendar-day.disabled {
          color: #cbd5e0;
          cursor: not-allowed;
          opacity: 0.5;
        }

        .calendar-day.empty {
          pointer-events: none;
        }

        /* Today indicator */
        .calendar-day.today:not(.selected) {
          background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
          color: #2d3748;
          font-weight: 600;
        }

        /* Mobile calendar adjustments */
        @media (max-width: 600px) {
          .calendar-container {
            width: 280px;
            left: 50%;
            transform: translateX(-50%);
          }

          .calendar {
            padding: 1rem;
          }

          .calendar-day {
            width: 32px;
            height: 32px;
            font-size: 0.85rem;
          }
        }

        /* Focus visible for accessibility */
        .calendar-day:focus-visible {
          outline: 2px solid #7a5a40;
          outline-offset: 2px;
        }

        .calendar-nav:focus-visible {
          outline: 2px solid #7a5a40;
          outline-offset: 2px;
        }

        /* Enhanced calendar animations */
        .calendar-day {
          position: relative;
          overflow: hidden;
        }

        .calendar-day::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s;
        }

        .calendar-day:hover::before {
          left: 100%;
        }

        /* Floating animation for the form container */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .reserve-container {
          animation: float 6s ease-in-out infinite;
        }

        /* Gradient text for title */
        .reserve-container h2 {
          background: linear-gradient(135deg, #8b7355 0%, #6b5b47 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Enhanced backdrop blur */
        .calendar {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        /* Smooth transitions for all interactive elements */
        * {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        /* Custom scrollbar for select options */
        select {
          scrollbar-width: thin;
          scrollbar-color: #deb59a #f1f1f1;
        }

        select::-webkit-scrollbar {
          width: 8px;
        }

        select::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        select::-webkit-scrollbar-thumb {
          background: #deb59a;
          border-radius: 4px;
        }

        select::-webkit-scrollbar-thumb:hover {
          background: #cca084;
        }
      `}</style>
    </div>
  );
};
