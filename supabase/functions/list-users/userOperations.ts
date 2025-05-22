
import { corsHeaders } from './utils.ts';

// Função para criar um novo usuário
export const createUser = async (supabaseAdmin: any, data: any) => {
  try {
    const { email, password, name, role } = data;

    if (!email || !password || !name || !role) {
      console.error("Dados incompletos para criar usuário:", { email, password: !!password, name, role });
      return { error: "Todos os campos são obrigatórios para criar um usuário" };
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

    // Criar usuário no Supabase Auth
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Marcar o email como confirmado para não precisar de verificação
      user_metadata: { name: name, role: role },
    });

    if (userError) {
      console.error("Erro ao criar usuário:", userError);
      return { error: userError.message };
    }

    if (user && user.user) {
      // Criar perfil associado na tabela "profiles"
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([
          { id: user.user.id, name: name, role: role, email: email }
        ]);

      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
        // Remover usuário criado se falhar ao criar perfil
        await supabaseAdmin.auth.admin.deleteUser(user.user.id);
        return { error: profileError.message };
      }

      console.log("Usuário criado com sucesso:", user.user.id);
      return { success: true, message: "Usuário criado com sucesso" };
    } else {
      console.error("Erro ao criar usuário: Resposta inesperada do Supabase Auth");
      return { error: "Erro ao criar usuário: Resposta inesperada do Supabase Auth" };
    }

  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return { error: error.message };
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

// Função para excluir um usuário
export const deleteUser = async (supabaseAdmin: any, data: any) => {
  try {
    const { userId, email } = data;

    if (!userId) {
      console.error("ID do usuário não fornecido para exclusão");
      return { error: "ID do usuário é obrigatório para esta operação" };
    }

    console.log(`Tentando excluir usuário ${userId} (${email || 'email não fornecido'})`);
    
    // Primeiro, verificar se o usuário tem dados associados em outras tabelas que podem impedir a exclusão
    const { count: profilesCount, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('id', userId);
      
    if (profilesError) {
      console.error("Erro ao verificar perfil do usuário:", profilesError);
    }
    
    console.log(`Usuário tem ${profilesCount || 0} perfis associados`);
    
    // Tentar primeiro remover o perfil associado
    if (profilesCount && profilesCount > 0) {
      const { error: deleteProfileError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (deleteProfileError) {
        console.error("Não foi possível excluir o perfil do usuário:", deleteProfileError);
        console.log("O usuário possui dados associados em outras tabelas. Procedendo com inativação em vez de exclusão.");
        
        // Usar updateUserById com ban_duration para inativar o usuário por um longo período (10 anos)
        const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { ban_duration: '87600h' }  // 10 anos
        );
        
        if (updateError) {
          console.error("Erro ao inativar o usuário:", updateError);
          return { error: updateError.message };
        }
        
        return { 
          success: true, 
          inactivated: true, 
          message: "Usuário foi inativado porque tem dados associados que não podem ser excluídos" 
        };
      }
    }

    // Se conseguiu excluir o perfil ou não havia perfil, tenta excluir o usuário
    try {
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (deleteError) {
        console.error("Erro ao excluir usuário:", deleteError);
        
        // Se falhar ao excluir, tenta inativar o usuário como último recurso
        console.log("Tentando inativar o usuário como alternativa à exclusão...");
        const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { ban_duration: '87600h' }  // 10 anos
        );
        
        if (updateError) {
          console.error("Erro ao inativar o usuário:", updateError);
          return { error: "Não foi possível excluir ou inativar o usuário: " + deleteError.message };
        }
        
        return { 
          success: true, 
          inactivated: true, 
          message: "Usuário foi inativado porque não pôde ser excluído completamente" 
        };
      }

      console.log("Usuário excluído com sucesso:", userId);
      return { success: true, message: "Usuário excluído com sucesso" };
    } catch (deleteError: any) {
      console.error("Exceção ao tentar excluir usuário:", deleteError);
      
      // Verificar se o erro é relacionado a foreign key constraints
      if (deleteError.message && deleteError.message.includes("violates foreign key constraint")) {
        console.log("Detectada violação de foreign key. Tentando inativar o usuário...");
        
        // Inativar o usuário em vez de excluir
        const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { ban_duration: '87600h' }  // 10 anos
        );
        
        if (updateError) {
          console.error("Erro ao inativar o usuário:", updateError);
          return { error: "Não foi possível inativar o usuário: " + updateError.message };
        }
        
        return { 
          success: true, 
          inactivated: true, 
          message: "Usuário foi inativado porque tem dados associados que não podem ser excluídos" 
        };
      }
      
      return { error: deleteError.message };
    }
  } catch (error: any) {
    console.error("Erro ao processar exclusão/inativação do usuário:", error);
    return { error: error.message };
  }
};

// Função para alternar o status do usuário (ativar/inativar)
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
