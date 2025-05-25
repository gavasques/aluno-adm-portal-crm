
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePermissionGroupRecovery = () => {
  const recoverMentorGroupMenus = useCallback(async () => {
    try {
      console.log("=== RECUPERANDO MENUS DO GRUPO MENTOR (VERSÃO EXPANDIDA) ===");
      
      // Buscar o grupo Mentor
      const { data: mentorGroup, error: groupError } = await supabase
        .from("permission_groups")
        .select("*")
        .eq("name", "Mentor")
        .single();

      if (groupError || !mentorGroup) {
        console.error("❌ Grupo Mentor não encontrado:", groupError);
        toast({
          title: "Erro",
          description: "Grupo Mentor não encontrado",
          variant: "destructive",
        });
        return false;
      }

      console.log("✅ Grupo Mentor encontrado:", {
        id: mentorGroup.id,
        is_admin: mentorGroup.is_admin,
        allow_admin_access: mentorGroup.allow_admin_access
      });

      // Conjunto expandido de menus para mentores
      const mentorMenus = [
        "dashboard",      // Dashboard principal
        "students",       // Gestão de alunos
        "mentoring",      // Sistema de mentoria
        "tasks",          // Tarefas e agenda
        "users",          // Gerenciamento de usuários
        "settings",       // Configurações
        "crm",           // CRM para leads
        "suppliers",     // Fornecedores
        "partners",      // Parceiros
        "tools",         // Ferramentas
        "bonus",         // Bônus e materiais
        "courses"        // Cursos
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
      console.log("✅ Menus válidos para recuperação:", validMenus);

      if (validMenus.length === 0) {
        console.log("⚠️ Nenhum menu válido encontrado para recuperação");
        toast({
          title: "Aviso",
          description: "Nenhum menu válido encontrado para recuperação",
          variant: "destructive",
        });
        return false;
      }

      // FORÇAR recuperação: deletar menus existentes e inserir novos
      console.log("🔄 Removendo menus existentes do grupo Mentor...");
      await supabase
        .from("permission_group_menus")
        .delete()
        .eq("permission_group_id", mentorGroup.id);

      // Inserir menus de recuperação
      const menuAssociations = validMenus.map(menuKey => ({
        permission_group_id: mentorGroup.id,
        menu_key: menuKey,
      }));

      console.log("📝 Inserindo", menuAssociations.length, "menus de recuperação...");
      const { error: insertError } = await supabase
        .from("permission_group_menus")
        .insert(menuAssociations);

      if (insertError) {
        console.error("❌ Erro ao inserir menus de recuperação:", insertError);
        toast({
          title: "Erro na recuperação",
          description: "Erro ao inserir menus de recuperação",
          variant: "destructive",
        });
        return false;
      }

      console.log("✅ Menus do grupo Mentor recuperados com sucesso!");
      console.log("📋 Menus restaurados:", validMenus);
      console.log("========================================================");

      toast({
        title: "Recuperação concluída",
        description: `Grupo Mentor recuperado com ${validMenus.length} menus: ${validMenus.join(", ")}`,
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
