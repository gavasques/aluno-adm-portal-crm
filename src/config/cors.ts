
// Configuração centralizada de CORS para todo o projeto
export const CORS_CONFIG = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info, cache-control, x-timestamp, x-application-name, x-lovable-origin',
    'Access-Control-Max-Age': '86400', // 24 horas
  },
  
  // Headers específicos para o ambiente Lovable
  getLovableHeaders: (origin?: string) => ({
    'x-lovable-origin': origin || (typeof window !== 'undefined' ? window.location.origin : ''),
    'x-client-info': 'lovable-crm-client',
    'x-application-name': 'crm-lead-management',
  }),
  
  // Headers completos para Edge Functions
  getEdgeFunctionHeaders: (origin?: string) => ({
    ...CORS_CONFIG.headers,
    ...CORS_CONFIG.getLovableHeaders(origin),
  }),
  
  // Resposta padronizada para OPTIONS
  createOptionsResponse: () => new Response(null, {
    status: 200,
    headers: CORS_CONFIG.headers
  }),
  
  // Resposta com CORS para dados
  createResponse: (data: any, status = 200, additionalHeaders = {}) => new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...CORS_CONFIG.headers,
        'Content-Type': 'application/json',
        ...additionalHeaders
      }
    }
  ),
  
  // Resposta de erro com CORS
  createErrorResponse: (error: string | any, status = 500) => {
    const errorMessage = typeof error === 'string' ? error : error.message || 'Erro interno';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        timestamp: new Date().toISOString()
      }),
      {
        status,
        headers: {
          ...CORS_CONFIG.headers,
          'Content-Type': 'application/json'
        }
      }
    );
  }
};

// Utilitário para detectar ambiente
export const ENVIRONMENT = {
  isLovable: () => typeof window !== 'undefined' && window.location.hostname.includes('lovable.dev'),
  isProduction: () => typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('lovable.dev'),
  isDevelopment: () => typeof window !== 'undefined' && (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')),
  
  getOrigin: () => typeof window !== 'undefined' ? window.location.origin : '',
  
  // URLs permitidas para CORS
  getAllowedOrigins: () => [
    'https://lovable.dev',
    'https://id-preview--615752d4-0ad0-4fbd-9977-45d5385af67b.lovable.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ]
};

// Log centralizado para debug CORS
export const CORS_LOGGER = {
  logRequest: (method: string, url: string, headers: Record<string, string>) => {
    console.log(`🌐 [CORS] ${method} ${url}`, {
      origin: headers.origin || 'no-origin',
      referer: headers.referer || 'no-referer',
      userAgent: headers['user-agent']?.substring(0, 50) || 'unknown',
      timestamp: new Date().toISOString()
    });
  },
  
  logResponse: (status: number, corsHeaders: Record<string, string>) => {
    console.log(`📤 [CORS] Response ${status}`, {
      corsHeaders,
      timestamp: new Date().toISOString()
    });
  },
  
  logError: (error: any, context: string) => {
    console.error(`❌ [CORS] ${context}:`, {
      error: error.message || error,
      stack: error.stack?.substring(0, 300),
      timestamp: new Date().toISOString()
    });
  }
};
