import React from 'react';
import { COMMANDS_DESC } from '../data/commands';
import { getFirstContextualMatch, getContextualCompletions } from './autocompleteUtils';
import type { FileSystem } from '../types';

// Get first matching command (same logic as ghost suggestion)
export const getFirstMatch = (currentInput: string): string => {
  if (!currentInput) return '';
  
  const availableCommands = Object.keys(COMMANDS_DESC);
  return availableCommands.find(cmd => 
    cmd.startsWith(currentInput.toLowerCase()) && cmd !== currentInput.toLowerCase()
  ) || '';
};

// Ghost suggestion logic with context awareness
export const updateGhostSuggestion = (
  currentInput: string,
  currentPath: string,
  fileSystem: FileSystem,
  setGhostSuggestion: (value: string) => void
): void => {
  const match = getFirstContextualMatch(currentInput, currentPath, fileSystem);
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

// Tab completion logic with context awareness
export const handleTabCompletion = (
  currentInput: string,
  currentPath: string,
  fileSystem: FileSystem,
  setCurrentInput: (value: string) => void,
  setSuggestions: (suggestions: string[]) => void,
  setGhostSuggestion: (value: string) => void
): void => {
  // Get contextual completions
  const completions = getContextualCompletions(currentInput, currentPath, fileSystem);
  
  // If only one match, complete immediately
  if (completions.length === 1) {
    setCurrentInput(completions[0]);
    setGhostSuggestion('');
    return;
  }
  
  // If multiple matches, show them
  if (completions.length > 1) {
    // Extract just the completion part (without command prefix)
    const { command, remaining } = parseCommandContext(currentInput);
    const simpleMatches = completions.map(c => {
      if (command) {
        return c.replace(`${command} `, '');
      }
      return c;
    });
    
    setSuggestions(simpleMatches);
    setTimeout(() => setSuggestions([]), 2000);
  }
};

// Parse command context from input
const parseCommandContext = (input: string): { command: string | null; remaining: string } => {
  const trimmedInput = input.trim();
  
  if (!trimmedInput) {
    return { command: null, remaining: '' };
  }
  
  const parts = trimmedInput.split(' ');
  const command = parts[0];
  const remaining = parts.slice(1).join(' ');
  
  return { command, remaining };
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
  currentPath: string,
  fileSystem: FileSystem,
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
    handleTabCompletion(currentInput, currentPath, fileSystem, setCurrentInput, setSuggestions, setGhostSuggestion);
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
  currentPath: string,
  fileSystem: FileSystem,
  setCurrentInput: (value: string) => void,
  setGhostSuggestion: (value: string) => void
): void => {
  const newValue = e.target.value;
  setCurrentInput(newValue);
  updateGhostSuggestion(newValue, currentPath, fileSystem, setGhostSuggestion);
};
