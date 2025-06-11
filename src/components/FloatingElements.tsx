import { motion } from 'framer-motion';

export const FloatingElements = () => {
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"
        style={{ animationDelay: '0s' }}
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20"
        style={{ animationDelay: '1s' }}
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20"
        style={{ animationDelay: '2s' }}
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute bottom-20 right-1/3 w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20"
        style={{ animationDelay: '3s' }}
      />
    </div>
  );
};
