
import { CreateUserRequest } from './types.ts';

export async function checkUserExists(email: string, supabaseAdmin: any) {
  console.log("🔍 Verificando se o usuário já existe...");

  // 1. Verificar no auth.users via admin
  const { data: existingAuthUser, error: authCheckError } = await supabaseAdmin.auth.admin.getUserByEmail(email.toLowerCase());
  
  if (authCheckError && authCheckError.message !== 'User not found') {
    console.error("❌ Erro ao verificar usuário no auth:", authCheckError);
    throw new Error('Erro ao verificar usuário existente no auth');
  }

  // 2. Verificar no profiles
  const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (profileCheckError) {
    console.error("❌ Erro ao verificar perfil existente:", profileCheckError);
    throw new Error('Erro ao verificar usuário existente');
  }

  console.log("🔍 Resultado da verificação:");
  console.log("- Usuário no auth:", existingAuthUser?.user ? "EXISTE" : "NÃO EXISTE");
  console.log("- Perfil na tabela:", existingProfile ? "EXISTE" : "NÃO EXISTE");

  return {
    authUserExists: !!existingAuthUser?.user,
    profileExists: !!existingProfile
  };
}

export async function createAuthUser(userData: CreateUserRequest, supabaseAdmin: any) {
  console.log("👤 Criando usuário via Admin API...");
  
  const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: userData.email.toLowerCase(),
    password: userData.password,
    email_confirm: true,
    user_metadata: {
      name: userData.name,
      role: userData.role,
      is_mentor: userData.is_mentor || false
    }
  });

  if (createError) {
    console.error("❌ Erro ao criar usuário no auth:", createError);
    throw new Error(`Erro no auth: ${createError.message}`);
  }

  if (!authUser.user) {
    console.error("❌ Usuário não foi retornado após criação");
    throw new Error('Falha ao criar usuário - dados não retornados');
  }

  console.log("✅ Usuário criado no auth:", authUser.user.id);
  return authUser.user;
}

export async function createUserProfile(user: any, userData: CreateUserRequest, supabaseAdmin: any) {
  console.log("👤 Criando perfil do usuário...");
  
  const { error: profileInsertError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: user.id,
      email: userData.email.toLowerCase(),
      name: userData.name,
      role: userData.role,
      is_mentor: userData.is_mentor || false,
      status: 'Ativo'
    });

  if (profileInsertError) {
    console.error("❌ Erro ao criar profile:", profileInsertError);
    
    // Se o profile não foi criado, limpar o usuário do auth
    console.log("🧹 Limpando usuário do auth devido a erro no profile...");
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    throw new Error(`Erro ao criar perfil: ${profileInsertError.message}`);
  }

  console.log("✅ Profile criado com sucesso");
}
