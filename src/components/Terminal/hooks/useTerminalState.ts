import { useState, useCallback } from 'react';
import { useCommandHistory } from './useCommandHistory';
import type { TerminalLine, PathArray } from '../types';

export const useTerminalState = (currentPath?: PathArray, setCurrentPath?: React.Dispatch<React.SetStateAction<PathArray>>) => {
  // Command history
  const history = useCommandHistory();
  
  // Terminal state
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [ghostSuggestion, setGhostSuggestion] = useState('');
  const [internalCurrentPath, setInternalCurrentPath] = useState<PathArray>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Use external path state if provided, otherwise use internal state
  const path = currentPath || internalCurrentPath;
  const setPath = setCurrentPath || setInternalCurrentPath;

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
    currentPath: path,
    setCurrentPath: setPath,
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
