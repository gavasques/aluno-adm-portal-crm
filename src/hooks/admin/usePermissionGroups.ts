
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface PermissionGroup {
  id: string;
  name: string;
  description?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  allowed_menu_ids?: string[];
}

export const usePermissionGroups = () => {
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissionGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try direct query as function doesn't exist yet
      const { data: directData, error: directError } = await supabase
        .from('permission_groups')
        .select('*');
      
      if (directError) {
        throw directError;
      }
      
      // Transform the data to match the expected interface
      const transformedData = directData?.map(group => ({
        ...group,
        allowed_menu_ids: [] // Set default empty array for allowed_menu_ids
      })) || [];
      
      setPermissionGroups(transformedData);
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao carregar grupos de permissão";
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get permission group menus
  const getPermissionGroupMenus = async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('permission_group_menus')
        .select('menu_key')
        .eq('permission_group_id', groupId);

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os menus do grupo",
        variant: "destructive",
      });
      return [];
    }
  };

  // Create permission group
  const createPermissionGroup = async (groupData: {
    name: string;
    description?: string;
    is_admin: boolean;
    menu_keys: string[];
  }) => {
    try {
      // Insert the group first
      const { data: newGroup, error: groupError } = await supabase
        .from('permission_groups')
        .insert({
          name: groupData.name,
          description: groupData.description,
          is_admin: groupData.is_admin
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // If not admin and there are menu keys, add them to permission_group_menus
      if (!groupData.is_admin && groupData.menu_keys.length > 0) {
        const menuEntries = groupData.menu_keys.map(menuKey => ({
          permission_group_id: newGroup.id,
          menu_key: menuKey
        }));

        const { error: menuError } = await supabase
          .from('permission_group_menus')
          .insert(menuEntries);

        if (menuError) throw menuError;
      }

      toast({
        title: "Sucesso",
        description: "Grupo de permissão criado com sucesso",
      });

      return newGroup;
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || "Erro ao criar grupo de permissão",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update permission group
  const updatePermissionGroup = async (groupData: {
    id: string;
    name: string;
    description?: string;
    is_admin: boolean;
    menu_keys: string[];
  }) => {
    try {
      // Update the group info
      const { error: groupError } = await supabase
        .from('permission_groups')
        .update({
          name: groupData.name,
          description: groupData.description,
          is_admin: groupData.is_admin,
          updated_at: new Date().toISOString()
        })
        .eq('id', groupData.id);

      if (groupError) throw groupError;

      // Delete existing menu entries
      const { error: deleteError } = await supabase
        .from('permission_group_menus')
        .delete()
        .eq('permission_group_id', groupData.id);

      if (deleteError) throw deleteError;

      // If not admin and there are menu keys, add them to permission_group_menus
      if (!groupData.is_admin && groupData.menu_keys.length > 0) {
        const menuEntries = groupData.menu_keys.map(menuKey => ({
          permission_group_id: groupData.id,
          menu_key: menuKey
        }));

        const { error: menuError } = await supabase
          .from('permission_group_menus')
          .insert(menuEntries);

        if (menuError) throw menuError;
      }

      toast({
        title: "Sucesso",
        description: "Grupo de permissão atualizado com sucesso",
      });

      return true;
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || "Erro ao atualizar grupo de permissão",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Delete permission group
  const deletePermissionGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('permission_groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Grupo de permissão excluído com sucesso",
      });

      return true;
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || "Erro ao excluir grupo de permissão",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Get users of a permission group
  const getPermissionGroupUsers = async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name, role')
        .eq('permission_group_id', groupId);

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários do grupo",
        variant: "destructive",
      });
      return [];
    }
  };

  // Remove user from permission group
  const removeUserFromGroup = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ permission_group_id: null })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Usuário removido do grupo com sucesso",
      });

      return true;
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || "Erro ao remover usuário do grupo",
        variant: "destructive",
      });
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
    getPermissionGroupMenus,
    createPermissionGroup,
    updatePermissionGroup,
    deletePermissionGroup,
    getPermissionGroupUsers,
    removeUserFromGroup
  };
};
