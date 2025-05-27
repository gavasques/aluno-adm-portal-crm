
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sanitizeError, logSecureError } from "@/utils/security";
import { logUserCreation } from "@/utils/audit-logger";

export interface CreateUserResult {
  success: boolean;
  existed?: boolean;
  profileCreated?: boolean;
  error?: string;
}

export const useAdminOperations = () => {
  const createAdminUser = async (
    email: string,
    name: string,
    role: string,
    password: string,
    is_mentor: boolean = false
  ): Promise<CreateUserResult> => {
    try {
      console.log("[useAdminOperations] === INÍCIO DO DEBUG DETALHADO ===");
      console.log("[useAdminOperations] Iniciando criação de usuário:", { email, name, role, is_mentor });

      // Validações básicas
      if (!email || !name || !role || !password) {
        const errorMsg = "Todos os campos obrigatórios devem ser preenchidos";
        console.error("[useAdminOperations] Erro de validação:", errorMsg);
        throw new Error(errorMsg);
      }

      if (password.length < 6) {
        const errorMsg = "A senha deve ter pelo menos 6 caracteres";
        console.error("[useAdminOperations] Erro de validação:", errorMsg);
        throw new Error(errorMsg);
      }

      // Verificar sessão atual para debug
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log("[useAdminOperations] Estado da sessão:", {
        hasSession: !!session,
        sessionError: sessionError?.message,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      });

      // Preparar dados para envio
      const requestData = {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        role: role,
        password: password,
        is_mentor: Boolean(is_mentor)
      };

      console.log("[useAdminOperations] Dados preparados:", { 
        ...requestData, 
        password: "***",
        dataSize: JSON.stringify(requestData).length 
      });
      
      console.log("[useAdminOperations] Chamando edge function create-user...");
      
      // Chamar a edge function para criar o usuário
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: requestData
      });

      console.log("[useAdminOperations] Resposta da edge function:");
      console.log("- data:", data);
      console.log("- error:", error);
      console.log("- error type:", typeof error);
      console.log("- error details:", error ? JSON.stringify(error, null, 2) : 'null');

      if (error) {
        console.error("[useAdminOperations] Erro na edge function:", error);
        
        // Melhor tratamento de diferentes tipos de erro
        let errorMessage = "Erro desconhecido na edge function";
        
        if (error.message) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error.toString && typeof error.toString === 'function') {
          errorMessage = error.toString();
        }
        
        console.error("[useAdminOperations] Mensagem de erro processada:", errorMessage);
        throw new Error(errorMessage);
      }

      // Processar a resposta
      console.log("[useAdminOperations] Processando resposta...");
      
      if (data && data.success) {
        console.log("[useAdminOperations] ✅ Usuário criado com sucesso");
        
        logUserCreation(email, true, 'admin');
        
        if (data.existed && data.profileCreated) {
          toast({
            title: "Usuário sincronizado",
            description: `Usuário ${email} foi sincronizado com sucesso.`,
          });
        } else {
          toast({
            title: "Usuário criado com sucesso",
            description: `Usuário ${email} foi criado e adicionado ao sistema.`,
          });
        }
        
        return { 
          success: true, 
          existed: data.existed,
          profileCreated: data.profileCreated 
        };
      } else if (data && data.existed) {
        console.log("[useAdminOperations] ⚠️ Usuário já existe");
        
        toast({
          title: "Usuário já existe",
          description: `O usuário ${email} já está cadastrado no sistema.`,
          variant: "default",
        });
        
        return { 
          success: false, 
          existed: true, 
          error: data.error || "Usuário já cadastrado" 
        };
      } else {
        const errorMsg = data?.error || "Erro desconhecido ao criar usuário";
        console.error("[useAdminOperations] ❌ Falha na criação:", errorMsg);
        console.log("[useAdminOperations] Dados recebidos:", data);
        throw new Error(errorMsg);
      }

    } catch (error: any) {
      console.error("[useAdminOperations] === ERRO CAPTURADO ===");
      console.error("Erro completo:", error);
      console.error("Tipo do erro:", typeof error);
      console.error("Stack trace:", error.stack);
      console.error("Message:", error.message);
      console.error("=== FIM DO DEBUG ===");
      
      const sanitizedMessage = sanitizeError(error);
      logSecureError(error, "Admin User Creation");
      logUserCreation(email, false, 'admin', sanitizedMessage);
      
      toast({
        title: "Erro ao criar usuário",
        description: sanitizedMessage,
        variant: "destructive",
      });
      
      return { 
        success: false, 
        existed: false, 
        error: sanitizedMessage 
      };
    }
  };

  return {
    createAdminUser
  };
};
