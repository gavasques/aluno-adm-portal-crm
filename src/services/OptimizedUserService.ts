
import { supabase } from '@/integrations/supabase/client';
import { User, CreateUserData, UpdateUserData, UserStats, UserFilters } from '@/types/user.types';
import { UserStatus, PermissionGroup } from '@/types/user.enums';
import { toast } from '@/hooks/use-toast';

export class OptimizedUserService {
  private static instance: OptimizedUserService;
  private queryClient: any;

  static getInstance(): OptimizedUserService {
    if (!OptimizedUserService.instance) {
      OptimizedUserService.instance = new OptimizedUserService();
    }
    return OptimizedUserService.instance;
  }

  setQueryClient(client: any) {
    this.queryClient = client;
  }

  private invalidateQueries() {
    if (this.queryClient) {
      this.queryClient.invalidateQueries(['users']);
    }
  }

  async fetchUsers(): Promise<User[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase.functions.invoke('list-users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error('Erro na Edge Function:', error);
        throw new Error(error.message || 'Erro ao buscar usuários');
      }

      return data?.users || [];
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  async createUser(userData: CreateUserData): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('list-users', {
        body: {
          action: 'createUser',
          email: userData.email.toLowerCase().trim(),
          name: userData.name.trim(),
          role: userData.role,
          password: userData.password,
          is_mentor: userData.is_mentor
        }
      });

      if (error) {
        throw new Error(error.message || 'Erro na edge function');
      }

      if (data?.success) {
        this.invalidateQueries();
        
        const message = data.existed 
          ? `O usuário ${userData.email} já existe no sistema.`
          : `Usuário ${userData.email} foi criado com sucesso.`;

        toast({
          title: data.existed ? "Usuário já existe" : "Usuário criado",
          description: message,
          variant: data.existed ? "default" : "default",
        });
        
        return true;
      } else {
        throw new Error(data?.error || "Erro desconhecido ao criar usuário");
      }
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Erro interno do servidor",
        variant: "destructive",
      });
      return false;
    }
  }

  async deleteUser(userId: string, userEmail: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('list-users', {
        body: {
          action: 'deleteUser',
          userId,
          email: userEmail
        }
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      this.invalidateQueries();
      
      const message = data.inactivated
        ? "O usuário foi inativado pois possui dados associados."
        : `O usuário ${userEmail} foi excluído com sucesso.`;

      toast({
        title: data.inactivated ? "Usuário inativado" : "Usuário excluído",
        description: message,
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar sua solicitação.",
        variant: "destructive",
      });
      return false;
    }
  }

  async toggleUserStatus(userId: string, userEmail: string, currentStatus: string): Promise<boolean> {
    try {
      const isActive = currentStatus?.toLowerCase() === "ativo";
      const newStatus = isActive ? UserStatus.INACTIVE : UserStatus.ACTIVE;

      const { error } = await supabase
        .from("profiles")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      this.invalidateQueries();
      
      toast({
        title: `Usuário ${newStatus === UserStatus.ACTIVE ? 'ativado' : 'inativado'}`,
        description: `O usuário ${userEmail} foi ${newStatus === UserStatus.ACTIVE ? 'ativado' : 'inativado'} com sucesso.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao alterar status do usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do usuário.",
        variant: "destructive",
      });
      return false;
    }
  }

  async resetPassword(email: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado",
        description: `Um email de redefinição de senha foi enviado para ${email}.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email de redefinição de senha.",
        variant: "destructive",
      });
      return false;
    }
  }

  async setPermissionGroup(userId: string, userEmail: string, groupId: string | null): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ permission_group_id: groupId })
        .eq("id", userId);
        
      if (error) throw error;

      this.invalidateQueries();
      
      toast({
        title: "Grupo de permissão atualizado",
        description: `${userEmail} foi vinculado ao grupo com sucesso`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar grupo de permissão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o grupo de permissão",
        variant: "destructive",
      });
      return false;
    }
  }

  calculateStats(users: User[]): UserStats {
    const total = users.length;
    const active = users.filter(u => u.status?.toLowerCase() === 'ativo').length;
    const inactive = users.filter(u => u.status?.toLowerCase() === 'inativo').length;
    const pending = users.filter(u => 
      u.permission_group_id === PermissionGroup.GERAL && 
      u.role !== "Admin"
    ).length;

    return { total, active, inactive, pending };
  }

  filterUsers(users: User[], filters: UserFilters): User[] {
    return users.filter(user => {
      const matchesSearch = !filters.search || 
        user.name?.toLowerCase().includes(filters.search.toLowerCase()) || 
        user.email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === "all" || 
        user.status?.toLowerCase().includes(filters.status.toLowerCase());
      
      let matchesGroup = true;
      if (filters.group === "pending") {
        matchesGroup = user.permission_group_id === PermissionGroup.GERAL && user.role !== "Admin";
      } else if (filters.group === "assigned") {
        matchesGroup = user.permission_group_id !== PermissionGroup.GERAL || user.role === "Admin";
      }
      
      return matchesSearch && matchesStatus && matchesGroup;
    });
  }
}

export const optimizedUserService = OptimizedUserService.getInstance();
