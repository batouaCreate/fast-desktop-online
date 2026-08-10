/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MERCURE_SUBSCRIBER_JWT_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
