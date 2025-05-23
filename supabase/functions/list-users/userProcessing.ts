
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
  
  // Buscar todos os perfis em uma única consulta para melhor performance
  const { data: profilesData, error: profilesError } = await supabaseAdmin
    .from('profiles')
    .select('*');
    
  if (profilesError) {
    console.error("Erro ao buscar perfis:", profilesError);
  }
  
  // Criar um mapa de perfis para acesso mais rápido
  const profilesMap = new Map();
  if (profilesData && Array.isArray(profilesData)) {
    profilesData.forEach(profile => {
      if (profile && profile.id) {
        profilesMap.set(profile.id, profile);
      }
    });
  }
  
  console.log(`Mapa de perfis criado com ${profilesMap.size} entradas`);
  
  return await Promise.all(users.map(async (user: any) => {
    try {
      if (!user || !user.id) {
        console.warn("Usuário inválido encontrado:", user);
        return null;
      }
      
      // Buscar perfil do mapa
      const profileData = profilesMap.get(user.id);
      
      // Log para debug
      console.log(`Processando usuário: ${user.id}, ${user.email}`);
      console.log(`Perfil encontrado: ${profileData ? 'Sim' : 'Não'}`);
      if (profileData) {
        console.log(`Status do perfil: ${profileData.status}`);
      }
      
      // Determinar o status do usuário - primariamente do perfil
      let status = profileData?.status || "Ativo";
      
      // Se não houver status no perfil, verificar banned_until
      if (user.banned_until && new Date(user.banned_until) > new Date()) {
        status = "Inativo";
      } else if (user.user_metadata?.status === 'Convidado') {
        status = "Convidado";
      }
      
      console.log(`Status final do usuário ${user.email}: ${status}`);

      return {
        id: user.id,
        name: profileData?.name || user.user_metadata?.name || user.email?.split('@')[0] || "Usuário sem nome",
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
        name: user.user_metadata?.name || user.email?.split('@')[0] || "Usuário sem nome",
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

// Função auxiliar para importar de profileManagement.ts
export const ensureProfiles = async (users: any[], supabaseAdmin: any, profilesMap: Map<string, any>) => {
  // Importar de forma dinâmica para evitar problemas de referência circular
  const { ensureUserProfile } = await import('./profileManagement.ts');
  
  // Garantir que todos os usuários tenham perfis
  for (const user of users) {
    if (user && user.id) {
      await ensureUserProfile(supabaseAdmin, user, profilesMap);
    }
  }
};
