
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeError, logSecureError } from "@/utils/security";
import { logUserCreation } from "@/utils/audit-logger";

export interface CreateUserResult {
  success: boolean;
  existed: boolean;
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
      logSecureError({ email, name, role, hasPassword: !!password, is_mentor }, "Creating user");

      // Criar o usuário diretamente via Edge Function no Supabase
      const { data: response, error } = await supabase.functions.invoke('list-users', {
        method: 'POST',
        body: {
          action: 'createUser',
          email: email,
          name: name,
          role: role,
          password: password || Math.random().toString(36).slice(-10),
          is_mentor: is_mentor
        }
      });

      if (error) {
        logSecureError(error, "Admin User Creation - Function Error");
        logUserCreation(email, false, 'admin', sanitizeError(error));
        throw new Error(sanitizeError(error));
      }
      
      if (response && response.error) {
        logSecureError(response.error, "Admin User Creation - Response Error");
        logUserCreation(email, false, 'admin', sanitizeError(response.error));
        throw new Error(sanitizeError(response.error));
      }
      
      // Verificar se o usuário já existe e tratar adequadamente
      if (response && response.existed) {
        logUserCreation(email, false, 'admin', 'User already exists');
        
        toast({
          title: "Usuário já existe",
          description: `O usuário ${email} já existe no sistema, mas pode não estar visível na lista atual.`,
          variant: "default",
        });
        
        return { success: false, existed: true };
      } else {
        logUserCreation(email, true, 'admin');
        
        toast({
          title: "Usuário adicionado com sucesso",
          description: `Usuário ${email} foi criado e adicionado ao sistema.`,
        });
        
        return { success: true, existed: false };
      }
    } catch (error: any) {
      logSecureError(error, "Admin User Creation");
      const sanitizedMessage = sanitizeError(error);
      logUserCreation(email, false, 'admin', sanitizedMessage);
      
      toast({
        title: "Erro ao adicionar usuário",
        description: sanitizedMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    createAdminUser
  };
};
