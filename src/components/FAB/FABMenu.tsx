import React, { useState } from 'react';
import { fileSystem } from '../Terminal/data/fileSystem';
import type { FABMenuProps } from './types';
import './FAB.css';

const FABMenu: React.FC<FABMenuProps> = ({ isOpen, onClose, onCommandSelect }) => {
  const [currentView, setCurrentView] = useState<'main' | 'projects' | 'certs'>('main');

  const mainMenuItems = [
    { label: 'About', command: 'about' },
    { label: 'Skills', command: 'skills' },
    { label: 'Projects', command: 'projects', isDropdown: true },
    { label: 'Certs', command: 'certs', isDropdown: true },
    { label: 'Roadmap', command: 'roadmap' },
    { label: 'Contact', command: 'contact' },
    { label: 'Help', command: 'help' }
  ];

  const handleItemClick = (item: any) => {
    if (item.isDropdown) {
      setCurrentView(item.command === 'projects' ? 'projects' : 'certs');
    } else {
      onCommandSelect(item.command);
    }
  };

  const handleBack = () => {
    setCurrentView('main');
  };

  const handleFileClick = (filename: string, directory: string) => {
    const filenameWithoutMd = filename.replace('.md', '');
    onCommandSelect(`${directory}/${filenameWithoutMd}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fab-menu">
      {currentView === 'main' ? (
        <div className="py-1">
          {mainMenuItems.map((item) => (
            <button
              key={item.command}
              onClick={() => handleItemClick(item)}
              className="fab-menu-item"
            >
              {item.label}
              {item.isDropdown && <span className="fab-menu-indicator">▶</span>}
            </button>
          ))}
        </div>
      ) : (
        <div className="py-1">
          <button
            onClick={handleBack}
            className="fab-menu-item fab-menu-back"
          >
            ◀ Back
          </button>
          {fileSystem[currentView as keyof typeof fileSystem]?.children && 
            Object.keys(fileSystem[currentView as keyof typeof fileSystem].children || {}).map((filename) => (
              <button
                key={filename}
                onClick={() => handleFileClick(filename, currentView)}
                className="fab-menu-item"
              >
                {filename.replace('.md', '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default FABMenu;
