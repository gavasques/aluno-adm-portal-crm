
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

      console.log("[useAdminOperations] Validação passou, verificando usuário existente");

      // Primeiro, verificar se o usuário já existe na tabela profiles
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("[useAdminOperations] Erro ao verificar profile:", profileError);
        throw new Error("Erro ao verificar usuário existente");
      }

      if (existingProfile) {
        console.log("[useAdminOperations] Usuário já existe:", existingProfile);
        
        toast({
          title: "Usuário já existe",
          description: `O usuário ${email} já está cadastrado no sistema.`,
          variant: "default",
        });
        
        return { 
          success: false, 
          existed: true, 
          error: "Usuário já cadastrado" 
        };
      }

      // Tentar criar o usuário via API Admin do Supabase
      const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
        email: email.toLowerCase(),
        password: password,
        email_confirm: true,
        user_metadata: {
          name: name,
          role: role,
          is_mentor: is_mentor
        }
      });

      if (createError) {
        console.error("[useAdminOperations] Erro ao criar usuário:", createError);
        
        if (createError.message.includes('already registered') || createError.message.includes('User already registered')) {
          // Usuário já existe no auth, mas não no profiles
          console.log("[useAdminOperations] Usuário existe no auth, buscando para criar profile");
          
          // Buscar o usuário no auth
          const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
          
          if (listError) {
            console.error("[useAdminOperations] Erro ao listar usuários:", listError);
            throw new Error("Erro ao verificar usuários existentes");
          }
          
          const existingUser = usersData.users.find((u: any) => u.email === email.toLowerCase());
          
          if (existingUser) {
            // Criar apenas o profile
            const { error: profileCreateError } = await supabase
              .from('profiles')
              .insert({
                id: existingUser.id,
                email: email.toLowerCase(),
                name: name,
                role: role,
                is_mentor: is_mentor,
                status: 'Ativo'
              });

            if (profileCreateError) {
              console.error("[useAdminOperations] Erro ao criar profile:", profileCreateError);
              throw new Error("Erro ao criar perfil do usuário");
            }

            toast({
              title: "Usuário sincronizado",
              description: `Usuário ${email} foi sincronizado com sucesso.`,
            });

            return { 
              success: true, 
              existed: true, 
              profileCreated: true 
            };
          }
        }
        
        throw createError;
      }

      if (!authUser.user) {
        throw new Error("Falha ao criar usuário - dados não retornados");
      }

      console.log("[useAdminOperations] Usuário criado no auth:", authUser.user.id);

      // Criar o profile do usuário
      const { error: profileInsertError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.user.id,
          email: email.toLowerCase(),
          name: name,
          role: role,
          is_mentor: is_mentor,
          status: 'Ativo'
        });

      if (profileInsertError) {
        console.error("[useAdminOperations] Erro ao criar profile:", profileInsertError);
        
        // Se o profile não foi criado, limpar o usuário do auth
        await supabase.auth.admin.deleteUser(authUser.user.id);
        
        throw new Error("Erro ao criar perfil do usuário");
      }

      console.log("[useAdminOperations] Profile criado com sucesso");
      
      logUserCreation(email, true, 'admin');
      
      toast({
        title: "Usuário criado com sucesso",
        description: `Usuário ${email} foi criado e adicionado ao sistema.`,
      });
      
      return { success: true, existed: false };

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
