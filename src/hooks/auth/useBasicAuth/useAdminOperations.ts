
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
      console.log("[useAdminOperations] Iniciando criação de usuário");
      console.log("[useAdminOperations] Dados:", {
        email,
        name,
        role,
        password: "***",
        is_mentor
      });

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

      // Verificar se temos uma sessão ativa
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error("[useAdminOperations] Sessão não encontrada:", sessionError);
        throw new Error("Usuário não está autenticado. Faça login novamente.");
      }

      console.log("[useAdminOperations] Sessão ativa encontrada, chamando edge function");
      
      // Chamar a edge function para criar o usuário
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email,
          name,
          role,
          password,
          is_mentor
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error("[useAdminOperations] Erro na edge function:", error);
        throw new Error(error.message || "Erro ao criar usuário");
      }

      console.log("[useAdminOperations] Resposta da edge function:", data);

      // Processar a resposta
      if (data && data.success) {
        console.log("[useAdminOperations] Usuário criado com sucesso:", data);
        
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
        console.log("[useAdminOperations] Usuário já existe:", data);
        
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
        // Erro na criação
        const errorMsg = data?.error || "Erro desconhecido ao criar usuário";
        console.error("[useAdminOperations] Erro na criação:", errorMsg);
        throw new Error(errorMsg);
      }

    } catch (error: any) {
      console.error("[useAdminOperations] Erro:", error);
      
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
