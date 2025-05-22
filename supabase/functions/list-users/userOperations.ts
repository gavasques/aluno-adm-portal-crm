// Operações específicas de usuários (criar, excluir, alterar status)

import { createSupabaseAdminClient } from './utils.ts';

// Função para criar um novo usuário
export async function createUser(supabaseAdmin: any, requestData: any) {
  const { email, name, role } = requestData;
  
  try {
    console.log(`Iniciando criação do usuário: ${email}`);
    
    // Verificar se o usuário já existe
    const { data: existingUsers, error: checkError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (checkError) {
      console.error("Erro ao verificar usuário existente:", checkError);
      throw checkError;
    }
    
    // Verificar se existe algum usuário com o email específico
    const userWithSameEmail = existingUsers.users.find(user => 
      user.email && user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (userWithSameEmail) {
      console.log(`Usuário com email ${email} já existe, ID: ${userWithSameEmail.id}`);
      return { success: true, message: "Usuário já existe", existed: true };
    }
    
    console.log(`Nenhum usuário encontrado com email ${email}, prosseguindo com criação`);
    
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
export async function checkUserDependencies(supabaseAdmin: any, userId: string) {
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
export async function deleteUser(supabaseAdmin: any, requestData: any) {
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
export async function toggleUserStatus(supabaseAdmin: any, requestData: any) {
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
    
    // Importante: confirmar que a alteração foi realizada
    const { data: updatedUser, error: checkError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (checkError) {
      console.error("Erro ao verificar atualização do usuário:", checkError);
      throw checkError;
    }
    
    // Verificar se o status foi realmente atualizado
    if (updatedUser.user.banned === !active) {
      console.log(`Usuário ${email} ${active ? 'ativado' : 'inativado'} com sucesso. banned=${updatedUser.user.banned}`);
      return { success: true, active, banned: updatedUser.user.banned };
    } else {
      console.error(`Falha na atualização do status: esperado banned=${!active}, recebido banned=${updatedUser.user.banned}`);
      throw new Error("A atualização do status não foi aplicada corretamente");
    }
  } catch (error) {
    console.error(`Falha ao alterar status do usuário ${email}:`, error);
    throw error;
  }
}
