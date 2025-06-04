
import { createSupabaseAdminClient } from "./utils.ts";
import { handleGetRequest, handlePostRequest } from "./handlers.ts";

console.log("🚀 [EDGE FUNCTION] list-users iniciada");
console.log("🚀 [EDGE FUNCTION] Timestamp:", new Date().toISOString());

// Configuração CORS otimizada para Lovable
const CORS_CONFIG = {
  allowedOrigins: [
    'https://lovable.dev',
    'https://lovable.app', 
    'https://id-preview--615752d4-0ad0-4fbd-9977-45d5385af67b.lovable.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],

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

  createOptionsResponse: (origin?: string) => new Response(null, {
    status: 200,
    headers: CORS_CONFIG.getHeaders(origin)
  }),

  createResponse: (data: any, status = 200, origin?: string) => new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...CORS_CONFIG.getHeaders(origin),
        'Content-Type': 'application/json'
      }
    }
  ),

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

const CORS_LOGGER = {
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

Deno.serve(async (req) => {
  const method = req.method;
  const url = new URL(req.url);
  const headers = Object.fromEntries(req.headers.entries());
  const origin = headers.origin || headers.referer?.split('/').slice(0, 3).join('/');
  
  // Log da requisição com informações CORS
  CORS_LOGGER.logRequest(method, url.pathname, headers);
  
  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    console.log("⚙️ [EDGE FUNCTION] Processando requisição OPTIONS (CORS)");
    const response = CORS_CONFIG.createOptionsResponse(origin);
    CORS_LOGGER.logResponse(200, CORS_CONFIG.getHeaders(origin));
    return response;
  }

  try {
    // Criar cliente admin do Supabase
    console.log("🔑 [EDGE FUNCTION] Criando cliente admin...");
    const supabaseAdmin = createSupabaseAdminClient();
    console.log("✅ [EDGE FUNCTION] Cliente admin criado com sucesso");
    
    let result;
    
    if (method === 'GET') {
      console.log("📖 [EDGE FUNCTION] Processando GET request...");
      const data = await handleGetRequest(supabaseAdmin);
      result = CORS_CONFIG.createResponse(data, 200, origin);
    } 
    else if (method === 'POST') {
      console.log("📝 [EDGE FUNCTION] Processando POST request...");
      console.log("🗑️ [EDGE FUNCTION] Esta é provavelmente uma operação de DELETE");
      const data = await handlePostRequest(req, supabaseAdmin);
      result = CORS_CONFIG.createResponse(data, 200, origin);
    } 
    else {
      console.error(`❌ [EDGE FUNCTION] Método não suportado: ${method}`);
      return CORS_CONFIG.createErrorResponse(`Método ${method} não suportado`, 405, origin);
    }
    
    // Log da resposta bem-sucedida
    CORS_LOGGER.logResponse(result.status, CORS_CONFIG.getHeaders(origin));
    return result;
    
  } catch (error: any) {
    console.error("💥 [EDGE FUNCTION] Erro crítico na função principal:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    CORS_LOGGER.logError(error, "função principal");
    return CORS_CONFIG.createErrorResponse("Erro interno do servidor: " + error.message, 500, origin);
  }
});
