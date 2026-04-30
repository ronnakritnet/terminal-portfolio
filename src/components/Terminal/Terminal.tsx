import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { TerminalLine, TerminalProps } from './types';
import { fileSystem } from './data/fileSystem';
import { COMMANDS_DESC, HELP_OUTPUT } from './data/commands';
import { renderTerminalContent } from './utils/linkRenderer';
import { 
  handleWhoisCommand, 
  handleSudoCommand, 
  handleCatCommand, 
  handleLsCommand, 
  handleCdCommand,
  handleTreeCommand
} from './utils/commandHandlers';
import { handleKeyDown, handleInputChange } from './utils/keyboardHandlers';
import { useTerminalState } from './hooks/useTerminalState';
import ASCIIBanner from './ASCIIBanner';

// ASCII art (moved to constants/ascii.ts)
// Terminal component
const Terminal: React.FC<TerminalProps> = ({ externalCommand }) => {
  const {
    lines,
    setLines,
    currentInput,
    setCurrentInput,
    suggestions,
    setSuggestions,
    ghostSuggestion,
    setGhostSuggestion,
    currentPath,
    setCurrentPath,
    isMobile,
    setIsMobile,
    toast,
    setToast,
    showToast,
    checkMobile,
    history,
    historyIndex,
    setHistoryIndex,
    addToHistory,
    clearHistory,
    showBanner,
    setShowBanner,
    isInitialLoad,
    setIsInitialLoad
  } = useTerminalState();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Command execution logic
  const executeCommand = useCallback((command: string) => {
    const trimmedCommand = command.trim();
    
    // Handle empty commands
    if (!trimmedCommand) return;
    
    const parts = trimmedCommand.split(' ');
    const mainCommand = parts[0];
    const args = parts.slice(1);

    // Set initial load to false after first user command
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }

    // Clear current input for external commands
    setCurrentInput('');
    setSuggestions([]);
    setGhostSuggestion('');

    // Capture current path for this execution
    const executionPath = currentPath;

    const newLine: TerminalLine = {
      id: Date.now().toString(),
      type: 'input',
      content: trimmedCommand,
      command: mainCommand,
      path: executionPath
    };

    setLines(prev => [...prev, newLine]);

    let output = '';

    switch (mainCommand) {
      case 'help':
        output = HELP_OUTPUT;
        break;

      case 'about':
        output = fileSystem['about.md'].content || 'About information not found.';
        break;

      case 'projects':
        output = `PROJECTS:
  📄 ronnakrit-net.md               - Interactive Portfolio & Terminal Interface
  📄 schedule-management-system.md  - Academic Triple-view Schedule Manager

Use 'cat [filename]' to explore project details.`;
        break;

      case 'certs':
        output = `CERTIFICATIONS:
  📄 google_it_support.md          - Google IT Support Professional Certificate
  📄 google_cybersecurity.md       - Google Cybersecurity Professional Certificate

Use 'cat [filename]' to explore certification details.`;
        break;

      case 'skills':
        output = fileSystem['skills.md'].content || 'Skills information not found.';
        break;

      case 'contact':
        output = fileSystem['contact.md'].content || 'Contact information not found.';
        break;

      case 'clear':
        setLines([]);
        setShowBanner(false);
        break;

      case 'ls':
        output = handleLsCommand(currentPath, fileSystem);
        break;

      case 'cd':
        output = handleCdCommand(args, setCurrentPath, fileSystem);
        break;

      case 'cat':
        output = handleCatCommand(args, currentPath, fileSystem);
        break;

      case 'tree':
        output = handleTreeCommand(currentPath, fileSystem);
        break;

      case 'whois':
        output = handleWhoisCommand(args);
        break;

      case 'sudo':
        output = handleSudoCommand(args);
        break;

      case 'roadmap':
        output = fileSystem['roadmap.md']?.content || 'Roadmap content not found';
        break;

      default:
        output = `-bash: ${mainCommand}: command not found\nType 'help' for available commands.`;
        break;
    }

    if (output) {
      const outputLine: TerminalLine = {
        id: (Date.now() + 1).toString(),
        type: 'output',
        content: output
      };
      setLines(prev => [...prev, outputLine]);
    }

    // Add to command history
    addToHistory(trimmedCommand);
    setCurrentInput('');
    setSuggestions([]);
    setGhostSuggestion('');
  }, [currentPath, fileSystem, addToHistory]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isInitialLoad && terminalRef.current) {
      setTimeout(() => {
        terminalRef.current!.scrollTop = terminalRef.current!.scrollHeight;
      }, 50);
    }
    
    // Also scroll window to bottom as fallback
    if (!isInitialLoad) {
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [currentPath, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && terminalRef.current) {
      setTimeout(() => {
        terminalRef.current!.scrollTop = terminalRef.current!.scrollHeight;
      }, 50);
    }
    
    // Also scroll window to bottom as fallback
    if (!isInitialLoad) {
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [suggestions, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && terminalRef.current) {
      setTimeout(() => {
        terminalRef.current!.scrollTop = terminalRef.current!.scrollHeight;
      }, 50);
    }
    
    // Also scroll window to bottom as fallback
    if (!isInitialLoad) {
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [lines, isInitialLoad]);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: TerminalLine = {
      id: Date.now().toString(),
      type: 'output',
      content: isMobile ? '' : '' // Will be handled by ASCIIBanner component
    };
    setLines([welcomeMessage]);

    // Scroll to top on initial load
    if (terminalRef.current) {
      terminalRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  // Handle external command
  useEffect(() => {
    if (externalCommand) {
      executeCommand(externalCommand);
    }
  }, [externalCommand, executeCommand]);

  // Input handling using modular keyboard handler
  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDown(
      e,
      currentInput,
      currentPath,
      fileSystem,
      setCurrentInput,
      setSuggestions,
      history,
      historyIndex,
      setHistoryIndex,
      setGhostSuggestion,
      executeCommand,
      ghostSuggestion
    );
  };

  const handleInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e, currentPath, fileSystem, setCurrentInput, setGhostSuggestion);
  };

  return (
    <div className="flex-1 bg-black text-green-400 font-mono flex flex-col border-t border-gray-800">
      {/* Executing Toast Notification */}
      {toast && (
        <div 
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-green-400 px-4 py-2 rounded-lg shadow-lg border border-green-700 z-50 transition-all duration-300 ease-in-out font-mono text-sm"
          style={{ 
            backgroundColor: '#1a1a1a',
            borderColor: '#16a34a',
            animation: 'fadeInOut 2s ease-in-out'
          }}
        >
          {toast}
        </div>
      )}

      {/* Terminal Container */}
      <div className="flex-1 flex px-4 py-6 pt-20 overflow-y-auto">
        <div className="w-full max-w-5xl mx-auto">
          {/* Terminal Content */}
          <div 
            ref={terminalRef}
            className="px-6 py-4 mb-12 md:mb-0"
            style={{ backgroundColor: 'var(--terminal-bg)' }}
          >
            {/* ASCII Banner - First element in terminal */}
            {showBanner && <ASCIIBanner isMobile={isMobile} />}
            
            {lines.map((line) => {
              return (
                <div key={line.id} className="mb-2">
                  {line.type === 'input' && (
                    <div className="flex items-center">
                      <span style={{ color: 'var(--terminal-green)' }}>
                        ronnakrit@portfolio
                      </span>
                      <span className="mx-1 text-white">:</span>
                      <span style={{ color: 'var(--terminal-blue)' }}>
                        {line.path || '~'}
                      </span>
                      <span className="mx-1 text-white">$</span>
                      <span className="ml-2 text-white">{line.content}</span>
                    </div>
                  )}
                  {line.type === 'output' && (
                    <pre 
                      className="whitespace-pre-wrap text-sm"
                      style={{ color: 'var(--terminal-light-green)' }}
                      dangerouslySetInnerHTML={{
                        __html: renderTerminalContent(line.content)
                      }}
                    />
                  )}
                  {line.type === 'error' && (
                    <pre 
                      className="whitespace-pre-wrap text-sm"
                      style={{ color: '#ff6b6b' }}
                    >
                      {renderTerminalContent(line.content)}
                    </pre>
                  )}
                </div>
              );
            })}
            
            {/* Current Input Line - Inside Terminal Container */}
            <div className="flex items-center">
              <span style={{ color: 'var(--terminal-green)' }}>
                ronnakrit@portfolio
              </span>
              <span className="mx-1 text-white">:</span>
              <span style={{ color: 'var(--terminal-blue)' }}>
                {currentPath}
              </span>
              <span className="mx-1 text-white">$</span>
              <div className="flex-1 relative ml-2 min-w-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={handleInputChangeHandler}
                  onKeyDown={handleInput}
                  className="w-full bg-transparent outline-none text-white"
                  style={{ color: 'var(--terminal-white)' }}
                  placeholder={currentInput.length === 0 ? "Type a command..." : ""}
                  data-ghost-suggestion={ghostSuggestion}
                />
                {/* Ghost Suggestion */}
                {ghostSuggestion && (
                  <span 
                    className="absolute left-0 top-0 pointer-events-none text-gray-500"
                    style={{ 
                      color: 'var(--terminal-gray)',
                      opacity: 0.5
                    }}
                  >
                    {ghostSuggestion}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
