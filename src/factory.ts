import { Logger } from './logger';
import { LoggerOptions, LogLevel } from './types';

// Store for singleton loggers by name
const loggers: Record<string, Logger> = {};

/**
 * Get or create a logger instance by name
 */
export function getLogger(name?: string, options?: LoggerOptions): Logger {
  const loggerName = name || 'default';
  
  if (!loggers[loggerName]) {
    // Create a new logger
    const logger = new Logger(options);
    
    // Add name to context if provided
    if (name) {
      return logger.child({ loggerName: name });
    }
    
    loggers[loggerName] = logger;
  }
  
  return loggers[loggerName];
}

/**
 * Set the minimum log level for all loggers
 */
export function setGlobalLevel(level: LogLevel): void {
  Object.values(loggers).forEach(logger => {
    logger.setLevel(level);
  });
}

/**
 * Create environment-aware logger
 */
export function createEnvLogger(
  name?: string, 
  options?: LoggerOptions
): Logger {
  const logger = getLogger(name, options);
  
  // Configure based on NODE_ENV
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    // In production, use JSON format and restrict to info and above
    logger.useJsonFormat().setLevel(LogLevel.INFO);
  } else if (env === 'test') {
    // In test, use minimal output and restrict to warn and above
    logger.setLevel(LogLevel.WARN);
  } else {
    // In development, use pretty format with colors
    logger.usePrettyFormat(true).setLevel(LogLevel.DEBUG);
  }
  
  return logger;
} 