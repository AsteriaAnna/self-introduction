import { Component, ReactNode, ErrorInfo } from 'react'
import { useErrorContext } from './ErrorProvider'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorType: ErrorCategory
}

export type ErrorCategory = 'environment' | 'dependency' | 'logic' | 'type' | 'contract' | 'unknown'

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: 'unknown'
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorType: classifyError(error)
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    const { logError } = useErrorContext()
    logError(error, errorInfo, classifyError(error))
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: 'unknown'
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <ErrorFallback
          error={this.state.error}
          errorType={this.state.errorType}
          onReset={this.resetError}
        />
      )
    }
    return this.props.children
  }
}

export function classifyError(error: Error): ErrorCategory {
  const message = error.message.toLowerCase()
  const name = error.name.toLowerCase()

  if (message.includes('module') || message.includes('not found') || message.includes('cannot find') || message.includes('failed to resolve')) {
    return 'dependency'
  }
  if (message.includes('required') || message.includes('environment') || message.includes('.env') || message.includes('config')) {
    return 'environment'
  }
  if (message.includes('type') || message.includes('typescript') || message.includes('assignable') || name.includes('type')) {
    return 'type'
  }
  if (message.includes('api') || message.includes('fetch') || message.includes('response') || message.includes('401') || message.includes('403') || message.includes('400')) {
    return 'contract'
  }
  if (message.includes('undefined') || message.includes('cannot read') || message.includes('is not a function')) {
    return 'logic'
  }

  return 'unknown'
}

interface ErrorFallbackProps {
  error: Error | null
  errorType: ErrorCategory
  onReset: () => void
}

export function ErrorFallback({ error, errorType, onReset }: ErrorFallbackProps) {
  const errorMessages: Record<ErrorCategory, { title: string; suggestion: string }> = {
    environment: {
      title: '环境配置错误',
      suggestion: '请检查环境变量配置是否正确，确保所有必需的配置项都已设置并重启应用。'
    },
    dependency: {
      title: '依赖加载错误',
      suggestion: '请运行 npm install 安装所有依赖，或检查模块导入路径是否正确。'
    },
    logic: {
      title: '程序逻辑错误',
      suggestion: '程序运行过程中发生了意外行为，请尝试刷新页面或联系开发者。'
    },
    type: {
      title: '类型错误',
      suggestion: '检测到类型不匹配，请检查代码中的类型定义和数据结构。'
    },
    contract: {
      title: '接口契约错误',
      suggestion: '与后端服务通信出现问题，请检查网络连接或服务是否可用。'
    },
    unknown: {
      title: '未知错误',
      suggestion: '发生了未知错误，请尝试刷新页面。'
    }
  }

  const { title, suggestion } = errorMessages[errorType]

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
              {errorType}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-900 rounded text-sm font-mono text-red-600 dark:text-red-400 overflow-auto max-h-32">
            {error.message}
          </div>
        )}

        <p className="text-gray-600 dark:text-gray-300 mb-6">{suggestion}</p>

        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded hover:opacity-90 transition-opacity"
          >
            重试
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:opacity-90 transition-opacity"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  )
}
