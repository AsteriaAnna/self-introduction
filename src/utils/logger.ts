type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface StructuredLogEntry {
  timestamp: string;
  level: LogLevel;
  service_name: string;
  traceId: string;
  thread_name: string;
  logger_name: string;
  message: string;
  details: Record<string, unknown> | null;
  stack_trace: string | null;
}

interface LoggerConfig {
  serviceName: string;
  loggerName: string;
}

class Logger {
  private logs: StructuredLogEntry[] = [];
  private maxLogs = 100;
  private config: LoggerConfig = {
    serviceName: 'self-introduction-web',
    loggerName: 'App',
  };
  private traceId: string = this.generateTraceId();

  configure(config: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...config };
  }

  setTraceId(traceId: string) {
    this.traceId = traceId;
  }

  getTraceId(): string {
    return this.traceId;
  }

  generateTraceId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private maskSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
    const sensitiveKeys = [
      'password',
      'pwd',
      'token',
      'secret',
      'phone',
      'mobile',
      'idCard',
      '身份证',
      '密码',
    ];
    const masked: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      const isSensitive = sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()));
      if (isSensitive && typeof value === 'string') {
        masked[key] = '***MASKED***';
      } else if (typeof value === 'object' && value !== null) {
        masked[key] = this.maskSensitiveData(value as Record<string, unknown>);
      } else {
        masked[key] = value;
      }
    }

    return masked;
  }

  private log(
    level: LogLevel,
    message: string,
    context?: string,
    details?: Record<string, unknown>,
    stackTrace?: string
  ) {
    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service_name: this.config.serviceName,
      traceId: this.traceId,
      thread_name: 'main',
      logger_name: context || this.config.loggerName,
      message,
      details: details ? this.maskSensitiveData(details) : null,
      stack_trace: stackTrace || null,
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    const jsonLog = JSON.stringify(entry);

    switch (level) {
      case 'DEBUG':
        console.debug(jsonLog);
        break;
      case 'INFO':
        console.info(jsonLog);
        break;
      case 'WARN':
        console.warn(jsonLog);
        break;
      case 'ERROR':
        console.error(jsonLog);
        break;
    }
  }

  debug(message: string, context?: string, details?: Record<string, unknown>) {
    this.log('DEBUG', message, context, details);
  }

  info(message: string, context?: string, details?: Record<string, unknown>) {
    this.log('INFO', message, context, details);
  }

  warn(message: string, context?: string, details?: Record<string, unknown>) {
    this.log('WARN', message, context, details);
  }

  error(message: string, context?: string, details?: Record<string, unknown>, error?: Error) {
    this.log('ERROR', message, context, details, error?.stack);
  }

  getLogs(level?: LogLevel): StructuredLogEntry[] {
    if (level) {
      return this.logs.filter((log) => log.level === level);
    }
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  startTimer(context?: string): () => void {
    const start = performance.now();
    return () => {
      const duration = Math.round(performance.now() - start);
      this.info(`Operation completed`, context, { duration_ms: duration });
    };
  }
}

export const logger = new Logger();

export interface ModuleLogger {
  debug: (message: string, details?: Record<string, unknown>) => void;
  info: (message: string, details?: Record<string, unknown>) => void;
  warn: (message: string, details?: Record<string, unknown>) => void;
  error: (message: string, details?: Record<string, unknown>, error?: Error) => void;
  startTimer: () => () => void;
}

export function createModuleLogger(moduleName: string): ModuleLogger {
  return {
    debug: (message: string, details?: Record<string, unknown>) =>
      logger.debug(message, moduleName, details),
    info: (message: string, details?: Record<string, unknown>) =>
      logger.info(message, moduleName, details),
    warn: (message: string, details?: Record<string, unknown>) =>
      logger.warn(message, moduleName, details),
    error: (message: string, details?: Record<string, unknown>, error?: Error) =>
      logger.error(message, moduleName, details, error),
    startTimer: () => logger.startTimer(moduleName),
  };
}
