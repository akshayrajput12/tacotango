import { motion } from 'framer-motion';
import { useState } from 'react';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = ['Our Story', 'Menu', 'Events', 'Gallery'];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              {/* Logo Image */}
              <img
                src="/src/assets/logo.png"
                alt="Cafex Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Raleway, sans-serif' }}>
                Cafex
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
              >
                {item}
              </a>
            ))}

            {/* Book a Table Button */}
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-full text-sm transition-colors duration-200">
              Book a Table
            </button>
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
                <a
                  key={item}
                  href="#"
                  className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                >
                  {item}
                </a>
              ))}
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-full text-sm transition-colors duration-200 mt-4 ml-3">
                Book a Table
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
