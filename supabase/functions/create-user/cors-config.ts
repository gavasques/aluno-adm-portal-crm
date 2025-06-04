
// Configuração CORS centralizada para Edge Functions
export const CORS_CONFIG = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info, cache-control, x-timestamp, x-application-name, x-lovable-origin',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
  },

  createOptionsResponse: () => new Response(null, {
    status: 200,
    headers: CORS_CONFIG.headers
  }),

  createSuccessResponse: (data: any, status = 200) => new Response(
    JSON.stringify(data),
    {
      status,
      headers: CORS_CONFIG.headers
    }
  ),

  createErrorResponse: (error: string | any, status = 500) => {
    const errorMessage = typeof error === 'string' ? error : error.message || 'Erro interno';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        timestamp: new Date().toISOString()
      }),
      {
        status,
        headers: CORS_CONFIG.headers
      }
    );
  }
};

// Log centralizado para debug CORS
export const CORS_LOGGER = {
  logRequest: (method: string, url: string, headers: Record<string, string>) => {
    console.log(`🌐 [CORS] ${method} ${url}`, {
      origin: headers.origin || 'no-origin',
      referer: headers.referer || 'no-referer',
      userAgent: headers['user-agent']?.substring(0, 50) || 'unknown',
      corsHeaders: {
        'access-control-request-method': headers['access-control-request-method'],
        'access-control-request-headers': headers['access-control-request-headers']
      },
      timestamp: new Date().toISOString()
    });
  },
  
  logResponse: (status: number, corsHeaders: Record<string, string>) => {
    console.log(`📤 [CORS] Response ${status}`, {
      corsHeaders: {
        'access-control-allow-origin': corsHeaders['Access-Control-Allow-Origin'],
        'access-control-allow-methods': corsHeaders['Access-Control-Allow-Methods'],
        'access-control-allow-headers': corsHeaders['Access-Control-Allow-Headers']
      },
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
