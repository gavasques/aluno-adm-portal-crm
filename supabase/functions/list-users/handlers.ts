
import { corsHeaders } from './utils.ts';

export const handleGetRequest = async (supabaseAdmin: any): Promise<Response> => {
  try {
    console.log("Processando requisição GET para listar usuários");
    
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
        
        // Log para debug - verificar banned_until de usuário específico
        console.log('getUser', { 
          id: user.id, 
          email: user.email, 
          banned_until: user.banned_until
        });
        
        // Determinar o status do usuário usando o banned_until
        let status = "Ativo";
        if (user.banned_until && new Date(user.banned_until) > new Date()) {
          status = "Inativo";
        } else if (user.user_metadata?.status === 'Convidado') {
          status = "Convidado";
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
          status: (user.banned_until && new Date(user.banned_until) > new Date()) ? "Inativo" : "Ativo",
          lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : "Nunca",
          tasks: []
        };
      }
    }));

    console.log(`Retornando ${processedUsers.length} usuários processados`);
    
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
    console.log("Processando requisição POST");
    
    // Verificar se o corpo da requisição existe
    let requestData;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error("Erro ao analisar o corpo da requisição:", error);
      return new Response(
        JSON.stringify({ 
          error: "Body required. Requisição POST requer um corpo JSON válido." 
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
    
    if (!requestData || !requestData.action) {
      console.error("Dados inválidos ou ação não especificada no corpo da requisição");
      return new Response(
        JSON.stringify({ 
          error: "Dados inválidos ou ação não especificada" 
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
    
    // Importar funções de operação dinâmicamente
    const { createUser, deleteUser, toggleUserStatus, inviteUser } = await import('./userOperations.ts');
    
    // Executar a ação correspondente
    console.log(`Executando ação: ${requestData.action}`);
    
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
        console.error(`Ação desconhecida: ${requestData.action}`);
        return new Response(
          JSON.stringify({ 
            error: `Ação desconhecida: ${requestData.action}` 
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
