import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@components/extensions/Theme';
import { LanguageProvider } from '@components/extensions/Language';
import { ErrorProvider } from '@components/common/ErrorBoundary';
import { ErrorBoundary } from '@components/common/ErrorBoundary';
import { LogProvider } from '@components/common/LogProvider';
import { useGlobalErrorHandler } from '@hooks/useGlobalErrorHandler';
import Home from '@pages/Home';
import SkillDetail from '@pages/SkillDetail';
import NotFound from '@pages/NotFound';
import ExperienceDetail from '@pages/ExperienceDetail';
import ProjectDetail from '@pages/ProjectDetail';
import MatchResult from '@pages/MatchResult';

function GlobalErrorHandler() {
  useGlobalErrorHandler();
  return null;
}

function App() {
  return (
    <LogProvider>
      <ErrorProvider>
        <ThemeProvider>
          <LanguageProvider>
            <GlobalErrorHandler />
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ErrorBoundary>
                      <Home />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/skill/:label"
                  element={
                    <ErrorBoundary>
                      <SkillDetail />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/experience/:id"
                  element={
                    <ErrorBoundary>
                      <ExperienceDetail />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/project/:id"
                  element={
                    <ErrorBoundary>
                      <ProjectDetail />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/match-result"
                  element={
                    <ErrorBoundary>
                      <MatchResult />
                    </ErrorBoundary>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </ThemeProvider>
      </ErrorProvider>
    </LogProvider>
  );
}

export default App;
