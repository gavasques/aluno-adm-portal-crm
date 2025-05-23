
// Operações relacionadas a perfis de usuários

/**
 * Função para criar perfil para usuários que não têm
 */
export async function ensureUserProfile(supabaseAdmin: any, authUser: any, profilesMap: Map<string, any>) {
  if (!profilesMap.has(authUser.id)) {
    console.log(`Criando perfil para usuário ${authUser.email} que não possui perfil`);
    
    // Verificar se é admin com base no email
    const isAdmin = authUser.email && (
      authUser.email.includes('gavasques') || 
      authUser.email.includes('admin') || 
      authUser.user_metadata?.role === 'Admin'
    );
    
    const profileData = {
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário sem nome',
      role: isAdmin ? 'Admin' : 'Student',
      status: 'Ativo'
    };
    
    const { error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert(profileData);
    
    if (insertError) {
      console.error(`Erro ao criar perfil para ${authUser.email}:`, insertError);
    } else {
      console.log(`Perfil criado com sucesso para o usuário ${authUser.email}`);
      
      // Adicionar o novo perfil ao mapa
      profilesMap.set(authUser.id, profileData);
    }
  }
}
