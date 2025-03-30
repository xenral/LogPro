import { LogEntry, LogLevel } from './types';

/**
 * ANSI color codes for terminal output
 */
const colors = {
  reset: '\x1b[0m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

/**
 * Map of log levels to colors
 */
const levelColors: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: colors.gray,
  [LogLevel.INFO]: colors.green,
  [LogLevel.WARN]: colors.yellow,
  [LogLevel.ERROR]: colors.red,
  [LogLevel.FATAL]: colors.magenta,
  [LogLevel.SILENT]: colors.reset
};

/**
 * Format a log entry as JSON
 */
export function jsonFormatter(entry: LogEntry): string {
  // Create a new object with all properties
  const logObject: Record<string, any> = {
    timestamp: entry.timestamp,
    level: entry.level,
    message: entry.message
  };

  // Add context if present
  if (entry.context && Object.keys(entry.context).length > 0) {
    Object.assign(logObject, entry.context);
  }

  // Add error details if present
  if (entry.error) {
    logObject.error = {
      name: entry.error.name,
      message: entry.error.message,
      stack: entry.error.stack
    };
  }

  return JSON.stringify(logObject);
}

/**
 * Format a log entry as pretty text (with optional colors)
 */
export function prettyFormatter(entry: LogEntry, useColors = false): string {
  let levelDisplay = `[${entry.level.toUpperCase()}]`;
  
  if (useColors) {
    const color = levelColors[entry.level] || colors.reset;
    levelDisplay = `${color}${levelDisplay}${colors.reset}`;
  }
  
  // Format the basic log message
  let output = `${entry.timestamp} ${levelDisplay} ${entry.message}`;
  
  // Add context if present
  if (entry.context && Object.keys(entry.context).length > 0) {
    output += ` ${JSON.stringify(entry.context)}`;
  }
  
  // Add error details if present
  if (entry.error) {
    output += `\n${entry.error.stack || entry.error.message}`;
  }
  
  return output;
} 