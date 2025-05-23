
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

// Re-exportar corsHeaders para uso em outros arquivos
export { corsHeaders };
