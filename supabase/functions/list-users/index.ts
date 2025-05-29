
import { createSupabaseAdminClient, corsHeaders } from "./utils.ts";
import { handleGetRequest, handlePostRequest } from "./handlers.ts";

console.log("🚀 [EDGE FUNCTION] list-users iniciada");
console.log("🚀 [EDGE FUNCTION] Timestamp:", new Date().toISOString());

Deno.serve(async (req) => {
  const method = req.method;
  const url = new URL(req.url);
  
  console.log(`📡 [EDGE FUNCTION] Recebida requisição ${method} para ${url.pathname}`);
  console.log(`📡 [EDGE FUNCTION] Headers:`, Object.fromEntries(req.headers.entries()));
  
  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    console.log("⚙️ [EDGE FUNCTION] Processando requisição OPTIONS (CORS)");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Criar cliente admin do Supabase
    console.log("🔑 [EDGE FUNCTION] Criando cliente admin...");
    const supabaseAdmin = createSupabaseAdminClient();
    console.log("✅ [EDGE FUNCTION] Cliente admin criado com sucesso");
    
    if (method === 'GET') {
      console.log("📖 [EDGE FUNCTION] Processando GET request...");
      return await handleGetRequest(supabaseAdmin);
    } 
    else if (method === 'POST') {
      console.log("📝 [EDGE FUNCTION] Processando POST request...");
      console.log("🗑️ [EDGE FUNCTION] Esta é provavelmente uma operação de DELETE");
      return await handlePostRequest(req, supabaseAdmin);
    } 
    else {
      console.error(`❌ [EDGE FUNCTION] Método não suportado: ${method}`);
      return new Response(
        JSON.stringify({ error: `Método ${method} não suportado` }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 405 
        }
      );
    }
  } catch (error: any) {
    console.error("💥 [EDGE FUNCTION] Erro crítico na função principal:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({ 
        error: "Erro interno do servidor",
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    );
  }
});
