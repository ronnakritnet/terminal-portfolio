import type { CommandValidation } from '../types';

// Helper functions for command validation
export const validateArgs = (args: string[], required: number = 1): CommandValidation => {
  if (args.length < required) {
    return { isValid: false, error: 'missing operand' };
  }
  return { isValid: true };
};
