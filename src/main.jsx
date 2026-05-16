import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

document.addEventListener('touchmove', (e) => {
  if (e.target.closest('.scroll-picker__list') ||
      e.target.closest('.name-dropdown') ||
      e.target.closest('.modal') ||
      e.target.closest('.place-filter') ||
      e.target.closest('.history-list') ||
      e.target.closest('#root')) return
  e.preventDefault()
}, { passive: false })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
