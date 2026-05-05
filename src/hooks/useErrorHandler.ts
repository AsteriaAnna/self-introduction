import { useCallback } from 'react';
import { useErrorContext } from '@components/common/ErrorBoundary/ErrorProvider';
import { classifyError, type ErrorCategory } from '@components/common/ErrorBoundary/ErrorBoundary';

export function useErrorHandler() {
  const { logError } = useErrorContext();

  const handleError = useCallback(
    (error: unknown, context?: string) => {
      if (error instanceof Error) {
        const category = classifyError(error);
        console.error(
          `[${category.toUpperCase()}]${context ? ` [${context}]` : ''}:`,
          error.message
        );
        logError(error, undefined, category);
        return { handled: true, category, message: error.message };
      }

      const unknownError = new Error(String(error));
      logError(unknownError, undefined, 'unknown');
      return { handled: true, category: 'unknown' as ErrorCategory, message: String(error) };
    },
    [logError]
  );

  const handleAsyncError = useCallback(
    <T>(promise: Promise<T>, context?: string): Promise<T | null> => {
      return promise.catch((error) => {
        handleError(error, context);
        return null;
      });
    },
    [handleError]
  );

  return {
    handleError,
    handleAsyncError,
  };
}
