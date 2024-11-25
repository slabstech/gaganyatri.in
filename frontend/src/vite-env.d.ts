/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GAGANYATRI_HF_SPACES_URL: string;
    readonly VITE_GAGANYATRI_LOCAL_INFERENCE_URL: string;
    readonly VITE_GAGANYATRI_BACKEND_APP_API_URL: string;
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }