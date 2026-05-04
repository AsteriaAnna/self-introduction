import { useCallback } from 'react'
import { logger, createModuleLogger } from '@utils/logger'
import { useLogContext } from '@components/common/LogProvider'

export function useLogger() {
  const { traceId } = useLogContext()

  const log = useCallback({
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
  } as const, [traceId])

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

export function useModuleLogger(moduleName: string) {
  return createModuleLogger(moduleName)
}
