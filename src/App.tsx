import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@components/extensions/Theme'
import { ErrorProvider } from '@components/common/ErrorBoundary'
import { ErrorBoundary } from '@components/common/ErrorBoundary'
import { LogProvider } from '@components/common/LogProvider'
import { useGlobalErrorHandler } from '@hooks/useGlobalErrorHandler'
import Home from '@pages/Home'
import Graph from '@pages/Graph'
import NotFound from '@pages/NotFound'
import ExperienceDetail from '@pages/ExperienceDetail'

function GlobalErrorHandler() {
  useGlobalErrorHandler()
  return null
}

function App() {
  return (
    <LogProvider>
      <ErrorProvider>
        <ErrorBoundary>
          <ThemeProvider>
            <GlobalErrorHandler />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/graph" element={<Graph />} />
                <Route path="/experience/:id" element={<ExperienceDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </ErrorBoundary>
      </ErrorProvider>
    </LogProvider>
  )
}

export default App
