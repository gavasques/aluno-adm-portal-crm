
// Arquivo principal da Edge Function

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, createSupabaseAdminClient, handleOptionsRequest } from './utils.ts';
import { handlePostRequest, handleGetRequest } from './handlers.ts';

// Função principal que processa as requisições
serve(async (req) => {
  console.log(`Recebendo requisição ${req.method} para list-users`);
  
  // Lidar com requisições OPTIONS (pre-flight CORS)
  if (req.method === 'OPTIONS') {
    return handleOptionsRequest();
  }

  try {
    // Criar cliente Supabase com token service_role
    const supabaseAdmin = createSupabaseAdminClient();
    
    // Processar requisições com base no método HTTP
    if (req.method === 'POST') {
      return await handlePostRequest(req, supabaseAdmin);
    } else {
      // Requisições GET (listar usuários)
      return await handleGetRequest(supabaseAdmin);
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro ao processar requisição"
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
