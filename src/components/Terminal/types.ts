// Terminal component types
export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'suggestion';
  content: string;
  command?: string;
  path?: string; // Store path at time of execution
}

export interface FileSystem {
  [key: string]: {
    type: 'file' | 'directory';
    content?: string;
    children?: FileSystem;
  };
}

export interface TerminalProps {
  externalCommand?: string;
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
