
// Configuração centralizada de CORS para todo o projeto
export const CORS_CONFIG = {
  // Origins específicos permitidos
  allowedOrigins: [
    'https://lovable.dev',
    'https://lovable.app',
    'https://id-preview--615752d4-0ad0-4fbd-9977-45d5385af67b.lovable.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],

  // Headers CORS simplificados
  getHeaders: (origin?: string) => ({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
  }),

  // Verificar se origin é permitido
  isOriginAllowed: (origin?: string) => {
    if (!origin) return false;
    return CORS_CONFIG.allowedOrigins.some(allowed => 
      allowed === origin || origin.includes('lovable')
    );
  }
};

// Utilitário para detectar ambiente
export const ENVIRONMENT = {
  isLovable: () => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname.includes('lovable.dev') || hostname.includes('lovable.app');
  },
  
  getOrigin: () => typeof window !== 'undefined' ? window.location.origin : '',
  
  getAllowedOrigins: () => CORS_CONFIG.allowedOrigins
};
