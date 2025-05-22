
import { corsHeaders } from './utils.ts';

// Função para criar um novo usuário
export const createUser = async (supabaseAdmin: any, data: any) => {
  try {
    const { email, password, name, role } = data;

    if (!email || !password || !name || !role) {
      console.error("Dados incompletos para criar usuário");
      return { error: "Todos os campos são obrigatórios para criar um usuário" };
    }

    // Criar usuário no Supabase Auth
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
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

    // Enviar convite para o usuário
    const { data: invite, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { name: name, role: role, status: 'Convidado' }
    });

    if (inviteError) {
      console.error("Erro ao convidar usuário:", inviteError);
      return { error: inviteError.message };
    }

    // Criar perfil associado na tabela "profiles" com status "Convidado"
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([
        { id: invite.user.id, name: name, role: role, email: email }
      ]);

    if (profileError) {
      console.error("Erro ao criar perfil:", profileError);
      return { error: profileError.message };
    }

    console.log("Convite enviado com sucesso para:", email);
    return { success: true, message: "Convite enviado com sucesso" };

  } catch (error) {
    console.error("Erro ao convidar usuário:", error);
    return { error: error.message };
  }
};

// Função para excluir um usuário
export const deleteUser = async (supabaseAdmin: any, data: any) => {
  try {
    const { userId } = data;

    if (!userId) {
      console.error("ID do usuário não fornecido para exclusão");
      return { error: "ID do usuário é obrigatório para esta operação" };
    }

    // Excluir usuário do Supabase Auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Erro ao excluir usuário:", deleteError);
      return { error: deleteError.message };
    }

    console.log("Usuário excluído com sucesso:", userId);
    return { success: true, message: "Usuário excluído com sucesso" };

  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
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
    
    // Atualizando o usuário no Supabase Auth usando o atributo correto 'disabled' em vez de 'banned'
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { disabled: !active }
    );
    
    if (updateError) {
      console.error("Erro ao atualizar status do usuário:", updateError);
      return {
        error: updateError.message || "Erro ao atualizar status do usuário"
      };
    }
    
    // Verificar se a atualização foi aplicada corretamente
    if (updateData?.user) {
      console.log("Status do usuário atualizado com sucesso:", 
        active ? "Ativado" : "Inativado", 
        "Disabled:", updateData.user.disabled);
      
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
