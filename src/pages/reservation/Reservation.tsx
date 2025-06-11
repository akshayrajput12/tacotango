import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ReservationHero = () => (
  <div className="text-center mb-12">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
      style={{ fontFamily: 'Raleway, sans-serif' }}
    >
      Reserve Your Table
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-lg text-gray-600 max-w-2xl mx-auto"
      style={{ fontFamily: 'Lato, sans-serif' }}
    >
      Select your preferred date, time, and number of guests to find a table. We look forward to hosting you at Cafex.
    </motion.p>
  </div>
);

export const ReservationPage = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: ''
  });

  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
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

  const handleFindTable = () => {
    if (formData.date && formData.time && formData.guests) {
      alert(`Table reservation request:\nDate: ${new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\nTime: ${formData.time}\nGuests: ${formData.guests}`);
    } else {
      alert('Please fill in all fields');
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
    if (!dateString) return 'Select Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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
      
      days.push(
        <button
          key={i}
          onClick={() => handleDateSelect(dayDate)}
          disabled={isPast}
          className={`calendar-day ${isPast ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
        >
          {i}
        </button>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="calendar"
      >
        <div className="calendar-header">
          <button onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className="calendar-nav"><ChevronLeftIcon /></button>
          <span>{new Date(year, month).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className="calendar-nav"><ChevronRightIcon /></button>
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
    <div className="min-h-screen pt-20 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40" style={{ backgroundColor: '#faf8f5' }}>
      <ReservationHero />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="reserve-container"
      >
        <div className="form-fields">
          {/* Date Field */}
          <div className="field-group">
            <label htmlFor="res-date">Date</label>
            <div className="relative">
              <button
                id="res-date"
                onClick={() => setCalendarOpen(!isCalendarOpen)}
                className="date-picker-button"
              >
                <span>{formatDate(formData.date)}</span>
                <CalendarIcon />
              </button>
              {isCalendarOpen && (
                <div ref={calendarRef} className="calendar-container">
                  {renderCalendar()}
                </div>
              )}
            </div>
          </div>

          {/* Time Field */}
          <div className="field-group">
            <label htmlFor="res-time">Time</label>
            <div className="select-wrapper">
              <select
                id="res-time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
              >
                <option value="" disabled>Select Time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Guests Field */}
          <div className="field-group">
            <label htmlFor="res-guests">Number of Guests</label>
            <div className="select-wrapper">
              <select
                id="res-guests"
                value={formData.guests}
                onChange={(e) => handleInputChange('guests', e.target.value)}
              >
                <option value="" disabled>Select Guests</option>
                {guestOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="button-container">
          <motion.button
            type="button"
            onClick={handleFindTable}
            whileHover={{ scale: 1.03, backgroundColor: "#c79a7b" }}
            whileTap={{ scale: 0.97 }}
            className="find-table-btn"
          >
            Find a Table
          </motion.button>
        </div>
      </motion.div>

      <style>{`
        .reserve-container {
          max-width: 1000px;
          margin: 2rem auto;
          padding: 2.5rem;
          background-color: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .reserve-container {
            grid-template-columns: 3fr 1fr;
            align-items: end;
          }
        }

        .form-fields {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .form-fields {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (max-width: 767px) {
          .field-group {
            width: 100%;
          }
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .field-group label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #555;
          font-family: 'Lato', sans-serif;
        }

        .select-wrapper {
          position: relative;
        }
        
        .select-wrapper::after {
          content: '▼';
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.8rem;
          color: #888;
          pointer-events: none;
        }

        .select-wrapper select, .date-picker-button {
          width: 100%;
          padding: 0.85rem 1rem;
          font-size: 1rem;
          border: 1px solid #e0d7cf;
          border-radius: 8px;
          background-color: #fdfcfb;
          color: #333;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Lato', sans-serif;
        }
        
        .date-picker-button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
        }

        .select-wrapper select:focus, .date-picker-button:focus {
          outline: none;
          border-color: #cbb4a3;
          box-shadow: 0 0 0 3px rgba(203, 180, 163, 0.2);
        }

        .button-container {
          display: flex;
        }
        
        @media (min-width: 1024px) {
          .button-container {
            align-items: flex-end;
          }
        }

        .find-table-btn {
          width: 100%;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          background-color: #deb59a;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease;
          font-family: 'Raleway', sans-serif;
        }

        .calendar-container {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          z-index: 10;
          width: 300px;
        }

        .calendar {
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          padding: 1rem;
          border: 1px solid #eee;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-weight: 600;
          color: #333;
        }
        
        .calendar-nav {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }
        
        .calendar-nav:hover {
          background-color: #f0f0f0;
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 0.8rem;
          color: #888;
          margin-bottom: 0.5rem;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .calendar-day {
          border: none;
          background-color: transparent;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s, color 0.2s;
          font-size: 0.9rem;
        }
        
        .calendar-day:not(.disabled):hover {
          background-color: #fdf2e9;
        }
        
        .calendar-day.selected {
          background-color: #deb59a;
          color: white;
          font-weight: bold;
        }
        
        .calendar-day.disabled {
          color: #ccc;
          cursor: not-allowed;
        }
        
        .calendar-day.empty {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};
