
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface PermissionGroup {
  id: string;
  name: string;
  description?: string;
  is_admin: boolean;
  allow_admin_access: boolean;
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
      setError(null);

      console.log("Buscando grupos de permissão...");

      const { data, error } = await supabase
        .from("permission_groups")
        .select("*")
        .order("name");

      if (error) {
        console.error("Erro ao buscar grupos de permissão:", error);
        throw error;
      }

      console.log("Grupos de permissão carregados:", data);
      setPermissionGroups(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar grupos de permissão:", err);
      setError(err.message || "Erro ao carregar grupos de permissão");
      
      // Mostrar toast apenas em caso de erro crítico
      if (err.message?.includes("permission denied") || err.message?.includes("RLS")) {
        toast({
          title: "Erro de permissão",
          description: "Não foi possível carregar os grupos de permissão. Verifique suas permissões.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createPermissionGroup = async (groupData: {
    name: string;
    description?: string;
    is_admin: boolean;
    allow_admin_access: boolean;
    menu_keys: string[];
  }) => {
    try {
      console.log("Criando grupo de permissão:", groupData);

      const { data, error } = await supabase
        .from("permission_groups")
        .insert({
          name: groupData.name,
          description: groupData.description,
          is_admin: groupData.is_admin,
          allow_admin_access: groupData.allow_admin_access,
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar grupo de permissão:", error);
        throw error;
      }

      console.log("Grupo de permissão criado:", data);

      // Se houver menus para associar
      if (groupData.menu_keys.length > 0) {
        const menuAssociations = groupData.menu_keys.map(menuKey => ({
          permission_group_id: data.id,
          menu_key: menuKey,
        }));

        const { error: menuError } = await supabase
          .from("permission_group_menus")
          .insert(menuAssociations);

        if (menuError) {
          console.error("Erro ao associar menus:", menuError);
          // Não falhar completamente, apenas avisar
        }
      }

      toast({
        title: "Grupo criado",
        description: "Grupo de permissão criado com sucesso",
      });

      return data;
    } catch (error: any) {
      console.error("Erro ao criar grupo de permissão:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar grupo de permissão",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePermissionGroup = async (groupData: {
    id: string;
    name: string;
    description?: string;
    is_admin: boolean;
    allow_admin_access: boolean;
    menu_keys: string[];
  }) => {
    try {
      console.log("Atualizando grupo de permissão:", groupData);

      const { data, error } = await supabase
        .from("permission_groups")
        .update({
          name: groupData.name,
          description: groupData.description,
          is_admin: groupData.is_admin,
          allow_admin_access: groupData.allow_admin_access,
          updated_at: new Date().toISOString(),
        })
        .eq("id", groupData.id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao atualizar grupo de permissão:", error);
        throw error;
      }

      // Atualizar associações de menus
      // Primeiro, remover associações existentes
      await supabase
        .from("permission_group_menus")
        .delete()
        .eq("permission_group_id", groupData.id);

      // Depois, adicionar novas associações
      if (groupData.menu_keys.length > 0) {
        const menuAssociations = groupData.menu_keys.map(menuKey => ({
          permission_group_id: groupData.id,
          menu_key: menuKey,
        }));

        const { error: menuError } = await supabase
          .from("permission_group_menus")
          .insert(menuAssociations);

        if (menuError) {
          console.error("Erro ao atualizar menus:", menuError);
        }
      }

      console.log("Grupo de permissão atualizado:", data);

      toast({
        title: "Grupo atualizado",
        description: "Grupo de permissão atualizado com sucesso",
      });

      return data;
    } catch (error: any) {
      console.error("Erro ao atualizar grupo de permissão:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar grupo de permissão",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePermissionGroup = async (groupId: string) => {
    try {
      console.log("Excluindo grupo de permissão:", groupId);

      // Primeiro, remover associações de menus
      await supabase
        .from("permission_group_menus")
        .delete()
        .eq("permission_group_id", groupId);

      // Depois, excluir o grupo
      const { error } = await supabase
        .from("permission_groups")
        .delete()
        .eq("id", groupId);

      if (error) {
        console.error("Erro ao excluir grupo de permissão:", error);
        throw error;
      }

      console.log("Grupo de permissão excluído com sucesso");

      toast({
        title: "Grupo excluído",
        description: "Grupo de permissão excluído com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao excluir grupo de permissão:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir grupo de permissão",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getPermissionGroupMenus = async (groupId: string) => {
    try {
      console.log("Buscando menus do grupo:", groupId);

      const { data, error } = await supabase
        .from("permission_group_menus")
        .select("menu_key")
        .eq("permission_group_id", groupId);

      if (error) {
        console.error("Erro ao buscar menus do grupo:", error);
        throw error;
      }

      console.log("Menus do grupo carregados:", data);
      return data || [];
    } catch (error: any) {
      console.error("Erro ao carregar menus do grupo:", error);
      throw error;
    }
  };

  const getPermissionGroupUsers = async (groupId: string) => {
    try {
      console.log("Buscando usuários do grupo:", groupId);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, role")
        .eq("permission_group_id", groupId);

      if (error) {
        console.error("Erro ao buscar usuários do grupo:", error);
        throw error;
      }

      console.log("Usuários do grupo carregados:", data);
      return data || [];
    } catch (error: any) {
      console.error("Erro ao carregar usuários do grupo:", error);
      throw error;
    }
  };

  const removeUserFromGroup = async (userId: string) => {
    try {
      console.log("Removendo usuário do grupo:", userId);

      const { error } = await supabase
        .from("profiles")
        .update({ permission_group_id: null })
        .eq("id", userId);

      if (error) {
        console.error("Erro ao remover usuário do grupo:", error);
        throw error;
      }

      console.log("Usuário removido do grupo com sucesso");

      toast({
        title: "Usuário removido",
        description: "Usuário removido do grupo com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao remover usuário do grupo:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover usuário do grupo",
        variant: "destructive",
      });
      throw error;
    }
  };

  const refreshPermissionGroups = () => {
    fetchPermissionGroups();
  };

  useEffect(() => {
    fetchPermissionGroups();
  }, []);

  return {
    permissionGroups,
    isLoading,
    error,
    refreshPermissionGroups,
    createPermissionGroup,
    updatePermissionGroup,
    deletePermissionGroup,
    getPermissionGroupMenus,
    getPermissionGroupUsers,
    removeUserFromGroup,
  };
};
