import React from 'react';

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-900 border-b border-gray-800">
      <div className="w-full px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2">
          <a
            href="/"
            className="flex items-center space-x-2 text-green-400 font-mono text-base md:text-lg font-bold hover:text-green-300 transition-colors"
          >
            <img src="/icon.svg" alt="R" className="w-6 h-6 md:w-7 md:h-7" />
            <span>ronnakrit.net</span>
          </a>
        </div>

        {/* Status / Quick External Links */}
        <div className="flex items-center space-x-4 font-mono text-xs md:text-sm">
          <div className="flex items-center space-x-1.5 text-gray-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="hidden sm:inline">CLI session active</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-400">
            <a
              href="https://github.com/ronnakritnet"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              GitHub
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="https://linkedin.com/in/ronnakritnet"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
