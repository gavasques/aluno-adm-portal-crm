
import { supabase } from '@/integrations/supabase/client';
import { BasePermissionService } from './BasePermissionService';
import type { ISystemModuleService, SystemModule } from '@/types/permissions';

export class SystemModuleService extends BasePermissionService implements ISystemModuleService {
  async getAll(): Promise<SystemModule[]> {
    const result = await this.executeWithErrorHandling(async () => {
      const { data, error } = await supabase
        .from("system_modules")
        .select(`
          *,
          actions:module_actions(*)
        `)
        .eq("is_active", true)
        .order("sort_order");

      if (error) throw error;
      return data || [];
    }, "buscar módulos do sistema");

    return result || [];
  }

  async getById(id: string): Promise<SystemModule | null> {
    const result = await this.executeWithErrorHandling(async () => {
      const { data, error } = await supabase
        .from("system_modules")
        .select(`
          *,
          actions:module_actions(*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    }, "buscar módulo do sistema");

    return result;
  }

  async getByCategory(): Promise<Record<string, SystemModule[]>> {
    const modules = await this.getAll();
    
    return modules.reduce((acc, module) => {
      const category = module.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(module);
      return acc;
    }, {} as Record<string, SystemModule[]>);
  }

  async getUserAllowedModules(userId?: string): Promise<SystemModule[]> {
    const result = await this.executeWithErrorHandling(async () => {
      const currentUserId = userId || await this.getCurrentUserId();
      
      if (!currentUserId) return [];

      const { data, error } = await supabase.rpc('get_user_allowed_modules', {
        user_id: currentUserId
      });

      if (error) throw error;
      
      // A função RPC retorna dados em formato diferente, então vamos buscar os módulos completos
      const moduleKeys = data?.map((item: any) => item.module_key) || [];
      
      if (moduleKeys.length === 0) return [];

      const { data: modules, error: modulesError } = await supabase
        .from("system_modules")
        .select(`
          *,
          actions:module_actions(*)
        `)
        .in("module_key", moduleKeys)
        .eq("is_active", true)
        .order("sort_order");

      if (modulesError) throw modulesError;
      return modules || [];
    }, "buscar módulos permitidos");

    return result || [];
  }

  async validateModuleAccess(moduleKey: string, actionKey: string, userId?: string): Promise<boolean> {
    const result = await this.executeWithErrorHandling(async () => {
      const currentUserId = userId || await this.getCurrentUserId();
      
      if (!currentUserId) return false;

      const { data, error } = await supabase.rpc('get_user_allowed_modules', {
        user_id: currentUserId
      });

      if (error) throw error;
      
      const module = data?.find((m: any) => m.module_key === moduleKey);
      return module?.actions?.includes(actionKey) || false;
    }, "verificar permissão de ação");

    return result || false;
  }
}
