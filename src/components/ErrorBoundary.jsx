import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown error' }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '60vh', gap: '16px',
          fontFamily: 'inherit', color: 'var(--white, #fff)',
          textAlign: 'center', padding: '40px',
        }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.14em', opacity: 0.4 }}>
            SYSTEM ERROR
          </p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 300, margin: 0 }}>
            Something went wrong.
          </h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.5, maxWidth: '320px' }}>
            {this.state.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            style={{
              marginTop: '8px', padding: '10px 24px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)', color: 'inherit',
              fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer',
            }}
          >
            TRY AGAIN
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
