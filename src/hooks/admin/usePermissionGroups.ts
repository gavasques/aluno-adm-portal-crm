
import { useState, useEffect, useCallback } from "react";
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

  const fetchPermissionGroups = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("permission_groups")
        .select("*")
        .order("name");

      if (error) {
        throw error;
      }

      setPermissionGroups(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar grupos de permissão:", err);
      setError(err.message || "Erro ao carregar grupos de permissão");
      
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
  }, []);

  const createPermissionGroup = useCallback(async (groupData: {
    name: string;
    description?: string;
    is_admin: boolean;
    allow_admin_access: boolean;
    menu_keys: string[];
  }) => {
    try {
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
        throw error;
      }

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
  }, []);

  const updatePermissionGroup = useCallback(async (groupData: {
    id: string;
    name: string;
    description?: string;
    is_admin: boolean;
    allow_admin_access: boolean;
    menu_keys: string[];
  }) => {
    try {
      console.log("=== UPDATE PERMISSION GROUP (FIXED) ===");
      console.log("Dados recebidos:", {
        id: groupData.id,
        is_admin: groupData.is_admin,
        allow_admin_access: groupData.allow_admin_access,
        menu_keys_count: groupData.menu_keys.length
      });

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
        throw error;
      }

      // CORREÇÃO CRÍTICA: Deletar menus APENAS se for admin completo
      if (groupData.is_admin) {
        console.log("🔴 Admin completo - DELETANDO todos os menus");
        await supabase
          .from("permission_group_menus")
          .delete()
          .eq("permission_group_id", groupData.id);
      } else {
        console.log("✅ Admin limitado/usuário normal - ATUALIZANDO menus preservados");
        
        // Para admin limitado, primeiro deletar e depois inserir os menus preservados
        await supabase
          .from("permission_group_menus")
          .delete()
          .eq("permission_group_id", groupData.id);

        // Inserir os menus preservados (se houver)
        if (groupData.menu_keys.length > 0) {
          const menuAssociations = groupData.menu_keys.map(menuKey => ({
            permission_group_id: groupData.id,
            menu_key: menuKey,
          }));

          console.log("📝 Inserindo menus preservados:", menuAssociations.length);
          const { error: menuError } = await supabase
            .from("permission_group_menus")
            .insert(menuAssociations);

          if (menuError) {
            console.error("❌ Erro ao inserir menus preservados:", menuError);
          } else {
            console.log("✅ Menus preservados inseridos com sucesso");
          }
        } else {
          console.log("⚠️ Nenhum menu para preservar");
        }
      }

      console.log("=====================================");

      toast({
        title: "Grupo atualizado",
        description: "Grupo de permissão atualizado com sucesso",
      });

      return data;
    } catch (error: any) {
      console.error("❌ Erro ao atualizar grupo de permissão:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar grupo de permissão",
        variant: "destructive",
      });
      throw error;
    }
  }, []);

  const deletePermissionGroup = useCallback(async (groupId: string) => {
    try {
      await supabase
        .from("permission_group_menus")
        .delete()
        .eq("permission_group_id", groupId);

      const { error } = await supabase
        .from("permission_groups")
        .delete()
        .eq("id", groupId);

      if (error) {
        throw error;
      }

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
  }, []);

  const getPermissionGroupMenus = useCallback(async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from("permission_group_menus")
        .select("menu_key")
        .eq("permission_group_id", groupId);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error: any) {
      console.error("Erro ao carregar menus do grupo:", error);
      throw error;
    }
  }, []);

  const getPermissionGroupUsers = useCallback(async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, role")
        .eq("permission_group_id", groupId);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error: any) {
      console.error("Erro ao carregar usuários do grupo:", error);
      throw error;
    }
  }, []);

  const removeUserFromGroup = useCallback(async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ permission_group_id: null })
        .eq("id", userId);

      if (error) {
        throw error;
      }

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
  }, []);

  const refreshPermissionGroups = useCallback(() => {
    fetchPermissionGroups();
  }, [fetchPermissionGroups]);

  useEffect(() => {
    fetchPermissionGroups();
  }, [fetchPermissionGroups]);

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
