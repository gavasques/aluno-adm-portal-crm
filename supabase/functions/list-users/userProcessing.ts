
/**
 * Este arquivo contém funções para processar dados de usuários
 * Extrai a lógica de processamento de usuários do handles.ts
 */
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

/**
 * Processa um array de usuários do Supabase Auth para o formato usado na UI
 */
export const processUsers = async (users: any[], supabaseAdmin: SupabaseClient): Promise<any[]> => {
  console.log("[userProcessing] 🔍 INICIANDO processUsers");
  console.log("[userProcessing] 📊 Recebidos para processamento:", typeof users, users?.length || 'N/A');
  
  if (!users || !Array.isArray(users)) {
    console.error("[userProcessing] ❌ Entrada inválida para processUsers:", typeof users);
    return [];
  }
  
  console.log(`[userProcessing] ✅ Processando ${users.length} usuários`);
  
  // Buscar todos os perfis em uma única consulta para melhor performance
  const { data: profilesData, error: profilesError } = await supabaseAdmin
    .from('profiles')
    .select('*');
    
  if (profilesError) {
    console.error("[userProcessing] ❌ Erro ao buscar perfis:", profilesError);
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
  
  console.log(`[userProcessing] 📊 Mapa de perfis criado com ${profilesMap.size} entradas`);
  
  const processedUsers = await Promise.all(users.map(async (user: any) => {
    try {
      if (!user || !user.id) {
        console.warn("[userProcessing] ⚠️ Usuário inválido encontrado:", user);
        return null;
      }
      
      // Buscar perfil do mapa
      const profileData = profilesMap.get(user.id);
      
      console.log(`[userProcessing] 👤 Processando usuário: ${user.email} (${user.id})`);
      console.log(`[userProcessing] 📋 Perfil encontrado: ${profileData ? 'Sim' : 'Não'}`);
      
      // Determinar status - priorizar o status da tabela profiles
      let status = "Ativo"; // Status padrão
      
      if (profileData && profileData.status) {
        status = profileData.status;
        console.log(`[userProcessing] ✅ Usando status do perfil: ${status} para usuário ${user.email}`);
      } else {
        console.log(`[userProcessing] ⚠️ Usando fallback de auth para usuário ${user.email}`);
        
        if (user.banned_until && new Date(user.banned_until) > new Date()) {
          status = "Inativo";
        } else if (user.user_metadata?.status === 'Convidado') {
          status = "Convidado";
        } else if (!user.email_confirmed_at) {
          status = "Pendente";
        }
      }
      
      const processedUser = {
        id: user.id,
        name: profileData?.name || user.user_metadata?.name || user.email?.split('@')[0] || "Usuário sem nome",
        email: user.email,
        role: profileData?.role || user.user_metadata?.role || "Student",
        status: status,
        lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : "Nunca",
        tasks: [],
        permission_group_id: profileData?.permission_group_id || null,
        storage_used_mb: profileData?.storage_used_mb || 0,
        storage_limit_mb: profileData?.storage_limit_mb || 100,
        is_mentor: profileData?.is_mentor || false,
        created_at: profileData?.created_at || user.created_at,
        updated_at: profileData?.updated_at || user.updated_at
      };
      
      console.log(`[userProcessing] ✅ Usuário processado: ${processedUser.email} - Status: ${processedUser.status}`);
      return processedUser;
      
    } catch (err) {
      console.error(`[userProcessing] ❌ Erro ao processar usuário ${user.id}:`, err);
      return {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || "Usuário sem nome",
        email: user.email,
        role: user.user_metadata?.role || "Student",
        status: "Ativo",
        lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : "Nunca",
        tasks: [],
        permission_group_id: null,
        storage_used_mb: 0,
        storage_limit_mb: 100,
        is_mentor: false,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    }
  }));
  
  const validUsers = processedUsers.filter(Boolean);
  console.log(`[userProcessing] 🎉 CONCLUÍDO: ${validUsers.length} usuários processados com sucesso`);
  return validUsers;
};

// Exportar a função que o handlers.ts está procurando
export const processUsersForResponse = processUsers;

// Função auxiliar para garantir perfis
export const ensureProfiles = async (users: any[], supabaseAdmin: SupabaseClient, profilesMap: Map<string, any>) => {
  console.log("[userProcessing] 🔧 Garantindo perfis para usuários...");
  
  for (const user of users) {
    if (user && user.id) {
      const profile = profilesMap.get(user.id);
      if (!profile) {
        console.log(`[userProcessing] 📝 Criando perfil para usuário: ${user.email}`);
        
        try {
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: user.id,
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
              role: user.user_metadata?.role || 'Student',
              status: 'Ativo',
              permission_group_id: '564c55dc-0ab8-481e-a0bc-97ea7e484b88',
              storage_limit_mb: 100,
              storage_used_mb: 0,
              is_mentor: false
            });
            
          if (profileError) {
            console.error(`[userProcessing] ❌ Erro ao criar perfil para ${user.email}:`, profileError);
          } else {
            console.log(`[userProcessing] ✅ Perfil criado para ${user.email}`);
          }
        } catch (error) {
          console.error(`[userProcessing] ❌ Erro inesperado ao criar perfil para ${user.email}:`, error);
        }
      }
    }
  }
};
