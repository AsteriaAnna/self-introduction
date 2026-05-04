import { useEffect } from 'react'
import { logger } from '@utils/logger'
import { useErrorContext } from '@components/common/ErrorBoundary'

export function useGlobalErrorHandler() {
  const { logError } = useErrorContext()

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error(`Unhandled Promise Rejection: ${event.reason}`, 'GLOBAL')
      if (event.reason instanceof Error) {
        logError(event.reason, undefined, 'logic')
      }
    }

    const handleGlobalError = (event: ErrorEvent) => {
      logger.error(`Global Error: ${event.message}`, 'GLOBAL')
      if (event.error instanceof Error) {
        logError(event.error, undefined, 'unknown')
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleGlobalError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleGlobalError)
    }
  }, [logError])
}
