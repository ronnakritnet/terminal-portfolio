import { useState, useCallback } from 'react';

export const useCommandHistory = () => {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = useCallback((command: string) => {
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
  }, []);

  const clearHistory = useCallback(() => {
    setCommandHistory([]);
    setHistoryIndex(-1);
  }, []);

  return {
    commandHistory,
    historyIndex,
    setHistoryIndex,
    addToHistory,
    clearHistory
  };
};
