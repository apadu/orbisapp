import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthProvider } from './auth/AuthContext'
import AuthModal from './components/AuthModal'
import ErrorBoundary from './components/ErrorBoundary'
import { installGlobalErrorHandlers } from './utils/errorReporter'

installGlobalErrorHandlers()

// /admin is its own screen (no globe, no game code): only loaded when you open it
const AdminPage = lazy(() => import('./components/admin/AdminPage'))
const isAdminRoute = /^\/admin\/?$/.test(window.location.pathname)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        {isAdminRoute ? <Suspense fallback={null}><AdminPage /></Suspense> : <App />}
        <AuthModal />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
)
