
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "./utils.ts";
import { processUsersForResponse } from "./userProcessing.ts";
import { deleteUserOperation, testDeleteConnectivity } from "./userOperations.ts";

export async function handleGetRequest(supabaseAdmin: SupabaseClient): Promise<Response> {
  console.log("[handleGetRequest] 🚀 ===== INICIANDO GET REQUEST =====");
  console.log("[handleGetRequest] 🕐 Timestamp:", new Date().toISOString());
  
  try {
    console.log("[handleGetRequest] 🔑 Cliente admin verificado, buscando usuários...");
    
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) {
      console.error("[handleGetRequest] ❌ Erro ao buscar usuários do auth:", authError);
      throw new Error(`Erro ao buscar usuários: ${authError.message}`);
    }
    
    console.log(`[handleGetRequest] ✅ Obtidos ${authUsers.users.length} usuários do auth`);
    console.log(`[handleGetRequest] 📊 Primeiros usuários:`, authUsers.users.slice(0, 2).map(u => ({ id: u.id, email: u.email })));
    
    const processedUsers = await processUsersForResponse(authUsers.users, supabaseAdmin);
    
    console.log(`[handleGetRequest] 📊 Retornando ${processedUsers.length} usuários processados com status 200`);
    console.log(`[handleGetRequest] 👥 Usuários processados:`, processedUsers.map(u => ({ email: u.email, status: u.status })));
    
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
  console.log("[handlePostRequest] 🔥 ===== RECEBIDA REQUISIÇÃO POST =====");
  console.log("[handlePostRequest] 🕐 Timestamp:", new Date().toISOString());
  console.log("[handlePostRequest] 📋 Headers:", Object.fromEntries(req.headers.entries()));
  console.log("[handlePostRequest] 🌐 URL:", req.url);
  console.log("[handlePostRequest] 📊 Method:", req.method);
  
  try {
    const body = await req.json();
    console.log("[handlePostRequest] 📦 Body recebido:", JSON.stringify(body, null, 2));
    
    const { action, userId, email } = body;
    
    // Adicionar endpoint de teste de conectividade
    if (action === 'testConnectivity') {
      console.log("[handlePostRequest] 🧪 TESTE DE CONECTIVIDADE SOLICITADO");
      
      const testResult = await testDeleteConnectivity(supabaseAdmin);
      console.log("[handlePostRequest] 🧪 Resultado do teste:", testResult);
      
      return new Response(
        JSON.stringify(testResult),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: testResult.success ? 200 : 500 
        }
      );
    }
    
    if (action === 'deleteUser') {
      console.log(`[handlePostRequest] 🗑️ ===== AÇÃO DE EXCLUSÃO DETECTADA =====`);
      console.log(`[handlePostRequest] 👤 Usuário alvo: ${email} (${userId})`);
      console.log(`[handlePostRequest] 🔍 Validando parâmetros obrigatórios...`);
      
      if (!userId || !email) {
        console.error(`[handlePostRequest] ❌ VALIDAÇÃO FALHOU: Parâmetros obrigatórios faltando:`, { userId, email });
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
      console.log(`[handlePostRequest] 🚀 Chamando deleteUserOperation com timeout de 30s...`);
      
      // Implementar timeout para a operação
      const deletePromise = deleteUserOperation(supabaseAdmin, userId, email);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout na operação de exclusão')), 30000)
      );
      
      try {
        const result = await Promise.race([deletePromise, timeoutPromise]) as any;
        
        console.log(`[handlePostRequest] 📊 Resultado final da exclusão:`, JSON.stringify(result, null, 2));
        console.log(`[handlePostRequest] 🔍 Detalhes do resultado:`, {
          success: result.success,
          error: result.error || 'Nenhum erro',
          message: result.message || 'Nenhuma mensagem',
          inactivated: result.inactivated || false,
          timestamp: new Date().toISOString()
        });
        
        if (result.success) {
          if (result.inactivated) {
            console.log(`[handlePostRequest] ⚠️ Usuário ${email} foi INATIVADO (não excluído)`);
          } else {
            console.log(`[handlePostRequest] ✅ Usuário ${email} foi EXCLUÍDO com sucesso`);
          }
        } else {
          console.error(`[handlePostRequest] ❌ FALHA na exclusão para ${email}:`, result.error);
        }
        
        return new Response(
          JSON.stringify({
            ...result,
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID()
          }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: result.success ? 200 : 400 
          }
        );
      } catch (timeoutError) {
        console.error(`[handlePostRequest] ⏰ TIMEOUT na exclusão para ${email}:`, timeoutError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Timeout na operação de exclusão: ${timeoutError.message}`,
            timestamp: new Date().toISOString()
          }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: 408 
          }
        );
      }
    }
    
    console.error(`[handlePostRequest] ❌ Ação não reconhecida: ${action}`);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Ação não reconhecida: ${action}. Ações disponíveis: deleteUser, testConnectivity` 
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
      timestamp: new Date().toISOString(),
      url: req.url
    });
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Erro interno crítico: ${error.message}`,
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
}
