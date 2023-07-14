import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import App from './App'

// The URL on the server where CesiumJS's static files are hosted
window.CESIUM_BASE_URL = 'assets/cesium/'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
