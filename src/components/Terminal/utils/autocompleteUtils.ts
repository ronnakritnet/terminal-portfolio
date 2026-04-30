import type { FileSystem } from '../types';
import { COMMANDS_DESC } from '../data/commands';
import { getDirectories, getFiles, resolvePathCompletions } from './fileSystemUtils';

/**
 * Get global command completions
 * @param input - Current input
 * @returns Array of matching command names
 */
export const getCommandCompletions = (input: string): string[] => {
  const availableCommands = Object.keys(COMMANDS_DESC);
  const lowerInput = input.toLowerCase();
  
  return availableCommands.filter(cmd => 
    cmd.startsWith(lowerInput) && cmd !== lowerInput
  );
};

/**
 * Parse command context from input
 * @param input - Current input string
 * @returns Object with command type and remaining input
 */
export const parseCommandContext = (input: string): { command: string | null; remaining: string } => {
  const trimmedInput = input.trim();
  
  if (!trimmedInput) {
    return { command: null, remaining: '' };
  }
  
  const parts = trimmedInput.split(' ');
  const command = parts[0];
  const remaining = parts.slice(1).join(' ');
  
  return { command, remaining };
};

/**
 * Get context-aware completions based on command
 * @param input - Current input string
 * @param currentPath - Current directory path
 * @param fileSystem - The file system object
 * @returns Array of completion suggestions
 */
export const getContextualCompletions = (
  input: string,
  currentPath: string,
  fileSystem: FileSystem
): string[] => {
  const { command, remaining } = parseCommandContext(input);
  
  // If no command yet, suggest global commands
  if (!command) {
    return getCommandCompletions(input);
  }
  
  // If command is complete and we have remaining input, provide path completions
  if (remaining) {
    // Check if remaining input contains a path separator
    if (remaining.includes('/')) {
      // Partial path completion (e.g., "cat certs/go")
      const pathCompletions = resolvePathCompletions(remaining, fileSystem);
      return pathCompletions.map(completion => `${command} ${completion}`);
    } else {
      // Simple filename/directory completion in current path
      if (command === 'cd') {
        const dirs = getDirectories(currentPath, fileSystem);
        const matches = dirs.filter(dir => dir.startsWith(remaining));
        return matches.map(match => `${command} ${match}`);
      } else if (command === 'cat') {
        const files = getFiles(currentPath, fileSystem);
        const matches = files.filter(file => file.startsWith(remaining));
        return matches.map(match => `${command} ${match}`);
      }
    }
  }
  
  // If command is cd, suggest directories from both current path and root
  if (command === 'cd') {
    const currentDirs = getDirectories(currentPath, fileSystem);
    const rootDirs = getDirectories('~', fileSystem);
    const allDirs = [...new Set([...currentDirs, ...rootDirs])];
    
    if (remaining) {
      const matches = allDirs.filter(dir => dir.startsWith(remaining));
      return matches.map(match => `${command} ${match}`);
    }
    
    return allDirs.map(dir => `${command} ${dir}`);
  }
  
  // If command is cat, suggest files from both current path and root
  if (command === 'cat') {
    const currentFiles = getFiles(currentPath, fileSystem);
    const rootFiles = getFiles('~', fileSystem);
    const allFiles = [...new Set([...currentFiles, ...rootFiles])];
    
    if (remaining) {
      const matches = allFiles.filter(file => file.startsWith(remaining));
      return matches.map(match => `${command} ${match}`);
    }
    
    return allFiles.map(file => `${command} ${file}`);
  }
  
  // For other commands, return global command completions
  return getCommandCompletions(command);
};

/**
 * Get the first matching completion for ghost suggestion
 * @param input - Current input string
 * @param currentPath - Current directory path
 * @param fileSystem - The file system object
 * @returns First matching completion or empty string
 */
export const getFirstContextualMatch = (
  input: string,
  currentPath: string,
  fileSystem: FileSystem
): string => {
  const completions = getContextualCompletions(input, currentPath, fileSystem);
  return completions[0] || '';
};
