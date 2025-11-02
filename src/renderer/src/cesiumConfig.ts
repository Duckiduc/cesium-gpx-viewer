// Configure Cesium base URL before any Cesium modules are imported
// This must be imported before any Cesium imports in the application

// Set the base URL for Cesium assets
// In development, BASE_URL is '/', in production it depends on the build config
const baseUrl = import.meta.env.BASE_URL || '/'

// For development server, use absolute URL
const cesiumBaseUrl =
  import.meta.env.DEV && typeof window !== 'undefined' && window.location
    ? `${window.location.origin}${baseUrl}assets/cesium/`
    : `${baseUrl}assets/cesium/`

window.CESIUM_BASE_URL = cesiumBaseUrl

console.log('Cesium Base URL configured as:', window.CESIUM_BASE_URL)

export {}
