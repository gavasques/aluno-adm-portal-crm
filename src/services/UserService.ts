import { supabase } from '@/integrations/supabase/client';
import { User, CreateUserData, UpdateUserData, UserStats, UserFilters } from '@/types/user.types';
import { toast } from '@/hooks/use-toast';

export class UserService {
  private static instance: UserService;
  private cache: Map<string, any> = new Map();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  private getCacheKey(operation: string, params?: any): string {
    return `${operation}_${JSON.stringify(params || {})}`;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private getCache(key: string): any {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.cacheExpiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  clearCache(): void {
    this.cache.clear();
  }

  async fetchUsers(): Promise<User[]> {
    const cacheKey = this.getCacheKey('fetchUsers');
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      const response = await fetch('https://qflmguzmticupqtnlirf.supabase.co/functions/v1/list-users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbG1ndXptdGljdXBxdG5saXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDkzOTUsImV4cCI6MjA2MzI4NTM5NX0.0aHGL_E9V9adyonhJ3fVudjxDnHXv8E3tIEXjby9qZM',
          'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const users = data.users || [];
      
      this.setCache(cacheKey, users);
      return users;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  async createUser(userData: CreateUserData): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: userData.email.toLowerCase().trim(),
          name: userData.name.trim(),
          role: userData.role,
          password: userData.password,
          is_mentor: userData.is_mentor
        }
      });

      if (error) {
        console.error('Erro na edge function:', error);
        throw new Error(error.message || 'Erro desconhecido na edge function');
      }

      if (data?.success) {
        this.clearCache();
        
        if (data.existed) {
          toast({
            title: "Usuário já existe",
            description: `O usuário ${userData.email} já está cadastrado no sistema.`,
            variant: "default",
          });
        } else {
          toast({
            title: "Usuário criado com sucesso",
            description: `Usuário ${userData.email} foi criado e adicionado ao sistema.`,
          });
        }
        
        return true;
      } else {
        const errorMsg = data?.error || "Erro desconhecido ao criar usuário";
        throw new Error(errorMsg);
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

  async updateUser(userId: string, data: UpdateUserData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      this.clearCache();
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o usuário.",
        variant: "destructive",
      });
      return false;
    }
  }

  async deleteUser(userId: string, userEmail: string): Promise<boolean> {
    console.log('🗑️ [FRONTEND] UserService.deleteUser iniciado:', { userId, userEmail });
    console.log('🗑️ [FRONTEND] Timestamp:', new Date().toISOString());
    
    try {
      if (!userId || !userEmail) {
        console.error('❌ [FRONTEND] Parâmetros obrigatórios faltando:', { userId, userEmail });
        throw new Error('ID do usuário e email são obrigatórios');
      }

      console.log('📡 [FRONTEND] Preparando chamada para edge function...');
      
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      console.log('🔑 [FRONTEND] Token obtido:', !!accessToken);

      const requestBody = {
        action: 'deleteUser',
        userId,
        email: userEmail
      };

      console.log('📦 [FRONTEND] Body da requisição:', requestBody);

      const response = await fetch('https://qflmguzmticupqtnlirf.supabase.co/functions/v1/list-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbG1ndXptdGljdXBxdG5saXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDkzOTUsImV4cCI6MjA2MzI4NTM5NX0.0aHGL_E9V9adyonhJ3fVudjxDnHXv8E3tIEXjby9qZM',
          'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 [FRONTEND] Resposta HTTP status:', response.status);
      console.log('📡 [FRONTEND] Resposta OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [FRONTEND] Erro HTTP:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📡 [FRONTEND] Resposta da edge function:', data);

      if (data.error) {
        console.error('❌ [FRONTEND] Erro retornado pela edge function:', data.error);
        throw new Error(data.error);
      }

      if (!data.success) {
        console.error('❌ [FRONTEND] Operação não bem-sucedida:', data);
        throw new Error('Falha na exclusão do usuário');
      }

      console.log('✅ [FRONTEND] Usuário excluído com sucesso, limpando cache...');
      this.clearCache();
      
      if (data.inactivated) {
        toast({
          title: "Usuário inativado",
          description: data.message || "O usuário foi inativado porque possui dados associados.",
        });
      } else {
        toast({
          title: "Usuário excluído",
          description: `O usuário ${userEmail} foi excluído com sucesso.`,
        });
      }
      
      return true;
    } catch (error: any) {
      console.error('❌ [FRONTEND] Erro completo ao excluir usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível excluir o usuário.",
        variant: "destructive",
      });
      return false;
    }
  }

  async toggleUserStatus(userId: string, userEmail: string, currentStatus: string): Promise<boolean> {
    try {
      const isActive = currentStatus === "Ativo";
      const newStatus = isActive ? "Inativo" : "Ativo";

      const { error } = await supabase
        .from("profiles")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      this.clearCache();
      toast({
        title: `Usuário ${newStatus === "Ativo" ? 'ativado' : 'inativado'}`,
        description: `O usuário ${userEmail} foi ${newStatus === "Ativo" ? 'ativado' : 'inativado'} com sucesso.`,
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

  async toggleMentorStatus(userId: string, userEmail: string, currentMentorStatus: boolean): Promise<boolean> {
    try {
      const newMentorStatus = !currentMentorStatus;

      const { error } = await supabase
        .from("profiles")
        .update({ 
          is_mentor: newMentorStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      this.clearCache();
      toast({
        title: `Status de mentor ${newMentorStatus ? 'ativado' : 'removido'}`,
        description: `${userEmail} ${newMentorStatus ? 'agora é mentor' : 'não é mais mentor'}.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao alterar status de mentor:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status de mentor.",
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

      this.clearCache();
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
      u.permission_group_id === "564c55dc-0ab8-481e-a0bc-97ea7e484b88" && 
      u.role !== "Admin"
    ).length;

    return { total, active, inactive, pending };
  }

  calculateStudentStats(users: User[]) {
    const students = users.filter(u => u.role === 'Student');
    const total = students.length;
    const active = students.filter(u => u.status?.toLowerCase() === 'ativo').length;
    const mentors = students.filter(u => u.is_mentor).length;
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newThisMonth = students.filter(u => 
      u.created_at && new Date(u.created_at) >= thisMonth
    ).length;

    return { total, active, mentors, newThisMonth };
  }

  filterUsers(users: User[], filters: UserFilters): User[] {
    return users.filter(user => {
      // Filtro de busca
      const matchesSearch = !filters.search || 
        user.name?.toLowerCase().includes(filters.search.toLowerCase()) || 
        user.email.toLowerCase().includes(filters.search.toLowerCase());
      
      // Filtro de status
      const matchesStatus = filters.status === "all" || 
        user.status?.toLowerCase().includes(filters.status.toLowerCase());
      
      // Filtro de role
      const matchesRole = !filters.role || filters.role === "all" ||
        user.role?.toLowerCase() === filters.role.toLowerCase();
      
      // Filtro de grupo
      let matchesGroup = true;
      if (filters.group === "pending") {
        matchesGroup = user.permission_group_id === "564c55dc-0ab8-481e-a0bc-97ea7e484b88" && user.role !== "Admin";
      } else if (filters.group === "assigned") {
        matchesGroup = user.permission_group_id !== "564c55dc-0ab8-481e-a0bc-97ea7e484b88" || user.role === "Admin";
      }
      
      return matchesSearch && matchesStatus && matchesGroup && matchesRole;
    });
  }
}

export const userService = UserService.getInstance();
