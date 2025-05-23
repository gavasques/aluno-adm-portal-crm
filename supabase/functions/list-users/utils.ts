
// Importar dependências necessárias
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

// Definir headers CORS para permitir o acesso a partir do frontend
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-timestamp',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400', // 24 horas para reduzir pré-voos CORS
};

// Função para criar o cliente do Supabase com role de administrador
export function createSupabaseAdminClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseServiceRole) {
    console.error("Variáveis de ambiente necessárias não configuradas:", {
      urlDefined: !!supabaseUrl,
      keyDefined: !!supabaseServiceRole
    });
    throw new Error("Configuração de ambiente incompleta - verifique SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY");
  }
  
  console.log("Criando cliente Supabase Admin com SERVICE_ROLE_KEY");
  console.log("URL do Supabase:", supabaseUrl);
  console.log("Service Role Key definida:", !!supabaseServiceRole);
  
  return createClient(
    supabaseUrl,
    supabaseServiceRole,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    }
  );
}

// Função para lidar com as requisições OPTIONS (CORS)
export function handleOptionsRequest() {
  console.log("Respondendo a requisição OPTIONS com cabeçalhos CORS");
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
}
