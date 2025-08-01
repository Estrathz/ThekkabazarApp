import { LOGGING_CONFIG, isProduction, isDevelopment } from '../config/environment';

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

class LoggingService {
  constructor() {
    this.logs = [];
    this.maxLogs = LOGGING_CONFIG.maxLogs;
    this.enabled = LOGGING_CONFIG.enabled;
    this.level = LOG_LEVELS[LOGGING_CONFIG.level.toUpperCase()] || LOG_LEVELS.ERROR;
  }

  // Add log entry
  addLog(level, message, data = null, error = null) {
    if (!this.enabled) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error: error ? this.sanitizeError(error) : null,
    };

    this.logs.push(logEntry);

    // Keep only the latest logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console logging based on environment
    if (isDevelopment()) {
      this.consoleLog(level, message, data, error);
    } else if (level === 'ERROR') {
      // Only log errors in production
      this.consoleLog(level, message, data, error);
    }
  }

  // Console logging with proper formatting
  consoleLog(level, message, data, error) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    switch (level) {
      case 'ERROR':
        console.error(prefix, message, data || '', error || '');
        break;
      case 'WARN':
        console.warn(prefix, message, data || '');
        break;
      case 'INFO':
        console.info(prefix, message, data || '');
        break;
      case 'DEBUG':
        console.log(prefix, message, data || '');
        break;
      default:
        console.log(prefix, message, data || '');
    }
  }

  // Sanitize error object for logging
  sanitizeError(error) {
    if (!error) return null;

    return {
      name: error.name,
      message: error.message,
      stack: isDevelopment() ? error.stack : undefined,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
    };
  }

  // Log methods
  error(message, data = null, error = null) {
    if (LOG_LEVELS.ERROR <= this.level) {
      this.addLog('ERROR', message, data, error);
    }
  }

  warn(message, data = null) {
    if (LOG_LEVELS.WARN <= this.level) {
      this.addLog('WARN', message, data);
    }
  }

  info(message, data = null) {
    if (LOG_LEVELS.INFO <= this.level) {
      this.addLog('INFO', message, data);
    }
  }

  debug(message, data = null) {
    if (LOG_LEVELS.DEBUG <= this.level) {
      this.addLog('DEBUG', message, data);
    }
  }

  // API logging
  logApiRequest(method, url, data = null) {
    this.debug(`API Request: ${method} ${url}`, data);
  }

  logApiResponse(method, url, status, duration, data = null) {
    const level = status >= 400 ? 'ERROR' : 'DEBUG';
    this.addLog(level, `API Response: ${method} ${url} - ${status} (${duration}ms)`, data);
  }

  logApiError(method, url, error) {
    this.error(`API Error: ${method} ${url}`, null, error);
  }

  // Navigation logging
  logNavigation(from, to, params = null) {
    this.debug(`Navigation: ${from} -> ${to}`, params);
  }

  // User action logging
  logUserAction(action, data = null) {
    this.info(`User Action: ${action}`, data);
  }

  // Performance logging
  logPerformance(operation, duration, data = null) {
    if (duration > 1000) {
      this.warn(`Slow Operation: ${operation} took ${duration}ms`, data);
    } else {
      this.debug(`Performance: ${operation} took ${duration}ms`, data);
    }
  }

  // Error boundary logging
  logErrorBoundary(error, errorInfo) {
    this.error('React Error Boundary Caught Error', {
      componentStack: errorInfo.componentStack,
      errorInfo,
    }, error);
  }

  // Get all logs
  getLogs() {
    return [...this.logs];
  }

  // Get logs by level
  getLogsByLevel(level) {
    return this.logs.filter(log => log.level === level);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Export logs for debugging
  exportLogs() {
    return {
      timestamp: new Date().toISOString(),
      environment: isProduction() ? 'production' : 'development',
      logs: this.logs,
      summary: {
        total: this.logs.length,
        error: this.logs.filter(log => log.level === 'ERROR').length,
        warn: this.logs.filter(log => log.level === 'WARN').length,
        info: this.logs.filter(log => log.level === 'INFO').length,
        debug: this.logs.filter(log => log.level === 'DEBUG').length,
      },
    };
  }

  // Send logs to remote service (for production)
  async sendLogsToRemote() {
    if (!isProduction()) return;

    try {
      const logData = this.exportLogs();
      
      // Here you would send logs to your remote logging service
      // Example: Sentry, LogRocket, etc.
      console.log('Sending logs to remote service:', logData);
      
      // Clear logs after successful send
      this.clearLogs();
    } catch (error) {
      console.error('Failed to send logs to remote service:', error);
    }
  }
}

// Create singleton instance
const loggingService = new LoggingService();

// Export singleton and class
export default loggingService;
export { LoggingService }; 