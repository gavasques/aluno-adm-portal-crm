import { corsHeaders } from './utils.ts';

// Função para limpar usuário órfão (existe no Auth mas não no profiles)
export const cleanupOrphanedUser = async (supabaseAdmin: any, email: string) => {
  try {
    console.log(`[cleanupOrphanedUser] Iniciando limpeza para email: ${email}`);
    
    // Buscar usuário no Auth usando listUsers
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error("[cleanupOrphanedUser] Erro ao buscar usuários do auth:", authError);
      return { error: authError.message };
    }

    // Filtrar usuário pelo email
    const existingUser = authData?.users?.find(user => user.email === email);
    
    if (!existingUser) {
      console.log(`[cleanupOrphanedUser] Nenhum usuário encontrado com email: ${email}`);
      return { cleaned: false, message: "Nenhum usuário encontrado" };
    }

    console.log(`[cleanupOrphanedUser] Usuário encontrado: ${existingUser.id}`);
    
    // Verificar se existe perfil
    const { data: existingProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', existingUser.id)
      .maybeSingle();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error("[cleanupOrphanedUser] Erro ao verificar perfil:", profileError);
      return { error: `Erro ao verificar perfil: ${profileError.message}` };
    }
    
    // Se não existe perfil, é um usuário órfão - deletar do Auth
    if (!existingProfile) {
      console.log(`[cleanupOrphanedUser] Deletando usuário órfão ${existingUser.id} do Auth`);
      
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
      
      if (deleteError) {
        console.error("[cleanupOrphanedUser] Erro ao deletar usuário órfão:", deleteError);
        return { error: `Erro ao limpar usuário órfão: ${deleteError.message}` };
      }
      
      console.log(`[cleanupOrphanedUser] Usuário órfão ${existingUser.id} deletado com sucesso`);
      return { cleaned: true, message: "Usuário órfão removido com sucesso" };
    }
    
    console.log(`[cleanupOrphanedUser] Usuário ${existingUser.id} tem perfil válido`);
    return { cleaned: false, message: "Usuário tem perfil válido" };
    
  } catch (error) {
    console.error("[cleanupOrphanedUser] Erro não tratado:", error);
    return { error: error.message };
  }
};

// Função para criar um novo usuário
export const createUser = async (supabaseAdmin: any, data: any) => {
  try {
    console.log("[createUser] Iniciando criação de usuário");
    console.log("[createUser] Dados recebidos:", { 
      email: data.email, 
      name: data.name, 
      role: data.role, 
      hasPassword: !!data.password,
      is_mentor: data.is_mentor 
    });

    const { email, password, name, role, is_mentor } = data;

    // Validação rigorosa de entrada
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.error("[createUser] Email inválido:", email);
      return { error: "Email é obrigatório e deve ser válido" };
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      console.error("[createUser] Senha inválida");
      return { error: "Senha é obrigatória e deve ter pelo menos 6 caracteres" };
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      console.error("[createUser] Nome inválido:", name);
      return { error: "Nome é obrigatório e não pode estar vazio" };
    }

    if (!role || typeof role !== 'string') {
      console.error("[createUser] Role inválido:", role);
      return { error: "Role é obrigatório" };
    }

    console.log("[createUser] Validação de entrada passou");

    // Primeiro, tentar limpar qualquer usuário órfão com este email
    console.log("[createUser] Executando limpeza de usuário órfão");
    const cleanupResult = await cleanupOrphanedUser(supabaseAdmin, email);
    if (cleanupResult.error) {
      console.log("[createUser] Aviso na limpeza:", cleanupResult.error);
    } else if (cleanupResult.cleaned) {
      console.log("[createUser] Usuário órfão removido:", cleanupResult.message);
    }

    // Verificar se o usuário ainda existe após a limpeza usando listUsers
    console.log("[createUser] Verificando se usuário ainda existe após limpeza");
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error("[createUser] Erro ao verificar usuários existentes:", authError);
      return { error: `Erro ao verificar usuários: ${authError.message}` };
    }

    const existingUser = authData?.users?.find(user => user.email === email);

    if (existingUser) {
      console.log("[createUser] Usuário ainda existe após limpeza:", email);
      
      // Verificar se o perfil também existe
      const { data: existingProfile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("[createUser] Erro ao verificar perfil existente:", profileError);
        return { error: `Erro ao verificar perfil: ${profileError.message}` };
      }
      
      // Se o perfil não existe mas o usuário auth existe, criar o perfil
      if (!existingProfile) {
        console.log("[createUser] Criando perfil para usuário existente:", existingUser.id);
        
        const profileData = {
          id: existingUser.id,
          name: name,
          role: role,
          email: email,
          is_mentor: is_mentor || false
        };
        
        console.log("[createUser] Dados do perfil a ser criado:", profileData);
        
        const { error: createProfileError } = await supabaseAdmin
          .from('profiles')
          .insert([profileData]);
          
        if (createProfileError) {
          console.error("[createUser] Erro ao criar perfil para usuário existente:", createProfileError);
          return { 
            existed: true, 
            error: "Usuário existe mas houve erro ao criar perfil",
            message: "O usuário já existe, mas houve um erro ao sincronizar seu perfil."
          };
        }
        
        console.log("[createUser] Perfil criado com sucesso para usuário existente");
        return { 
          existed: true, 
          profileCreated: true, 
          message: "Usuário já existe, mas o perfil foi sincronizado com sucesso.",
          is_mentor: is_mentor || false
        };
      } else {
        // Perfil existe, vamos atualizar os dados incluindo is_mentor
        console.log("[createUser] Atualizando perfil existente:", {
          currentData: existingProfile,
          newData: { name, role, is_mentor: is_mentor || false }
        });
        
        const updateData = {
          name: name,
          role: role,
          is_mentor: is_mentor || false
        };
        
        console.log("[createUser] Dados para atualização:", updateData);
        
        const { data: updateResult, error: updateProfileError } = await supabaseAdmin
          .from('profiles')
          .update(updateData)
          .eq('id', existingUser.id)
          .select();
          
        if (updateProfileError) {
          console.error("[createUser] Erro ao atualizar perfil existente:", updateProfileError);
          return { 
            existed: true, 
            error: "Erro ao atualizar dados do usuário existente",
            message: "O usuário já existe, mas houve um erro ao atualizar seus dados."
          };
        }
        
        console.log("[createUser] Resultado da atualização:", updateResult);
        console.log("[createUser] Perfil atualizado com sucesso para usuário existente");
        
        // Verificar se a atualização foi bem-sucedida
        const { data: verifyProfile, error: verifyError } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', existingUser.id)
          .single();
          
        if (!verifyError) {
          console.log("[createUser] Verificação pós-atualização:", verifyProfile);
        }
        
        return { 
          existed: true, 
          profileCreated: true, 
          message: "Usuário já existe e seus dados foram atualizados com sucesso.",
          is_mentor: is_mentor || false
        };
      }
    }

    console.log("[createUser] Criando novo usuário no Supabase Auth");
    // Criar usuário no Supabase Auth
    const { data: newUserData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { 
        name: name, 
        role: role, 
        is_mentor: is_mentor || false 
      },
    });

    if (userError) {
      console.error("[createUser] Erro ao criar usuário no auth:", userError);
      return { error: `Erro ao criar usuário: ${userError.message}` };
    }

    if (!newUserData || !newUserData.user) {
      console.error("[createUser] Resposta inesperada do Supabase Auth:", newUserData);
      return { error: "Erro ao criar usuário: Resposta inesperada do Supabase Auth" };
    }

    console.log("[createUser] Usuário criado no auth:", newUserData.user.id);

    // Criar perfil associado na tabela "profiles"
    const profileData = {
      id: newUserData.user.id,
      name: name,
      role: role,
      email: email,
      is_mentor: is_mentor || false
    };
    
    console.log("[createUser] Criando perfil na tabela profiles:", profileData);
    
    const { data: profileResult, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([profileData])
      .select();

    if (profileError) {
      console.error("[createUser] Erro ao criar perfil:", profileError);
      console.log("[createUser] Removendo usuário criado devido ao erro no perfil");
      
      // Remover usuário criado se falhar ao criar perfil
      await supabaseAdmin.auth.admin.deleteUser(newUserData.user.id);
      return { error: `Erro ao criar perfil: ${profileError.message}` };
    }

    console.log("[createUser] Resultado da criação do perfil:", profileResult);
    console.log("[createUser] Usuário e perfil criados com sucesso:", newUserData.user.id);
    console.log("[createUser] Status de mentor definido como:", is_mentor || false);
    
    return { 
      success: true, 
      message: "Usuário criado com sucesso",
      userId: newUserData.user.id,
      is_mentor: is_mentor || false
    };

  } catch (error) {
    console.error("[createUser] Erro não tratado:", error);
    return { error: `Erro interno: ${error.message}` };
  }
};

// Função para convidar um usuário
export const inviteUser = async (supabaseAdmin: any, data: any) => {
  try {
    const { email, name, role } = data;

    if (!email || !name || !role) {
      console.error("Dados incompletos para convidar usuário");
      return { error: "Email, nome e role são obrigatórios para convidar um usuário" };
    }

    // Verificar se o usuário já existe pelo email
    const { data: existingUsers, error: searchError } = await supabaseAdmin.auth.admin.listUsers({
      filter: { email }
    });

    if (searchError) {
      console.error("Erro ao verificar se usuário existe:", searchError);
      return { error: searchError.message };
    }

    if (existingUsers && existingUsers.users && existingUsers.users.length > 0) {
      console.log("Usuário já existe com este email:", email);
      return { existed: true, message: "Usuário já existe com este email" };
    }

    // Tente enviar o convite
    try {
      // Enviar convite para o usuário
      const { data: invite, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: { name: name, role: role, status: 'Convidado' }
      });

      if (inviteError) {
        console.error("Erro ao convidar usuário via email:", inviteError);
        throw inviteError;
      }

      // Criar perfil associado na tabela "profiles"
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([
          { id: invite.user.id, name: name, role: role, email: email, status: 'Convidado' }
        ]);

      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
        // Não vamos remover o usuário já que o convite foi enviado
        // Apenas logamos o erro e continuamos
        console.log("Perfil não foi criado, mas o convite foi enviado.");
      }

      console.log("Convite enviado com sucesso para:", email);
      return { success: true, message: "Convite enviado com sucesso" };
    } catch (inviteError) {
      // Se houver erro ao enviar convite, cadastrar o usuário diretamente
      console.log("Não foi possível enviar convite. Tentando criar usuário diretamente...");
      
      // Gerar senha aleatória
      const temporaryPassword = Math.random().toString(36).slice(-10);
      
      // Criar usuário diretamente
      const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: temporaryPassword,
        email_confirm: false, // Precisa confirmar o email neste caso
        user_metadata: { name: name, role: role, status: 'Convidado' }
      });
      
      if (userError) {
        console.error("Erro ao criar usuário após falha de convite:", userError);
        return { error: "Não foi possível convidar ou criar o usuário: " + userError.message };
      }
      
      // Criar perfil associado na tabela "profiles"
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([
          { id: user.user.id, name: name, role: role, email: email, status: 'Convidado' }
        ]);
        
      if (profileError) {
        console.error("Erro ao criar perfil após criação direta:", profileError);
      }
      
      return { 
        success: true, 
        directCreation: true,
        message: "Usuário foi criado diretamente. Ele precisará usar a opção 'Esqueci minha senha'."
      };
    }

  } catch (error) {
    console.error("Erro ao processar operação de convite:", error);
    return { error: error.message };
  }
};

export const deleteUser = async (supabaseAdmin: any, data: any) => {
  try {
    const { userId, email } = data;

    if (!userId) {
      console.error("ID do usuário não fornecido para exclusão");
      return { 
        success: false,
        error: "ID do usuário é obrigatório para esta operação" 
      };
    }

    console.log(`[deleteUser] Tentando excluir usuário ${userId} (${email || 'email não fornecido'})`);
    
    // Verificar se o usuário existe no auth
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error("[deleteUser] Erro ao buscar usuários do auth:", authError);
      return { 
        success: false,
        error: `Erro ao verificar usuário: ${authError.message}` 
      };
    }

    const userExists = authUsers?.users?.find(user => user.id === userId);
    
    if (!userExists) {
      console.log(`[deleteUser] Usuário ${userId} não encontrado no auth`);
      // Se não existe no auth, tentar remover apenas do profiles
      const { error: profileDeleteError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (profileDeleteError) {
        console.error("[deleteUser] Erro ao remover perfil:", profileDeleteError);
        return {
          success: false,
          error: `Erro ao remover perfil: ${profileDeleteError.message}`
        };
      }
      
      return { 
        success: true, 
        message: "Perfil removido com sucesso (usuário não estava no auth)" 
      };
    }
    
    // Verificar se o usuário tem dados associados em outras tabelas
    console.log(`[deleteUser] Verificando dados associados para usuário ${userId}`);
    
    // Verificar my_suppliers
    const { count: suppliersCount } = await supabaseAdmin
      .from('my_suppliers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
      
    // Verificar user_files
    const { count: filesCount } = await supabaseAdmin
      .from('user_files')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
      
    // Verificar mentoring_enrollments como student
    const { count: enrollmentsCount } = await supabaseAdmin
      .from('mentoring_enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', userId);
    
    const totalAssociatedData = (suppliersCount || 0) + (filesCount || 0) + (enrollmentsCount || 0);
    
    console.log(`[deleteUser] Dados associados encontrados: ${totalAssociatedData} (fornecedores: ${suppliersCount}, arquivos: ${filesCount}, matrículas: ${enrollmentsCount})`);
    
    if (totalAssociatedData > 0) {
      console.log(`[deleteUser] Usuário tem dados associados, inativando em vez de excluir`);
      
      // Inativar usuário usando ban_duration
      const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { ban_duration: '87600h' }  // 10 anos
      );
      
      if (banError) {
        console.error("[deleteUser] Erro ao inativar usuário:", banError);
        return {
          success: false,
          error: `Erro ao inativar usuário: ${banError.message}`
        };
      }
      
      // Atualizar status no perfil também
      const { error: profileUpdateError } = await supabaseAdmin
        .from('profiles')
        .update({ status: 'Inativo' })
        .eq('id', userId);
        
      if (profileUpdateError) {
        console.log("[deleteUser] Aviso: não foi possível atualizar status no perfil:", profileUpdateError);
      }
      
      return { 
        success: true, 
        inactivated: true, 
        message: `Usuário foi inativado porque possui ${totalAssociatedData} registro(s) associado(s)` 
      };
    }
    
    // Se não tem dados associados, tentar exclusão completa
    console.log(`[deleteUser] Usuário não tem dados associados, procedendo com exclusão completa`);
    
    // Primeiro remover o perfil
    const { error: profileDeleteError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);
      
    if (profileDeleteError) {
      console.error("[deleteUser] Erro ao remover perfil:", profileDeleteError);
      // Se não conseguiu remover o perfil, inativar o usuário
      const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { ban_duration: '87600h' }
      );
      
      if (banError) {
        return {
          success: false,
          error: `Erro ao remover perfil e inativar usuário: ${profileDeleteError.message}`
        };
      }
      
      return { 
        success: true, 
        inactivated: true, 
        message: "Usuário foi inativado porque não foi possível remover o perfil" 
      };
    }
    
    // Agora tentar remover do auth
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authDeleteError) {
      console.error("[deleteUser] Erro ao excluir usuário do auth:", authDeleteError);
      
      // Se falhou ao excluir do auth mas removeu o perfil, 
      // tentar recriar o perfil e inativar o usuário
      console.log("[deleteUser] Recriando perfil e inativando usuário...");
      
      const { error: recreateError } = await supabaseAdmin
        .from('profiles')
        .insert([{
          id: userId,
          email: email || userExists.email,
          name: userExists.user_metadata?.name || email || userExists.email,
          status: 'Inativo',
          role: 'Student'
        }]);
        
      if (recreateError) {
        console.error("[deleteUser] Erro ao recriar perfil:", recreateError);
      }
      
      // Inativar usuário
      const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { ban_duration: '87600h' }
      );
      
      if (banError) {
        return {
          success: false,
          error: `Erro na exclusão: ${authDeleteError.message}`
        };
      }
      
      return { 
        success: true, 
        inactivated: true, 
        message: "Usuário foi inativado porque não pôde ser excluído completamente do sistema de autenticação" 
      };
    }

    console.log(`[deleteUser] Usuário ${userId} excluído com sucesso do auth e profiles`);
    return { 
      success: true, 
      message: "Usuário excluído com sucesso" 
    };

  } catch (error: any) {
    console.error("[deleteUser] Erro não tratado na exclusão:", error);
    
    // Em caso de erro, tentar inativar como última tentativa
    if (data.userId) {
      try {
        const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(
          data.userId,
          { ban_duration: '87600h' }
        );
        
        if (!banError) {
          return { 
            success: true, 
            inactivated: true, 
            message: "Usuário foi inativado devido a erro na exclusão" 
          };
        }
      } catch (banError) {
        console.error("[deleteUser] Erro ao tentar inativar como fallback:", banError);
      }
    }
    
    return { 
      success: false,
      error: `Erro interno na exclusão: ${error.message}` 
    };
  }
};

export const toggleUserStatus = async (supabaseAdmin: any, data: any) => {
  try {
    const { userId, active } = data;
    
    if (!userId) {
      console.error("ID do usuário não fornecido para alteração de status");
      return { 
        error: "ID do usuário é obrigatório para esta operação"
      };
    }

    console.log(`Alterando status do usuário para ${active ? 'ativo' : 'inativo'}`);
    
    // Usar updateUserById com o parâmetro ban_duration conforme a versão 2.49.8 do Supabase
    const banDuration = active ? 'none' : '87600h'; // 'none' para ativar, '87600h' para inativar (10 anos)
    
    console.log(`Utilizando updateUserById com ban_duration: ${banDuration} para o usuário ${userId}`);
    
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { ban_duration: banDuration }
    );
    
    // Log detalhado do resultado da operação para debug
    console.log('toggleUserStatus-result', { 
      updateData, 
      updateError,
      userId,
      actionTaken: active ? 'ativar (ban_duration: none)' : 'inativar (ban_duration: 87600h)'
    });
    
    if (updateError) {
      console.error("Erro ao atualizar status do usuário:", updateError);
      return {
        error: updateError.message || "Erro ao atualizar status do usuário"
      };
    }
    
    // Verificar se a atualização foi aplicada corretamente
    if (updateData) {
      const statusMessage = active ? "Ativado" : "Inativado";
      console.log(`Status do usuário atualizado com sucesso: ${statusMessage}`);
      
      return { 
        success: true, 
        message: `Usuário ${active ? 'ativado' : 'inativado'} com sucesso`
      };
    } else {
      throw new Error("A atualização do status não foi aplicada corretamente");
    }
    
  } catch (error) {
    console.error(`Falha ao alterar status do usuário: ${error.message}`);
    return { 
      error: error.message || "Erro ao processar alteração de status"
    };
  }
};
