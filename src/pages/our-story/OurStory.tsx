import { motion } from 'framer-motion';
import { OurStoryHero, MissionValues, MeetTheTeam, WhatMakesUsUnique } from './components';

export const OurStoryPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-20"
      style={{ backgroundColor: '#faf8f5' }}
    >
      <OurStoryHero />
      <MissionValues />
      <WhatMakesUsUnique />
      <MeetTheTeam />
    </motion.div>
  );
};
