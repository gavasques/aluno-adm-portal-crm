
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PermissionGroup {
  id: string;
  name: string;
  description: string | null;
  is_admin: boolean;
}

interface PermissionGroupWithMenus extends PermissionGroup {
  menu_keys: string[];
}

export const usePermissionGroups = () => {
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissionGroups = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("permission_groups")
        .select("*")
        .order("name");
        
      if (error) throw error;
      
      setPermissionGroups(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar grupos de permissão:", err);
      setError("Não foi possível carregar os grupos de permissão. Tente novamente mais tarde.");
      toast({
        title: "Erro",
        description: "Não foi possível carregar os grupos de permissão",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPermissionGroup = useCallback(async (groupData: PermissionGroupWithMenus) => {
    try {
      const { name, description, is_admin, menu_keys } = groupData;
      
      // Inserir o grupo de permissão
      const { data: newGroup, error: groupError } = await supabase
        .from("permission_groups")
        .insert({
          name,
          description,
          is_admin
        })
        .select()
        .single();
        
      if (groupError) throw groupError;
      
      // Se não for admin e tiver menu_keys, inserir as permissões
      if (!is_admin && menu_keys && menu_keys.length > 0 && newGroup) {
        const menuPermissions = menu_keys.map((menuKey) => ({
          permission_group_id: newGroup.id,
          menu_key
        }));
        
        const { error: menuError } = await supabase
          .from("permission_group_menus")
          .insert(menuPermissions);
          
        if (menuError) throw menuError;
      }
      
      toast({
        title: "Grupo criado",
        description: "Grupo de permissão criado com sucesso",
      });
      
      // Atualizar a lista de grupos
      await fetchPermissionGroups();
    } catch (err: any) {
      console.error("Erro ao criar grupo de permissão:", err);
      toast({
        title: "Erro",
        description: "Não foi possível criar o grupo de permissão",
        variant: "destructive",
      });
      throw err;
    }
  }, [fetchPermissionGroups]);

  const updatePermissionGroup = useCallback(async (groupData: PermissionGroupWithMenus) => {
    try {
      const { id, name, description, is_admin, menu_keys } = groupData;
      
      // Atualizar o grupo de permissão
      const { error: groupError } = await supabase
        .from("permission_groups")
        .update({
          name,
          description,
          is_admin,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (groupError) throw groupError;
      
      // Excluir todas as permissões existentes para o grupo
      const { error: deleteError } = await supabase
        .from("permission_group_menus")
        .delete()
        .eq('permission_group_id', id);
        
      if (deleteError) throw deleteError;
      
      // Se não for admin e tiver menu_keys, inserir as novas permissões
      if (!is_admin && menu_keys && menu_keys.length > 0) {
        const menuPermissions = menu_keys.map((menuKey) => ({
          permission_group_id: id,
          menu_key
        }));
        
        const { error: menuError } = await supabase
          .from("permission_group_menus")
          .insert(menuPermissions);
          
        if (menuError) throw menuError;
      }
      
      toast({
        title: "Grupo atualizado",
        description: "Grupo de permissão atualizado com sucesso",
      });
      
      // Atualizar a lista de grupos
      await fetchPermissionGroups();
    } catch (err: any) {
      console.error("Erro ao atualizar grupo de permissão:", err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o grupo de permissão",
        variant: "destructive",
      });
      throw err;
    }
  }, [fetchPermissionGroups]);

  const deletePermissionGroup = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("permission_groups")
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Grupo excluído",
        description: "Grupo de permissão excluído com sucesso",
      });
      
      // Atualizar a lista de grupos
      await fetchPermissionGroups();
    } catch (err: any) {
      console.error("Erro ao excluir grupo de permissão:", err);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o grupo de permissão",
        variant: "destructive",
      });
      throw err;
    }
  }, [fetchPermissionGroups]);

  const getPermissionGroupMenus = useCallback(async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from("permission_group_menus")
        .select("menu_key")
        .eq('permission_group_id', groupId);
        
      if (error) throw error;
      
      return data || [];
    } catch (err: any) {
      console.error("Erro ao carregar menus do grupo:", err);
      throw err;
    }
  }, []);

  const getPermissionGroupUsers = useCallback(async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, role")
        .eq('permission_group_id', groupId);
        
      if (error) throw error;
      
      return data || [];
    } catch (err: any) {
      console.error("Erro ao carregar usuários do grupo:", err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários do grupo",
        variant: "destructive",
      });
      throw err;
    }
  }, []);

  const removeUserFromGroup = useCallback(async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ permission_group_id: null })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: "Usuário removido",
        description: "Usuário removido do grupo com sucesso",
      });
    } catch (err: any) {
      console.error("Erro ao remover usuário do grupo:", err);
      toast({
        title: "Erro",
        description: "Não foi possível remover o usuário do grupo",
        variant: "destructive",
      });
      throw err;
    }
  }, []);

  // Inicializar a lista de grupos
  useEffect(() => {
    fetchPermissionGroups();
  }, [fetchPermissionGroups]);

  return {
    permissionGroups,
    isLoading,
    error,
    refreshPermissionGroups: fetchPermissionGroups,
    createPermissionGroup,
    updatePermissionGroup,
    deletePermissionGroup,
    getPermissionGroupMenus,
    getPermissionGroupUsers,
    removeUserFromGroup
  };
};
