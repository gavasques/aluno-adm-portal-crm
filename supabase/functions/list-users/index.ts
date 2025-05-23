
import { serve } from "https://deno.land/std@0.202.0/http/server.ts";
import { corsHeaders } from "./_shared/cors.ts";
import { handleGetRequest, handlePostRequest } from "./handlers.ts";
import { createSupabaseAdminClient } from "./utils.ts";

console.log("Edge Function list-users inicializada");

// Função principal que processa as requisições
serve(async (req) => {
  console.log(`Recebendo requisição ${req.method} para list-users na URL: ${req.url}`);
  
  try {
    // Lidar com requisições OPTIONS (pre-flight CORS)
    if (req.method === 'OPTIONS') {
      console.log("Processando requisição OPTIONS");
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Criar cliente Supabase com token service_role
    console.log("Criando cliente Supabase Admin...");
    const supabaseAdmin = createSupabaseAdminClient();
    console.log("Cliente Supabase Admin criado com sucesso");
    
    // Processar requisições com base no método HTTP
    if (req.method === 'GET') {
      console.log("Encaminhando para o handler GET");
      const response = await handleGetRequest(supabaseAdmin);
      // Garantir que os headers CORS estejam na resposta GET
      const responseHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });
      
      console.log("Headers da resposta GET:", Object.fromEntries(responseHeaders.entries()));
      
      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    } else if (req.method === 'POST') {
      console.log("Encaminhando para o handler POST");
      const response = await handlePostRequest(req, supabaseAdmin);
      // Garantir que os headers CORS estejam na resposta POST
      const responseHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });
      
      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    } else {
      // Método não suportado
      console.error(`Método não suportado: ${req.method}`);
      return new Response(
        JSON.stringify({ 
          error: `Método não suportado: ${req.method}` 
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 405 
        }
      );
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro ao processar requisição",
        stack: error.stack,
        timestamp: new Date().toISOString()
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
