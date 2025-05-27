
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

      console.log('✅ Sessão encontrada, fazendo chamada para list-users edge function...');

      const requestBody = {
        action: 'createUser',
        email: userData.email.toLowerCase().trim(),
        name: userData.name.trim(),
        role: userData.role,
        password: userData.password,
        is_mentor: userData.is_mentor || false
      };

      console.log('📤 Enviando dados:', requestBody);

      // Chamada correta para a edge function list-users
      const { data, error } = await supabase.functions.invoke('list-users', {
        body: requestBody
      });

      console.log('📊 Resposta da edge function:', { data, error });

      // Se houve erro na chamada da função
      if (error) {
        console.error('❌ Erro na Edge Function list-users:', error);
        
        // Verificar se é erro de constraint de chave duplicada
        if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
          this.invalidateQueries();
          
          toast({
            title: "Usuário já existe",
            description: `O usuário ${userData.email} já está cadastrado no sistema.`,
            variant: "default",
          });
          
          return true; // Retornar sucesso para não bloquear o fluxo
        }
        
        throw new Error(error.message || 'Erro na edge function');
      }

      // Verificar se a resposta contém dados válidos
      if (!data) {
        console.error('❌ Nenhum dado retornado da edge function');
        throw new Error('Nenhum dado retornado do servidor');
      }

      // Verificar se houve sucesso na operação
      if (data.success === true) {
        this.invalidateQueries();
        
        const message = data.existed 
          ? `O usuário ${userData.email} já existe no sistema.`
          : `Usuário ${userData.email} foi criado com sucesso.`;

        toast({
          title: data.existed ? "Usuário já existe" : "Usuário criado",
          description: message,
          variant: "default",
        });
        
        return true;
      } 
      
      // Se houve erro específico retornado pela edge function
      if (data.error) {
        console.error('❌ Erro retornado pela edge function:', data.error);
        
        // Verificar se é erro de perfil duplicado
        if (data.error.includes('duplicate key value violates unique constraint')) {
          this.invalidateQueries();
          
          toast({
            title: "Usuário já existe",
            description: `O usuário ${userData.email} já está cadastrado no sistema.`,
            variant: "default",
          });
          
          return true; // Retornar sucesso para não bloquear o fluxo
        }
        
        throw new Error(data.error);
      }

      // Fallback para casos não esperados
      console.error('❌ Resposta inesperada da edge function:', data);
      throw new Error("Resposta inesperada do servidor");

    } catch (error: any) {
      console.error('❌ Erro ao criar usuário:', error);
      
      // Verificar se é erro de chave duplicada no catch geral
      if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
        this.invalidateQueries();
        
        toast({
          title: "Usuário já existe",
          description: `O usuário ${userData.email} já está cadastrado no sistema.`,
          variant: "default",
        });
        
        return true; // Retornar sucesso para não bloquear o fluxo
      }
      
      // Se o erro for relacionado à edge function, mas o usuário pode ter sido criado
      if (error.message?.includes('Edge Function returned a non-2xx status code')) {
        console.log('⚠️ Erro na edge function, mas verificando se usuário foi criado...');
        
        // Invalidar queries para atualizar a lista e verificar se o usuário foi criado
        this.invalidateQueries();
        
        toast({
          title: "Atenção",
          description: "Houve um problema na resposta do servidor, mas o usuário pode ter sido criado. Verifique a lista.",
          variant: "default",
        });
        
        return true; // Assumir sucesso para não bloquear o fluxo
      }
      
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
      console.log('🔄 Iniciando exclusão de usuário:', { userId, userEmail });

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error('❌ Usuário não autenticado');
        throw new Error('Usuário não autenticado');
      }

      console.log('✅ Sessão encontrada, fazendo chamada para exclusão...');

      const { data, error } = await supabase.functions.invoke('list-users', {
        body: {
          action: 'deleteUser',
          userId,
          email: userEmail
        }
      });

      console.log('📊 Resposta da exclusão:', { data, error });

      if (error) {
        console.error('❌ Erro na Edge Function:', error);
        throw new Error(error.message || 'Erro na exclusão');
      }

      if (!data) {
        console.error('❌ Nenhum dado retornado da edge function');
        throw new Error('Nenhum dado retornado do servidor');
      }

      // Verificar se houve sucesso na operação
      if (data.success === true) {
        this.invalidateQueries();
        
        let toastTitle, toastDescription;
        
        if (data.inactivated) {
          toastTitle = "Usuário inativado";
          toastDescription = data.message || `O usuário ${userEmail} foi inativado pois possui dados associados.`;
        } else {
          toastTitle = "Usuário excluído";
          toastDescription = data.message || `O usuário ${userEmail} foi excluído com sucesso.`;
        }

        toast({
          title: toastTitle,
          description: toastDescription,
          variant: "default",
        });
        
        return true;
      }
      
      // Se houve erro específico retornado pela edge function
      if (data.error) {
        console.error('❌ Erro retornado pela edge function:', data.error);
        throw new Error(data.error);
      }

      // Fallback para casos não esperados
      console.error('❌ Resposta inesperada da edge function:', data);
      throw new Error("Resposta inesperada do servidor");

    } catch (error: any) {
      console.error('❌ Erro ao excluir usuário:', error);
      
      toast({
        title: "Erro na exclusão",
        description: error.message || "Não foi possível excluir o usuário.",
        variant: "destructive",
      });
      
      return false;
    }
  }

  async toggleUserStatus(userId: string, userEmail: string, currentStatus: string): Promise<boolean> {
    try {
      console.log('🔄 Service: Iniciando alteração de status:', {
        userId,
        userEmail,
        currentStatus
      });

      const isActive = currentStatus?.toLowerCase() === "ativo";
      const newStatus = isActive ? "Inativo" : "Ativo";
      
      console.log('🔄 Service: Status será alterado de', currentStatus, 'para', newStatus);

      // Primeiro tentar atualização direta no banco
      const { data: updateResult, error: updateError } = await supabase
        .from("profiles")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      console.log('📊 Service: Resultado da atualização direta:', { updateResult, updateError });

      if (updateError) {
        console.error('❌ Service: Erro na atualização direta:', updateError);
        throw updateError;
      }

      // Verificar se a atualização foi bem-sucedida
      if (updateResult && updateResult.length > 0) {
        console.log('✅ Service: Status alterado com sucesso no banco:', updateResult[0]);
        
        // Invalidar cache
        this.invalidateQueries();
        
        // NÃO mostrar toast aqui pois já é mostrado no diálogo
        
        return true;
      } else {
        console.error('❌ Service: Nenhum registro foi atualizado');
        return false;
      }
    } catch (error: any) {
      console.error('❌ Service: Erro ao alterar status do usuário:', error);
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

    console.log('📊 Estatísticas calculadas:', { total, active, inactive, pending });
    return { total, active, inactive, pending };
  }

  filterUsers(users: User[], filters: UserFilters): User[] {
    console.log('🔍 Filtrando usuários:', { 
      totalUsers: users.length, 
      filters,
      sampleUser: users[0] 
    });

    const filtered = users.filter(user => {
      // Busca por nome ou email
      const matchesSearch = !filters.search || 
        user.name?.toLowerCase().includes(filters.search.toLowerCase()) || 
        user.email.toLowerCase().includes(filters.search.toLowerCase());
      
      // Filtro por status
      let matchesStatus = true;
      if (filters.status !== "all") {
        const userStatus = user.status?.toLowerCase() || 'ativo';
        const filterStatus = filters.status.toLowerCase();
        matchesStatus = userStatus.includes(filterStatus);
      }
      
      // Filtro por grupo
      let matchesGroup = true;
      if (filters.group === "pending") {
        matchesGroup = user.permission_group_id === PermissionGroup.GERAL && user.role !== "Admin";
      } else if (filters.group === "assigned") {
        matchesGroup = user.permission_group_id !== PermissionGroup.GERAL || user.role === "Admin";
      }
      // Se filters.group === "all", matchesGroup permanece true
      
      const matches = matchesSearch && matchesStatus && matchesGroup;
      
      if (!matches) {
        console.log('🚫 Usuário filtrado:', {
          email: user.email,
          matchesSearch,
          matchesStatus,
          matchesGroup,
          userStatus: user.status,
          filterStatus: filters.status
        });
      }
      
      return matches;
    });

    console.log('✅ Usuários após filtro:', {
      original: users.length,
      filtered: filtered.length,
      filters
    });
    
    return filtered;
  }
}

export const optimizedUserService = OptimizedUserService.getInstance();
