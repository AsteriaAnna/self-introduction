import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { logger } from '@utils/logger'

interface LogContextType {
  traceId: string
  generateNewTraceId: () => string
  setTraceId: (id: string) => void
  getLogs: () => ReturnType<typeof logger.getLogs>
  clearLogs: () => void
}

const LogContext = createContext<LogContextType | undefined>(undefined)

export function LogProvider({ children }: { children: ReactNode }) {
  const [traceId, setTraceIdState] = useState<string>(logger.getTraceId())

  const generateNewTraceId = useCallback(() => {
    const newTraceId = logger.generateTraceId()
    setTraceIdState(newTraceId)
    logger.setTraceId(newTraceId)
    return newTraceId
  }, [])

  const setTraceId = useCallback((id: string) => {
    setTraceIdState(id)
    logger.setTraceId(id)
  }, [])

  const getLogs = useCallback(() => {
    return logger.getLogs()
  }, [])

  const clearLogs = useCallback(() => {
    logger.clearLogs()
  }, [])

  return (
    <LogContext.Provider value={{ traceId, generateNewTraceId, setTraceId, getLogs, clearLogs }}>
      {children}
    </LogContext.Provider>
  )
}

export function useLogContext() {
  const context = useContext(LogContext)
  if (context === undefined) {
    throw new Error('useLogContext must be used within a LogProvider')
  }
  return context
}
