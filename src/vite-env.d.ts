/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_REQUEST_TIMEOUT: string
  readonly VITE_ENABLE_LOGS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}