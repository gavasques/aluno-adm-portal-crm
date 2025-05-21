
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type ProfileWithUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  status: string | null;
  last_login: string | null;
  permission_group_id: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export const useUserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<ProfileWithUser[]>([]);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: error.message || "Não foi possível carregar os usuários.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserPermissionGroup = async (userId: string, groupId: number | null) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ permission_group_id: groupId })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Atualize a lista local
      setUsers(users.map(user => 
        user.id === userId ? { ...user, permission_group_id: groupId } : user
      ));

      toast({
        title: "Grupo atualizado",
        description: "O grupo de permissão do usuário foi atualizado com sucesso.",
        variant: "default"
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar grupo de permissão:', error);
      toast({
        title: "Erro ao atualizar grupo",
        description: error.message || "Não foi possível atualizar o grupo de permissão.",
        variant: "destructive"
      });
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Email enviado",
        description: "Um email para redefinição de senha foi enviado.",
        variant: "default"
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao enviar email de redefinição:', error);
      toast({
        title: "Erro ao redefinir senha",
        description: error.message || "Não foi possível enviar o email de redefinição.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Atualize a lista local
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status } : user
      ));

      toast({
        title: "Status atualizado",
        description: `O usuário foi ${status === 'Ativo' ? 'ativado' : 'inativado'} com sucesso.`,
        variant: "default"
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar status do usuário:', error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Não foi possível atualizar o status do usuário.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Função para enviar um magic link para o usuário
  const sendMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Magic Link enviado",
        description: "Um magic link foi enviado para o email do usuário.",
        variant: "default"
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao enviar magic link:', error);
      toast({
        title: "Erro ao enviar magic link",
        description: error.message || "Não foi possível enviar o magic link.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    users,
    loading,
    fetchUsers,
    updateUserPermissionGroup,
    resetPassword,
    updateUserStatus,
    sendMagicLink
  };
};
