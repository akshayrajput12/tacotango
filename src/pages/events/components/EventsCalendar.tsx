import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { goToReservation } from '../../../utils/navigation';
import { usePublicEvents } from '../../../hooks/useEvents';
import type { Event as DatabaseEvent } from '../../../services/eventsService';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  description: string;
  image: string;
  price: string;
  category: string;
}

interface CalendarDay {
  date: number;
  hasEvent: boolean;
  events?: Event[];
  isToday?: boolean;
  isPastDate?: boolean;
}



export const EventsCalendarAndFeatured = () => {
  const [currentDisplayMonth, setCurrentDisplayMonth] = useState(0); // Index for which month to display (0-5)
  const [startDate, setStartDate] = useState<{date: number, month: number} | null>(null);
  const [endDate, setEndDate] = useState<{date: number, month: number} | null>(null);
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);

  // Use the database hook
  const { events: databaseEvents, loading, error } = usePublicEvents();

  // Get current date for dynamic calendar
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed (June = 5)

  // Transform database events to match the component's expected format
  const transformDatabaseEvent = (dbEvent: DatabaseEvent): Event => ({
    id: parseInt(dbEvent.id),
    title: dbEvent.title,
    date: dbEvent.date,
    time: dbEvent.time,
    type: dbEvent.type,
    description: dbEvent.description,
    image: dbEvent.image,
    price: dbEvent.price,
    category: dbEvent.category
  });

  // Use database events only
  const events: Event[] = databaseEvents.map(transformDatabaseEvent);


  // Generate dynamic months starting from current month
  const generateMonths = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const months = [];

    for (let i = 0; i < 6; i++) { // Show 6 months starting from current
      const monthIndex = (currentMonth + i) % 12;
      const year = currentYear + Math.floor((currentMonth + i) / 12);
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();

      // Create empty days for proper calendar alignment
      const emptyDays = Array.from({ length: firstDayOfWeek }, () => null);

      const monthDays = Array.from({ length: daysInMonth }, (_, dayIndex) => {
        const date = dayIndex + 1;
        const dateString = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        const dayEvents = events.filter(event => event.date === dateString);
        const dateObj = new Date(year, monthIndex, date);
        const isToday = dateObj.toDateString() === today.toDateString();
        const isPastDate = dateObj < today && !isToday;

        return {
          date,
          hasEvent: dayEvents.length > 0,
          events: dayEvents,
          isToday,
          isPastDate
        };
      });

      months.push({
        name: `${monthNames[monthIndex]} ${year}`,
        monthIndex,
        year,
        days: [...emptyDays, ...monthDays]
      });
    }

    return months;
  };

  const months = generateMonths();

  // Update filter applied state when dates change
  useEffect(() => {
    if (startDate && endDate) {
      setFilterApplied(true);
    }
  }, [startDate, endDate]);

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const nextMonth = () => {
    setCurrentDisplayMonth((prev) => Math.min(prev + 1, months.length - 2));
    clearSelection();
  };

  const prevMonth = () => {
    setCurrentDisplayMonth((prev) => Math.max(prev - 1, 0));
    clearSelection();
  };

  const clearSelection = () => {
    setStartDate(null);
    setEndDate(null);
    setIsSelectingRange(false);
    setFilterApplied(false);
  };

  const handleDateClick = (day: CalendarDay | null, monthIndex: number) => {
    if (!day || day.isPastDate) return; // Don't allow selection of past dates or empty days

    if (!startDate) {
      // First click - set start date
      setStartDate({ date: day.date, month: monthIndex });
      setIsSelectingRange(true);
      setFilterApplied(false);
    } else if (!endDate && isSelectingRange) {
      // Second click - set end date
      const clickedDate = { date: day.date, month: monthIndex };

      // Ensure end date is after start date
      if (isDateAfter(clickedDate, startDate)) {
        setEndDate(clickedDate);
      } else {
        setEndDate(startDate);
        setStartDate(clickedDate);
      }
      setIsSelectingRange(false);
      setFilterApplied(true);
    } else {
      // Third click - reset and start new selection
      clearSelection();
      setStartDate({ date: day.date, month: monthIndex });
      setIsSelectingRange(true);
    }
  };

  const isDateAfter = (date1: {date: number, month: number}, date2: {date: number, month: number}) => {
    if (date1.month > date2.month) return true;
    if (date1.month < date2.month) return false;
    return date1.date > date2.date;
  };

  const isDateInRange = (day: CalendarDay | null, monthIndex: number) => {
    if (!day || !startDate || !endDate) return false;

    const currentDate = { date: day.date, month: monthIndex };
    return (
      (isDateAfter(currentDate, startDate) || isDateEqual(currentDate, startDate)) &&
      (isDateAfter(endDate, currentDate) || isDateEqual(currentDate, endDate))
    );
  };

  const isDateEqual = (date1: {date: number, month: number}, date2: {date: number, month: number}) => {
    return date1.date === date2.date && date1.month === date2.month;
  };

  const getFilteredEvents = () => {
    if (!startDate || !endDate) return [];

    const filteredEvents: Event[] = [];

    months.forEach((month, monthIndex) => {
      month.days.forEach(day => {
        if (day && isDateInRange(day, monthIndex) && day.events) {
          filteredEvents.push(...day.events);
        }
      });
    });

    return filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return (
    <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40" style={{ backgroundColor: '#FCFAF7' }}>
      <div className="mt-6 mb-8">
        {/* Calendar Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-8 border border-opacity-20"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
            borderColor: '#deb59a',
            boxShadow: '0 15px 30px rgba(44, 24, 16, 0.1), 0 5px 15px rgba(44, 24, 16, 0.05)'
          }}
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <motion.button
              onClick={prevMonth}
              whileHover={{ scale: 1.05, backgroundColor: '#F2EBE8' }}
              whileTap={{ scale: 0.95 }}
              className="p-2 sm:p-3 rounded-full transition-all duration-300 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #deb59a 0%, #d4a574 100%)',
                color: '#2c1810'
              }}
              disabled={currentDisplayMonth === 0}
            >
              <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>

            <div className="flex flex-col sm:flex-row sm:space-x-8 md:space-x-12 lg:space-x-16 space-y-2 sm:space-y-0">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3
                  className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide"
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    color: '#2c1810',
                    textShadow: '0 2px 4px rgba(44, 24, 16, 0.1)'
                  }}
                >
                  {months[currentDisplayMonth]?.name}
                </h3>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3
                  className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide"
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    color: '#2c1810',
                    textShadow: '0 2px 4px rgba(44, 24, 16, 0.1)'
                  }}
                >
                  {months[currentDisplayMonth + 1]?.name}
                </h3>
              </motion.div>
            </div>

            <motion.button
              onClick={nextMonth}
              whileHover={{ scale: 1.05, backgroundColor: '#F2EBE8' }}
              whileTap={{ scale: 0.95 }}
              className="p-2 sm:p-3 rounded-full transition-all duration-300 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #deb59a 0%, #d4a574 100%)',
                color: '#2c1810'
              }}
              disabled={currentDisplayMonth >= months.length - 2}
            >
              <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {[currentDisplayMonth, currentDisplayMonth + 1].map((monthIdx) => {
              const month = months[monthIdx];
              if (!month) return null;

              return (
                <div key={monthIdx} className="space-y-3">
                  {/* Week Days Header */}
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="text-center py-2 text-xs sm:text-sm font-bold tracking-wider"
                        style={{
                          color: '#96664F',
                          fontFamily: 'Raleway, sans-serif'
                        }}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {month.days.map((day, dayIndex) => {
                      if (!day) {
                        // Empty day for calendar alignment
                        return <div key={dayIndex} className="w-8 h-8 sm:w-10 sm:h-10"></div>;
                      }

                      const isSelected = (startDate && isDateEqual({date: day.date, month: monthIdx}, startDate)) ||
                                       (endDate && isDateEqual({date: day.date, month: monthIdx}, endDate));
                      const isInRange = isDateInRange(day, monthIdx) && startDate && endDate;

                      return (
                        <motion.button
                          key={dayIndex}
                          whileHover={{
                            scale: day.isPastDate ? 1 : 1.05,
                            boxShadow: day.isPastDate ? 'none' : '0 4px 15px rgba(222, 181, 154, 0.3)'
                          }}
                          whileTap={{ scale: day.isPastDate ? 1 : 0.95 }}
                          onClick={() => handleDateClick(day, monthIdx)}
                          disabled={day.isPastDate}
                          className={`
                            w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 relative
                            ${day.isPastDate
                              ? 'text-gray-300 cursor-not-allowed opacity-50'
                              : 'cursor-pointer'
                            }
                            ${day.isToday && !isSelected && !isInRange
                              ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg ring-1 ring-blue-300'
                              : ''
                            }
                            ${day.hasEvent && !day.isPastDate && !isSelected && !isInRange
                              ? 'bg-gradient-to-br from-orange-200 to-orange-300 text-orange-800 hover:from-orange-300 hover:to-orange-400 shadow-md'
                              : ''
                            }
                            ${!day.hasEvent && !day.isToday && !day.isPastDate && !isSelected && !isInRange
                              ? 'text-gray-600 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200'
                              : ''
                            }
                            ${isSelected
                              ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg ring-2 ring-amber-300 ring-opacity-50 transform scale-105'
                              : ''
                            }
                            ${isInRange && !isSelected
                              ? 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800 shadow-md'
                              : ''
                            }
                          `}
                          style={{
                            fontFamily: 'Lato, sans-serif'
                          }}
                        >
                          {day.date}
                          {day.hasEvent && !day.isPastDate && (
                            <motion.div
                              className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-sm"
                              style={{ backgroundColor: '#d97706' }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Date Range Selection Info */}
          <motion.div
            className="mt-6 sm:mt-8 pt-4 sm:pt-6"
            style={{ borderTop: '2px solid #F2EBE8' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
              <div className="space-y-3">
                <motion.h4
                  className="text-xl font-bold tracking-wide"
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    color: '#2c1810'
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Event Filter
                </motion.h4>

                <AnimatePresence mode="wait">
                  {filterApplied && startDate && endDate ? (
                    <motion.div
                      key="filter-applied"
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="flex items-center gap-3 p-4 rounded-xl shadow-md"
                      style={{
                        background: 'linear-gradient(135deg, #deb59a 0%, #d4a574 100%)',
                        color: '#2c1810'
                      }}
                    >
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.div>
                      <div>
                        <p className="font-semibold text-sm">Filter Applied!</p>
                        <p className="text-xs opacity-90">
                          {months[startDate.month]?.name.split(' ')[0]} {startDate.date} - {months[endDate.month]?.name.split(' ')[0]} {endDate.date}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="filter-instructions"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-gray-600 leading-relaxed"
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      {!startDate && !endDate && "Click on dates to select a range for filtering events below"}
                      {startDate && !endDate && "Click on another date to complete the range"}
                      {startDate && endDate && !filterApplied && "Range selected - filter will be applied automatically"}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {(startDate || endDate) && (
                <motion.button
                  onClick={clearSelection}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 8px 25px rgba(150, 102, 79, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #96664F 0%, #7a5a40 100%)',
                    color: 'white',
                    fontFamily: 'Lato, sans-serif'
                  }}
                >
                  Clear Selection
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Featured Events Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6"
          >
            {filterApplied && startDate && endDate ? 'Filtered Events' : 'Featured Events'}
          </motion.h2>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && events.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Unable to load events from database.</p>
              <p className="text-sm text-gray-500">Please check your connection or try again later.</p>
            </div>
          )}

          {filterApplied && startDate && endDate && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base text-gray-600 mb-6"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              Showing events from {months[startDate.month]?.name.split(' ')[0]} {startDate.date} to {months[endDate.month]?.name.split(' ')[0]} {endDate.date}
            </motion.p>
          )}

          {/* No Events State */}
          {!loading && events.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Available</h3>
                <p className="text-gray-600 mb-4">There are currently no events to display.</p>
                <p className="text-sm text-gray-500">Add events through the admin panel to see them here.</p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {(filterApplied && startDate && endDate ? getFilteredEvents() : events).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300`}
                >
                  {/* Event Image */}
                  <div className="lg:w-1/2">
                    <div className="relative h-64 sm:h-80 lg:h-72 xl:h-80">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                    >
                      <p className="text-orange-600 text-sm sm:text-base font-medium mb-2">
                        {event.type}
                      </p>

                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                        {event.title}
                      </h3>

                      <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-4">
                        {event.description}
                      </p>

                      <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          🕒 {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          🎫 {event.price}
                        </span>
                      </div>

                      <motion.button
                        onClick={goToReservation}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full transition-all duration-200 shadow-lg text-sm sm:text-base"
                      >
                        Book Table
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* No Events Message */}
            {filterApplied && startDate && endDate && getFilteredEvents().length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12 bg-white rounded-2xl shadow-lg"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="text-gray-500 text-lg mb-4">No events found in the selected date range.</p>
                  <motion.button
                    onClick={clearSelection}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200"
                  >
                    View All Events
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* View All Events Button */}
          {!filterApplied && (
            <div className="flex justify-center mt-8">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 sm:py-4 sm:px-10 rounded-full transition-all duration-200 shadow-lg text-sm sm:text-base border-2 border-orange-600 hover:border-orange-700"
              >
                View All Events
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
