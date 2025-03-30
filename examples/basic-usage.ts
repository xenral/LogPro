import { logger, getLogger, LogLevel } from '../src';

// Using the default logger
logger.info('Application started');
logger.warn('This is a warning message');
logger.error('An error occurred', { code: 500 });

// Creating a custom logger with a name
const userLogger = getLogger('user-service');

// Log with context
userLogger.info('User logged in', { userId: 'user123', role: 'admin' });

// Log with error
try {
  throw new Error('Authentication failed');
} catch (error: any) {
  userLogger.error('Login failed', { userId: 'user456' }, error);
}

// Debug logging (only appears in development)
userLogger.debug('Debug information', { debug: true });

// Creating a child logger with additional context
const requestLogger = userLogger.child({
  requestId: 'req-123-456',
  path: '/api/users',
  method: 'GET'
});

requestLogger.info('Request received');
requestLogger.debug('Processing request parameters');

// Customizing output format
const jsonLogger = getLogger('api')
  .useJsonFormat()
  .setLevel(LogLevel.DEBUG);

jsonLogger.debug('This is in JSON format');

// Creating a pretty logger with colors
const prettyLogger = getLogger('ui')
  .usePrettyFormat(true);

prettyLogger.info('This is in pretty format with colors');
prettyLogger.warn('Warning in pretty format');
prettyLogger.error('Error in pretty format'); 