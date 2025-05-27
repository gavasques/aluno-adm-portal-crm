
import { CreateUserRequest, UserValidationResult } from './types.ts';

export function validateUserData(userData: CreateUserRequest): UserValidationResult {
  const errors: string[] = [];

  if (!userData.email) errors.push('email');
  if (!userData.name) errors.push('name');
  if (!userData.role) errors.push('role');
  if (!userData.password) errors.push('password');

  if (errors.length > 0) {
    return {
      isValid: false,
      errors: [`Campos obrigatórios faltando: ${errors.join(', ')}`]
    };
  }

  if (userData.password.length < 6) {
    return {
      isValid: false,
      errors: ['A senha deve ter pelo menos 6 caracteres']
    };
  }

  return {
    isValid: true,
    errors: []
  };
}
