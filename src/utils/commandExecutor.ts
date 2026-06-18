// Shared command execution utility for typing into terminal input field

export type CommandExecutorCallback = (command: string) => void;

let commandExecutorCallback: CommandExecutorCallback | null = null;

/**
 * Register a callback function that will handle command execution
 * This should be called by the Terminal component to expose its execution capability
 */
export const registerCommandExecutor = (callback: CommandExecutorCallback) => {
  commandExecutorCallback = callback;
};

/**
 * Execute a command by typing it into the terminal input field
 * This simulates character-by-character typing and auto-submits
 */
export const executeCommand = async (command: string) => {
  if (!commandExecutorCallback) {
    console.error('Command executor not registered');
    return;
  }

  commandExecutorCallback(command);
};

/**
 * Check if command executor is registered
 */
export const isCommandExecutorRegistered = () => {
  return commandExecutorCallback !== null;
};
