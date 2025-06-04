
import { createSupabaseAdminClient } from "./utils.ts";
import { handleGetRequest, handlePostRequest } from "./handlers.ts";

console.log("🚀 [EDGE FUNCTION] list-users iniciada");
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

Deno.serve(async (req) => {
  const method = req.method;
  const url = new URL(req.url);
  
  console.log(`🌐 [EDGE FUNCTION] ${method} ${url.pathname}`);
  
  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    console.log("⚙️ [EDGE FUNCTION] Processando requisição OPTIONS (CORS)");
    return new Response(null, { status: 200, headers: corsHeaders });
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
      result = createResponse(data, 200);
    } 
    else if (method === 'POST') {
      console.log("📝 [EDGE FUNCTION] Processando POST request...");
      const data = await handlePostRequest(req, supabaseAdmin);
      result = createResponse(data, 200);
    } 
    else {
      console.error(`❌ [EDGE FUNCTION] Método não suportado: ${method}`);
      return createErrorResponse(`Método ${method} não suportado`, 405);
    }
    
    console.log(`✅ [EDGE FUNCTION] Resposta enviada com status ${result.status}`);
    return result;
    
  } catch (error: any) {
    console.error("💥 [EDGE FUNCTION] Erro crítico na função principal:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return createErrorResponse("Erro interno do servidor: " + error.message, 500);
  }
});
