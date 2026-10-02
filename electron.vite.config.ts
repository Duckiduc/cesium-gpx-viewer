import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const cesiumBuild = '../../node_modules/cesium/Build/Cesium'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      react(),
      viteStaticCopy({
        targets: ['Workers', 'ThirdParty', 'Assets', 'Widgets'].map((directory) => ({
          src: `${cesiumBuild}/${directory}`,
          dest: 'assets/cesium',
          // Drop `node_modules/cesium/Build/Cesium` from the copied paths
          rename: { stripBase: 4 }
        }))
      })
    ]
  }
})
