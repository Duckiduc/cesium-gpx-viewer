import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// The URL on the server where CesiumJS's static files are hosted
window.CESIUM_BASE_URL = '/src/assets/cesium/'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
