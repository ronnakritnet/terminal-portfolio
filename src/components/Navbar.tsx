import React from 'react';

const Navbar: React.FC = () => {

  const navItems = [
    { label: 'About', href: '/about' },
    { label: 'Skills', href: '/skills' },
    { label: 'Projects', href: '/projects' },
    { label: 'Certifications', href: '/certs' },
    { label: 'Roadmap', href: '/roadmap' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-gray-900 border-b border-gray-700">
      <div className="px-4 py-3">
        <div className="flex flex-row items-start justify-between space-y-0">
          {/* Logo/Title */}
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2 text-green-400 font-mono text-lg font-bold hover:text-green-300 transition-colors">
              <img src="/icon.svg" alt="R" className="w-7 h-7" />
              <span>ronnakrit.net</span>
            </a>
          </div>

          {/* Navigation Buttons */}
          <div className="hidden md:flex flex-wrap justify-center gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-1 bg-gray-800 text-green-400 border border-green-600 rounded hover:bg-gray-700 hover:border-green-400 transition-colors duration-200 font-mono text-sm"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Command Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-4 py-3 z-50 md:hidden">
        <div className="flex overflow-x-auto gap-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-1 bg-gray-800 text-green-400 border border-green-600 rounded text-sm font-mono whitespace-nowrap hover:bg-gray-700 hover:border-green-400 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
