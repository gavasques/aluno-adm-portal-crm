
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { CORS_CONFIG, CORS_LOGGER } from "../../../src/config/cors.ts";
import { validateAuthToken, checkAdminPermissions } from './auth.ts';
import { parseRequestBody, handleUserCreation } from './request-handler.ts';

console.log("🚀 [EDGE FUNCTION] create-user iniciada");
console.log("🚀 [EDGE FUNCTION] Timestamp:", new Date().toISOString());

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
