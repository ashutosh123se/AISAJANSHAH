import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

document.documentElement.classList.remove('dark')

function showBootError(message) {
  const root = document.getElementById('root')
  if (!root) return
  root.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;background:#F9F8F6;font-family:Inter,sans-serif">
      <div style="max-width:480px;background:#fff;border:1px solid #E5E2DC;border-radius:16px;padding:2rem;text-align:center">
        <h2 style="font-size:1.25rem;font-weight:700;color:#1A1A1A;margin-bottom:0.5rem">App failed to start</h2>
        <p style="font-size:0.875rem;color:#5C5C5C;margin-bottom:1.5rem">${message}</p>
        <button onclick="location.reload()" style="padding:0.75rem 1.5rem;background:#E55A28;color:#fff;border:none;border-radius:9999px;font-weight:600;cursor:pointer">Reload Page</button>
      </div>
    </div>`
}

window.addEventListener('error', (e) => {
  console.error('Global error:', e.error || e.message)
})

try {
  const rootEl = document.getElementById('root')
  if (!rootEl) throw new Error('Root element #root not found')

  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
} catch (err) {
  showBootError(err?.message || 'Unknown startup error')
}
