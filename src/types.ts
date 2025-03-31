/**
 * Log levels supported by the logger
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
  SILENT = 'silent'
}

/**
 * Numeric values for each log level (lower is more verbose)
 */
export const LogLevelValue: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.FATAL]: 4,
  [LogLevel.SILENT]: 5
};

/**
 * Interface for a log entry
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error | null;
}

/**
 * Type for log formatter function
 */
export type LogFormatter = (entry: LogEntry) => string;

/**
 * Transport interface for sending logs to different destinations
 */
export interface LogTransport {
  /**
   * Process a log entry
   */
  log(entry: LogEntry): void;

  /**
   * Optional filter function to determine if this transport
   * should process a particular log entry
   */
  filter?(entry: LogEntry): boolean;
}

/**
 * Telegram transport options
 */
export interface TelegramTransportOptions {
  /**
   * Telegram Bot API token
   */
  token: string;

  /**
   * Chat ID to send messages to
   */
  chatId: string;

  /**
   * Minimum log level to send to Telegram
   */
  minLevel?: LogLevel;

  /**
   * Optional filter function
   */
  filter?: (entry: LogEntry) => boolean;
  
  /**
   * Optional formatter function
   */
  formatter?: LogFormatter;
}

/**
 * Configuration options for the logger
 */
export interface LoggerOptions {
  /**
   * Minimum log level to output
   */
  minLevel?: LogLevel;
  
  /**
   * Custom formatter function
   */
  formatter?: LogFormatter;
  
  /**
   * Global context to include with all logs
   */
  context?: Record<string, any>;
  
  /**
   * Enable/disable color output
   */
  enableColors?: boolean;

  /**
   * Array of log transports
   */
  transports?: LogTransport[];
} 