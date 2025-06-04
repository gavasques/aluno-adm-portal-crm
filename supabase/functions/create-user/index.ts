
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { validateAuthToken, checkAdminPermissions } from './auth.ts';
import { parseRequestBody, handleUserCreation } from './request-handler.ts';

console.log("🚀 [EDGE FUNCTION] create-user iniciada");
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

serve(async (req) => {
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
    console.log("=== INÍCIO CRIAÇÃO DE USUÁRIO ===");
    console.log(`Método: ${method}`);
    console.log(`URL: ${url}`);

    if (method !== 'POST') {
      console.error("❌ Método não permitido:", method);
      return CORS_CONFIG.createErrorResponse('Método não permitido', 405, origin);
    }

    // Criar cliente Supabase com service_role para admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log("✅ Cliente Supabase Admin criado");

    // Validar token de autorização
    const user = await validateAuthToken(req.headers.get('authorization'), supabaseAdmin);
    console.log("✅ Token validado para usuário:", user.email);

    // Verificar permissões administrativas
    await checkAdminPermissions(user, supabaseAdmin);
    console.log("✅ Permissões administrativas confirmadas");

    // Processar dados da requisição
    const userData = await parseRequestBody(req);
    console.log("✅ Dados da requisição processados");

    // Criar o usuário
    const result = await handleUserCreation(userData, supabaseAdmin);
    
    console.log("✅ Resultado da criação:", result);
    console.log("=== FIM CRIAÇÃO DE USUÁRIO ===");
    
    CORS_LOGGER.logResponse(200, CORS_CONFIG.getHeaders(origin));
    return CORS_CONFIG.createResponse(result, 200, origin);

  } catch (error: any) {
    console.error("=== ERRO NA CRIAÇÃO DE USUÁRIO ===");
    console.error("Erro:", error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("===================================");
    
    CORS_LOGGER.logError(error, "criação de usuário");
    return CORS_CONFIG.createErrorResponse(
      error.message || 'Erro interno do servidor',
      500,
      origin
    );
  }
});
