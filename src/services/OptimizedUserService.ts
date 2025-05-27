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
      console.log('🔄 Iniciando busca de usuários...');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error('❌ Usuário não autenticado');
        throw new Error('Usuário não autenticado');
      }
      
      console.log('✅ Sessão encontrada, fazendo chamada para edge function...');
      
      const { data, error } = await supabase.functions.invoke('list-users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (error) {
        console.error('❌ Erro na Edge Function:', error);
        throw new Error(error.message || 'Erro ao buscar usuários');
      }

      if (!data) {
        console.error('❌ Nenhum dado retornado da edge function');
        throw new Error('Nenhum dado retornado do servidor');
      }

      const users = data?.users || [];
      console.log(`✅ ${users.length} usuários carregados com sucesso:`, users);
      
      return users;
    } catch (error: any) {
      console.error('❌ Erro completo ao buscar usuários:', error);
      console.error('Stack trace:', error.stack);
      
      // Tentar fallback direto da tabela profiles
      console.log('🔄 Tentando fallback direto da tabela profiles...');
      try {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            permission_groups(name)
          `);
          
        if (profileError) {
          console.error('❌ Erro no fallback:', profileError);
          throw profileError;
        }
        
        console.log(`✅ Fallback bem-sucedido: ${profiles?.length || 0} perfis encontrados`);
        
        // Transformar perfis em formato de usuário
        const transformedUsers = (profiles || []).map(profile => ({
          id: profile.id,
          name: profile.name || profile.email,
          email: profile.email,
          role: profile.role || 'Student',
          status: profile.status || 'Ativo',
          lastLogin: 'Nunca',
          permission_group_id: profile.permission_group_id,
          storage_used_mb: profile.storage_used_mb || 0,
          storage_limit_mb: profile.storage_limit_mb || 100,
          is_mentor: profile.is_mentor || false,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        }));
        
        return transformedUsers;
      } catch (fallbackError) {
        console.error('❌ Fallback também falhou:', fallbackError);
        throw error; // Retornar erro original
      }
    }
  }

  async createUser(userData: CreateUserData): Promise<boolean> {
    try {
      console.log('🔄 Iniciando criação de usuário:', { 
        email: userData.email, 
        name: userData.name, 
        role: userData.role,
        is_mentor: userData.is_mentor 
      });

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error('❌ Usuário não autenticado');
        throw new Error('Usuário não autenticado');
      }

      console.log('✅ Sessão encontrada, fazendo chamada para create-user edge function...');

      const { data, error } = await supabase.functions.invoke('create-user', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: {
          email: userData.email.toLowerCase().trim(),
          name: userData.name.trim(),
          role: userData.role,
          password: userData.password,
          is_mentor: userData.is_mentor || false
        }
      });

      console.log('📊 Resposta da edge function:', { data, error });

      if (error) {
        console.error('❌ Erro na Edge Function create-user:', error);
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
        console.error('❌ Falha na criação:', data);
        throw new Error(data?.error || "Erro desconhecido ao criar usuário");
      }
    } catch (error: any) {
      console.error('❌ Erro ao criar usuário:', error);
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'deleteUser',
          userId,
          email: userEmail
        })
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
