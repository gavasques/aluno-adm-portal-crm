
// Função para validação robusta de senhas
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("A senha deve ter pelo menos 8 caracteres");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula");
  }
  
  if (!/\d/.test(password)) {
    errors.push("A senha deve conter pelo menos um número");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("A senha deve conter pelo menos um caractere especial");
  }
  
  // Blacklist de senhas comuns
  const commonPasswords = [
    "password", "123456", "123456789", "12345678", "qwerty", 
    "abc123", "password123", "admin", "letmein", "welcome"
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("Esta senha é muito comum. Escolha uma senha mais segura");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Função para sanitizar mensagens de erro
export const sanitizeError = (error: any): string => {
  if (!error) return "Ocorreu um erro inesperado";
  
  const errorMessage = typeof error === "string" ? error : error.message || "";
  
  // Mapear erros conhecidos do Supabase para mensagens amigáveis
  const errorMappings: Record<string, string> = {
    "Invalid login credentials": "Email ou senha incorretos",
    "Email not confirmed": "Por favor, confirme seu email antes de fazer login",
    "Too many requests": "Muitas tentativas de login. Tente novamente em alguns minutos",
    "User already registered": "Este email já está cadastrado no sistema",
    "Password should be at least 6 characters": "A senha deve ter pelo menos 8 caracteres",
    "Unable to validate email address": "Email inválido",
    "Email rate limit exceeded": "Limite de emails excedido. Tente novamente mais tarde",
    "Invalid email": "Formato de email inválido",
    "Weak password": "Senha muito fraca. Use uma senha mais forte",
    "refresh_token_not_found": "Sessão expirada. Faça login novamente",
    "Invalid refresh token": "Sessão inválida. Faça login novamente"
  };
  
  // Verificar se é um erro conhecido
  for (const [key, value] of Object.entries(errorMappings)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Remover informações técnicas sensíveis
  if (errorMessage.includes("stack") || errorMessage.includes("at ")) {
    return "Ocorreu um erro interno. Tente novamente";
  }
  
  // Remover URLs e caminhos de arquivo
  const sanitized = errorMessage
    .replace(/https?:\/\/[^\s]+/g, "[URL removida]")
    .replace(/\/[^\s]*\.(js|ts|tsx|jsx)/g, "[arquivo removido]")
    .replace(/Error: /g, "");
  
  // Se a mensagem ainda contém informações técnicas, usar mensagem genérica
  if (sanitized.includes("postgresql") || sanitized.includes("supabase") || sanitized.length > 200) {
    return "Ocorreu um erro. Tente novamente ou entre em contato com o suporte";
  }
  
  return sanitized || "Ocorreu um erro inesperado";
};

// Função para logging seguro de erros (apenas para desenvolvimento)
export const logSecureError = (error: any, context?: string) => {
  if (process.env.NODE_ENV === "development") {
    console.error(`[${context || "Error"}]:`, error);
  }
};
