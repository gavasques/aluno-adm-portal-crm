
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "./_shared/cors.ts";

export const createSupabaseAdminClient = () => {
  return createClient(
    // Deno.env.get() is used within Supabase Functions environment
    Deno.env.get('SUPABASE_URL') ?? '',
    // Use service_role key to bypass RLS
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
};

// Função para lidar com requisições OPTIONS (CORS preflight)
export function handleOptionsRequest() {
  console.log("Respondendo a requisição OPTIONS com cabeçalhos CORS");
  
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// Re-exportar corsHeaders para uso em outros arquivos
export { corsHeaders };
