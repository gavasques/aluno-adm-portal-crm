
/**
 * Este arquivo contém funções para processar dados de usuários
 * Extrai a lógica de processamento de usuários do handles.ts
 */

/**
 * Processa um array de usuários do Supabase Auth para o formato usado na UI
 */
export const processUsers = async (users: any[], supabaseAdmin: any): Promise<any[]> => {
  return await Promise.all(users.map(async (user: any) => {
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
        status: profileData?.status,
        banned_until: user.banned_until
      });
      
      // Determinar o status do usuário usando o campo status do perfil 
      // ou o banned_until como fallback
      let status = profileData?.status || "Ativo";
      if (!status && user.banned_until && new Date(user.banned_until) > new Date()) {
        status = "Inativo";
      } else if (!status && user.user_metadata?.status === 'Convidado') {
        status = "Convidado";
      }

      return {
        id: user.id,
        name: profileData?.name || user.user_metadata?.name || "Usuário sem nome",
        email: user.email,
        role: profileData?.role || user.user_metadata?.role || "Student",
        status: status,
        lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : "Nunca",
        tasks: [], // Placeholder para futuras tarefas
        permission_group_id: profileData?.permission_group_id || null
      };
    } catch (err) {
      console.error(`Erro ao processar usuário ${user.id}:`, err);
      return {
        id: user.id,
        name: user.user_metadata?.name || "Usuário sem nome",
        email: user.email,
        role: user.user_metadata?.role || "Student",
        status: "Ativo", // Status padrão para casos de erro
        lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : "Nunca",
        tasks: [],
        permission_group_id: null
      };
    }
  }));
};
