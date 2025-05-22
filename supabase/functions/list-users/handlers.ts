
import { createSupabaseAdminClient } from './utils.ts';
import { createUser, deleteUser, toggleUserStatus, inviteUser } from './userOperations.ts';

export const handleGetRequest = async (): Promise<Response> => {
  try {
    const supabaseAdmin = await createSupabaseAdminClient();
    
    // Buscar todos os usuários usando o client admin
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error("Erro ao listar usuários:", error);
      throw error;
    }

    // Processar os usuários para o formato esperado
    const processedUsers = await Promise.all(users.map(async (user) => {
      try {
        // Buscar perfil associado para obter mais dados
        const { data: profileData } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        // Determinar o status do usuário
        let status = "Inativo";
        if (!user.banned) {
          if (user.user_metadata?.status === 'Convidado') {
            status = "Convidado";
          } else {
            status = "Ativo";
          }
        }

        return {
          id: user.id,
          name: profileData?.name || user.user_metadata?.name || "Usuário sem nome",
          email: user.email,
          role: profileData?.role || user.user_metadata?.role || "Student",
          status: status,
          lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : "Nunca",
          tasks: [] // Placeholder para futuras tarefas
        };
      } catch (err) {
        console.error(`Erro ao processar usuário ${user.id}:`, err);
        return {
          id: user.id,
          name: user.user_metadata?.name || "Usuário sem nome",
          email: user.email,
          role: user.user_metadata?.role || "Student",
          status: user.banned ? "Inativo" : "Ativo",
          lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : "Nunca",
          tasks: []
        };
      }
    }));

    return new Response(
      JSON.stringify({ 
        users: processedUsers 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Erro ao processar requisição GET:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro ao listar usuários" 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

export const handlePostRequest = async (req: Request): Promise<Response> => {
  try {
    const requestData = await req.json();
    
    if (!requestData || !requestData.action) {
      throw new Error("Dados inválidos ou ação não especificada");
    }
    
    const supabaseAdmin = await createSupabaseAdminClient();
    
    // Executar a ação correspondente
    switch (requestData.action) {
      case 'createUser':
        const createResult = await createUser(supabaseAdmin, requestData);
        return new Response(
          JSON.stringify(createResult),
          { 
            status: 200,
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      
      case 'inviteUser':
        const inviteResult = await inviteUser(supabaseAdmin, requestData);
        return new Response(
          JSON.stringify(inviteResult),
          { 
            status: 200,
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      
      case 'deleteUser':
        const deleteResult = await deleteUser(supabaseAdmin, requestData);
        return new Response(
          JSON.stringify(deleteResult),
          { 
            status: 200,
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      
      case 'toggleUserStatus':
        const toggleResult = await toggleUserStatus(supabaseAdmin, requestData);
        return new Response(
          JSON.stringify(toggleResult),
          { 
            status: 200,
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      
      default:
        throw new Error(`Ação desconhecida: ${requestData.action}`);
    }
  } catch (error) {
    console.error("Erro ao processar requisição POST:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro ao processar a requisição" 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};
