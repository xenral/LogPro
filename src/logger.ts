import { LogEntry, LogFormatter, LogLevel, LogLevelValue, LoggerOptions } from './types';
import { jsonFormatter, prettyFormatter } from './formatters';

/**
 * Default logger options
 */
const DEFAULT_OPTIONS: LoggerOptions = {
  minLevel: LogLevel.INFO,
  formatter: jsonFormatter,
  context: {},
  enableColors: false
};

/**
 * Core logger class
 */
export class Logger {
  private options: Required<LoggerOptions>;

  /**
   * Create a new logger instance
   */
  constructor(options: LoggerOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options } as Required<LoggerOptions>;
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Record<string, any>): Logger {
    return new Logger({
      ...this.options,
      context: {
        ...this.options.context,
        ...context
      }
    });
  }

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): Logger {
    this.options.minLevel = level;
    return this;
  }

  /**
   * Set the formatter
   */
  setFormatter(formatter: LogFormatter): Logger {
    this.options.formatter = formatter;
    return this;
  }

  /**
   * Set to use JSON formatter
   */
  useJsonFormat(): Logger {
    return this.setFormatter(jsonFormatter);
  }

  /**
   * Set to use pretty formatter
   */
  usePrettyFormat(enableColors: boolean = true): Logger {
    return this.setFormatter((entry) => prettyFormatter(entry, enableColors));
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, contextOrError?: Record<string, any> | Error, error?: Error): void {
    // Skip logging if level is lower than minimum
    if (LogLevelValue[level] < LogLevelValue[this.options.minLevel]) {
      return;
    }

    let context: Record<string, any> = {};
    let errorObj: Error | null = null;

    // Handle different parameter combinations
    if (contextOrError) {
      if (contextOrError instanceof Error) {
        errorObj = contextOrError;
      } else {
        context = contextOrError;
      }
    }

    if (error && error instanceof Error) {
      errorObj = error;
    }

    // Create log entry
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: { ...this.options.context, ...context },
      error: errorObj
    };

    // Format and output the log
    const formattedLog = this.options.formatter(entry);
    
    // Write to appropriate console method
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedLog);
        break;
      default:
        console.log(formattedLog);
    }
  }

  /**
   * Log at debug level
   */
  debug(message: string, contextOrError?: Record<string, any> | Error, error?: Error): void {
    this.log(LogLevel.DEBUG, message, contextOrError, error);
  }

  /**
   * Log at info level
   */
  info(message: string, contextOrError?: Record<string, any> | Error, error?: Error): void {
    this.log(LogLevel.INFO, message, contextOrError, error);
  }

  /**
   * Log at warn level
   */
  warn(message: string, contextOrError?: Record<string, any> | Error, error?: Error): void {
    this.log(LogLevel.WARN, message, contextOrError, error);
  }

  /**
   * Log at error level
   */
  error(message: string, contextOrError?: Record<string, any> | Error, error?: Error): void {
    this.log(LogLevel.ERROR, message, contextOrError, error);
  }

  /**
   * Log at fatal level
   */
  fatal(message: string, contextOrError?: Record<string, any> | Error, error?: Error): void {
    this.log(LogLevel.FATAL, message, contextOrError, error);
  }
} 