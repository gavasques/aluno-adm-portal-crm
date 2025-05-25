
import { supabase } from "@/integrations/supabase/client";

export interface SupabaseDiagnostics {
  clientConfigured: boolean;
  currentUrl: string;
  redirectUrl: string;
  userExists?: boolean;
  errors: string[];
}

export const runSupabaseDiagnostics = async (userEmail?: string): Promise<SupabaseDiagnostics> => {
  const diagnostics: SupabaseDiagnostics = {
    clientConfigured: false,
    currentUrl: window.location.origin,
    redirectUrl: "",
    errors: []
  };

  try {
    // Verificar se o cliente está configurado
    if (supabase) {
      diagnostics.clientConfigured = true;
      diagnostics.redirectUrl = `${window.location.origin}/reset-password?type=recovery`;
    } else {
      diagnostics.errors.push("Cliente Supabase não configurado");
    }

    // Verificar se conseguimos acessar a sessão atual
    try {
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        diagnostics.errors.push(`Erro ao verificar sessão: ${sessionError.message}`);
      } else {
        console.log("Sessão atual:", session);
      }
    } catch (error: any) {
      diagnostics.errors.push(`Erro ao acessar auth: ${error.message}`);
    }

    // Se email fornecido, verificar se usuário existe
    if (userEmail) {
      try {
        const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
        if (usersError) {
          diagnostics.errors.push(`Não foi possível listar usuários: ${usersError.message}`);
        } else {
          diagnostics.userExists = users?.users?.some(user => user.email === userEmail) || false;
        }
      } catch (error: any) {
        diagnostics.errors.push(`Erro ao verificar usuário: ${error.message}`);
      }
    }

  } catch (error: any) {
    diagnostics.errors.push(`Erro geral: ${error.message}`);
  }

  console.log("=== DIAGNÓSTICO SUPABASE ===");
  console.log(diagnostics);
  console.log("============================");

  return diagnostics;
};

export const logPasswordResetAttempt = (email: string, success: boolean, error?: any) => {
  const logData = {
    timestamp: new Date().toISOString(),
    email,
    success,
    error: error ? {
      message: error.message,
      code: error.code,
      status: error.status
    } : null,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  console.log("=== LOG TENTATIVA RESET SENHA ===");
  console.log(JSON.stringify(logData, null, 2));
  console.log("=================================");

  // Salvar no localStorage para debug
  const attempts = JSON.parse(localStorage.getItem("password_reset_attempts") || "[]");
  attempts.push(logData);
  
  // Manter apenas os últimos 10 logs
  if (attempts.length > 10) {
    attempts.splice(0, attempts.length - 10);
  }
  
  localStorage.setItem("password_reset_attempts", JSON.stringify(attempts));
};
