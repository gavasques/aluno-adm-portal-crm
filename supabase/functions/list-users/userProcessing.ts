
/**
 * Este arquivo contém funções para processar dados de usuários
 * Extrai a lógica de processamento de usuários do handles.ts
 */

/**
 * Processa um array de usuários do Supabase Auth para o formato usado na UI
 */
export const processUsers = async (users: any[], supabaseAdmin: any): Promise<any[]> => {
  if (!users || !Array.isArray(users)) {
    console.error("Entrada inválida para processUsers:", users);
    return [];
  }
  
  console.log(`Processando ${users.length} usuários`);
  
  return await Promise.all(users.map(async (user: any) => {
    try {
      if (!user || !user.id) {
        console.warn("Usuário inválido encontrado:", user);
        return null;
      }
      
      // Buscar perfil associado para obter mais dados
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.warn(`Erro ao buscar perfil para usuário ${user.id}:`, profileError);
      }
      
      // Log para debug
      console.log('Dados do usuário processado:', { 
        id: user.id, 
        email: user.email, 
        perfil: profileData ? 'encontrado' : 'não encontrado',
        status: profileData?.status || 'Ativo',
        banned_until: user.banned_until
      });
      
      // Determinar o status do usuário - primariamente do perfil
      let status = profileData?.status;
      
      // Se não houver status no perfil, verificar banned_until
      if (!status && user.banned_until && new Date(user.banned_until) > new Date()) {
        status = "Inativo";
      } else if (!status && user.user_metadata?.status === 'Convidado') {
        status = "Convidado";
      }
      
      // Garantir que temos um status válido
      if (!status) {
        status = "Ativo"; // Valor padrão final
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
  })).then(users => users.filter(Boolean)); // Filtrar nulos
};
