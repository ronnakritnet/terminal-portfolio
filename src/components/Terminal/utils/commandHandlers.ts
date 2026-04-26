import type { FileSystem, CommandValidation } from '../types';
import { COMMAND_RESPONSES } from '../data/responses';
import { validateArgs } from './validators';

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
  let fileContent = '';
  
  // Handle path parsing (e.g., projects/filename.md or certs/filename.md)
  if (filename.includes('/')) {
    const [directory, file] = filename.split('/');
    if (directory === 'projects' && fileSystem['projects']?.children) {
      if (fileSystem['projects'].children[file]) {
        fileContent = fileSystem['projects'].children[file].content || '';
      } else {
        return `-bash: cat: ${filename}: No such file or directory`;
      }
    } else if (directory === 'certs' && fileSystem['certs']?.children) {
      if (fileSystem['certs'].children[file]) {
        fileContent = fileSystem['certs'].children[file].content || '';
      } else {
        return `-bash: cat: ${filename}: No such file or directory`;
      }
    } else {
      return `-bash: cat: ${filename}: No such file or directory`;
    }
  } else {
    // Existing logic for current directory files
    if (currentPath === '~' && fileSystem[filename]) {
      fileContent = fileSystem[filename].content || '';
    } else if (currentPath === 'projects' && fileSystem['projects']?.children) {
      if (fileSystem['projects'].children[filename]) {
        fileContent = fileSystem['projects'].children[filename].content || '';
      } else {
        return `-bash: cat: ${filename}: No such file or directory`;
      }
    } else if (currentPath === 'certs' && fileSystem['certs']?.children) {
      if (fileSystem['certs'].children[filename]) {
        fileContent = fileSystem['certs'].children[filename].content || '';
      } else {
        return `-bash: cat: ${filename}: No such file or directory`;
      }
    }
  }

  if (fileContent) {
    return fileContent;
  } else {
    return `-bash: cat: ${filename}: No such file or directory`;
  }
};

export const handleLsCommand = (currentPath: string, fileSystem: FileSystem): string => {
  if (currentPath === '~') {
    return Object.keys(fileSystem)
      .map(item => {
        const obj = fileSystem[item];
        return obj.type === 'directory' ? `📁 ${item}/` : `📄 ${item}`;
      })
      .join('\n');
  } else if (currentPath === 'projects' && fileSystem['projects']?.children) {
    return Object.keys(fileSystem['projects'].children)
      .map(item => {
        const obj = fileSystem['projects'].children![item];
        return obj.type === 'directory' ? `📁 ${item}/` : `📄 ${item}`;
      })
      .join('\n');
  } else if (currentPath === 'certs' && fileSystem['certs']?.children) {
    return Object.keys(fileSystem['certs'].children)
      .map(item => {
        const obj = fileSystem['certs'].children![item];
        return obj.type === 'directory' ? `📁 ${item}/` : `📄 ${item}`;
      })
      .join('\n');
  }
  
  return 'Directory is empty.';
};

export const handleCdCommand = (args: string[], setCurrentPath: React.Dispatch<React.SetStateAction<string>>, fileSystem: FileSystem): string => {
  if (args.length === 0) {
    setCurrentPath('~');
    return '';
  }
  
  const target = args[0];
  if (target === 'projects' && fileSystem['projects']) {
    setCurrentPath('projects');
    return '';
  } else if (target === 'certs' && fileSystem['certs']) {
    setCurrentPath('certs');
    return '';
  } else if (target === '..') {
    setCurrentPath('~');
    return '';
  }
  
  return `-bash: cd: ${target}: No such directory`;
};
