import { createContext, useContext, useState, useCallback, ReactNode, ErrorInfo } from 'react'
import type { ErrorCategory } from './ErrorBoundary'

export interface ErrorLog {
  id: string
  message: string
  stack?: string
  category: ErrorCategory
  timestamp: Date
  info?: ErrorInfo
}

interface ErrorContextType {
  errors: ErrorLog[]
  logError: (error: Error, info?: ErrorInfo, category?: ErrorCategory) => void
  clearErrors: () => void
  removeError: (id: string) => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<ErrorLog[]>([])

  const logError = useCallback((error: Error, info?: ErrorInfo, category: ErrorCategory = 'unknown') => {
    const errorLog: ErrorLog = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: error.message,
      stack: error.stack,
      category,
      timestamp: new Date(),
      info
    }
    setErrors(prev => [errorLog, ...prev].slice(0, 50))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(err => err.id !== id))
  }, [])

  return (
    <ErrorContext.Provider value={{ errors, logError, clearErrors, removeError }}>
      {children}
    </ErrorContext.Provider>
  )
}

export function useErrorContext() {
  const context = useContext(ErrorContext)
  if (context === undefined) {
    throw new Error('useErrorContext must be used within an ErrorProvider')
  }
  return context
}
