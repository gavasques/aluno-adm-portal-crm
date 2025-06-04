
// Configuração centralizada de CORS para todo o projeto
export const CORS_CONFIG = {
  // Origins específicos permitidos (mais seguro que '*')
  allowedOrigins: [
    'https://lovable.dev',
    'https://lovable.app',
    'https://id-preview--615752d4-0ad0-4fbd-9977-45d5385af67b.lovable.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],

  // Headers CORS otimizados
  getHeaders: (origin?: string) => {
    const allowedOrigin = CORS_CONFIG.isOriginAllowed(origin) ? origin : CORS_CONFIG.allowedOrigins[0];
    
    return {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info, cache-control, x-timestamp, x-application-name, x-lovable-origin',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin'
    };
  },

  // Verificar se origin é permitido
  isOriginAllowed: (origin?: string) => {
    if (!origin) return false;
    return CORS_CONFIG.allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace('*', '.*');
        return new RegExp(`^${pattern}$`).test(origin);
      }
      return allowed === origin;
    });
  },

  // Headers específicos para o ambiente Lovable
  getLovableHeaders: (origin?: string) => ({
    'x-lovable-origin': origin || (typeof window !== 'undefined' ? window.location.origin : ''),
    'x-client-info': 'lovable-crm-client',
    'x-application-name': 'crm-lead-management',
  }),

  // Headers completos para Edge Functions
  getEdgeFunctionHeaders: (origin?: string) => ({
    ...CORS_CONFIG.getHeaders(origin),
    ...CORS_CONFIG.getLovableHeaders(origin),
  }),

  // Resposta padronizada para OPTIONS
  createOptionsResponse: (origin?: string) => new Response(null, {
    status: 200,
    headers: CORS_CONFIG.getHeaders(origin)
  }),

  // Resposta com CORS para dados
  createResponse: (data: any, status = 200, origin?: string, additionalHeaders = {}) => new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...CORS_CONFIG.getHeaders(origin),
        'Content-Type': 'application/json',
        ...additionalHeaders
      }
    }
  ),

  // Resposta de erro com CORS
  createErrorResponse: (error: string | any, status = 500, origin?: string) => {
    const errorMessage = typeof error === 'string' ? error : error.message || 'Erro interno';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        timestamp: new Date().toISOString()
      }),
      {
        status,
        headers: {
          ...CORS_CONFIG.getHeaders(origin),
          'Content-Type': 'application/json'
        }
      }
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
  
  isProduction: () => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return !hostname.includes('localhost') && 
           !hostname.includes('127.0.0.1') && 
           !hostname.includes('lovable.dev');
  },
  
  isDevelopment: () => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname.includes('localhost') || hostname.includes('127.0.0.1');
  },
  
  getOrigin: () => typeof window !== 'undefined' ? window.location.origin : '',
  
  // URLs permitidas para CORS - incluindo mais variações do Lovable
  getAllowedOrigins: () => CORS_CONFIG.allowedOrigins
};

// Log centralizado para debug CORS
export const CORS_LOGGER = {
  logRequest: (method: string, url: string, headers: Record<string, string>) => {
    console.log(`🌐 [CORS] ${method} ${url}`, {
      origin: headers.origin || 'no-origin',
      referer: headers.referer || 'no-referer',
      userAgent: headers['user-agent']?.substring(0, 50) || 'unknown',
      lovableOrigin: headers['x-lovable-origin'] || 'not-set',
      isAllowed: CORS_CONFIG.isOriginAllowed(headers.origin),
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
