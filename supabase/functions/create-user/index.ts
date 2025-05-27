
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

import { corsHeaders, handleCorsRequest } from './cors.ts';
import { validateAuthToken, checkAdminPermissions } from './auth.ts';
import { parseRequestBody, handleUserCreation } from './request-handler.ts';
import { CreateUserResponse } from './types.ts';

console.log("Edge Function create-user inicializada");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsRequest();
  }

  try {
    console.log("=== INÍCIO CRIAÇÃO DE USUÁRIO ===");
    console.log(`Método: ${req.method}`);
    console.log(`URL: ${req.url}`);

    if (req.method !== 'POST') {
      console.error("❌ Método não permitido:", req.method);
      return new Response(
        JSON.stringify({ error: 'Método não permitido' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar cliente Supabase com service_role para admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log("✅ Cliente Supabase Admin criado");

    // Validar token de autorização
    const user = await validateAuthToken(req.headers.get('authorization'), supabaseAdmin);
    console.log("✅ Token validado para usuário:", user.email);

    // Verificar permissões administrativas
    await checkAdminPermissions(user, supabaseAdmin);
    console.log("✅ Permissões administrativas confirmadas");

    // Processar dados da requisição
    const userData = await parseRequestBody(req);
    console.log("✅ Dados da requisição processados");

    // Criar o usuário
    const result = await handleUserCreation(userData, supabaseAdmin);
    
    console.log("✅ Resultado da criação:", result);
    console.log("=== FIM CRIAÇÃO DE USUÁRIO ===");
    
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("=== ERRO NA CRIAÇÃO DE USUÁRIO ===");
    console.error("Erro:", error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("===================================");
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor',
        details: error.stack ? error.stack.substring(0, 500) : 'Sem stack trace'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
