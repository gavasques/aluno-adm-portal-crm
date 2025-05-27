
import { CreateUserRequest, CreateUserResponse } from './types.ts';
import { validateUserData } from './validation.ts';
import { checkUserExists, createAuthUser, createUserProfile } from './user-operations.ts';

export async function parseRequestBody(req: Request): Promise<CreateUserRequest> {
  let requestBody;
  try {
    requestBody = await req.text();
    console.log("📝 Body da requisição recebido (tamanho):", requestBody.length);
    console.log("📝 Body da requisição:", requestBody);
  } catch (error) {
    console.error("❌ Erro ao ler o body da requisição:", error);
    throw new Error('Erro ao ler dados da requisição');
  }

  if (!requestBody || requestBody.trim() === '') {
    console.error("❌ Body da requisição está vazio");
    throw new Error('Body da requisição está vazio');
  }
  
  let userData;
  try {
    userData = JSON.parse(requestBody);
    console.log("✅ Dados parseados:", { ...userData, password: userData.password ? "***" : "não definida" });
  } catch (parseError) {
    console.error("❌ Erro ao fazer parse do JSON:", parseError);
    throw new Error('JSON inválido no corpo da requisição');
  }

  return userData as CreateUserRequest;
}

export async function handleUserCreation(userData: CreateUserRequest, supabaseAdmin: any): Promise<CreateUserResponse> {
  const { email, name, role, password, is_mentor } = userData;

  console.log("📋 Dados extraídos:", { email, name, role, is_mentor, hasPassword: !!password });

  // Validações básicas
  const validation = validateUserData(userData);
  if (!validation.isValid) {
    console.error("❌ Campos obrigatórios faltando:", validation.errors);
    throw new Error(validation.errors[0]);
  }

  // Verificar se o usuário já existe
  const { authUserExists, profileExists } = await checkUserExists(email, supabaseAdmin);
  
  if (authUserExists || profileExists) {
    console.log("❌ Usuário já existe no sistema");
    return { 
      success: false, 
      existed: true, 
      error: 'Usuário já cadastrado no sistema' 
    };
  }

  console.log("✅ Usuário não existe, prosseguindo com a criação...");

  // Criar o usuário
  const authUser = await createAuthUser(userData, supabaseAdmin);
  
  // Criar o profile do usuário
  await createUserProfile(authUser, userData, supabaseAdmin);

  console.log("✅ Profile criado com sucesso");
  console.log("=== USUÁRIO CRIADO COM SUCESSO ===");
  
  return { success: true, existed: false };
}
