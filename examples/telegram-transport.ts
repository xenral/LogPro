import { getLogger, LogLevel, TelegramTransport } from '../src';

// Create a new logger
const logger = getLogger('app');

// Create a Telegram transport that only sends ERROR and FATAL logs
const telegramTransport = new TelegramTransport({
  token: 'YOUR_TELEGRAM_BOT_TOKEN',
  chatId: 'YOUR_CHAT_ID',
  minLevel: LogLevel.ERROR,
  // Optional: Add a filter to only send specific logs
  filter: (entry) => {
    // Example: Only send logs containing the word "critical" or from payment service
    return entry.message.includes('critical') || 
           (entry.context.service === 'payment');
  }
});

// Add the transport to the logger
logger.addTransport(telegramTransport);

// Regular logs will go to console only
logger.info('Application started');
logger.debug('This is a debug message');

// Error logs will go to both console and Telegram
logger.error('Critical system failure detected!', { 
  service: 'auth',
  userId: '12345'
});

// This will go to Telegram because it matches the filter
logger.warn('Payment processing issue', { 
  service: 'payment',
  orderId: 'ORD-123'
});

// This will go to Telegram because it contains 'critical'
logger.info('Processing critical user data', { 
  service: 'user',
  count: 42
}); 