import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { TerminalLine, TerminalProps, PathArray } from './types';
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
import { pathArrayToString } from './utils/pathUtils';
import ASCIIBanner from './ASCIIBanner';
import { registerCommandExecutor } from '../../utils/commandExecutor';

// Terminal Constants
const TERMINAL_CONSTANTS = {
  SCROLL_DELAY_MS: 50,
  WINDOW_SCROLL_DELAY_MS: 100,
  TYPING_CHAR_DELAY_MS: 50,
  TYPING_EXECUTION_DELAY_MS: 200,
  SUGGESTION_DISPLAY_DURATION_MS: 2000,
  TOAST_DURATION_MS: 2500,
  MOBILE_BREAKPOINT_PX: 640,
} as const;

const QUICK_COMMANDS = [
  'help',
  'about',
  'projects',
  'skills',
  'certs',
  'roadmap',
  'contact',
  'clear'
] as const;

const VALID_HASH_COMMANDS = [
  'about',
  'projects',
  'skills',
  'certs',
  'roadmap',
  'contact',
  'help'
] as const;

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
  const [isTyping, setIsTyping] = useState(false);
  const isTypingRef = useRef(false);
  const lastExecutedHashRef = useRef<string>('');

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
    const executionPath = pathArrayToString(currentPath);

    // Update URL hash for deep linking (without page refresh)
    if (typeof window !== 'undefined') {
      if ((VALID_HASH_COMMANDS as readonly string[]).includes(mainCommand)) {
        lastExecutedHashRef.current = mainCommand;
        window.history.replaceState(null, '', `#${mainCommand}`);
      } else if (mainCommand === 'clear') {
        lastExecutedHashRef.current = '';
        window.history.replaceState(null, '', window.location.pathname);
      }
    }

    const baseId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newLine: TerminalLine = {
      id: `${baseId}-in`,
      type: 'input',
      content: trimmedCommand,
      command: mainCommand,
      path: executionPath
    };

    let output = '';

    switch (mainCommand) {
      case 'help':
        output = HELP_OUTPUT;
        break;

      case 'about':
        output = fileSystem['about.md'].content || 'About information not found.';
        break;

      case 'projects':
        output = `PROJECTS DIRECTORY:
  📄 ronnakrit-net.md               - Interactive Portfolio & Terminal Interface
  📄 schedule-management-system.md  - Academic Triple-view Schedule Manager

[Usage Tips]
- From root folder : cat projects/[filename]
- Inside directory : cd projects && cat [filename]`;
        break;

      case 'certs':
        output = `CERTIFICATIONS DIRECTORY:
  📄 google_it_support.md          - Google IT Support Professional Certificate
  📄 google_cybersecurity.md       - Google Cybersecurity Professional Certificate

[Usage Tips]
- From root folder : cat certs/[filename]
- Inside directory : cd certs && cat [filename]`;
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;

      case 'ls':
        output = handleLsCommand(args, currentPath, fileSystem);
        break;

      case 'cd':
        output = handleCdCommand(args, currentPath, setCurrentPath, fileSystem);
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

      // Handle direct path execution for allowed directories
      default:
        const DIRECT_PATH_PREFIXES = ['projects/', 'certs/'];
        let handled = false;

        for (const prefix of DIRECT_PATH_PREFIXES) {
          if (mainCommand.startsWith(prefix)) {
            const filename = mainCommand.slice(prefix.length);

            // Validate that a filename was provided
            if (!filename) {
              output = `-bash: ${mainCommand}: No file specified`;
              handled = true;
              break;
            }

            // Auto-append .md if not present and execute as cat command resolved from root
            const fullPath = mainCommand.endsWith('.md') ? mainCommand : mainCommand + '.md';
            const catResult = handleCatCommand([fullPath], [], fileSystem);
            output = catResult;
            handled = true;
            break;
          }
        }

        if (!handled) {
          output = `-bash: ${mainCommand}: command not found\nType 'help' for available commands.`;
        }
        break;
    }

    if (mainCommand !== 'clear') {
      const newLines: TerminalLine[] = [newLine];
      if (output) {
        newLines.push({
          id: `${baseId}-out`,
          type: 'output',
          content: output
        });
      }
      setLines(prev => [...prev, ...newLines]);
    }

    // Add to command history
    addToHistory(trimmedCommand);
    setCurrentInput('');
    setSuggestions([]);
    setGhostSuggestion('');
  }, [currentPath, fileSystem, addToHistory]);

  // Auto-scroll functionality - consolidated helper
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, TERMINAL_CONSTANTS.SCROLL_DELAY_MS);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      scrollToBottom();
    }
  }, [currentPath, isInitialLoad, scrollToBottom]);

  useEffect(() => {
    if (!isInitialLoad) {
      scrollToBottom();
    }
  }, [suggestions, isInitialLoad, scrollToBottom]);

  useEffect(() => {
    if (!isInitialLoad) {
      scrollToBottom();
    }
  }, [lines, isInitialLoad, scrollToBottom]);

  // Initial mount setup
  useEffect(() => {
    window.scrollTo(0, 0);

    const checkMobileHandler = () => {
      setIsMobile(window.innerWidth <= TERMINAL_CONSTANTS.MOBILE_BREAKPOINT_PX);
    };

    checkMobileHandler();
    window.addEventListener('resize', checkMobileHandler);

    return () => window.removeEventListener('resize', checkMobileHandler);
  }, [setIsMobile]);

  // Handle external command
  useEffect(() => {
    if (externalCommand) {
      executeCommand(externalCommand);
    }
  }, [externalCommand, executeCommand]);

  // Typing simulation for external command execution
  const simulateTyping = useCallback(async (command: string) => {
    if (isTypingRef.current) return;

    isTypingRef.current = true;
    setIsTyping(true);
    setCurrentInput('');

    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }

    try {
      // Type character by character
      for (let i = 0; i <= command.length; i++) {
        setCurrentInput(command.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, TERMINAL_CONSTANTS.TYPING_CHAR_DELAY_MS));
      }

      // Wait a moment before executing
      await new Promise(resolve => setTimeout(resolve, TERMINAL_CONSTANTS.TYPING_EXECUTION_DELAY_MS));

      // Execute the command
      executeCommand(command);
    } finally {
      setCurrentInput('');
      isTypingRef.current = false;
      setIsTyping(false);
    }
  }, [executeCommand]);

  // Keep ref to latest simulateTyping to avoid effect re-triggers
  const simulateTypingRef = useRef(simulateTyping);
  useEffect(() => {
    simulateTypingRef.current = simulateTyping;
  }, [simulateTyping]);

  // Register command executor callback
  useEffect(() => {
    registerCommandExecutor(simulateTyping);
  }, [simulateTyping]);

  // Deep link support: auto-execute command on initial mount if hash is present, or on real hashchange
  useEffect(() => {
    let timerId: number | null = null;

    const handleHashCommand = () => {
      const hash = window.location.hash.replace('#', '').trim().toLowerCase();
      if (!hash) return;
      // Do not re-execute if already processed
      if (hash === lastExecutedHashRef.current) return;

      if ((VALID_HASH_COMMANDS as readonly string[]).includes(hash)) {
        lastExecutedHashRef.current = hash;
        timerId = window.setTimeout(() => {
          simulateTypingRef.current(hash);
        }, 200);
      }
    };

    handleHashCommand();
    window.addEventListener('hashchange', handleHashCommand);
    return () => {
      if (timerId) window.clearTimeout(timerId);
      window.removeEventListener('hashchange', handleHashCommand);
    };
  }, []);

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

  const handleTerminalClick = (e: React.MouseEvent) => {
    // If text is currently selected, do not trigger command execution or focus
    if (window.getSelection()?.toString()) return;

    const target = e.target as HTMLElement;

    // Check if clicked element or its parent is an interactive command trigger
    const cmdElement = target.closest('[data-command]') as HTMLElement | null;
    if (cmdElement) {
      e.preventDefault();
      e.stopPropagation();
      const cmd = cmdElement.getAttribute('data-command');
      if (cmd) {
        simulateTyping(cmd);
      }
      return;
    }

    if (target.tagName.toLowerCase() === 'a' || target.closest('a')) return;
    if (target.tagName.toLowerCase() === 'button' || target.closest('button')) return;
    inputRef.current?.focus();
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target as HTMLElement;
      const cmdElement = target.closest('[data-command]') as HTMLElement | null;
      if (cmdElement) {
        e.preventDefault();
        e.stopPropagation();
        const cmd = cmdElement.getAttribute('data-command');
        if (cmd) {
          simulateTyping(cmd);
        }
      }
    }
  };

  return (
    <div 
      onClick={handleTerminalClick}
      onKeyDown={handleTerminalKeyDown}
      className="flex-1 bg-gray-950 text-green-400 font-mono flex flex-col cursor-text min-h-screen"
    >
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

      {/* Terminal Main Container (Frame/Card border removed) */}
      <div
        ref={terminalRef}
        onClick={handleTerminalClick}
        className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 flex flex-col cursor-text"
      >
        {/* ASCII Banner - First element in terminal */}
        {showBanner && <ASCIIBanner isMobile={isMobile} />}

        {lines.map((line) => {
          return (
            <div key={line.id} className="mb-2">
              {line.type === 'input' && (
                <div className="flex items-center text-xs sm:text-sm">
                  <span style={{ color: 'var(--terminal-green)' }}>
                    <span className="hidden min-[360px]:inline">ronnakrit@</span>portfolio
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
                  className="whitespace-pre-wrap text-xs sm:text-sm"
                  style={{ color: 'var(--terminal-light-green)' }}
                  dangerouslySetInnerHTML={{
                    __html: renderTerminalContent(line.content)
                  }}
                />
              )}
              {line.type === 'error' && (
                <pre
                  className="whitespace-pre-wrap text-xs sm:text-sm"
                  style={{ color: '#ff6b6b' }}
                  dangerouslySetInnerHTML={{
                    __html: renderTerminalContent(line.content)
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Tab Suggestions Display - Clickable on mobile & desktop */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 my-2 p-1.5 bg-gray-800/70 rounded border border-gray-700/60 text-xs font-mono">
            <span className="text-gray-400 select-none mr-1">Matches:</span>
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  simulateTyping(item);
                }}
                className="px-1.5 py-0.5 bg-gray-900/90 hover:bg-green-950/80 text-green-400 hover:text-green-300 rounded border border-green-800/50 hover:border-green-400 text-[11px] cursor-pointer transition-colors active:scale-95"
                title={`Click to run: ${item}`}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* Quick Command Action Toolbar (Frameless) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 my-2.5">
          <span className="text-xs text-gray-400 font-mono flex items-center mr-1 select-none">
            <span className="text-green-400 mr-1">⚡</span>
            <span className="hidden sm:inline">Quick:</span>
          </span>
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              type="button"
              disabled={isTyping}
              onClick={(e) => {
                e.stopPropagation();
                simulateTyping(cmd);
              }}
              className="px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs font-mono bg-gray-900/90 hover:bg-green-950/80 text-green-400 hover:text-green-300 border border-gray-800 hover:border-green-400 rounded transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed select-none"
              title={`Run command: ${cmd}`}
            >
              <span className="text-green-500/70 mr-1 select-none">$</span>
              {cmd}
            </button>
          ))}
        </div>

        {/* Current Input Line - Inside Terminal Container */}
        <div className="flex items-center text-xs sm:text-sm">
          <span style={{ color: 'var(--terminal-green)' }}>
            <span className="hidden min-[360px]:inline">ronnakrit@</span>portfolio
          </span>
          <span className="mx-1 text-white">:</span>
          <span style={{ color: 'var(--terminal-blue)' }}>
            {pathArrayToString(currentPath)}
          </span>
          <span className="mx-1 text-white">$</span>
          <div className="flex-1 relative ml-2 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChangeHandler}
              onKeyDown={handleInput}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="w-full bg-transparent outline-none text-white font-mono caret-green-400 text-xs sm:text-sm"
              style={{ 
                color: 'var(--terminal-white)',
                caretColor: 'var(--terminal-green)'
              }}
              placeholder={currentInput.length === 0 ? "Type a command..." : ""}
              data-ghost-suggestion={ghostSuggestion}
            />
            {/* Ghost Suggestion */}
            {currentInput.length > 0 && ghostSuggestion && ghostSuggestion.toLowerCase().startsWith(currentInput.toLowerCase()) && (
              <span
                className="absolute left-0 top-0 pointer-events-none text-gray-500 font-mono text-xs sm:text-sm"
                style={{
                  color: 'var(--terminal-gray)',
                  opacity: 0.5
                }}
              >
                <span className="invisible select-none">{currentInput}</span>
                <span>{ghostSuggestion.slice(currentInput.length)}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
