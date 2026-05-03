import type { PathArray, PathString } from '../types';

/**
 * Convert path array to display string
 * @param pathArray - Path array (e.g., ['projects'])
 * @returns Display string (e.g., "~/projects")
 */
export const pathArrayToString = (pathArray: PathArray): PathString => {
  if (pathArray.length === 0) {
    return '~';
  }
  return `~/${pathArray.join('/')}`;
};

/**
 * Parse path string to array
 * @param pathString - Path string (e.g., "~/projects" or "projects")
 * @returns Path array (e.g., ['projects'])
 */
export const pathStringToArray = (pathString: PathString): PathArray => {
  const normalized = normalizePath(pathString);
  
  if (normalized === '~' || normalized === '') {
    return [];
  }
  
  // Remove leading ~ if present
  const withoutTilde = normalized.replace(/^~\//, '');
  
  if (withoutTilde === '') {
    return [];
  }
  
  return withoutTilde.split('/').filter(Boolean);
};

/**
 * Normalize path string
 * Handles ~, leading/trailing slashes
 * @param pathString - Raw path string
 * @returns Normalized path string
 */
export const normalizePath = (pathString: PathString): PathString => {
  let normalized = pathString.trim();
  
  // Replace ~ with ~/ for consistency
  if (normalized === '~') {
    return '~';
  }
  
  // Handle leading ~
  if (normalized.startsWith('~/')) {
    normalized = normalized.substring(2);
  } else if (normalized === '~') {
    normalized = '';
  }
  
  // Remove leading slashes
  normalized = normalized.replace(/^\/+/, '');
  
  // Remove trailing slashes
  normalized = normalized.replace(/\/+$/, '');
  
  // If empty, return ~ (root)
  if (normalized === '') {
    return '~';
  }
  
  return `~/${normalized}`;
};

/**
 * Join base path with relative segment
 * @param base - Base path array
 * @param relative - Relative path segment
 * @returns Combined path array
 */
export const joinPath = (base: PathArray, relative: string): PathArray => {
  // Filter out empty strings to prevent empty segment lookups
  const segments = relative.split('/').filter(Boolean);
  
  let result = [...base];
  
  for (const segment of segments) {
    if (segment === '..') {
      // Go up one level
      if (result.length > 0) {
        result.pop();
      }
    } else if (segment === '.') {
      // Current directory, do nothing
      continue;
    } else {
      // Add segment
      result.push(segment);
    }
  }
  
  return result;
};

/**
 * Resolve a path relative to a base path
 * @param pathString - Path string to resolve
 * @param basePath - Base path array
 * @returns Resolved path array
 */
export const resolveRelativePath = (pathString: PathString, basePath: PathArray): PathArray => {
  const normalized = normalizePath(pathString);
  
  // Handle ~ as absolute root
  if (normalized === '~') {
    return [];
  }
  
  // Remove leading ~/
  const withoutTilde = normalized.replace(/^~\//, '');
  
  // If empty after removing ~/, return root
  if (withoutTilde === '') {
    return [];
  }
  
  return joinPath(basePath, withoutTilde);
};
