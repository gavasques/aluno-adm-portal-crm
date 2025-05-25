
import { supabase } from '@/integrations/supabase/client';
import { BasePermissionService } from './BasePermissionService';
import type { ISystemMenuService, SystemMenu } from '@/types/permissions';

export class SystemMenuService extends BasePermissionService implements ISystemMenuService {
  async getAll(): Promise<SystemMenu[]> {
    const result = await this.executeWithErrorHandling(async () => {
      const { data, error } = await supabase
        .from("system_menus")
        .select("*")
        .order("display_name");

      if (error) throw error;
      return data || [];
    }, "buscar menus do sistema");

    return result || [];
  }

  async getById(id: string): Promise<SystemMenu | null> {
    const result = await this.executeWithErrorHandling(async () => {
      const { data, error } = await supabase
        .from("system_menus")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    }, "buscar menu do sistema");

    return result;
  }

  async getByKeys(keys: string[]): Promise<SystemMenu[]> {
    if (keys.length === 0) return [];

    const result = await this.executeWithErrorHandling(async () => {
      const { data, error } = await supabase
        .from("system_menus")
        .select("*")
        .in("menu_key", keys)
        .order("display_name");

      if (error) throw error;
      return data || [];
    }, "buscar menus por chaves");

    return result || [];
  }

  async getAllowedMenusForUser(userId?: string): Promise<string[]> {
    const result = await this.executeWithErrorHandling(async () => {
      const { data, error } = await supabase.rpc('get_allowed_menus');

      if (error) throw error;
      return data?.map((item: any) => item.menu_key) || [];
    }, "buscar menus permitidos");

    return result || [];
  }

  async validateMenuAccess(menuKey: string, userId?: string): Promise<boolean> {
    const allowedMenus = await this.getAllowedMenusForUser(userId);
    return allowedMenus.includes(menuKey);
  }
}
