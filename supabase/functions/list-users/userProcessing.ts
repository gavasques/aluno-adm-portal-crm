
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

export async function processUsersForResponse(authUsers: any[], supabaseAdmin: SupabaseClient) {
  console.log("[userProcessing] 🔍 INICIANDO processUsers");
  console.log("[userProcessing] 📊 Recebidos para processamento:", typeof authUsers, authUsers.length);

  if (!authUsers || authUsers.length === 0) {
    console.log("[userProcessing] ⚠️ Nenhum usuário para processar");
    return [];
  }

  // Buscar todos os perfis de uma vez
  const userIds = authUsers.map(user => user.id);
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .in('id', userIds);

  console.log("[userProcessing] ✅ Processando", authUsers.length, "usuários");
  
  // Criar mapa de perfis para acesso rápido
  const profilesMap = new Map();
  if (profiles) {
    profiles.forEach(profile => {
      profilesMap.set(profile.id, profile);
    });
  }
  console.log("[userProcessing] 📊 Mapa de perfis criado com", profilesMap.size, "entradas");

  const processedUsers = [];

  for (const user of authUsers) {
    console.log(`[userProcessing] 👤 Processando usuário: ${user.email} (${user.id})`);
    
    const profile = profilesMap.get(user.id);
    console.log("[userProcessing] 📋 Perfil encontrado:", profile ? "Sim" : "Não");

    // Processar último login
    let lastLogin = "Nunca";
    
    if (user.last_sign_in_at) {
      try {
        const lastSignInDate = new Date(user.last_sign_in_at);
        if (!isNaN(lastSignInDate.getTime())) {
          lastLogin = lastSignInDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          console.log(`[userProcessing] 📅 Último login processado: ${lastLogin} para ${user.email}`);
        } else {
          console.log(`[userProcessing] ⚠️ Data inválida de último login para ${user.email}:`, user.last_sign_in_at);
        }
      } catch (error) {
        console.error(`[userProcessing] ❌ Erro ao processar último login para ${user.email}:`, error);
      }
    } else {
      console.log(`[userProcessing] ℹ️ Nenhum último login registrado para ${user.email}`);
    }

    // Determinar status
    let status = "Ativo";
    if (profile && profile.status) {
      status = profile.status;
      console.log(`[userProcessing] ✅ Usando status do perfil: ${status} para usuário ${user.email}`);
    } else {
      console.log(`[userProcessing] ⚠️ Usando status padrão: ${status} para usuário ${user.email}`);
    }

    const processedUser = {
      id: user.id,
      email: user.email,
      name: profile?.name || user.user_metadata?.name || user.user_metadata?.full_name || "Nome não informado",
      role: profile?.role || "Student",
      status: status,
      lastLogin: lastLogin,
      tasks: [],
      permission_group_id: profile?.permission_group_id || null,
      storage_used_mb: profile?.storage_used_mb || 0,
      storage_limit_mb: profile?.storage_limit_mb || 100,
      is_mentor: profile?.is_mentor || false,
      created_at: user.created_at,
      updated_at: profile?.updated_at || user.updated_at
    };

    processedUsers.push(processedUser);
    console.log(`[userProcessing] ✅ Usuário processado: ${user.email} - Status: ${status} - Último Login: ${lastLogin}`);
  }

  console.log("[userProcessing] 🎉 CONCLUÍDO:", processedUsers.length, "usuários processados com sucesso");
  return processedUsers;
}
