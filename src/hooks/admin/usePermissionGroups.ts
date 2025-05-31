
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PermissionGroup {
  id: string;
  name: string;
  description?: string;
  allow_admin_access: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

interface PermissionGroupInput {
  name: string;
  description?: string;
  is_admin: boolean;
  allow_admin_access: boolean;
  menu_keys: string[];
}

export const usePermissionGroups = () => {
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissionGroups = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('permission_groups')
        .select('*')
        .order('name');

      if (error) throw error;

      setPermissionGroups(data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar grupos de permissão:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const createPermissionGroup = async (groupData: PermissionGroupInput) => {
    try {
      const { menu_keys, ...permissionGroupData } = groupData;
      
      const { data, error } = await supabase
        .from('permission_groups')
        .insert(permissionGroupData)
        .select()
        .single();

      if (error) throw error;

      // Adicionar menus se fornecidos
      if (menu_keys && menu_keys.length > 0) {
        const menuInserts = menu_keys.map(menuKey => ({
          permission_group_id: data.id,
          menu_key: menuKey
        }));

        const { error: menuError } = await supabase
          .from('permission_group_menus')
          .insert(menuInserts);

        if (menuError) throw menuError;
      }

      setPermissionGroups(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Erro ao criar grupo de permissão:', err);
      throw err;
    }
  };

  const updatePermissionGroup = async (groupData: { id: string } & Partial<PermissionGroupInput>) => {
    try {
      const { id, menu_keys, ...updates } = groupData;
      
      const { data, error } = await supabase
        .from('permission_groups')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Atualizar menus se fornecidos
      if (menu_keys !== undefined) {
        // Remover menus existentes
        await supabase
          .from('permission_group_menus')
          .delete()
          .eq('permission_group_id', id);

        // Adicionar novos menus
        if (menu_keys.length > 0) {
          const menuInserts = menu_keys.map(menuKey => ({
            permission_group_id: id,
            menu_key: menuKey
          }));

          const { error: menuError } = await supabase
            .from('permission_group_menus')
            .insert(menuInserts);

          if (menuError) throw menuError;
        }
      }

      setPermissionGroups(prev => 
        prev.map(group => group.id === id ? data : group)
      );
      return data;
    } catch (err) {
      console.error('Erro ao atualizar grupo de permissão:', err);
      throw err;
    }
  };

  const deletePermissionGroup = async (id: string) => {
    try {
      const { error } = await supabase
        .from('permission_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPermissionGroups(prev => prev.filter(group => group.id !== id));
    } catch (err) {
      console.error('Erro ao deletar grupo de permissão:', err);
      throw err;
    }
  };

  const getPermissionGroupUsers = async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('permission_group_id', groupId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Erro ao buscar usuários do grupo:', err);
      throw err;
    }
  };

  const removeUserFromGroup = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ permission_group_id: null })
        .eq('id', userId);

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao remover usuário do grupo:', err);
      throw err;
    }
  };

  const getPermissionGroupMenus = async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('permission_group_menus')
        .select('menu_key')
        .eq('permission_group_id', groupId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Erro ao buscar menus do grupo:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPermissionGroups();
  }, []);

  return {
    permissionGroups,
    isLoading,
    error,
    refetch: fetchPermissionGroups,
    createPermissionGroup,
    updatePermissionGroup,
    deletePermissionGroup,
    getPermissionGroupUsers,
    removeUserFromGroup,
    getPermissionGroupMenus
  };
};
