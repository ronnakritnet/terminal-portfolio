import React, { useState, useEffect, useRef } from 'react';
import { fileSystem } from './Terminal/data/fileSystem';

interface NavbarProps {
  onCommandExecute: (command: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCommandExecute }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isCertsDesktopDropdownOpen, setIsCertsDesktopDropdownOpen] = useState(false);
  const [isCertsMobileDropdownOpen, setIsCertsMobileDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const certsDesktopDropdownRef = useRef<HTMLDivElement>(null);
  const certsMobileDropdownRef = useRef<HTMLDivElement>(null);

  const simulateTyping = async (command: string) => {
    setIsTyping(true);
    setCurrentCommand('');
    
    for (let i = 0; i <= command.length; i++) {
      setCurrentCommand(command.substring(0, i));
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    onCommandExecute(command);
    setCurrentCommand('');
    setIsTyping(false);
  };

  const handleProjectClick = (filename: string) => {
    setIsDesktopDropdownOpen(false);
    setIsMobileDropdownOpen(false);
    // Ensure filename includes .md extension
    const fullFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
    simulateTyping(`cat projects/${fullFilename}`);
  };

  const handleCertClick = (filename: string) => {
    setIsCertsDesktopDropdownOpen(false);
    setIsCertsMobileDropdownOpen(false);
    // Ensure filename includes .md extension
    const fullFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
    simulateTyping(`cat certs/${fullFilename}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target as Node)) {
        setIsDesktopDropdownOpen(false);
      }
    };

    if (isDesktopDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDesktopDropdownOpen]);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setIsMobileDropdownOpen(false);
      }
    };

    if (isMobileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileDropdownOpen]);

  // Close Certs desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (certsDesktopDropdownRef.current && !certsDesktopDropdownRef.current.contains(event.target as Node)) {
        setIsCertsDesktopDropdownOpen(false);
      }
    };

    if (isCertsDesktopDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCertsDesktopDropdownOpen]);

  // Close Certs mobile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (certsMobileDropdownRef.current && !certsMobileDropdownRef.current.contains(event.target as Node)) {
        setIsCertsMobileDropdownOpen(false);
      }
    };

    if (isCertsMobileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCertsMobileDropdownOpen]);

  const navItems = [
    { label: 'About', command: 'about' },
    { label: 'Skills', command: 'skills' },
    { label: 'Projects', command: 'projects', isDropdown: true },
    { label: 'Certs', command: 'certs', isDropdown: true },
    { label: 'Roadmap', command: 'roadmap' },
    { label: 'Contact', command: 'contact' },
    { label: 'Help', command: 'help' }
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-gray-900 border-b border-gray-700">
      <div className="px-4 py-3">
        <div className="flex flex-row items-start justify-between space-y-0">
          {/* Logo/Title */}
          <div className="flex items-start space-x-2">
            <a href="/" className="text-green-400 font-mono text-lg font-bold hover:text-green-300 transition-colors">
              ronnakrit.net
            </a>
          </div>

          {/* Navigation Buttons */}
          <div className="hidden md:flex flex-wrap justify-center gap-2">
            {navItems.map((item) => {
              if (item.isDropdown) {
                const isProjects = item.command === 'projects';
                const isCerts = item.command === 'certs';
                const isOpen = isProjects ? isDesktopDropdownOpen : isCertsDesktopDropdownOpen;
                const setIsOpen = isProjects ? setIsDesktopDropdownOpen : setIsCertsDesktopDropdownOpen;
                const dropdownRef = isProjects ? desktopDropdownRef : certsDesktopDropdownRef;
                const handleClick = isProjects ? handleProjectClick : handleCertClick;
                const directory = isProjects ? 'projects' : 'certs';

                return (
                  <div key={item.command} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => {
                        if (!isTyping) {
                          simulateTyping(item.command);
                        }
                      }}
                      disabled={isTyping}
                      className="px-0 py-1 bg-gray-800 text-green-400 border border-green-600 rounded hover:bg-gray-700 hover:border-green-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm flex items-center gap-1"
                    >
                      <div className="flex-1 h-full flex items-center pl-3">
                        <span className="font-mono text-sm">{item.label}</span>
                      </div>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen(!isOpen);
                        }}
                        className="flex items-center h-full pl-1 pr-3 cursor-pointer"
                      >
                        <span className="text-xs">{'\u25bc'}</span>
                      </div>
                    </button>
                    {isOpen && (() => {
                      const dirContent = fileSystem[directory as keyof typeof fileSystem];
                      if (!dirContent?.children) return null;
                      return (
                        <div className="absolute top-full mt-1 bg-gray-900 border border-green-600 rounded shadow-lg z-50">
                          {Object.keys(dirContent.children).map((filename) => (
                            <button
                              key={filename}
                              onClick={() => handleClick(filename)}
                              disabled={isTyping}
                              className="block w-full text-left px-3 py-2 text-green-400 hover:bg-gray-800 hover:text-green-300 font-mono text-sm whitespace-nowrap transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ minWidth: '200px' }}
                            >
                              {filename.replace('.md', '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                );
              }
              return (
                <button
                  key={item.command}
                  onClick={() => simulateTyping(item.command)}
                  disabled={isTyping}
                  className="px-3 py-1 bg-gray-800 text-green-400 border border-green-600 rounded hover:bg-gray-700 hover:border-green-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Typing Indicator */}
        {isTyping && (
          <div className="mt-2 text-xs text-gray-400 font-mono">
            Executing: <span className="text-green-400">{currentCommand}</span>
            <span className="cursor-blink">_</span>
          </div>
        )}
      </div>

      {/* Mobile Command Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-4 py-3 z-50 md:hidden">
        <div className="flex overflow-x-auto gap-2">
          {navItems.map((item) => {
            if (item.isDropdown) {
              const isProjects = item.command === 'projects';
              const isCerts = item.command === 'certs';
              const isOpen = isProjects ? isMobileDropdownOpen : isCertsMobileDropdownOpen;
              const setIsOpen = isProjects ? setIsMobileDropdownOpen : setIsCertsMobileDropdownOpen;

              return (
                <div key={item.command} className="relative">
                  <button
                    onClick={() => {
                      if (!isTyping) {
                        simulateTyping(item.command);
                      }
                    }}
                    disabled={isTyping}
                    className="px-0 py-1 bg-gray-800 text-green-400 border border-green-600 rounded hover:bg-gray-700 hover:border-green-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-mono whitespace-nowrap flex items-center gap-1"
                  >
                    <span className="flex-1 h-full flex items-center pl-3">
                      <span className="font-mono text-sm">{item.label}</span>
                    </span>
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                      }}
                      className="flex items-center h-full pl-1 pr-3 cursor-pointer"
                    >
                      <span className="text-xs">{'\u25bc'}</span>
                    </div>
                  </button>
                </div>
              );
            }
            return (
              <button
                key={item.command}
                onClick={() => simulateTyping(item.command)}
                disabled={isTyping}
                className="px-3 py-1 bg-gray-800 text-green-400 border border-green-600 rounded text-sm font-mono whitespace-nowrap hover:bg-gray-700 hover:border-green-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Dropdown - Fixed positioning to escape overflow */}
      {isMobileDropdownOpen && (
        <div className="fixed bottom-20 left-4 bg-gray-900 border border-green-600 rounded shadow-lg z-[100] md:hidden" ref={mobileDropdownRef}>
          {fileSystem['projects']?.children && Object.keys(fileSystem['projects'].children).map((filename) => (
            <button
              key={filename}
              onClick={() => handleProjectClick(filename)}
              disabled={isTyping}
              className="block w-full text-left px-3 py-2 text-green-400 hover:bg-gray-800 hover:text-green-300 font-mono text-sm whitespace-nowrap transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-700 last:border-b-0"
              style={{ minWidth: '180px' }}
            >
              {filename.replace('.md', '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      )}
      {isCertsMobileDropdownOpen && (
        <div className="fixed bottom-20 left-4 bg-gray-900 border border-green-600 rounded shadow-lg z-[100] md:hidden" ref={certsMobileDropdownRef}>
          {fileSystem['certs']?.children && Object.keys(fileSystem['certs'].children).map((filename) => (
            <button
              key={filename}
              onClick={() => handleCertClick(filename)}
              disabled={isTyping}
              className="block w-full text-left px-3 py-2 text-green-400 hover:bg-gray-800 hover:text-green-300 font-mono text-sm whitespace-nowrap transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-700 last:border-b-0"
              style={{ minWidth: '180px' }}
            >
              {filename.replace('.md', '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
