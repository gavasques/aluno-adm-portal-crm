
import { CreateUserRequest, UserValidationResult } from './types.ts';

export function validateUserData(userData: CreateUserRequest): UserValidationResult {
  const errors: string[] = [];

  console.log("🔍 Validando dados do usuário:", { 
    email: userData.email, 
    name: userData.name, 
    role: userData.role, 
    hasPassword: !!userData.password,
    is_mentor: userData.is_mentor 
  });

  if (!userData.email || userData.email.trim() === '') {
    errors.push('Email é obrigatório');
  }
  
  if (!userData.name || userData.name.trim() === '') {
    errors.push('Nome é obrigatório');
  }
  
  if (!userData.role || userData.role.trim() === '') {
    errors.push('Função/Role é obrigatória');
  }
  
  if (!userData.password || userData.password.trim() === '') {
    errors.push('Senha é obrigatória');
  }

  // Validar formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (userData.email && !emailRegex.test(userData.email)) {
    errors.push('Email deve ter um formato válido');
  }

  // Validar senha
  if (userData.password && userData.password.length < 6) {
    errors.push('A senha deve ter pelo menos 6 caracteres');
  }

  if (errors.length > 0) {
    console.error("❌ Erros de validação encontrados:", errors);
    return {
      isValid: false,
      errors: errors
    };
  }

  console.log("✅ Dados válidos");
  return {
    isValid: true,
    errors: []
  };
}
