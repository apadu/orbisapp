/**
 * The app itself, imported by main.jsx once the language's dictionaries are loaded
 * (modules translate their constants with t() as soon as they're imported).
 */
import { StrictMode, lazy, Suspense } from 'react'
import './utils/challenge' // reads a challenge link (?vs=…) before the router tidies the address
import './utils/install'   // install prompt + offline service worker
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
