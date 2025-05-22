
// Manipuladores específicos para requisições HTTP

import { corsHeaders, createSupabaseAdminClient, mapUsers } from './utils.ts';
import { createUser, deleteUser, toggleUserStatus } from './userOperations.ts';
import { ensureUserProfile } from './profileManagement.ts';

// Função para lidar com requisições POST
export async function handlePostRequest(req: Request, supabaseAdmin: any) {
  try {
    // Verificar se há corpo na requisição
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: "Content-Type deve ser application/json" }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 400
        }
      );
    }

    // Tratar caso onde o corpo está vazio
    const text = await req.text();
    if (!text || text.trim() === '') {
      return new Response(
        JSON.stringify({ error: "Corpo da requisição vazio ou inválido" }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 400
        }
      );
    }

    // Parse JSON com tratamento de erro explícito
    let requestData;
    try {
      requestData = JSON.parse(text);
    } catch (parseError) {
      console.error("Erro ao processar JSON:", parseError);
      return new Response(
        JSON.stringify({ error: "Formato de dados inválido: " + parseError.message }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 400
        }
      );
    }
    
    if (requestData.action === 'createUser') {
      console.log("Criando novo usuário:", requestData.email);
      try {
        const result = await createUser(supabaseAdmin, requestData);
        console.log("Usuário processado com sucesso!");
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
      } catch (error) {
        console.error("Erro durante criação do usuário:", error);
        return new Response(
          JSON.stringify({ 
            error: error.message || "Erro ao criar usuário",
            details: error.details || error.code || "Sem detalhes adicionais" 
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
    } else if (requestData.action === 'deleteUser') {
      console.log("Excluindo usuário:", requestData.email);
      try {
        const result = await deleteUser(supabaseAdmin, requestData);
        console.log("Usuário excluído/inativado com sucesso!");
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
      } catch (error) {
        console.error("Erro durante exclusão do usuário:", error);
        return new Response(
          JSON.stringify({ 
            error: error.message || "Erro ao excluir usuário",
            details: error.details || error.code || "Sem detalhes adicionais" 
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
    } else if (requestData.action === 'toggleUserStatus') {
      console.log("Alterando status do usuário:", requestData.email);
      try {
        const result = await toggleUserStatus(supabaseAdmin, requestData);
        console.log("Status do usuário alterado com sucesso!");
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
      } catch (error) {
        console.error("Erro durante alteração de status do usuário:", error);
        return new Response(
          JSON.stringify({ 
            error: error.message || "Erro ao alterar status do usuário",
            details: error.details || error.code || "Sem detalhes adicionais" 
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
    
    return new Response(
      JSON.stringify({ error: "Ação não reconhecida" }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 400
      }
    );
  } catch (error) {
    console.error("Erro ao processar requisição POST:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro ao processar requisição" }),
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

// Função para lidar com requisições GET
export async function handleGetRequest(supabaseAdmin: any) {
  console.log("Processando requisição GET para listar usuários");
  
  try {
    // Obter usuários através do admin.listUsers
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error("Erro ao listar usuários:", authError);
      throw authError;
    }

    console.log(`Encontrados ${authUsers.users.length} usuários na autenticação`);

    // Buscar perfis dos usuários
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error("Erro ao buscar perfis:", profilesError);
    }

    console.log(`Encontrados ${profiles?.length || 0} perfis no banco de dados`);

    // Para cada usuário que não tem perfil, criar um
    const profilesMap = new Map();
    if (profiles) {
      profiles.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
    }

    // Criar perfis para usuários que não têm
    for (const authUser of authUsers.users) {
      await ensureUserProfile(supabaseAdmin, authUser, profilesMap);
    }

    // Buscar perfis novamente se houveram atualizações
    const latestProfiles = profilesMap.size > 0 ? 
      Array.from(profilesMap.values()) : 
      profiles || [];

    const mappedUsers = mapUsers(authUsers, latestProfiles);
    console.log(`Retornando ${mappedUsers.length} usuários mapeados`);

    return new Response(
      JSON.stringify({ users: mappedUsers }),
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
        error: error.message || "Erro ao processar requisição para listar usuários"
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
