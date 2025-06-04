
import { CORS_CONFIG, CORS_LOGGER } from "./cors-config.ts";
import { createSupabaseAdminClient } from "./utils.ts";
import { handleGetRequest, handlePostRequest } from "./handlers.ts";

console.log("🚀 [EDGE FUNCTION] list-users iniciada");
console.log("🚀 [EDGE FUNCTION] Timestamp:", new Date().toISOString());

Deno.serve(async (req) => {
  const method = req.method;
  const url = new URL(req.url);
  const headers = Object.fromEntries(req.headers.entries());
  
  // Log da requisição com informações CORS
  CORS_LOGGER.logRequest(method, url.pathname, headers);
  
  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    console.log("⚙️ [EDGE FUNCTION] Processando requisição OPTIONS (CORS)");
    const response = CORS_CONFIG.createOptionsResponse();
    CORS_LOGGER.logResponse(200, CORS_CONFIG.headers);
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
      result = await handleGetRequest(supabaseAdmin);
    } 
    else if (method === 'POST') {
      console.log("📝 [EDGE FUNCTION] Processando POST request...");
      console.log("🗑️ [EDGE FUNCTION] Esta é provavelmente uma operação de DELETE");
      result = await handlePostRequest(req, supabaseAdmin);
    } 
    else {
      console.error(`❌ [EDGE FUNCTION] Método não suportado: ${method}`);
      return CORS_CONFIG.createErrorResponse(`Método ${method} não suportado`, 405);
    }
    
    // Log da resposta bem-sucedida
    CORS_LOGGER.logResponse(result.status, CORS_CONFIG.headers);
    return result;
    
  } catch (error: any) {
    console.error("💥 [EDGE FUNCTION] Erro crítico na função principal:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    CORS_LOGGER.logError(error, "função principal");
    return CORS_CONFIG.createErrorResponse("Erro interno do servidor: " + error.message, 500);
  }
});
