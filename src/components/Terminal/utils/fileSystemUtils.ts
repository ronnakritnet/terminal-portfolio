import type { FileSystem } from '../types';

/**
 * Standardized sorting utility for file system items
 * Sorts items with directories first, then files, both alphabetically (A-Z)
 * @param items - Array of item names
 * @param fileSystem - The file system object
 * @returns Sorted array of item names
 */
export const sortItems = (items: string[], fileSystem: FileSystem): string[] => {
  return items.sort((a, b) => {
    const aIsDir = fileSystem[a].type === 'directory';
    const bIsDir = fileSystem[b].type === 'directory';
    
    // Directories first, then files
    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    
    // Alphabetical order within same type
    return a.localeCompare(b);
  });
};

/**
 * Get file content with path parsing support
 * Supports both relative paths (from current directory) and absolute paths (from root)
 * @param inputPath - The path to resolve (e.g., "filename.md", "projects/filename.md")
 * @param currentPath - Current directory path (e.g., "~", "projects", "certs")
 * @param fileSystem - The file system object
 * @returns File content string or error message
 */
export const getFileContent = (
  inputPath: string,
  currentPath: string,
  fileSystem: FileSystem
): string => {
  if (!inputPath) return 'cat: missing file operand\nTry \'cat --help\' for more information.';

  let fileContent = '';

  // Handle path parsing (e.g., projects/filename.md or certs/filename.md)
  if (inputPath.includes('/')) {
    const [directory, file] = inputPath.split('/');
    if (directory === 'projects' && fileSystem['projects']?.children) {
      if (fileSystem['projects'].children[file]) {
        fileContent = fileSystem['projects'].children[file].content || '';
      } else {
        return `-bash: cat: ${inputPath}: No such file or directory`;
      }
    } else if (directory === 'certs' && fileSystem['certs']?.children) {
      if (fileSystem['certs'].children[file]) {
        fileContent = fileSystem['certs'].children[file].content || '';
      } else {
        return `-bash: cat: ${inputPath}: No such file or directory`;
      }
    } else {
      return `-bash: cat: ${inputPath}: No such file or directory`;
    }
  } else {
    // Logic for current directory files
    if (currentPath === '~' && fileSystem[inputPath]) {
      fileContent = fileSystem[inputPath].content || '';
    } else if (currentPath === 'projects' && fileSystem['projects']?.children) {
      if (fileSystem['projects'].children[inputPath]) {
        fileContent = fileSystem['projects'].children[inputPath].content || '';
      } else {
        return `-bash: cat: ${inputPath}: No such file or directory`;
      }
    } else if (currentPath === 'certs' && fileSystem['certs']?.children) {
      if (fileSystem['certs'].children[inputPath]) {
        fileContent = fileSystem['certs'].children[inputPath].content || '';
      } else {
        return `-bash: cat: ${inputPath}: No such file or directory`;
      }
    }
  }

  if (fileContent) {
    return fileContent;
  } else {
    return `-bash: cat: ${inputPath}: No such file or directory`;
  }
};

/**
 * List directory contents with emoji prefixes
 * @param path - Directory path to list
 * @param fileSystem - The file system object
 * @returns Formatted directory listing string
 */
export const listDirectory = (path: string, fileSystem: FileSystem): string => {
  let items: string[] = [];
  let targetFileSystem: FileSystem;

  if (path === '~') {
    items = Object.keys(fileSystem);
    targetFileSystem = fileSystem;
  } else if (path === 'projects' && fileSystem['projects']?.children) {
    items = Object.keys(fileSystem['projects'].children);
    targetFileSystem = fileSystem['projects'].children;
  } else if (path === 'certs' && fileSystem['certs']?.children) {
    items = Object.keys(fileSystem['certs'].children);
    targetFileSystem = fileSystem['certs'].children;
  } else {
    return 'Directory is empty.';
  }

  // Sort items using standardized sorting
  const sortedItems = sortItems(items, targetFileSystem);

  return sortedItems
    .map(item => {
      const obj = targetFileSystem[item];
      return obj.type === 'directory' ? `📁 ${item}/` : `📄 ${item}`;
    })
    .join('\n');
};

/**
 * Validate and resolve directory change
 * @param target - Target directory
 * @param currentPath - Current directory path
 * @param fileSystem - The file system object
 * @returns Valid path or error message
 */
export const changeDirectory = (
  target: string,
  currentPath: string,
  fileSystem: FileSystem
): { path: string; error?: string } => {
  if (!target) {
    return { path: '~' };
  }

  if (target === 'projects' && fileSystem['projects']) {
    return { path: 'projects' };
  } else if (target === 'certs' && fileSystem['certs']) {
    return { path: 'certs' };
  } else if (target === '..') {
    return { path: '~' };
  }

  return { path: currentPath, error: `-bash: cd: ${target}: No such directory` };
};

/**
 * Get directory items (both files and directories)
 * @param path - Directory path
 * @param fileSystem - The file system object
 * @returns Array of directory item names
 */
export const getDirectoryContents = (path: string, fileSystem: FileSystem): string[] => {
  if (path === '~') {
    return Object.keys(fileSystem);
  } else if (path === 'projects' && fileSystem['projects']?.children) {
    return Object.keys(fileSystem['projects'].children);
  } else if (path === 'certs' && fileSystem['certs']?.children) {
    return Object.keys(fileSystem['certs'].children);
  }
  return [];
};

/**
 * Get only directories from a path
 * @param path - Directory path
 * @param fileSystem - The file system object
 * @returns Array of directory names
 */
export const getDirectories = (path: string, fileSystem: FileSystem): string[] => {
  if (path === '~') {
    return Object.keys(fileSystem).filter(key => fileSystem[key].type === 'directory');
  } else if (path === 'projects' && fileSystem['projects']?.children) {
    return Object.keys(fileSystem['projects'].children).filter(
      key => fileSystem['projects']!.children![key].type === 'directory'
    );
  } else if (path === 'certs' && fileSystem['certs']?.children) {
    return Object.keys(fileSystem['certs'].children).filter(
      key => fileSystem['certs']!.children![key].type === 'directory'
    );
  }
  return [];
};

/**
 * Get only files from a path
 * @param path - Directory path
 * @param fileSystem - The file system object
 * @returns Array of file names
 */
export const getFiles = (path: string, fileSystem: FileSystem): string[] => {
  if (path === '~') {
    return Object.keys(fileSystem).filter(key => fileSystem[key].type === 'file');
  } else if (path === 'projects' && fileSystem['projects']?.children) {
    return Object.keys(fileSystem['projects'].children).filter(
      key => fileSystem['projects']!.children![key].type === 'file'
    );
  } else if (path === 'certs' && fileSystem['certs']?.children) {
    return Object.keys(fileSystem['certs'].children).filter(
      key => fileSystem['certs']!.children![key].type === 'file'
    );
  }
  return [];
};

/**
 * Resolve a partial path to a complete path
 * Supports paths like "certs/go" -> "certs/google_it_support.md"
 * @param inputPath - Partial or complete path
 * @param fileSystem - The file system object
 * @returns Array of possible completions
 */
export const resolvePathCompletions = (inputPath: string, fileSystem: FileSystem): string[] => {
  const completions: string[] = [];

  // If no slash, complete from root
  if (!inputPath.includes('/')) {
    Object.keys(fileSystem).forEach(key => {
      if (key.startsWith(inputPath)) {
        completions.push(key);
      }
    });
  } else {
    // Split path into directory and partial
    const parts = inputPath.split('/');
    const dirPath = parts[0];
    const partial = parts.slice(1).join('/');

    // Check if directory exists
    if (fileSystem[dirPath] && fileSystem[dirPath].type === 'directory' && fileSystem[dirPath].children) {
      Object.keys(fileSystem[dirPath].children).forEach(key => {
        if (key.startsWith(partial)) {
          completions.push(`${dirPath}/${key}`);
        }
      });
    }
  }

  return completions;
};
