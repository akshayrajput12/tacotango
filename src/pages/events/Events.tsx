import { motion } from 'framer-motion';
import { EventsHero, EventsCalendarAndFeatured, SpecialOffers } from './components';

export const EventsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-16 sm:pt-20"
      style={{ backgroundColor: '#FCFAF7' }}
    >
      <EventsHero />
      <EventsCalendarAndFeatured />
      <SpecialOffers />
    </motion.div>
  );
};
