
import { CreateUserRequest } from './types.ts';

export async function checkUserExists(email: string, supabaseAdmin: any) {
  console.log("🔍 Verificando se o usuário já existe para email:", email);

  try {
    // 1. Verificar no auth.users via admin
    const { data: existingAuthUser, error: authCheckError } = await supabaseAdmin.auth.admin.getUserByEmail(email.toLowerCase().trim());
    
    if (authCheckError && authCheckError.message !== 'User not found') {
      console.error("❌ Erro ao verificar usuário no auth:", authCheckError);
      throw new Error('Erro ao verificar usuário existente no auth: ' + authCheckError.message);
    }

    // 2. Verificar no profiles
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (profileCheckError) {
      console.error("❌ Erro ao verificar perfil existente:", profileCheckError);
      throw new Error('Erro ao verificar perfil existente: ' + profileCheckError.message);
    }

    console.log("🔍 Resultado da verificação:");
    console.log("- Usuário no auth:", existingAuthUser?.user ? "EXISTE" : "NÃO EXISTE");
    console.log("- Perfil na tabela:", existingProfile ? "EXISTE" : "NÃO EXISTE");

    return {
      authUserExists: !!existingAuthUser?.user,
      profileExists: !!existingProfile
    };
  } catch (error) {
    console.error("❌ Erro na verificação de usuário existente:", error);
    throw error;
  }
}

export async function createAuthUser(userData: CreateUserRequest, supabaseAdmin: any) {
  console.log("👤 Criando usuário via Admin API para:", userData.email);
  
  try {
    const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        name: userData.name.trim(),
        role: userData.role,
        is_mentor: userData.is_mentor || false
      }
    });

    if (createError) {
      console.error("❌ Erro ao criar usuário no auth:", createError);
      throw new Error(`Erro ao criar usuário no auth: ${createError.message}`);
    }

    if (!authUser.user) {
      console.error("❌ Usuário não foi retornado após criação");
      throw new Error('Falha ao criar usuário - dados não retornados');
    }

    console.log("✅ Usuário criado no auth com ID:", authUser.user.id);
    return authUser.user;
  } catch (error) {
    console.error("❌ Erro na criação do usuário auth:", error);
    throw error;
  }
}

export async function createUserProfile(user: any, userData: CreateUserRequest, supabaseAdmin: any) {
  console.log("👤 Criando perfil do usuário para ID:", user.id);
  
  try {
    // Buscar o grupo "Geral" como padrão
    const { data: geralGroup } = await supabaseAdmin
      .from('permission_groups')
      .select('id')
      .eq('name', 'Geral')
      .single();

    const profileData = {
      id: user.id,
      email: userData.email.toLowerCase().trim(),
      name: userData.name.trim(),
      role: userData.role,
      is_mentor: userData.is_mentor || false,
      status: 'Ativo',
      permission_group_id: geralGroup?.id || null
    };

    console.log("📝 Dados do perfil a ser criado:", profileData);

    const { error: profileInsertError } = await supabaseAdmin
      .from('profiles')
      .insert(profileData);

    if (profileInsertError) {
      console.error("❌ Erro ao criar profile:", profileInsertError);
      
      // Se o profile não foi criado, limpar o usuário do auth
      console.log("🧹 Limpando usuário do auth devido a erro no profile...");
      try {
        await supabaseAdmin.auth.admin.deleteUser(user.id);
        console.log("🧹 Usuário removido do auth");
      } catch (deleteError) {
        console.error("❌ Erro ao limpar usuário do auth:", deleteError);
      }
      
      throw new Error(`Erro ao criar perfil: ${profileInsertError.message}`);
    }

    console.log("✅ Profile criado com sucesso");
  } catch (error) {
    console.error("❌ Erro na criação do profile:", error);
    throw error;
  }
}
