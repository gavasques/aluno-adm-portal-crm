
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
      console.log("Criando usuário via Edge Function com dados:", { 
        email, 
        name, 
        role, 
        password: "***",
        is_mentor 
      });

      const { data, error } = await supabase.functions.invoke('list-users', {
        body: { 
          action: 'createUser',
          email, 
          name, 
          role, 
          password,
          is_mentor
        }
      });

      console.log("Resposta da Edge Function:", { data, error });

      if (error) {
        console.error("Erro da Edge Function:", error);
        
        // Tratar diferentes tipos de erro
        let errorMessage = "Erro ao criar usuário";
        if (error.message?.includes("non-2xx status code")) {
          errorMessage = "Erro interno do servidor. Tente novamente.";
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
        console.error("Erro retornado pela função:", data.error);
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
        
        toast({
          title: "Aviso",
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
      console.error("Resposta inesperada da função:", data);
      const fallbackMessage = "Resposta inesperada do servidor";
      
      toast({
        title: "Erro",
        description: fallbackMessage,
        variant: "destructive",
      });
      
      return { error: fallbackMessage, existed: false };
      
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      
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
