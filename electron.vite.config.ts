import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    assetsInclude: ['**/*.gpx'],
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: '../../node_modules/cesium/Build/Cesium/Workers',
            dest: 'assets/cesium'
          },
          {
            src: '../../node_modules/cesium/Build/Cesium/ThirdParty',
            dest: 'assets/cesium'
          },
          {
            src: '../../node_modules/cesium/Build/Cesium/Assets',
            dest: 'assets/cesium'
          },
          {
            src: '../../node_modules/cesium/Build/Cesium/Widgets',
            dest: 'assets/cesium'
          }
        ]
      })
    ]
  }
})
