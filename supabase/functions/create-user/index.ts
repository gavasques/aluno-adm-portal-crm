
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { validateAuthToken, checkAdminPermissions } from './auth.ts';
import { parseRequestBody, handleUserCreation } from './request-handler.ts';

console.log("🚀 [EDGE FUNCTION] create-user iniciada");
console.log("🚀 [EDGE FUNCTION] Timestamp:", new Date().toISOString());

// Configuração CORS simplificada
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json'
};

function createResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders
  });
}

function createErrorResponse(error: string | any, status = 500) {
  const errorMessage = typeof error === 'string' ? error : error.message || 'Erro interno';
  return new Response(JSON.stringify({ 
    error: errorMessage,
    timestamp: new Date().toISOString()
  }), {
    status,
    headers: corsHeaders
  });
}

serve(async (req) => {
  const method = req.method;
  const url = new URL(req.url);
  
  console.log(`🌐 [EDGE FUNCTION] ${method} ${url.pathname}`);
  
  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    console.log("⚙️ [EDGE FUNCTION] Processando requisição OPTIONS (CORS)");
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    console.log("=== INÍCIO CRIAÇÃO DE USUÁRIO ===");
    console.log(`Método: ${method}`);
    console.log(`URL: ${url}`);

    if (method !== 'POST') {
      console.error("❌ Método não permitido:", method);
      return createErrorResponse('Método não permitido', 405);
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
    
    return createResponse(result, 200);

  } catch (error: any) {
    console.error("=== ERRO NA CRIAÇÃO DE USUÁRIO ===");
    console.error("Erro:", error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("===================================");
    
    return createErrorResponse(
      error.message || 'Erro interno do servidor',
      500
    );
  }
});
