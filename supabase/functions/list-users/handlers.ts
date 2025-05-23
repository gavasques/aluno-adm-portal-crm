
import { corsHeaders } from './utils.ts';
import { processUsers } from './userProcessing.ts';

// Função auxiliar para criar respostas com sucesso
function createSuccessResponse(data: any, status = 200) {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      },
      status 
    }
  );
}

// Função auxiliar para criar respostas de erro
function createErrorResponse(error: any, status = 500) {
  console.error("Erro na operação:", error);
  
  const errorMessage = error instanceof Error ? error.message : 
    (typeof error === 'string' ? error : "Erro desconhecido");
  
  return new Response(
    JSON.stringify({ error: errorMessage }),
    { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      },
      status 
    }
  );
}

export const handleGetRequest = async (supabaseAdmin: any): Promise<Response> => {
  try {
    console.log("Processando requisição GET para listar usuários");
    
    // Buscar todos os usuários usando o client admin
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error("Erro ao listar usuários:", error);
      throw error;
    }

    console.log(`Obtidos ${users?.length || 0} usuários do auth`);
    
    // Processar os usuários para o formato esperado usando a função refatorada
    const processedUsers = await processUsers(users, supabaseAdmin);

    console.log(`Retornando ${processedUsers.length} usuários processados`);
    
    return createSuccessResponse({ users: processedUsers });
  } catch (error) {
    console.error("Erro ao processar requisição GET:", error);
    return createErrorResponse(error);
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
      return createErrorResponse(
        "Body required. Requisição POST requer um corpo JSON válido.",
        400
      );
    }
    
    if (!requestData || !requestData.action) {
      console.error("Dados inválidos ou ação não especificada no corpo da requisição");
      return createErrorResponse(
        "Dados inválidos ou ação não especificada",
        400
      );
    }
    
    // Importar funções de operação dinamicamente
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
      return createSuccessResponse(result);
    } else {
      console.error(`Ação desconhecida: ${requestData.action}`);
      return createErrorResponse(
        `Ação desconhecida: ${requestData.action}`,
        400
      );
    }
  } catch (error) {
    console.error("Erro ao processar requisição POST:", error);
    return createErrorResponse(error);
  }
};
