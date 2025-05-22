
// Utilitários e configurações compartilhadas

// Definir headers CORS para permitir o acesso a partir do frontend
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Função para criar o cliente do Supabase com role de administrador
export function createSupabaseAdminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        persistSession: false,
      }
    }
  );
}

// Função para lidar com as requisições OPTIONS (CORS)
export function handleOptionsRequest() {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
}

// Importar dependências necessárias
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
