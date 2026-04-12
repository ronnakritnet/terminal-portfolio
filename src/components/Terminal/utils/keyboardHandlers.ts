import React from 'react';
import { COMMANDS_DESC } from '../data/commands';

// Get first matching command (same logic as ghost suggestion)
export const getFirstMatch = (currentInput: string): string => {
  if (!currentInput) return '';
  
  const availableCommands = Object.keys(COMMANDS_DESC);
  return availableCommands.find(cmd => 
    cmd.startsWith(currentInput.toLowerCase()) && cmd !== currentInput.toLowerCase()
  ) || '';
};

// Ghost suggestion logic
export const updateGhostSuggestion = (
  currentInput: string,
  setGhostSuggestion: (value: string) => void
): void => {
  const match = getFirstMatch(currentInput);
  setGhostSuggestion(match);
};

// Accept ghost suggestion
export const acceptGhostSuggestion = (
  ghostSuggestion: string,
  setCurrentInput: (value: string) => void,
  setGhostSuggestion: (value: string) => void
): void => {
  if (ghostSuggestion) {
    setCurrentInput(ghostSuggestion);
    setGhostSuggestion('');
  }
};

// Tab completion logic - now accepts ghost suggestion immediately
export const handleTabCompletion = (
  currentInput: string,
  setCurrentInput: (value: string) => void,
  setSuggestions: (suggestions: string[]) => void,
  setGhostSuggestion: (value: string) => void
): void => {
  const availableCommands = Object.keys(COMMANDS_DESC);
  const matches = availableCommands.filter(cmd => 
    cmd.startsWith(currentInput.toLowerCase())
  );
  
  // First, try to accept ghost suggestion if it exists
  const ghostMatch = getFirstMatch(currentInput);
  if (ghostMatch) {
    setCurrentInput(ghostMatch);
    setGhostSuggestion('');
    return;
  }
  
  // If no ghost suggestion, show multiple matches
  if (matches.length > 1) {
    setSuggestions(matches);
    setTimeout(() => setSuggestions([]), 2000);
  }
};

// History navigation logic
export const handleHistoryNavigation = (
  direction: 'up' | 'down',
  commandHistory: string[],
  historyIndex: number,
  setHistoryIndex: (index: number) => void,
  setCurrentInput: (value: string) => void,
  setGhostSuggestion: (value: string) => void
): void => {
  if (direction === 'up') {
    if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      setGhostSuggestion('');
    }
  } else if (direction === 'down') {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      setGhostSuggestion('');
    } else if (historyIndex === 0) {
      setHistoryIndex(-1);
      setCurrentInput('');
      setGhostSuggestion('');
    }
  }
};

// Main keyboard handler
export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  currentInput: string,
  setCurrentInput: (value: string) => void,
  setSuggestions: (suggestions: string[]) => void,
  commandHistory: string[],
  historyIndex: number,
  setHistoryIndex: (index: number) => void,
  setGhostSuggestion: (value: string) => void,
  executeCommand: (command: string) => void,
  ghostSuggestion: string
): void => {
  if (e.key === 'Enter') {
    e.preventDefault();
    executeCommand(currentInput);
  } else if (e.key === 'Tab') {
    e.preventDefault();
    handleTabCompletion(currentInput, setCurrentInput, setSuggestions, setGhostSuggestion);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    // Accept ghost suggestion with right arrow
    acceptGhostSuggestion(ghostSuggestion, setCurrentInput, setGhostSuggestion);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    handleHistoryNavigation('up', commandHistory, historyIndex, setHistoryIndex, setCurrentInput, setGhostSuggestion);
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    handleHistoryNavigation('down', commandHistory, historyIndex, setHistoryIndex, setCurrentInput, setGhostSuggestion);
  }
};

// Handle input change for ghost suggestion
export const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setCurrentInput: (value: string) => void,
  setGhostSuggestion: (value: string) => void
): void => {
  const newValue = e.target.value;
  setCurrentInput(newValue);
  updateGhostSuggestion(newValue, setGhostSuggestion);
};
