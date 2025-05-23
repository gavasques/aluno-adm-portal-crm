
import { corsHeaders } from './utils.ts';
import { processUsers, ensureProfiles } from './userProcessing.ts';

// Função auxiliar para criar respostas de sucesso
export const createSuccessResponse = (data: any) => {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      },
      status: 200 
    }
  );
};

// Função auxiliar para criar respostas de erro
export const createErrorResponse = (error: any, status: number = 500) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return new Response(
    JSON.stringify({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }),
    { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      },
      status 
    }
  );
};

export async function handleGetRequest(supabaseAdmin: any): Promise<Response> {
  try {
    console.log("Processando requisição GET para listar usuários");
    
    // Verificação explícita do client admin
    if (!supabaseAdmin || !supabaseAdmin.auth || !supabaseAdmin.auth.admin) {
      console.error("Erro: Cliente Supabase Admin inválido ou sem permissões suficientes");
      throw new Error("Cliente Supabase Admin inválido ou sem permissões admin");
    }
    
    console.log("Cliente admin verificado, buscando usuários...");
    
    // Buscar todos os usuários usando o client admin
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error("Erro ao listar usuários:", error);
      throw error;
    }

    const users = data?.users;
    
    if (!users || !Array.isArray(users)) {
      console.error("Resposta inválida da API auth.admin.listUsers:", data);
      throw new Error("Resposta inválida da API: dados de usuários não encontrados ou inválidos");
    }

    console.log(`Obtidos ${users.length} usuários do auth`);
    
    // Buscar perfis em uma única consulta
    const { data: profilesData } = await supabaseAdmin
      .from('profiles')
      .select('*');
    
    // Criar um mapa de perfis para acesso rápido
    const profilesMap = new Map();
    if (profilesData && Array.isArray(profilesData)) {
      profilesData.forEach(profile => {
        if (profile && profile.id) {
          profilesMap.set(profile.id, profile);
        }
      });
    }
    
    console.log(`Mapa de perfis criado com ${profilesMap.size} entradas`);
    
    // Assegurar que todos os usuários tenham perfis
    await ensureProfiles(users, supabaseAdmin, profilesMap);
    
    // Processar os usuários para o formato esperado usando a função refatorada
    const processedUsers = await processUsers(users, supabaseAdmin);

    console.log(`Retornando ${processedUsers.length} usuários processados com status 200`);
    
    // Retornar com o formato esperado pelo frontend
    return createSuccessResponse({ users: processedUsers });
  } catch (error) {
    console.error("Erro ao processar requisição GET:", error);
    return createErrorResponse(error);
  }
};

export async function handlePostRequest(req: Request, supabaseAdmin: any): Promise<Response> {
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
      console.log(`Ação ${requestData.action} concluída com sucesso, retornando status 200`);
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
