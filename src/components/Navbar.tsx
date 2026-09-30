import React from 'react';

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-black/95 backdrop-blur-sm border-b border-gray-900/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between font-mono">
        {/* Logo/Brand & Session Info */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <a 
            href="/" 
            className="flex items-center space-x-2 text-green-400 font-bold hover:text-green-300 transition-colors"
          >
            <span className="text-green-500 font-bold">&gt;_</span>
            <span className="text-white">ronnakrit.net</span>
          </a>
          <span className="text-gray-700 hidden sm:inline">|</span>
          <span className="text-gray-500 text-xs hidden sm:inline">ssh://portfolio</span>
        </div>

        {/* Status / Quick External Links */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-gray-400 text-xs hidden xs:inline">active</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <a 
              href="https://github.com/ronnakritnet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-400 transition-colors px-1.5 py-0.5 rounded hover:bg-gray-900"
            >
              [GitHub]
            </a>
            <a 
              href="https://linkedin.com/in/ronnakritnet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-400 transition-colors px-1.5 py-0.5 rounded hover:bg-gray-900"
            >
              [LinkedIn]
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
