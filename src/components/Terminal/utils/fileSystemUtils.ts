import type { FileSystem, CommandResult, PathArray, FileSystemNode } from '../types';
import { resolveRelativePath } from './pathUtils';

/**
 * Type guard to validate if a value is a FileSystemNode
 * @param node - Unknown value to validate
 * @returns True if the value is a valid FileSystemNode
 */
export const isFileSystemNode = (node: unknown): node is FileSystemNode => {
  return typeof node === 'object' && node !== null && 'type' in node;
};

/**
 * Standardized sorting utility for file system items
 * Sorts items with directories first, then files, both alphabetically (A-Z)
 * @param items - Array of item names
 * @param fileSystem - The file system object
 * @returns Sorted array of item names
 */
export const sortItems = (items: string[], fileSystem: FileSystem): string[] => {
  return items.sort((a, b) => {
    const aIsDir = fileSystem[a]?.type === 'directory';
    const bIsDir = fileSystem[b]?.type === 'directory';
    
    // Directories first, then files
    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    
    // Alphabetical order within same type
    return a.localeCompare(b);
  });
};

/**
 * Dynamic path resolver - recursively traverses fileSystem to find target node
 * @param pathString - Path string to resolve (e.g., "projects", "certs/google_it_support.md")
 * @param currentPathArray - Current path array (e.g., ['projects'])
 * @param fileSystem - The file system object
 * @returns CommandResult with node or error
 */
export const resolvePath = (
  pathString: string,
  currentPathArray: PathArray,
  fileSystem: FileSystem
): CommandResult<{ node: FileSystemNode; remainingPath: PathArray }> => {
  
  // 1. Prepare working path array
  let workingPathArray: PathArray;
  const normalizedPath = pathString ? pathString.trim() : '';
  const isAbsolute = normalizedPath.startsWith('~') || normalizedPath.startsWith('/');
  
  if (isAbsolute) {
    workingPathArray = [];
  } else {
    workingPathArray = [...currentPathArray];
  }

  // 2. Handle navigation segments (.. and .)
  const pathSegments = normalizedPath.split('/').filter(Boolean);
  for (const segment of pathSegments) {
    if (segment === '..') {
      if (workingPathArray.length > 0) workingPathArray.pop();
    } else if (segment === '.' || segment === '~') {
      continue;
    } else {
      workingPathArray.push(segment);
    }
  }

  // 3. Start traversal from a Virtual Root to maintain consistent node structure
  let currentNode: FileSystemNode = { type: 'directory', children: fileSystem };

  for (const segment of workingPathArray) {
    // Ensure current node is a directory before moving deeper
    if (currentNode.type !== 'directory' || !currentNode.children) {
       return { success: false, error: `-bash: ${pathString}: Not a directory` };
    }

    const nextNode = currentNode.children?.[segment];
    if (!nextNode) {
      return { success: false, error: `-bash: ${pathString}: No such file or directory` };
    }
    
    // Validate next node type before assignment
    if (!isFileSystemNode(nextNode)) {
      return { success: false, error: `-bash: ${pathString}: Invalid file system node` };
    }
    
    currentNode = nextNode;
  }

  // 4. Return the actual node (which now correctly contains .type and .children)
  return {
    success: true,
    data: { node: currentNode, remainingPath: workingPathArray }
  };
};

/**
 * Get file content with dynamic path resolution
 * @param inputPath - The path to resolve (e.g., "filename.md", "projects/filename.md")
 * @param currentPathArray - Current path array (e.g., ['projects'])
 * @param fileSystem - The file system object
 * @returns CommandResult with file content or error
 */
export const getFileContent = (
  inputPath: string,
  currentPathArray: PathArray,
  fileSystem: FileSystem
): CommandResult<string> => {
  if (!inputPath) {
    return {
      success: false,
      error: 'cat: missing file operand\nTry \'cat --help\' for more information.'
    };
  }

  const result = resolvePath(inputPath, currentPathArray, fileSystem);
  
  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || `-bash: cat: ${inputPath}: No such file or directory`
    };
  }

  const node = result.data.node;
  
  // Validate node type before proceeding
  if (!isFileSystemNode(node)) {
    return {
      success: false,
      error: `-bash: cat: ${inputPath}: Invalid file system node`
    };
  }
  
  // Check if node is a file
  if (node.type !== 'file') {
    return {
      success: false,
      error: `-bash: cat: ${inputPath}: Is a directory`
    };
  }

  return {
    success: true,
    data: node.content || ''
  };
};

/**
 * List directory contents with emoji prefixes using dynamic path resolution
 * @param pathString - Directory path to list (e.g., "projects", "certs")
 * @param currentPathArray - Current path array
 * @param fileSystem - The file system object
 * @returns CommandResult with formatted directory listing or error
 */
export const listDirectory = (
  pathString: string,
  currentPathArray: PathArray,
  fileSystem: FileSystem
): CommandResult<string> => {
  const result = resolvePath(pathString, currentPathArray, fileSystem);
  
  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || `-bash: ls: ${pathString}: No such directory`
    };
  }

  const node = result.data.node;
  
  // Validate node type before proceeding
  if (!isFileSystemNode(node)) {
    return {
      success: false,
      error: `-bash: ${pathString}: Invalid file system node`
    };
  }
  
  // Check if node is a directory
  if (node.type !== 'directory' || !node.children) {
    return {
      success: false,
      error: `-bash: ${pathString}: Not a directory`
    };
  }

  const targetFileSystem = node.children;
  const items = Object.keys(targetFileSystem);
  
  // Sort items using standardized sorting
  const sortedItems = sortItems(items, targetFileSystem);

  return {
    success: true,
    data: sortedItems
      .map(item => {
        const obj = targetFileSystem[item];
        return obj.type === 'directory' ? `📁 ${item}/` : `📄 ${item}`;
      })
      .join('\n')
  };
};

/**
 * Validate and resolve directory change using dynamic path resolution
 * @param target - Target directory path string
 * @param currentPathArray - Current path array
 * @param fileSystem - The file system object
 * @returns CommandResult with new path array or error
 */
export const changeDirectory = (
  target: string,
  currentPathArray: PathArray,
  fileSystem: FileSystem
): CommandResult<PathArray> => {
  // Handle empty target - go to root
  if (!target || target === '') {
    return {
      success: true,
      data: []
    };
  }

  const result = resolvePath(target, currentPathArray, fileSystem);
  
  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || `-bash: cd: ${target}: No such directory`
    };
  }

  const node = result.data.node;
  
  // Validate node type before proceeding
  if (!isFileSystemNode(node)) {
    return {
      success: false,
      error: `-bash: cd: ${target}: Invalid file system node`
    };
  }
  
  // Check if node is a directory
  if (node.type !== 'directory') {
    return {
      success: false,
      error: `-bash: cd: ${target}: Not a directory`
    };
  }

  return {
    success: true,
    data: result.data.remainingPath
  };
};

/**
 * Get directory items (both files and directories) using dynamic path resolution
 * @param pathString - Directory path
 * @param currentPathArray - Current path array
 * @param fileSystem - The file system object
 * @returns CommandResult with array of item names or error
 */
export const getDirectoryContents = (
  pathString: string,
  currentPathArray: PathArray,
  fileSystem: FileSystem
): CommandResult<string[]> => {
  const result = resolvePath(pathString, currentPathArray, fileSystem);
  
  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || `-bash: ${pathString}: No such directory`
    };
  }

  const node = result.data.node;
  
  // Check if node is a directory
  if (node.type !== 'directory' || !node.children) {
    return {
      success: false,
      error: `-bash: ${pathString}: Not a directory`
    };
  }

  const targetFileSystem = node.children as FileSystem;
  
  return {
    success: true,
    data: Object.keys(targetFileSystem)
  };
};

/**
 * Get only directories from a path using dynamic path resolution
 * @param pathString - Directory path
 * @param currentPathArray - Current path array
 * @param fileSystem - The file system object
 * @returns CommandResult with array of directory names or error
 */
export const getDirectories = (
  pathString: string,
  currentPathArray: PathArray,
  fileSystem: FileSystem
): CommandResult<string[]> => {
  const result = resolvePath(pathString, currentPathArray, fileSystem);
  
  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || `-bash: ${pathString}: No such directory`
    };
  }

  const node = result.data.node;
  
  // Check if node is a directory
  if (node.type !== 'directory' || !node.children) {
    return {
      success: false,
      error: `-bash: ${pathString}: Not a directory`
    };
  }

  const targetFileSystem = node.children as FileSystem;
  
  return {
    success: true,
    data: Object.keys(targetFileSystem).filter(key => targetFileSystem[key].type === 'directory')
  };
};

/**
 * Get only files from a path using dynamic path resolution
 * @param pathString - Directory path
 * @param currentPathArray - Current path array
 * @param fileSystem - The file system object
 * @returns CommandResult with array of file names or error
 */
export const getFiles = (
  pathString: string,
  currentPathArray: PathArray,
  fileSystem: FileSystem
): CommandResult<string[]> => {
  const result = resolvePath(pathString, currentPathArray, fileSystem);
  
  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || `-bash: ${pathString}: No such directory`
    };
  }

  const node = result.data.node;
  
  // Check if node is a directory
  if (node.type !== 'directory' || !node.children) {
    return {
      success: false,
      error: `-bash: ${pathString}: Not a directory`
    };
  }

  const targetFileSystem = node.children as FileSystem;
  
  return {
    success: true,
    data: Object.keys(targetFileSystem).filter(key => targetFileSystem[key].type === 'file')
  };
};

/**
 * Resolve a partial path to a complete path using dynamic resolution
 * Supports paths like "certs/go" -> "certs/google_it_support.md"
 * @param inputPath - Partial or complete path
 * @param currentPathArray - Current path array
 * @param fileSystem - The file system object
 * @returns Array of possible completions
 */
export const resolvePathCompletions = (
  inputPath: string,
  currentPathArray: PathArray,
  fileSystem: FileSystem
): string[] => {
  const completions: string[] = [];

  // If no slash, complete from current directory
  if (!inputPath.includes('/')) {
    const result = resolvePath('', currentPathArray, fileSystem);
    if (result.success && result.data) {
      const node = result.data.node;
      if (isFileSystemNode(node) && node.type === 'directory' && node.children) {
        const targetFileSystem = node.children;
        Object.keys(targetFileSystem).forEach(key => {
          if (key.startsWith(inputPath)) {
            completions.push(key);
          }
        });
      }
    }
  } else {
    // Split path into directory and partial
    const parts = inputPath.split('/');
    const dirPath = parts[0];
    const partial = parts.slice(1).join('/');

    // Resolve directory part
    const dirResult = resolvePath(dirPath, currentPathArray, fileSystem);
    if (dirResult.success && dirResult.data) {
      const node = dirResult.data.node;
      if (isFileSystemNode(node) && node.type === 'directory' && node.children) {
        const targetFileSystem = node.children;
        Object.keys(targetFileSystem).forEach(key => {
          if (key.startsWith(partial)) {
            completions.push(`${dirPath}/${key}`);
          }
        });
      }
    }
  }

  return completions;
};
