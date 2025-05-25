
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface CreateUserResult {
  success?: boolean;
  existed?: boolean;
  error?: string;
  message?: string;
  is_mentor?: boolean;
  profileCreated?: boolean;
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

      // Validação de entrada no frontend
      if (!email || !email.includes('@')) {
        const errorMsg = "Email é obrigatório e deve ser válido";
        console.error("[useAdminOperations] Erro de validação:", errorMsg);
        toast({
          title: "Erro de Validação",
          description: errorMsg,
          variant: "destructive",
        });
        return { error: errorMsg };
      }

      if (!password || password.length < 6) {
        const errorMsg = "Senha deve ter pelo menos 6 caracteres";
        console.error("[useAdminOperations] Erro de validação:", errorMsg);
        toast({
          title: "Erro de Validação",
          description: errorMsg,
          variant: "destructive",
        });
        return { error: errorMsg };
      }

      if (!name || name.trim().length === 0) {
        const errorMsg = "Nome é obrigatório";
        console.error("[useAdminOperations] Erro de validação:", errorMsg);
        toast({
          title: "Erro de Validação",
          description: errorMsg,
          variant: "destructive",
        });
        return { error: errorMsg };
      }

      console.log("[useAdminOperations] Validação passou, chamando Edge Function");

      const { data, error } = await supabase.functions.invoke('list-users', {
        body: { 
          action: 'createUser',
          email: email.trim(), 
          name: name.trim(), 
          role, 
          password,
          is_mentor
        }
      });

      console.log("[useAdminOperations] Resposta da Edge Function:", { data, error });

      if (error) {
        console.error("[useAdminOperations] Erro da Edge Function:", error);
        
        let errorMessage = "Erro ao criar usuário";
        if (error.message?.includes("Failed to fetch")) {
          errorMessage = "Erro de conexão com o servidor. Verifique sua conexão.";
        } else if (error.message?.includes("non-2xx status code")) {
          errorMessage = "Erro interno do servidor. Dados inválidos ou conflito.";
        } else {
          errorMessage = error.message || "Erro desconhecido ao criar usuário";
        }
        
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
        
        return { error: errorMessage, existed: false };
      }

      if (data?.error) {
        console.error("[useAdminOperations] Erro retornado pela função:", data.error);
        toast({
          title: "Erro",
          description: data.error,
          variant: "destructive",
        });
        return { error: data.error, existed: false };
      }

      if (data?.existed) {
        const message = data.profileCreated 
          ? "Usuário já existia, mas o perfil foi sincronizado com sucesso"
          : data.message || "Usuário já existe com este email";
        
        console.log("[useAdminOperations] Usuário já existe:", message);
        
        toast({
          title: data.profileCreated ? "Sincronizado" : "Aviso",
          description: message,
          variant: data.profileCreated ? "default" : "destructive",
        });
        
        return { 
          success: data.profileCreated, 
          existed: true, 
          message,
          is_mentor: data.is_mentor || is_mentor
        };
      }

      if (data?.success) {
        const message = data.message || "Usuário criado com sucesso";
        const mentorMessage = is_mentor ? " (marcado como mentor)" : "";
        
        console.log("[useAdminOperations] Usuário criado com sucesso:", message);
        
        toast({
          title: "Sucesso",
          description: message + mentorMessage,
        });
        
        return { 
          success: true, 
          existed: false, 
          message,
          is_mentor: data.is_mentor || is_mentor
        };
      }

      // Se chegou até aqui, algo inesperado aconteceu
      console.error("[useAdminOperations] Resposta inesperada:", data);
      const fallbackMessage = "Resposta inesperada do servidor";
      
      toast({
        title: "Erro",
        description: fallbackMessage,
        variant: "destructive",
      });
      
      return { error: fallbackMessage, existed: false };
      
    } catch (error: any) {
      console.error("[useAdminOperations] Erro não tratado:", error);
      
      let errorMessage = "Erro desconhecido ao criar usuário";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { error: errorMessage, existed: false };
    }
  };

  return {
    createAdminUser,
  };
};
