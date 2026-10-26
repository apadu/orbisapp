import { Component } from 'react'

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
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#08050f', color: '#f0e6ff', fontFamily: 'system-ui, sans-serif', padding: 24,
      }}>
        <div style={{ maxWidth: 640, width: '100%' }}>
          <h1 style={{ fontSize: 22, marginBottom: 8 }}>⚠️ Orbis crashed</h1>
          <p style={{ color: '#a98fdb', marginBottom: 16 }}>Copy the error below and send it over.</p>
          <pre style={{
            background: '#110d1e', border: '1px solid #3d2f6e', borderRadius: 10, padding: 14,
            whiteSpace: 'pre-wrap', fontSize: 12, maxHeight: 360, overflow: 'auto',
          }}>
            {String(error?.stack ?? error)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 14, background: '#c77dff', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}
          >
            Reload
          </button>
        </div>
      </div>
    )
  }
}
