
import { supabase } from '@/integrations/supabase/client';
import { BasePermissionService } from './BasePermissionService';
import { PermissionGroupSchema } from '@/types/permissions';
import type { IPermissionValidationService } from '@/types/permissions';

export class PermissionValidationService extends BasePermissionService implements IPermissionValidationService {
  async isAdmin(userId?: string): Promise<boolean> {
    const result = await this.executeWithErrorHandling(async () => {
      const { data, error } = await supabase.rpc('is_admin');

      if (error) throw error;
      return !!data;
    }, "verificar se é admin");

    return result || false;
  }

  async hasAdminAccess(userId?: string): Promise<boolean> {
    return this.isAdmin(userId);
  }

  async canAccessMenu(menuKey: string, userId?: string): Promise<boolean> {
    const result = await this.executeWithErrorHandling(async () => {
      const { data, error } = await supabase.rpc('get_allowed_menus');

      if (error) throw error;
      
      const allowedMenus = data?.map((item: any) => item.menu_key) || [];
      return allowedMenus.includes(menuKey);
    }, "verificar acesso ao menu");

    return result || false;
  }

  async canPerformAction(moduleKey: string, actionKey: string, userId?: string): Promise<boolean> {
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

  async validatePermissionGroupData(data: any): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      PermissionGroupSchema.parse(data);
      return { isValid: true, errors: [] };
    } catch (error: any) {
      const errors = error.errors?.map((e: any) => e.message) || ['Dados inválidos'];
      return { isValid: false, errors };
    }
  }
}
