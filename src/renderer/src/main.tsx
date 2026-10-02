// Configure Cesium before any imports
import './cesiumConfig'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/base.css'
import App from './App'
import { PreferencesProvider } from './hooks/PreferencesProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PreferencesProvider>
      <App />
    </PreferencesProvider>
  </React.StrictMode>
)
