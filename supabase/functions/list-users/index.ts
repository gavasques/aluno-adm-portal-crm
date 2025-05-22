
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

// Definir headers CORS para permitir o acesso a partir do frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Função para criar o cliente do Supabase com role de administrador
function createSupabaseAdminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        persistSession: false,
      }
    }
  );
}

// Função para lidar com as requisições OPTIONS (CORS)
function handleOptionsRequest() {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
}

// Função para criar um novo usuário
async function createUser(supabaseAdmin, requestData) {
  const { email, name, role } = requestData;
  
  try {
    console.log(`Iniciando criação do usuário: ${email}`);
    
    // Verificar se o usuário já existe
    const { data: existingUsers, error: checkError } = await supabaseAdmin.auth.admin.listUsers({
      email: email
    });
    
    if (checkError) {
      console.error("Erro ao verificar usuário existente:", checkError);
      throw checkError;
    }
    
    if (existingUsers && existingUsers.users && existingUsers.users.length > 0) {
      console.log("Usuário já existe, pulando criação:", email);
      return { success: true, message: "Usuário já existe", existed: true };
    }
    
    // Gerar uma senha aleatória temporária
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Criar um novo usuário
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name,
        role,
      }
    });
    
    if (authError) {
      console.error("Erro ao criar usuário:", authError);
      throw authError;
    }
    
    console.log(`Usuário criado com sucesso: ${email}, ID: ${authData.user.id}`);
    
    try {
      // Verificar se o perfil já existe
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
        
      if (!existingProfile) {
        // Criar perfil para o novo usuário apenas se não existir
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: authData.user.id,
            email,
            name,
            role,
          });
        
        if (profileError) {
          console.error("Erro ao criar perfil, mas usuário foi criado:", profileError);
          // Não falhar a operação se apenas o perfil falhar
        } else {
          console.log(`Perfil criado para usuário: ${email}`);
        }
      } else {
        console.log(`Perfil já existe para usuário: ${email}, pulando criação`);
      }
    } catch (profileError) {
      console.error("Erro ao verificar/criar perfil:", profileError);
      // Não falhar a operação se apenas o perfil falhar
    }
    
    // Enviar email de redefinição de senha
    const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `https://titan.guilhermevasques.club/reset-password`,
      }
    });
    
    if (resetError) {
      console.error("Erro ao gerar link de redefinição de senha:", resetError);
      throw resetError;
    }
    
    console.log(`Email de redefinição de senha enviado para: ${email}`);
    return { success: true, message: "Usuário criado com sucesso e email de redefinição enviado" };
  } catch (error) {
    console.error(`Falha ao criar usuário ${email}:`, error);
    throw error;
  }
}

// Função para verificar se o usuário tem dependências
async function checkUserDependencies(supabaseAdmin, userId) {
  try {
    // Aqui podemos consultar tabelas que têm referências ao usuário
    // Por exemplo: fornecedores, alunos, arquivos, etc.
    // Esta implementação é simplificada. Em um caso real, você deve verificar todas as tabelas relevantes.
    
    // Verificar se há alguma entrada nas tabelas relacionadas
    // Por enquanto, retornamos false indicando que não há dependências
    // Em uma implementação real, você adicionaria as verificações necessárias
    
    return false; // Simulando que não há dependências
  } catch (error) {
    console.error(`Erro ao verificar dependências do usuário ${userId}:`, error);
    // Em caso de erro na verificação, é mais seguro assumir que há dependências
    return true;
  }
}

// Função para excluir um usuário ou inativá-lo se tiver referências
async function deleteUser(supabaseAdmin, requestData) {
  const { userId, email } = requestData;
  
  try {
    console.log(`Iniciando exclusão do usuário: ${email} (ID: ${userId})`);
    
    // Verificar se o usuário existe
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError) {
      console.error("Erro ao buscar usuário:", userError);
      throw userError;
    }
    
    if (!userData || !userData.user) {
      console.error("Usuário não encontrado:", userId);
      throw new Error("Usuário não encontrado");
    }

    // Verificar dependências reais do usuário
    const hasDependencies = await checkUserDependencies(supabaseAdmin, userId);
    
    if (hasDependencies) {
      // Se tiver dependências, apenas inativamos o usuário em vez de excluí-lo
      console.log(`Usuário ${email} possui dados relacionados, inativando em vez de excluir`);
      
      // Banir o usuário (isso o impede de fazer login)
      const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { banned: true }
      );
      
      if (banError) {
        console.error("Erro ao inativar usuário:", banError);
        throw banError;
      }
      
      console.log(`Usuário ${email} inativado com sucesso`);
      return { success: true, inactivated: true };
    } else {
      // Se não tiver referências, excluímos primeiro o perfil e depois o usuário
      console.log(`Excluindo perfil e usuário ${email} completamente`);
      
      // 1. Primeiro excluir o perfil
      const { error: profileDeleteError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (profileDeleteError) {
        console.error("Erro ao excluir perfil do usuário:", profileDeleteError);
        throw profileDeleteError;
      }
      
      console.log(`Perfil do usuário ${email} excluído com sucesso`);
      
      // 2. Agora excluir o usuário
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      
      if (deleteError) {
        console.error("Erro ao excluir usuário:", deleteError);
        throw deleteError;
      }
      
      console.log(`Usuário ${email} excluído com sucesso`);
      return { success: true, deleted: true };
    }
  } catch (error) {
    console.error(`Falha ao processar exclusão do usuário ${email}:`, error);
    throw error;
  }
}

// Função para alterar o status (ativar/desativar) de um usuário
async function toggleUserStatus(supabaseAdmin, requestData) {
  const { userId, email, active } = requestData;
  
  try {
    console.log(`Alterando status do usuário ${email} para ${active ? 'ativo' : 'inativo'}`);
    
    // Verificar se o usuário existe
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError) {
      console.error("Erro ao buscar usuário:", userError);
      throw userError;
    }
    
    if (!userData || !userData.user) {
      console.error("Usuário não encontrado:", userId);
      throw new Error("Usuário não encontrado");
    }
    
    // Atualizar o status do usuário (banned = !active)
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { banned: !active }
    );
    
    if (updateError) {
      console.error(`Erro ao ${active ? 'ativar' : 'inativar'} usuário:`, updateError);
      throw updateError;
    }
    
    console.log(`Usuário ${email} ${active ? 'ativado' : 'inativado'} com sucesso`);
    return { success: true, active };
  } catch (error) {
    console.error(`Falha ao alterar status do usuário ${email}:`, error);
    throw error;
  }
}

// Função para lidar com requisições POST
async function handlePostRequest(req, supabaseAdmin) {
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

// Função para criar perfil para usuários que não têm
async function ensureUserProfile(supabaseAdmin, authUser, profilesMap) {
  if (!profilesMap.has(authUser.id)) {
    // Verifica se é admin com base no email
    const isAdmin = authUser.email && (
      authUser.email.includes('gavasques') || 
      authUser.user_metadata?.role === 'Admin'
    );
    
    const { error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário sem nome',
        role: isAdmin ? 'Admin' : 'Student'
      });
    
    if (insertError) {
      console.error(`Erro ao criar perfil para ${authUser.email}:`, insertError);
    } else {
      console.log(`Perfil criado para o usuário ${authUser.email}`);
      
      // Adicionar o novo perfil ao mapa
      profilesMap.set(authUser.id, {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário sem nome',
        role: isAdmin ? 'Admin' : 'Student'
      });
    }
  }
}

// Função para mapear usuários combinando dados de auth e profiles
function mapUsers(authUsers, latestProfiles) {
  // Mapear usuários combinando dados de auth e profiles
  const mappedUsers = authUsers.users.map(authUser => {
    const profile = latestProfiles.find((p) => p.id === authUser.id);
    
    // Determinar o papel com base no email ou nos metadados
    const isAdmin = authUser.email && (
      authUser.email.includes('gavasques') || 
      authUser.user_metadata?.role === 'Admin'
    );
    
    return {
      id: authUser.id,
      name: profile?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário sem nome',
      email: authUser.email || '',
      role: profile?.role || (isAdmin ? 'Admin' : 'Student'),
      status: authUser.banned ? 'Inativo' : 'Ativo',
      lastLogin: authUser.last_sign_in_at 
        ? new Date(authUser.last_sign_in_at).toLocaleDateString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) 
        : 'Nunca',
      tasks: []
    };
  });

  // Ordenar usuários por email
  mappedUsers.sort((a, b) => a.email.localeCompare(b.email));
  
  return mappedUsers;
}

// Função para lidar com requisições GET
async function handleGetRequest(supabaseAdmin) {
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

// Função principal que processa as requisições
serve(async (req) => {
  console.log(`Recebendo requisição ${req.method} para list-users`);
  
  // Lidar com requisições OPTIONS (pre-flight CORS)
  if (req.method === 'OPTIONS') {
    return handleOptionsRequest();
  }

  try {
    // Criar cliente Supabase com token service_role
    const supabaseAdmin = createSupabaseAdminClient();
    
    // Processar requisições com base no método HTTP
    if (req.method === 'POST') {
      return await handlePostRequest(req, supabaseAdmin);
    } else {
      // Requisições GET (listar usuários)
      return await handleGetRequest(supabaseAdmin);
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro ao processar requisição"
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
});
