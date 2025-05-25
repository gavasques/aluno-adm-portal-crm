
import { corsHeaders } from "./_shared/cors.ts";
import { createUser, inviteUser, deleteUser, toggleUserStatus } from "./userOperations.ts";
import { processUsersForResponse } from "./userProcessing.ts";

// Handler para requisições GET (listar usuários)
export const handleGetRequest = async (supabaseAdmin: any) => {
  try {
    console.log("Processando requisição GET para listar usuários");
    
    // Verificar se o cliente admin está funcionando
    if (!supabaseAdmin) {
      console.error("Cliente Supabase Admin não disponível");
      return new Response(
        JSON.stringify({ error: "Erro interno: cliente admin não disponível" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
    
    console.log("Cliente admin verificado, buscando usuários...");
    
    // Buscar usuários do auth
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error("Erro ao buscar usuários do auth:", authError);
      return new Response(
        JSON.stringify({ error: authError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
    
    console.log(`Obtidos ${authUsers?.users?.length || 0} usuários do auth`);
    
    // Buscar perfis
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*');
      
    if (profilesError) {
      console.error("Erro ao buscar perfis:", profilesError);
    }
    
    // Processar usuários para resposta
    const processedUsers = await processUsersForResponse(authUsers?.users || [], profiles || []);
    
    console.log(`Retornando ${processedUsers.length} usuários processados com status 200`);
    console.log("Amostra de dados:", processedUsers.slice(0, 2));
    
    return new Response(
      JSON.stringify({ users: processedUsers }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Erro no handler GET:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
};

// Handler para requisições POST (operações de usuário)
export const handlePostRequest = async (req: Request, supabaseAdmin: any) => {
  try {
    console.log("Processando requisição POST");
    
    const requestBody = await req.json();
    console.log("Dados recebidos:", { ...requestBody, password: requestBody.password ? '***' : undefined });
    
    const { action } = requestBody;
    console.log("Executando ação:", action);
    
    let result;
    
    switch (action) {
      case 'create':
      case 'createUser':
        result = await createUser(supabaseAdmin, requestBody);
        break;
        
      case 'invite':
      case 'inviteUser':
        result = await inviteUser(supabaseAdmin, requestBody);
        break;
        
      case 'delete':
      case 'deleteUser':
        result = await deleteUser(supabaseAdmin, requestBody);
        break;
        
      case 'toggleStatus':
      case 'toggleUserStatus':
        result = await toggleUserStatus(supabaseAdmin, requestBody);
        break;
        
      default:
        console.error("Ação não reconhecida:", action);
        return new Response(
          JSON.stringify({ error: `Ação não suportada: ${action}` }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
    }
    
    console.log("Resultado da operação:", result);
    
    // Determinar status HTTP baseado no resultado
    let statusCode = 200;
    if (result.error) {
      statusCode = 400;
    } else if (result.existed && !result.profileCreated) {
      statusCode = 409; // Conflict
    }
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: statusCode 
      }
    );
    
  } catch (error) {
    console.error("Erro no handler POST:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
};
