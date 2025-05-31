
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

  const createPermissionGroup = async (groupData: Omit<PermissionGroup, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('permission_groups')
        .insert(groupData)
        .select()
        .single();

      if (error) throw error;

      setPermissionGroups(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Erro ao criar grupo de permissão:', err);
      throw err;
    }
  };

  const updatePermissionGroup = async (id: string, updates: Partial<PermissionGroup>) => {
    try {
      const { data, error } = await supabase
        .from('permission_groups')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

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
        .select('id, name, email')
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
      return data?.map(item => item.menu_key) || [];
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
