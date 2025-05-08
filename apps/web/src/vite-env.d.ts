/// <reference types="vite/client" />
interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly GOOGLE_GENERATIVE_AI_API_KEY: string;
  readonly VITE_AMPLITUDE_API_KEY: string;
  readonly SHOPIFY_STORE_DOMAIN: string;
  readonly SHOPIFY_STOREFRONT_ACCESS_TOKEN: string;
  readonly VERCEL_PROJECT_PRODUCTION_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
