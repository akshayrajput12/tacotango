import { motion } from 'framer-motion';
import { useState } from 'react';
import { goHome, goToReservation, goToOurStory, goToGallery, goToEvents, goToMenu, goToFAQ, goToContact, goToCustomerStories } from '../utils/navigation';
import logoImage from '../assets/logo.png';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = ['Our Story', 'Menu', 'Events', 'Gallery', 'Customer Stories', 'Contact Us', 'FAQ'];

  const handleHomeClick = () => {
    goHome();
    setIsOpen(false); // Close mobile menu if open
  };

  const handleBookTableClick = () => {
    goToReservation();
    setIsOpen(false); // Close mobile menu if open
  };

  const handleNavItemClick = (item: string) => {
    if (item === 'Our Story') {
      goToOurStory();
    } else if (item === 'Gallery') {
      goToGallery();
    } else if (item === 'Events') {
      goToEvents();
    } else if (item === 'Menu') {
      goToMenu();
    } else if (item === 'Customer Stories') {
      goToCustomerStories();
    } else if (item === 'Contact Us') {
      goToContact();
    } else if (item === 'FAQ') {
      goToFAQ();
    }
    // Add other navigation handlers here as needed
    setIsOpen(false); // Close mobile menu if open
  };

  return (
    <>
      {/* Custom CSS for logo cursor */}
      <style>{`
        .logo-cursor:hover {
          cursor: url('/src/assets/logo.png') 16 16, pointer !important;
        }
      `}</style>

      <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.button
              onClick={handleHomeClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 transition-all duration-200 logo-cursor"
            >
              {/* Logo Image */}
              <img
                src={logoImage}
                alt="Cafex Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors duration-200" style={{ fontFamily: 'Raleway, sans-serif' }}>
                Cafex
              </span>
            </motion.button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavItemClick(item)}
                className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 logo-cursor"
              >
                {item}
              </button>
            ))}

            {/* Book a Table Button */}
            <motion.button
              onClick={handleBookTableClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-full text-sm transition-colors duration-200 logo-cursor"
            >
              Book a Table
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavItemClick(item)}
                  className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium w-full text-left logo-cursor"
                >
                  {item}
                </button>
              ))}
              <motion.button
                onClick={handleBookTableClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-full text-sm transition-colors duration-200 mt-4 ml-3 logo-cursor"
              >
                Book a Table
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
};
