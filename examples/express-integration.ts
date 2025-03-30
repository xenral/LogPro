/**
 * Express.js integration example
 * 
 * This example shows how to create a middleware that logs all HTTP requests
 * using LogMate.
 * 
 * To run this example, you'll need to install Express:
 * npm install express @types/express
 */

import express, { Request, Response, NextFunction } from 'express';
import { getLogger } from '../src';

const app = express();
const port = 3000;

// Create a logger instance for HTTP requests
const httpLogger = getLogger('http');

// Middleware to log all requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Create base context for this request
  const requestContext = {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  };
  
  // Log request received
  httpLogger.info('Request received', requestContext);
  
  // Capture response data
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    // Create response context
    const responseContext = {
      ...requestContext,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`
    };
    
    // Log based on status code
    if (res.statusCode >= 500) {
      httpLogger.error('Server error response', responseContext);
    } else if (res.statusCode >= 400) {
      httpLogger.warn('Client error response', responseContext);
    } else {
      httpLogger.info('Request completed', responseContext);
    }
  });
  
  next();
});

// Create a logger for application logic
const appLogger = getLogger('app');

// Example routes
app.get('/', (req: Request, res: Response) => {
  appLogger.debug('Processing root request');
  res.send('Hello World!');
});

app.get('/users/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  appLogger.info('User details requested', { userId });
  
  if (userId === '123') {
    res.json({ id: userId, name: 'Test User' });
  } else {
    appLogger.warn('User not found', { userId });
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/error', (req: Request, res: Response) => {
  appLogger.error('Simulating server error');
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
  appLogger.info(`Server started`, { port });
  console.log(`Example app listening at http://localhost:${port}`);
}); 