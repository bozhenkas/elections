import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#CDDCDC' }}>
          <p>Что-то пошло не так.</p>
          <p style={{ opacity: 0.5, fontSize: 14, marginTop: 8 }}>{this.state.message}</p>
          <button
            style={{ marginTop: 24, color: '#CDDCDC', border: '0.5px solid #CDDCDC', padding: '8px 20px', borderRadius: 12 }}
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            попробовать снова
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
