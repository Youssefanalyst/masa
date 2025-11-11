import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './tailwind.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AdminProvider } from './contexts/AdminContext'

const rootElement = document.getElementById('root')

const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AdminProvider>
          <App />
        </AdminProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

// Support for react-snap pre-rendering
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
