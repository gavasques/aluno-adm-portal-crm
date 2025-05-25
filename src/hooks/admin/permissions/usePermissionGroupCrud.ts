
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CreatePermissionGroupData {
  name: string;
  description?: string;
  is_admin: boolean;
  allow_admin_access: boolean;
  menu_keys: string[];
}

interface UpdatePermissionGroupData extends CreatePermissionGroupData {
  id: string;
}

export const usePermissionGroupCrud = () => {
  const createPermissionGroup = useCallback(async (groupData: CreatePermissionGroupData) => {
    try {
      console.log("=== CREATE PERMISSION GROUP ===");
      console.log("Dados para criação:", {
        is_admin: groupData.is_admin,
        allow_admin_access: groupData.allow_admin_access,
        menu_keys_count: groupData.menu_keys.length
      });

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

      // Inserir menus apenas se houver menus para associar
      if (groupData.menu_keys.length > 0) {
        const menuAssociations = groupData.menu_keys.map(menuKey => ({
          permission_group_id: data.id,
          menu_key: menuKey,
        }));

        console.log("📝 Inserindo", menuAssociations.length, "associações de menu");
        const { error: menuError } = await supabase
          .from("permission_group_menus")
          .insert(menuAssociations);

        if (menuError) {
          console.error("❌ Erro ao associar menus:", menuError);
        } else {
          console.log("✅ Menus associados com sucesso");
        }
      } else {
        console.log("ℹ️ Nenhum menu para associar (admin completo ou sem seleção)");
      }

      console.log("=================================");

      toast({
        title: "Grupo criado",
        description: "Grupo de permissão criado com sucesso",
      });

      return data;
    } catch (error: any) {
      console.error("❌ Erro ao criar grupo de permissão:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar grupo de permissão",
        variant: "destructive",
      });
      throw error;
    }
  }, []);

  const updatePermissionGroup = useCallback(async (groupData: UpdatePermissionGroupData) => {
    try {
      console.log("=== UPDATE PERMISSION GROUP (CRITICAL FIX) ===");
      console.log("Dados recebidos:", {
        id: groupData.id,
        is_admin: groupData.is_admin,
        allow_admin_access: groupData.allow_admin_access,
        menu_keys_count: groupData.menu_keys.length
      });

      // Atualizar dados básicos do grupo
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

      // CORREÇÃO CRÍTICA: Lógica condicional para gerenciamento de menus
      if (groupData.is_admin) {
        // Admin completo (is_admin = true) - deletar todos os menus (acesso total)
        console.log("🔴 ADMIN COMPLETO - Deletando todos os menus (acesso total implícito)");
        await supabase
          .from("permission_group_menus")
          .delete()
          .eq("permission_group_id", groupData.id);
        console.log("✅ Todos os menus deletados para admin completo");
      } else {
        // Não-admin (is_admin = false) - gerenciar menus conforme seleção
        console.log("🟡 NÃO-ADMIN - Gerenciando menus conforme seleção");
        
        if (groupData.allow_admin_access) {
          console.log("🟢 ADMIN LIMITADO - Preservando menus selecionados");
        } else {
          console.log("🔵 USUÁRIO NORMAL - Gerenciando menus normalmente");
        }
        
        // Sempre deletar e reinserir para garantir consistência
        await supabase
          .from("permission_group_menus")
          .delete()
          .eq("permission_group_id", groupData.id);

        // Inserir menus selecionados (se houver)
        if (groupData.menu_keys.length > 0) {
          const menuAssociations = groupData.menu_keys.map(menuKey => ({
            permission_group_id: groupData.id,
            menu_key: menuKey,
          }));

          console.log("📝 Inserindo", menuAssociations.length, "menus preservados/selecionados");
          const { error: menuError } = await supabase
            .from("permission_group_menus")
            .insert(menuAssociations);

          if (menuError) {
            console.error("❌ Erro ao inserir menus preservados:", menuError);
          } else {
            console.log("✅ Menus preservados/selecionados inseridos com sucesso");
          }
        } else {
          console.log("ℹ️ Nenhum menu selecionado para inserir");
        }
      }

      console.log("==============================================");

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
      // Deletar associações de menu primeiro
      await supabase
        .from("permission_group_menus")
        .delete()
        .eq("permission_group_id", groupId);

      // Deletar o grupo
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
      console.error("❌ Erro ao excluir grupo de permissão:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir grupo de permissão",
        variant: "destructive",
      });
      throw error;
    }
  }, []);

  return {
    createPermissionGroup,
    updatePermissionGroup,
    deletePermissionGroup,
  };
};
