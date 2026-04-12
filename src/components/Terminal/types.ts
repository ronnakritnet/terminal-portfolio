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
