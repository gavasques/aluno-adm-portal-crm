
import { corsHeaders } from './utils.ts';

export const handleGetRequest = async (supabaseAdmin: any): Promise<Response> => {
  try {
    // Buscar todos os usuários usando o client admin
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error("Erro ao listar usuários:", error);
      throw error;
    }

    // Processar os usuários para o formato esperado
    const processedUsers = await Promise.all(users.map(async (user: any) => {
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
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Erro ao processar requisição GET:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro ao listar usuários" 
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
};

export const handlePostRequest = async (req: Request, supabaseAdmin: any): Promise<Response> => {
  try {
    const requestData = await req.json();
    
    if (!requestData || !requestData.action) {
      throw new Error("Dados inválidos ou ação não especificada");
    }
    
    // Importar funções de operação dinâmicamente
    const { createUser, deleteUser, toggleUserStatus, inviteUser } = await import('./userOperations.ts');
    
    // Executar a ação correspondente
    switch (requestData.action) {
      case 'createUser':
        const createResult = await createUser(supabaseAdmin, requestData);
        return new Response(
          JSON.stringify(createResult),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: 200 
          }
        );
      
      case 'inviteUser':
        const inviteResult = await inviteUser(supabaseAdmin, requestData);
        return new Response(
          JSON.stringify(inviteResult),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: 200 
          }
        );
      
      case 'deleteUser':
        const deleteResult = await deleteUser(supabaseAdmin, requestData);
        return new Response(
          JSON.stringify(deleteResult),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: 200 
          }
        );
      
      case 'toggleUserStatus':
        const toggleResult = await toggleUserStatus(supabaseAdmin, requestData);
        return new Response(
          JSON.stringify(toggleResult),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: 200 
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
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    );
  }
};
