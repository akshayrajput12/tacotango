import { motion } from 'framer-motion';
import { goToEvents } from '../../../utils/navigation';
import { usePublicEvents } from '../../../hooks/useEvents';
import type { Event } from '../../../services/eventsService';

// Transform Event to match the component's expected format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const UpcomingEvents = () => {
  const { featuredEvents, loading, error } = usePublicEvents();

  // Use database events only (limit to 2 for home page)
  const displayEvents = featuredEvents.slice(0, 2);

  // Show loading state
  if (loading) {
    return (
      <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <div className="mt-6 mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6"
          >
            Upcoming Events
          </motion.h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <div className="mt-6 mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6"
        >
          Upcoming Events
        </motion.h2>

        {displayEvents.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-gray-500 mb-2">No upcoming events available</p>
              <p className="text-sm text-gray-400">Add featured events in the admin panel to display them here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {displayEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
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
                    {formatDate(event.date)}
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
                    onClick={goToEvents}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full transition-all duration-200 shadow-lg text-sm sm:text-base"
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
            ))}
          </div>
        )}

        {/* View All Events Button - Show only when there are events */}
        {displayEvents.length > 0 && (
          <div className="flex justify-center mt-8">
            <motion.button
              onClick={goToEvents}
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
      </div>
    </section>
  );
};
