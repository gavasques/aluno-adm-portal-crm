
import { corsHeaders } from './utils.ts';
import { processUsers } from './userProcessing.ts';

export const handleGetRequest = async (supabaseAdmin: any): Promise<Response> => {
  try {
    console.log("Processando requisição GET para listar usuários");
    
    // Buscar todos os usuários usando o client admin
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error("Erro ao listar usuários:", error);
      throw error;
    }

    // Processar os usuários para o formato esperado usando a função refatorada
    const processedUsers = await processUsers(users, supabaseAdmin);

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
    
    const handlers = {
      'createUser': createUser,
      'inviteUser': inviteUser,
      'deleteUser': deleteUser,
      'toggleUserStatus': toggleUserStatus
    };
    
    const handler = handlers[requestData.action];
    
    if (handler) {
      const result = await handler(supabaseAdmin, requestData);
      return new Response(
        JSON.stringify(result),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 200 
        }
      );
    } else {
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
