import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F6F7FF] dark:bg-[#0F172A] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white dark:bg-[#1A2540] p-6 rounded-3xl border border-[#EDEEF8] dark:border-[#2D3F5C] shadow-xl max-w-sm w-full space-y-4">
            <span className="text-4xl">🌱</span>
            <h2 className="text-lg font-bold text-[#1A1D2E] dark:text-[#E2E8F0]">
              Ocurrió un error al cargar la aplicación
            </h2>
            <p className="text-xs text-[#7C7FAD] dark:text-[#64748B]">
              Tus datos están a salvo. Toca el botón para recargar la app.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-xl bg-[#5B68F5] text-white font-bold text-sm hover:bg-[#4452D3] active:scale-95 transition-all shadow-md"
            >
              Cargar de nuevo
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
