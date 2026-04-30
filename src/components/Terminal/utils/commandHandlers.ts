import type { FileSystem, CommandValidation } from '../types';
import { COMMAND_RESPONSES } from '../data/responses';
import { validateArgs } from './validators';
import { getFileContent, listDirectory, changeDirectory, getDirectoryContents, sortItems } from './fileSystemUtils';

// Command handlers
export const handleWhoisCommand = (args: string[]): string => {
  const validation = validateArgs(args);
  if (!validation.isValid) {
    return COMMAND_RESPONSES.whois.missingArgs;
  }
  
  const domain = args[0];
  if (domain === 'ronnakrit' || domain === 'ronnakrit.net') {
    return COMMAND_RESPONSES.whois.ronnakrit;
  }
  
  return COMMAND_RESPONSES.whois.notFound(domain);
};

export const handleSudoCommand = (args: string[]): string => {
  if (args.length === 0) {
    return COMMAND_RESPONSES.sudo.missingArgs;
  }
  
  return COMMAND_RESPONSES.sudo.accessDenied(args.join(' '));
};

export const handleCatCommand = (args: string[], currentPath: string, fileSystem: FileSystem): string => {
  const validation = validateArgs(args);
  if (!validation.isValid) {
    return 'cat: missing file operand\nTry \'cat --help\' for more information.';
  }
  
  const filename = args[0];
  return getFileContent(filename, currentPath, fileSystem);
};

export const handleLsCommand = (currentPath: string, fileSystem: FileSystem): string => {
  return listDirectory(currentPath, fileSystem);
};

export const handleCdCommand = (args: string[], setCurrentPath: React.Dispatch<React.SetStateAction<string>>, fileSystem: FileSystem): string => {
  const target = args[0];
  const result = changeDirectory(target, '', fileSystem);
  
  if (result.error) {
    return result.error;
  }
  
  setCurrentPath(result.path);
  return '';
};

/**
 * Recursive function to generate ASCII tree structure
 * @param items - Array of item names
 * @param fileSystem - The file system object
 * @param prefix - Current prefix for tree lines
 * @param parentPrefixes - Array of booleans indicating which parent levels need vertical lines
 * @returns Formatted tree string
 */
const generateTree = (
  items: string[],
  fileSystem: FileSystem,
  prefix: string = '',
  parentPrefixes: boolean[] = []
): string => {
  let result = '';
  
  items.forEach((item, index) => {
    const isLastItem = index === items.length - 1;
    const connector = isLastItem ? '└── ' : '├── ';
    
    const obj = fileSystem[item];
    const icon = obj?.type === 'directory' ? '📁' : '📄';
    const suffix = obj?.type === 'directory' ? '/' : '';
    
    result += `${prefix}${connector}${icon} ${item}${suffix}\n`;
    
    // If directory, recursively add children
    if (obj?.type === 'directory' && obj.children) {
      const children = Object.keys(obj.children);
      // Build the new prefix for children
      const newParentPrefixes = [...parentPrefixes, !isLastItem];
      const newPrefix = newParentPrefixes
        .map(shouldContinue => shouldContinue ? '│   ' : '    ')
        .join('');
      
      result += generateTree(children, obj.children, newPrefix, newParentPrefixes);
    }
  });
  
  return result;
};

export const handleTreeCommand = (currentPath: string, fileSystem: FileSystem): string => {
  let targetPath = currentPath;
  let targetFileSystem = fileSystem;
  
  // Resolve the target file system based on current path
  if (currentPath === 'projects' && fileSystem['projects']?.children) {
    targetFileSystem = fileSystem['projects'].children;
    targetPath = 'projects';
  } else if (currentPath === 'certs' && fileSystem['certs']?.children) {
    targetFileSystem = fileSystem['certs'].children;
    targetPath = 'certs';
  } else {
    targetFileSystem = fileSystem;
    targetPath = '~';
  }
  
  const items = Object.keys(targetFileSystem);
  
  if (items.length === 0) {
    return 'Directory is empty.';
  }
  
  // Sort items using standardized sorting utility
  const sortedItems = sortItems(items, targetFileSystem);
  
  const tree = generateTree(sortedItems, targetFileSystem);
  
  return `${targetPath}/\n${tree}`;
};
