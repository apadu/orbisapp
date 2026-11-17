import { Component } from 'react'
import { t } from '../i18n'
import { reportError, isChunkError, reloadForNewBuild } from '../utils/errorReporter'
import { plain } from '../utils/plain'

/**
 * Catches render/effect crashes so the app shows the error instead of a black screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[orbis] crash:', error, info?.componentStack)
    // Old tab after a deploy asking for a chunk that's gone: just load the new build
    if (isChunkError(error) && reloadForNewBuild(error)) return
    reportError('render', error, { componentStack: info?.componentStack })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0D1A2B', color: '#F2E9D8', fontFamily: 'system-ui, sans-serif', padding: 24,
      }}>
        <div style={{ maxWidth: 640, width: '100%' }}>
          <h1 style={{ fontSize: 22, marginBottom: 8 }}>{plain(t('⚠️ Orbis crashed'))}</h1>
          <p style={{ color: '#B5AD9E', marginBottom: 16 }}>{t('Copy the error below and send it over.')}</p>
          <pre style={{
            background: '#12233A', border: '1px solid #2C415C', borderRadius: 10, padding: 14,
            whiteSpace: 'pre-wrap', fontSize: 12, maxHeight: 360, overflow: 'auto',
          }}>
            {String(error?.stack ?? error)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 14, background: '#FF7A3D', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}
          >
            {t('Reload')}
          </button>
        </div>
      </div>
    )
  }
}
