import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'node_modules/cesium/Build/Cesium/Workers', dest: 'src/assets/cesium' },
        { src: 'node_modules/cesium/Build/Cesium/ThirdParty', dest: 'src/assets/cesium' },
        { src: 'node_modules/cesium/Build/Cesium/Assets', dest: 'src/assets/cesium' },
        { src: 'node_modules/cesium/Build/Cesium/Widgets', dest: 'src/assets/cesium' }
      ]
    })
  ],
})
