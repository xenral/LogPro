# SmartLog

A minimalistic, structured logging utility for TypeScript projects.

## Features

- 🔍 **Structured logging** - JSON output format for easy parsing and analysis
- 🔄 **Multiple log levels** - debug, info, warn, error, and fatal
- 🧩 **Context support** - Attach consistent metadata to your logs
- 🌍 **Environment-aware** - Automatically adjusts configuration based on environment
- 🎨 **Pretty formatting** - Human-readable output with optional colors for development
- 🔧 **Customizable** - Easily configurable to match your needs
- 🌱 **Zero dependencies** - Core logging with no external dependencies
- 📲 **Optional transports** - Extend with transports like Telegram (opt-in only)

## Installation

```bash
npm install smartlog
```

or

```bash
yarn add smartlog
```

## Quick Start

```typescript
import { logger } from 'smartlog';

// Basic logging
logger.info('Application started');
logger.warn('Connection timeout, retrying...');
logger.error('Failed to connect to database');

// Adding context
logger.info('User logged in', { userId: '123', role: 'admin' });

// Logging errors with stack traces
try {
  throw new Error('Something went wrong');
} catch (error) {
  logger.error('Operation failed', { operation: 'data-import' }, error);
}
```

## Advanced Usage

### Creating Named Loggers

```typescript
import { getLogger } from 'smartlog';

const dbLogger = getLogger('database');
const authLogger = getLogger('auth');

dbLogger.info('Connected to database');
authLogger.warn('Invalid login attempt', { username: 'user123', ip: '192.168.1.1' });
```

### Customizing Log Level

```typescript
import { getLogger, LogLevel } from 'smartlog';

const logger = getLogger('app')
  .setLevel(LogLevel.DEBUG);

// This will output in development, but not in production
logger.debug('Debugging information');
```

### Changing Output Format

```typescript
import { getLogger } from 'smartlog';

// JSON format (default in production)
const jsonLogger = getLogger('api')
  .useJsonFormat();

// Pretty format with colors (default in development)
const prettyLogger = getLogger('ui')
  .usePrettyFormat(true);
```

### Creating Child Loggers with Context

```typescript
import { getLogger } from 'smartlog';

const logger = getLogger('requestHandler');

// Create a child logger for a specific request
function handleRequest(req) {
  const requestLogger = logger.child({
    requestId: req.id,
    path: req.path,
    method: req.method
  });
  
  requestLogger.info('Request received');
  
  // All logs from requestLogger will include the request context
  requestLogger.debug('Processing request');
}
```

### Environment-Aware Logger

```typescript
import { createEnvLogger } from 'smartlog';

// Automatically configures based on NODE_ENV
const logger = createEnvLogger('app');

// In development: Pretty output with colors, DEBUG level
// In test: Default output, WARN level
// In production: JSON output, INFO level
```

### Sending Logs to Telegram (Optional)

Optionally send important logs directly to a Telegram channel for real-time monitoring:

```typescript
import { getLogger, LogLevel, TelegramTransport } from 'smartlog';

// First install the required dependency
// npm install node-telegram-bot-api

// Create a logger
const logger = getLogger('app');

// Create a Telegram transport
const telegramTransport = new TelegramTransport({
  token: 'YOUR_TELEGRAM_BOT_TOKEN',
  chatId: 'YOUR_CHAT_ID',
  minLevel: LogLevel.ERROR, // Only send ERROR and FATAL logs
  // Optional: Add a filter for specific logs
  filter: (entry) => entry.context.important === true
});

// Add the transport to the logger
logger.addTransport(telegramTransport);

// Regular logs will go to console only
logger.info('Application started');

// Error logs will go to both console and Telegram
logger.error('Database connection failed', { 
  important: true,
  dbHost: 'production-db-1'
});
```

To set up the Telegram integration:

1. Install the optional dependency: `npm install node-telegram-bot-api`
2. Create a bot using [BotFather](https://t.me/botfather) and get the token
3. Add the bot to your channel or group
4. Get the chat ID (you can use the [@username_to_id_bot](https://t.me/username_to_id_bot))
5. Configure the TelegramTransport with your token and chat ID

## API Reference

### Log Levels

- `LogLevel.DEBUG` - Detailed information for debugging
- `LogLevel.INFO` - Informational messages highlighting progress
- `LogLevel.WARN` - Potentially harmful situations
- `LogLevel.ERROR` - Error events that might still allow the application to continue
- `LogLevel.FATAL` - Severe error events that lead to application termination
- `LogLevel.SILENT` - Turns off all logging

### Core Methods

- `debug(message, context?, error?)` - Log at debug level
- `info(message, context?, error?)` - Log at info level
- `warn(message, context?, error?)` - Log at warn level
- `error(message, context?, error?)` - Log at error level
- `fatal(message, context?, error?)` - Log at fatal level

### Configuration Methods

- `setLevel(level)` - Set minimum log level
- `useJsonFormat()` - Use JSON output format
- `usePrettyFormat(enableColors?)` - Use human-readable output format
- `setFormatter(formatter)` - Set custom formatter function
- `child(context)` - Create a child logger with additional context

## License

MIT 