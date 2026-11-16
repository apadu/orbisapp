import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthProvider } from './auth/AuthContext'
import AuthModal from './components/AuthModal'
import ErrorBoundary from './components/ErrorBoundary'
import { installGlobalErrorHandlers } from './utils/errorReporter'

installGlobalErrorHandlers()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
        <AuthModal />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
)
