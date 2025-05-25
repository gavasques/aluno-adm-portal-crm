
import { corsHeaders } from "./_shared/cors.ts";
import { createUser, inviteUser, deleteUser, toggleUserStatus } from "./userOperations.ts";

// Função para processar usuários para resposta
const processUsersForResponse = async (authUsers: any[], profiles: any[]) => {
  console.log("[processUsersForResponse] Processando usuários:", authUsers.length, "perfis:", profiles.length);
  
  const processedUsers = [];
  
  for (const user of authUsers) {
    // Buscar perfil correspondente
    const profile = profiles.find(p => p.id === user.id || p.email === user.email);
    
    // Determinar status do usuário
    let status = 'Ativo';
    if (user.banned_until && new Date(user.banned_until) > new Date()) {
      status = 'Inativo';
    } else if (!user.email_confirmed_at) {
      status = 'Pendente';
    }
    
    // Determinar último login
    let lastLogin = 'Nunca';
    if (user.last_sign_in_at) {
      lastLogin = new Date(user.last_sign_in_at).toLocaleDateString('pt-BR');
    }
    
    processedUsers.push({
      id: user.id,
      name: profile?.name || user.user_metadata?.name || user.email,
      email: user.email,
      role: profile?.role || 'Student',
      status: status,
      lastLogin: lastLogin,
      tasks: [],
      permission_group_id: profile?.permission_group_id || null,
      storage_used_mb: profile?.storage_used_mb || 0,
      storage_limit_mb: profile?.storage_limit_mb || 100,
      is_mentor: profile?.is_mentor || false
    });
  }
  
  console.log("[processUsersForResponse] Usuários processados:", processedUsers.length);
  return processedUsers;
};

// Handler para requisições GET (listar usuários)
export const handleGetRequest = async (supabaseAdmin: any) => {
  try {
    console.log("[handleGetRequest] Processando requisição GET para listar usuários");
    
    // Verificar se o cliente admin está funcionando
    if (!supabaseAdmin) {
      console.error("[handleGetRequest] Cliente Supabase Admin não disponível");
      return new Response(
        JSON.stringify({ error: "Erro interno: cliente admin não disponível" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
    
    console.log("[handleGetRequest] Cliente admin verificado, buscando usuários...");
    
    // Buscar usuários do auth
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error("[handleGetRequest] Erro ao buscar usuários do auth:", authError);
      return new Response(
        JSON.stringify({ error: authError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
    
    console.log(`[handleGetRequest] Obtidos ${authUsers?.users?.length || 0} usuários do auth`);
    
    // Buscar perfis
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*');
      
    if (profilesError) {
      console.error("[handleGetRequest] Erro ao buscar perfis:", profilesError);
    }
    
    // Processar usuários para resposta
    const processedUsers = await processUsersForResponse(authUsers?.users || [], profiles || []);
    
    console.log(`[handleGetRequest] Retornando ${processedUsers.length} usuários processados com status 200`);
    
    return new Response(
      JSON.stringify({ users: processedUsers }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("[handleGetRequest] Erro no handler GET:", error);
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
    console.log("[handlePostRequest] Processando requisição POST");
    
    const requestBody = await req.json();
    console.log("[handlePostRequest] Dados recebidos:", { 
      action: requestBody.action,
      email: requestBody.email,
      name: requestBody.name,
      role: requestBody.role,
      hasPassword: !!requestBody.password,
      is_mentor: requestBody.is_mentor
    });
    
    const { action } = requestBody;
    console.log("[handlePostRequest] Executando ação:", action);
    
    // Validação de entrada
    if (!action || typeof action !== 'string') {
      console.error("[handlePostRequest] Ação não fornecida ou inválida");
      return new Response(
        JSON.stringify({ error: "Ação é obrigatória" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
    
    let result;
    
    switch (action) {
      case 'create':
      case 'createUser':
        console.log("[handlePostRequest] Executando criação de usuário");
        result = await createUser(supabaseAdmin, requestBody);
        break;
        
      case 'invite':
      case 'inviteUser':
        console.log("[handlePostRequest] Executando convite de usuário");
        result = await inviteUser(supabaseAdmin, requestBody);
        break;
        
      case 'delete':
      case 'deleteUser':
        console.log("[handlePostRequest] Executando exclusão de usuário");
        result = await deleteUser(supabaseAdmin, requestBody);
        break;
        
      case 'toggleStatus':
      case 'toggleUserStatus':
        console.log("[handlePostRequest] Executando alteração de status");
        result = await toggleUserStatus(supabaseAdmin, requestBody);
        break;
        
      default:
        console.error("[handlePostRequest] Ação não reconhecida:", action);
        return new Response(
          JSON.stringify({ error: `Ação não suportada: ${action}` }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
    }
    
    console.log("[handlePostRequest] Resultado da operação:", result);
    
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
    console.error("[handlePostRequest] Erro no handler POST:", error);
    return new Response(
      JSON.stringify({ error: `Erro interno: ${error.message}` }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
};
