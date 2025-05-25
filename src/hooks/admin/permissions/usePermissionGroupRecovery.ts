
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePermissionGroupRecovery = () => {
  const recoverMentorGroupMenus = useCallback(async () => {
    try {
      console.log("=== RECUPERANDO MENUS DO GRUPO MENTOR ===");
      
      // Buscar o grupo Mentor
      const { data: mentorGroup, error: groupError } = await supabase
        .from("permission_groups")
        .select("*")
        .eq("name", "Mentor")
        .single();

      if (groupError || !mentorGroup) {
        console.error("❌ Grupo Mentor não encontrado:", groupError);
        return false;
      }

      console.log("Grupo Mentor encontrado:", {
        id: mentorGroup.id,
        is_admin: mentorGroup.is_admin,
        allow_admin_access: mentorGroup.allow_admin_access
      });

      // Verificar menus atuais
      const { data: currentMenus, error: menusError } = await supabase
        .from("permission_group_menus")
        .select("menu_key")
        .eq("permission_group_id", mentorGroup.id);

      if (menusError) {
        console.error("❌ Erro ao verificar menus atuais:", menusError);
        return false;
      }

      console.log("Menus atuais do grupo Mentor:", currentMenus?.length || 0);

      // Se já tem menus, não fazer nada
      if (currentMenus && currentMenus.length > 0) {
        console.log("✅ Grupo Mentor já possui menus, não é necessária recuperação");
        return true;
      }

      // Menus que um mentor deveria ter acesso
      const mentorMenus = [
        "dashboard",
        "students", 
        "mentoring",
        "settings"
      ];

      // Verificar quais menus existem no sistema
      const { data: systemMenus, error: systemMenusError } = await supabase
        .from("system_menus")
        .select("menu_key")
        .in("menu_key", mentorMenus);

      if (systemMenusError) {
        console.error("❌ Erro ao buscar menus do sistema:", systemMenusError);
        return false;
      }

      const validMenus = systemMenus?.map(m => m.menu_key) || [];
      console.log("Menus válidos para recuperação:", validMenus);

      if (validMenus.length === 0) {
        console.log("⚠️ Nenhum menu válido encontrado para recuperação");
        return false;
      }

      // Inserir menus de recuperação
      const menuAssociations = validMenus.map(menuKey => ({
        permission_group_id: mentorGroup.id,
        menu_key: menuKey,
      }));

      const { error: insertError } = await supabase
        .from("permission_group_menus")
        .insert(menuAssociations);

      if (insertError) {
        console.error("❌ Erro ao inserir menus de recuperação:", insertError);
        return false;
      }

      console.log("✅ Menus do grupo Mentor recuperados com sucesso!");
      console.log("Menus restaurados:", validMenus);
      console.log("=========================================");

      toast({
        title: "Recuperação concluída",
        description: `Grupo Mentor recuperado com ${validMenus.length} menus`,
      });

      return true;
    } catch (error: any) {
      console.error("❌ Erro na recuperação do grupo Mentor:", error);
      toast({
        title: "Erro na recuperação",
        description: error.message || "Erro ao recuperar grupo Mentor",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  return {
    recoverMentorGroupMenus,
  };
};
