import React, { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(2025); // Fallback year

  useEffect(() => {
    // Only set year on client side to prevent hydration mismatch
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gray-900 border-t border-gray-700 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="text-gray-400 text-sm">
            © {currentYear} Ronnakrit Wananukan. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a 
              href="https://github.com/ronnakrit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-400 transition-colors duration-200"
            >
              GitHub
            </a>
            <a 
              href="https://linkedin.com/in/ronnakrit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-400 transition-colors duration-200"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
