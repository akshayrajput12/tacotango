import { motion } from 'framer-motion';
import { FAQItem } from './FAQItem';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  faqs: FAQ[];
  sectionIndex: number;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ title, faqs, sectionIndex }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: sectionIndex * 0.2 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: sectionIndex * 0.1 }
      }}
      viewport={{ once: true, margin: "-100px" }}
      className="mb-12"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: sectionIndex * 0.2 + 0.1 }}
        whileInView={{
          opacity: 1,
          x: 0,
          transition: { duration: 0.5, delay: sectionIndex * 0.1 }
        }}
        viewport={{ once: true }}
        className="mb-6 pb-2 border-b-2 border-orange-100"
      >
        <motion.h2
          className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 relative"
          style={{ fontFamily: 'Raleway, sans-serif' }}
          whileHover={{
            color: "#f97316",
            transition: { duration: 0.3 }
          }}
        >
          {title}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-orange-500"
            initial={{ width: 0 }}
            whileInView={{ width: "60px" }}
            transition={{ duration: 0.8, delay: sectionIndex * 0.2 + 0.3 }}
            viewport={{ once: true }}
          />
        </motion.h2>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: sectionIndex * 0.2 + 0.4 }}
      >
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            index={index + sectionIndex * 3}
          />
        ))}
      </motion.div>
    </motion.section>
  );
};
