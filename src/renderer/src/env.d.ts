/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RENDERER_VITE_CESIUM_ACCESS_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
