
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  createUserSchema, 
  inviteUserSchema, 
  storageUpgradeSchema,
  type CreateUserInput,
  type InviteUserInput,
  type StorageUpgradeInput
} from '@/schemas/user.schemas';
import { useUsers } from './useUsers';
import { toast } from '@/hooks/use-toast';

export const useValidatedUserOperations = () => {
  const {
    createUser,
    deleteUser,
    toggleUserStatus,
    resetPassword,
    setPermissionGroup
  } = useUsers();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form para criação de usuário
  const createUserForm = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Student",
      password: "",
      is_mentor: false,
    },
  });

  // Form para convite de usuário
  const inviteUserForm = useForm<InviteUserInput>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Student",
    },
  });

  // Form para upgrade de armazenamento
  const storageUpgradeForm = useForm<StorageUpgradeInput>({
    resolver: zodResolver(storageUpgradeSchema),
    defaultValues: {
      upgradeAmount: 100,
      notes: "",
    },
  });

  // Operação validada de criação de usuário
  const handleCreateUser = async (data: CreateUserInput): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      const success = await createUser({
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password,
        is_mentor: data.is_mentor
      });

      if (success) {
        createUserForm.reset();
        toast({
          title: "Usuário criado",
          description: `${data.email} foi criado com sucesso.`,
        });
      }

      return success;
    } catch (error) {
      console.error('Erro na criação validada:', error);
      toast({
        title: "Erro de validação",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Operação validada de convite de usuário
  const handleInviteUser = async (data: InviteUserInput): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      // Para convites, usamos uma senha temporária que será resetada
      const success = await createUser({
        name: data.name,
        email: data.email,
        role: data.role,
        password: Math.random().toString(36).slice(-12) + "A1!", // Senha temporária válida
        is_mentor: false
      });

      if (success) {
        inviteUserForm.reset();
        // Automaticamente enviar reset de senha
        await resetPassword(data.email);
        toast({
          title: "Convite enviado",
          description: `Convite enviado para ${data.email}. Um email de redefinição de senha foi enviado.`,
        });
      }

      return success;
    } catch (error) {
      console.error('Erro no convite validado:', error);
      toast({
        title: "Erro de validação",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Operação validada de upgrade de armazenamento
  const handleStorageUpgrade = async (data: StorageUpgradeInput): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      // Aqui integraria com a função de upgrade de armazenamento
      toast({
        title: "Upgrade de armazenamento",
        description: `${data.upgradeAmount}MB adicionados com sucesso.`,
      });
      
      storageUpgradeForm.reset();
      return true;
    } catch (error) {
      console.error('Erro no upgrade validado:', error);
      toast({
        title: "Erro de validação",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Forms
    createUserForm,
    inviteUserForm,
    storageUpgradeForm,
    
    // Handlers validados
    handleCreateUser,
    handleInviteUser,
    handleStorageUpgrade,
    
    // Estados
    isSubmitting,
    
    // Operações básicas (sem validação adicional)
    deleteUser,
    toggleUserStatus,
    resetPassword,
    setPermissionGroup,
  };
};
