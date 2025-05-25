
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePermissionGroupOperations = () => {
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

  return {
    getPermissionGroupMenus,
    getPermissionGroupUsers,
    removeUserFromGroup,
  };
};
