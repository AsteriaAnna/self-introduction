import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@components/extensions/Theme'
import { ErrorProvider } from '@components/common/ErrorBoundary'
import { ErrorBoundary } from '@components/common/ErrorBoundary'
import { LogProvider } from '@components/common/LogProvider'
import { useGlobalErrorHandler } from '@hooks/useGlobalErrorHandler'
import Home from '@pages/Home'
import SkillDetail from '@pages/SkillDetail'
import NotFound from '@pages/NotFound'
import ExperienceDetail from '@pages/ExperienceDetail'
import ProjectDetail from '@pages/ProjectDetail'
import MatchResult from '@pages/MatchResult'

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
                <Route path="/skill/:label" element={<SkillDetail />} />
                <Route path="/experience/:id" element={<ExperienceDetail />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="/match-result" element={<MatchResult />} />
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
