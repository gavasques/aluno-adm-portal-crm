
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "./_shared/cors.ts";
import { processUsersForResponse } from "./userProcessing.ts";
import { deleteUserOperation } from "./userOperations.ts";

export async function handleGetRequest(supabaseAdmin: SupabaseClient): Promise<Response> {
  console.log("[handleGetRequest] Processando requisição GET para listar usuários");
  
  try {
    console.log("[handleGetRequest] Cliente admin verificado, buscando usuários...");
    
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) {
      console.error("Erro ao buscar usuários do auth:", authError);
      throw new Error(`Erro ao buscar usuários: ${authError.message}`);
    }
    
    console.log(`[handleGetRequest] Obtidos ${authUsers.users.length} usuários do auth`);
    
    const processedUsers = await processUsersForResponse(supabaseAdmin, authUsers.users);
    
    console.log(`[handleGetRequest] Retornando ${processedUsers.length} usuários processados com status 200`);
    
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
    console.error("Erro no handleGetRequest:", error);
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
  console.log("[handlePostRequest] Processando requisição POST");
  
  try {
    const body = await req.json();
    console.log("[handlePostRequest] Body recebido:", body);
    
    const { action, userId, email } = body;
    
    if (action === 'deleteUser') {
      console.log(`[handlePostRequest] Executando exclusão de usuário: ${email} (${userId})`);
      
      if (!userId || !email) {
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
      
      const result = await deleteUserOperation(supabaseAdmin, userId, email);
      
      console.log(`[handlePostRequest] Resultado da exclusão:`, result);
      
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
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Ação não reconhecida' 
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
    console.error("Erro no handlePostRequest:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
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
