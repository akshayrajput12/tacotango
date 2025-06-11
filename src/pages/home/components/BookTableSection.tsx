import { motion } from 'framer-motion';

interface BookTableSectionProps {
  onBookTable?: () => void;
}

export const BookTableSection = ({ onBookTable }: BookTableSectionProps) => {
  return (
    <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 py-12" style={{ backgroundColor: '#F5F1EC' }}>
      <div className="flex justify-center">
        <motion.button
          onClick={onBookTable}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(234, 88, 12, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          className="bg-orange-600 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-700 transition-all duration-300 shadow-lg text-lg"
        >
          Book a Table
        </motion.button>
      </div>
    </section>
  );
};
