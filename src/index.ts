export * from './types';
export * from './logger';
export * from './formatters';
export * from './factory';
export * from './transports';

// Re-export commonly used functions for convenience
import { getLogger, createEnvLogger } from './factory';
import { LogLevel } from './types';

// Export default instance
export const logger = createEnvLogger();

// Export convenient factory
export default {
  getLogger,
  createEnvLogger,
  LogLevel
}; 