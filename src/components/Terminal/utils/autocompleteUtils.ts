import type { FileSystem, PathArray } from '../types';
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
 * @param currentPathArray - Current directory path array
 * @param fileSystem - The file system object
 * @returns Array of completion suggestions
 */
export const getContextualCompletions = (
  input: string,
  currentPathArray: PathArray,
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
      const pathCompletions = resolvePathCompletions(remaining, currentPathArray, fileSystem);
      return pathCompletions.map(completion => `${command} ${completion}`);
    } else {
      // Simple filename/directory completion in current path
      if (command === 'cd') {
        const dirsResult = getDirectories('', currentPathArray, fileSystem);
        if (dirsResult.success && dirsResult.data) {
          const matches = dirsResult.data.filter((dir: string) => dir.startsWith(remaining));
          return matches.map((match: string) => `${command} ${match}`);
        }
      } else if (command === 'cat') {
        const filesResult = getFiles('', currentPathArray, fileSystem);
        if (filesResult.success && filesResult.data) {
          const matches = filesResult.data.filter((file: string) => file.startsWith(remaining));
          return matches.map((match: string) => `${command} ${match}`);
        }
      }
    }
  }
  
  // If command is cd, suggest directories from both current path and root
  if (command === 'cd') {
    const currentDirsResult = getDirectories('', currentPathArray, fileSystem);
    const rootDirsResult = getDirectories('', [], fileSystem);
    
    const currentDirs = currentDirsResult.success && currentDirsResult.data ? currentDirsResult.data : [];
    const rootDirs = rootDirsResult.success && rootDirsResult.data ? rootDirsResult.data : [];
    const allDirs = [...new Set([...currentDirs, ...rootDirs])];
    
    if (remaining) {
      const matches = allDirs.filter((dir: string) => dir.startsWith(remaining));
      return matches.map((match: string) => `${command} ${match}`);
    }
    
    return allDirs.map((dir: string) => `${command} ${dir}`);
  }
  
  // If command is cat, suggest files from both current path and root
  if (command === 'cat') {
    const currentFilesResult = getFiles('', currentPathArray, fileSystem);
    const rootFilesResult = getFiles('', [], fileSystem);
    
    const currentFiles = currentFilesResult.success && currentFilesResult.data ? currentFilesResult.data : [];
    const rootFiles = rootFilesResult.success && rootFilesResult.data ? rootFilesResult.data : [];
    const allFiles = [...new Set([...currentFiles, ...rootFiles])];
    
    if (remaining) {
      const matches = allFiles.filter((file: string) => file.startsWith(remaining));
      return matches.map((match: string) => `${command} ${match}`);
    }
    
    return allFiles.map((file: string) => `${command} ${file}`);
  }
  
  // For other commands, return global command completions
  return getCommandCompletions(command);
};

/**
 * Get the first matching completion for ghost suggestion
 * @param input - Current input string
 * @param currentPathArray - Current directory path array
 * @param fileSystem - The file system object
 * @returns First matching completion or empty string
 */
export const getFirstContextualMatch = (
  input: string,
  currentPathArray: PathArray,
  fileSystem: FileSystem
): string => {
  const completions = getContextualCompletions(input, currentPathArray, fileSystem);
  return completions[0] || '';
};
