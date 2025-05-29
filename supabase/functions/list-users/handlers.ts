
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "./_shared/cors.ts";
import { processUsersForResponse } from "./userProcessing.ts";
import { deleteUserOperation } from "./userOperations.ts";

export async function handleGetRequest(supabaseAdmin: SupabaseClient): Promise<Response> {
  console.log("[handleGetRequest] 📡 Processando requisição GET para listar usuários");
  console.log("[handleGetRequest] 🕐 Timestamp:", new Date().toISOString());
  
  try {
    console.log("[handleGetRequest] 🔑 Cliente admin verificado, buscando usuários...");
    
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) {
      console.error("[handleGetRequest] ❌ Erro ao buscar usuários do auth:", authError);
      throw new Error(`Erro ao buscar usuários: ${authError.message}`);
    }
    
    console.log(`[handleGetRequest] ✅ Obtidos ${authUsers.users.length} usuários do auth`);
    
    const processedUsers = await processUsersForResponse(supabaseAdmin, authUsers.users);
    
    console.log(`[handleGetRequest] 📊 Retornando ${processedUsers.length} usuários processados com status 200`);
    
    return new Response(
      JSON.stringify({ users: processedUsers }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    );
  } catch (error: any) {
    console.error("[handleGetRequest] ❌ Erro crítico:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        users: []
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
}

export async function handlePostRequest(req: Request, supabaseAdmin: SupabaseClient): Promise<Response> {
  console.log("[handlePostRequest] 🔥 RECEBIDA REQUISIÇÃO POST - DELETE USER");
  console.log("[handlePostRequest] 🕐 Timestamp:", new Date().toISOString());
  console.log("[handlePostRequest] 📋 Headers:", Object.fromEntries(req.headers.entries()));
  
  try {
    const body = await req.json();
    console.log("[handlePostRequest] 📦 Body recebido:", JSON.stringify(body, null, 2));
    
    const { action, userId, email } = body;
    
    if (action === 'deleteUser') {
      console.log(`[handlePostRequest] 🗑️ AÇÃO DE EXCLUSÃO DETECTADA`);
      console.log(`[handlePostRequest] 👤 Usuário alvo: ${email} (${userId})`);
      console.log(`[handlePostRequest] 🔍 Validando parâmetros...`);
      
      if (!userId || !email) {
        console.error(`[handlePostRequest] ❌ Parâmetros obrigatórios faltando:`, { userId, email });
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'userId e email são obrigatórios para exclusão' 
          }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: 400 
          }
        );
      }
      
      console.log(`[handlePostRequest] ✅ Parâmetros válidos, iniciando operação de exclusão...`);
      console.log(`[handlePostRequest] 🚀 Chamando deleteUserOperation...`);
      
      const result = await deleteUserOperation(supabaseAdmin, userId, email);
      
      console.log(`[handlePostRequest] 📊 Resultado final da exclusão:`, JSON.stringify(result, null, 2));
      
      if (result.success) {
        console.log(`[handlePostRequest] ✅ Exclusão bem-sucedida para ${email}`);
      } else {
        console.error(`[handlePostRequest] ❌ Falha na exclusão para ${email}:`, result.error);
      }
      
      return new Response(
        JSON.stringify(result),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: result.success ? 200 : 400 
        }
      );
    }
    
    console.error(`[handlePostRequest] ❌ Ação não reconhecida: ${action}`);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Ação não reconhecida: ${action}` 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 400 
      }
    );
    
  } catch (error: any) {
    console.error("[handlePostRequest] ❌ ERRO CRÍTICO INESPERADO:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Erro interno: ${error.message}` 
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
}
