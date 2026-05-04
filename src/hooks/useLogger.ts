import { useCallback } from 'react'
import { logger, createModuleLogger, type ModuleLogger } from '@utils/logger'
import { useLogContext } from '@components/common/LogProvider'

interface UseLoggerResult {
  log: {
    debug: (message: string, details?: Record<string, unknown>) => void
    info: (message: string, details?: Record<string, unknown>) => void
    warn: (message: string, details?: Record<string, unknown>) => void
    error: (message: string, details?: Record<string, unknown>, error?: Error) => void
  }
  startTimer: () => () => void
  createLogger: (moduleName: string) => ModuleLogger
  traceId: string
  getLogs: () => ReturnType<typeof logger.getLogs>
  clearLogs: () => void
}

export function useLogger(): UseLoggerResult {
  const { traceId } = useLogContext()

  const log = {
    debug: (message: string, details?: Record<string, unknown>) => {
      logger.debug(message, undefined, details)
    },
    info: (message: string, details?: Record<string, unknown>) => {
      logger.info(message, undefined, details)
    },
    warn: (message: string, details?: Record<string, unknown>) => {
      logger.warn(message, undefined, details)
    },
    error: (message: string, details?: Record<string, unknown>, error?: Error) => {
      logger.error(message, undefined, details, error)
    }
  }

  const startTimer = useCallback(() => {
    return logger.startTimer()
  }, [])

  const createLogger = useCallback((moduleName: string) => {
    return createModuleLogger(moduleName)
  }, [])

  return {
    log,
    startTimer,
    createLogger,
    traceId,
    getLogs: () => logger.getLogs(),
    clearLogs: () => logger.clearLogs()
  }
}

export function useModuleLogger(moduleName: string): ModuleLogger {
  return createModuleLogger(moduleName)
}
