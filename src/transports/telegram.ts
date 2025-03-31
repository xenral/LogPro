import TelegramBot from 'node-telegram-bot-api';
import { LogEntry, LogLevel, LogLevelValue, LogTransport, TelegramTransportOptions } from '../types';
import { jsonFormatter } from '../formatters';

/**
 * Telegram Transport for sending logs to a Telegram channel
 */
export class TelegramTransport implements LogTransport {
  private bot: TelegramBot;
  private options: Required<TelegramTransportOptions>;
  private ready: boolean = false;

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

    // Initialize bot
    this.bot = new TelegramBot(this.options.token, { polling: false });
    this.ready = true;
  }

  /**
   * Process a log entry
   */
  log(entry: LogEntry): void {
    // Skip if not ready or filtered out
    if (!this.ready || !this.filter(entry)) {
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
      .catch(error => {
        console.error('Error sending log to Telegram:', error);
      });
  }

  /**
   * Filter function
   */
  filter(entry: LogEntry): boolean {
    // Check log level
    if (LogLevelValue[entry.level] < LogLevelValue[this.options.minLevel]) {
      return false;
    }

    // Apply custom filter if provided
    return this.options.filter(entry);
  }
} 