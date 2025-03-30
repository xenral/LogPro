import { Logger } from './logger';
import { LogLevel } from './types';

describe('Logger', () => {
  let originalConsole: Console;
  let mockConsole: any;
  
  beforeEach(() => {
    // Save original console
    originalConsole = global.console;
    
    // Create mock console
    mockConsole = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      log: jest.fn()
    };
    
    // Replace console with mock
    global.console = mockConsole as any;
  });
  
  afterEach(() => {
    // Restore original console
    global.console = originalConsole;
  });
  
  it('should create a logger with default options', () => {
    const logger = new Logger();
    expect(logger).toBeInstanceOf(Logger);
  });
  
  it('should respect minimum log level', () => {
    const logger = new Logger({ minLevel: LogLevel.WARN });
    
    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');
    
    expect(mockConsole.debug).not.toHaveBeenCalled();
    expect(mockConsole.info).not.toHaveBeenCalled();
    expect(mockConsole.warn).toHaveBeenCalled();
    expect(mockConsole.error).toHaveBeenCalled();
  });
  
  it('should include context in log message', () => {
    const logger = new Logger();
    const context = { userId: '123', action: 'login' };
    
    logger.info('User action', context);
    
    expect(mockConsole.info).toHaveBeenCalled();
    const logArg = mockConsole.info.mock.calls[0][0];
    expect(logArg).toContain('User action');
    expect(logArg).toContain('userId');
    expect(logArg).toContain('action');
  });
  
  it('should create child logger with merged context', () => {
    const logger = new Logger({ context: { app: 'test-app' } });
    const childLogger = logger.child({ module: 'auth' });
    
    childLogger.info('Test message');
    
    expect(mockConsole.info).toHaveBeenCalled();
    const logArg = mockConsole.info.mock.calls[0][0];
    expect(logArg).toContain('app');
    expect(logArg).toContain('test-app');
    expect(logArg).toContain('module');
    expect(logArg).toContain('auth');
  });
  
  it('should handle error objects', () => {
    const logger = new Logger();
    const error = new Error('Test error');
    
    logger.error('Operation failed', error);
    
    expect(mockConsole.error).toHaveBeenCalled();
    const logArg = mockConsole.error.mock.calls[0][0];
    expect(logArg).toContain('Operation failed');
    expect(logArg).toContain('Test error');
  });
  
  it('should allow changing the log level', () => {
    const logger = new Logger({ minLevel: LogLevel.ERROR });
    
    logger.warn('Warning message');
    expect(mockConsole.warn).not.toHaveBeenCalled();
    
    logger.setLevel(LogLevel.WARN);
    
    logger.warn('Another warning message');
    expect(mockConsole.warn).toHaveBeenCalled();
  });
}); 