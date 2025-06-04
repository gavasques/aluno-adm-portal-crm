
import { createSupabaseAdminClient } from "./utils.ts";
import { handleGetRequest, handlePostRequest } from "./handlers.ts";
import { CORS_CONFIG, CORS_LOGGER } from "../../../src/config/cors.ts";

console.log("🚀 [EDGE FUNCTION] list-users iniciada");
console.log("🚀 [EDGE FUNCTION] Timestamp:", new Date().toISOString());

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
