// Terminal component types
export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'suggestion';
  content: string;
  command?: string;
  path?: string; // Store path at time of execution
}

// Strict file system node interface for type safety
export interface FileSystemNode {
  type: 'file' | 'directory';
  content?: string;
  children?: Record<string, FileSystemNode>;
}

export interface FileSystem {
  [key: string]: FileSystemNode;
}

export interface TerminalProps {
  externalCommand?: string;
  currentPath?: PathArray;
  setCurrentPath?: React.Dispatch<React.SetStateAction<PathArray>>;
}

export interface CommandValidation {
  isValid: boolean;
  error?: string;
}

// Standardized result type for all file system operations
export type CommandResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Path representation as array (internal state)
export type PathArray = string[];

// Path string for display (e.g., "~/projects")
export type PathString = string;
