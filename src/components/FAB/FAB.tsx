import React, { useState, useRef, useEffect } from 'react';
import { executeCommand } from '../../utils/commandExecutor';
import { fileSystem } from '../Terminal/data/fileSystem';
import FABMenu from './FABMenu';
import type { FABProps } from './types';
import './FAB.css';

const FAB: React.FC<FABProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  const handleFABClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCommandSelect = (command: string) => {
    setIsMenuOpen(false);
    executeCommand(command);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div ref={fabRef} className="fixed z-50" style={{ bottom: '90px', right: '20px' }}>
      <button
        onClick={handleFABClick}
        className="fab-button"
      >
        <img src="/favicon.svg" alt="R" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }} />
      </button>
      
      <FABMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onCommandSelect={handleCommandSelect}
      />
    </div>
  );
};

export default FAB;
