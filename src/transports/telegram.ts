import { LogEntry, LogLevel, LogLevelValue, LogTransport, TelegramTransportOptions } from '../types';
import { jsonFormatter } from '../formatters';

/**
 * Dynamic import for node-telegram-bot-api to make it optional
 */
let TelegramBot: any = null;
try {
  // This will be replaced with actual module during runtime
  // only if the package is installed
  TelegramBot = require('node-telegram-bot-api');
} catch (e) {
  // Module not available, we'll handle this in the constructor
}

/**
 * Telegram Transport for sending logs to a Telegram channel
 */
export class TelegramTransport implements LogTransport {
  private bot: any;
  private options: Required<TelegramTransportOptions>;
  private ready: boolean = false;
  private missingDependency: boolean = false;

  /**
   * Create a new Telegram transport
   */
  constructor(options: TelegramTransportOptions) {
    // Set default options
    this.options = {
      minLevel: LogLevel.INFO,
      formatter: jsonFormatter,
      filter: () => true,
      ...options
    };

    // Handle missing dependency case
    if (!TelegramBot) {
      this.missingDependency = true;
      console.warn(
        '[LogPro] node-telegram-bot-api package is not installed. ' +
        'Telegram transport will not work. ' +
        'Install it with: npm install node-telegram-bot-api'
      );
      return;
    }

    // Initialize bot
    try {
      this.bot = new TelegramBot(this.options.token, { polling: false });
      this.ready = true;
    } catch (error) {
      console.error('[LogPro] Failed to initialize Telegram bot:', error);
    }
  }

  /**
   * Process a log entry
   */
  log(entry: LogEntry): void {
    // Skip if not ready, missing dependency, or filtered out
    if (this.missingDependency || !this.ready || !this.filter(entry)) {
      return;
    }

    // Format the message
    let formattedMessage = this.options.formatter(entry);

    // Ensure message isn't too long for Telegram (max 4096 chars)
    if (formattedMessage.length > 4000) {
      formattedMessage = formattedMessage.substring(0, 4000) + '... (truncated)';
    }

    // Send the message
    this.bot.sendMessage(this.options.chatId, formattedMessage)
      .catch((error: Error) => {
        console.error('[LogPro] Error sending log to Telegram:', error);
      });
  }

  /**
   * Filter function
   */
  filter(entry: LogEntry): boolean {
    // Always return false if dependency is missing
    if (this.missingDependency) {
      return false;
    }
    
    // Check log level
    if (LogLevelValue[entry.level] < LogLevelValue[this.options.minLevel]) {
      return false;
    }

    // Apply custom filter if provided
    return this.options.filter(entry);
  }
} 