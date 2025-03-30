/**
 * Production Configuration Example
 * 
 * This example demonstrates how to configure the logger for production environments
 * with structured JSON output that can be easily ingested by log management systems.
 */

import { getLogger, LogLevel } from '../src';

// Create a production-ready logger
const logger = getLogger('production-app')
  // Use JSON format for structured logging
  .useJsonFormat()
  // Set log level to INFO in production to reduce noise
  .setLevel(LogLevel.INFO)
  // Add global contextual info that will be included in all logs
  .child({
    environment: 'production',
    version: process.env.APP_VERSION || '1.0.0',
    service: 'api-service',
    // Can include custom metrics/tags for better filtering in log management systems
    region: process.env.AWS_REGION || 'us-east-1',
    nodeVersion: process.version
  });

// Example logs with different levels and contexts
logger.info('Application started', {
  startupTime: Date.now(),
  memoryUsage: process.memoryUsage().heapUsed
});

// This won't be logged in production (debug < info)
logger.debug('DB connection pool initialized', {
  poolSize: 10, 
  maxConnections: 100
});

// Processing incoming request (logged because info level)
logger.info('Processing payment request', {
  paymentId: 'pay_123456',
  amount: 100.50,
  currency: 'USD',
  customerId: 'cust_42'
});

// Error handling with structured data
try {
  throw new Error('Payment gateway timeout');
} catch (error: any) {
  logger.error('Payment processing failed', {
    paymentId: 'pay_123456',
    errorCode: 'GATEWAY_TIMEOUT',
    retryCount: 2,
    processingTimeMs: 3200
  }, error);
}

// Fatal errors for critical system failures
logger.fatal('Database connection lost', {
  dbHost: 'primary-db.example.com',
  connectionId: 'conn_789',
  failoverStatus: 'INITIATED'
});

// Output sample:
/*
{"timestamp":"2023-05-12T15:47:32.345Z","level":"info","message":"Application started","environment":"production","version":"1.0.0","service":"api-service","region":"us-east-1","nodeVersion":"v16.14.2","startupTime":1683907652345,"memoryUsage":23415808}
{"timestamp":"2023-05-12T15:47:32.347Z","level":"info","message":"Processing payment request","environment":"production","version":"1.0.0","service":"api-service","region":"us-east-1","nodeVersion":"v16.14.2","paymentId":"pay_123456","amount":100.5,"currency":"USD","customerId":"cust_42"}
{"timestamp":"2023-05-12T15:47:32.349Z","level":"error","message":"Payment processing failed","environment":"production","version":"1.0.0","service":"api-service","region":"us-east-1","nodeVersion":"v16.14.2","paymentId":"pay_123456","errorCode":"GATEWAY_TIMEOUT","retryCount":2,"processingTimeMs":3200,"error":{"name":"Error","message":"Payment gateway timeout","stack":"Error: Payment gateway timeout\n    at Object.<anonymous> (/app/examples/production-config.ts:44:9)\n    at Module._compile (internal/modules/cjs/loader.js:1085:14)\n    at Module.m._compile (/app/node_modules/ts-node/src/index.ts:1618:23)\n    at Module._extensions..js (internal/modules/cjs/loader.js:1114:10)"}}
{"timestamp":"2023-05-12T15:47:32.350Z","level":"fatal","message":"Database connection lost","environment":"production","version":"1.0.0","service":"api-service","region":"us-east-1","nodeVersion":"v16.14.2","dbHost":"primary-db.example.com","connectionId":"conn_789","failoverStatus":"INITIATED"}
*/ 