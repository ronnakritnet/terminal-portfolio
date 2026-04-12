import { useState, useCallback } from 'react';
import { useCommandHistory } from './useCommandHistory';
import type { TerminalLine } from '../types';

export const useTerminalState = () => {
  // Command history
  const history = useCommandHistory();
  
  // Terminal state
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [ghostSuggestion, setGhostSuggestion] = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const [isMobile, setIsMobile] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Toast notification handler
  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // Mobile detection
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  return {
    ...history,
    history: history.commandHistory,
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
    showBanner,
    setShowBanner,
    isInitialLoad,
    setIsInitialLoad
  };
};
