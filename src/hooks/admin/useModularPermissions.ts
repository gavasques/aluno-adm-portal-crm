
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ModuleWithActions } from "./useSystemModules";

export interface PermissionGroupModule {
  id: string;
  permission_group_id: string;
  module_id: string;
  action_id: string;
  granted: boolean;
  created_at: string;
}

export interface ModulePermissionData {
  module_id: string;
  module_key: string;
  module_name: string;
  actions: {
    action_id: string;
    action_key: string;
    action_name: string;
    granted: boolean;
  }[];
}

export const useModularPermissions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getGroupModulePermissions = useCallback(async (groupId: string, modules: ModuleWithActions[]) => {
    try {
      console.log("Buscando permissões para o grupo:", groupId);
      
      const { data: permissions, error } = await supabase
        .from("permission_group_modules")
        .select("*")
        .eq("permission_group_id", groupId);
        
      if (error) {
        console.error("Erro ao buscar permissões:", error);
        throw error;
      }
      
      // Criar estrutura de dados organizada por módulo
      const modulePermissions: ModulePermissionData[] = modules.map(module => ({
        module_id: module.id,
        module_key: module.module_key,
        module_name: module.module_name,
        actions: module.actions.map(action => {
          const permission = permissions?.find(p => 
            p.module_id === module.id && p.action_id === action.id
          );
          return {
            action_id: action.id,
            action_key: action.action_key,
            action_name: action.action_name,
            granted: permission?.granted || false
          };
        })
      }));
      
      console.log("Permissões organizadas:", modulePermissions);
      return modulePermissions;
    } catch (err: any) {
      console.error("Erro ao carregar permissões do grupo:", err);
      throw err;
    }
  }, []);

  const saveGroupModulePermissions = useCallback(async (
    groupId: string, 
    modulePermissions: ModulePermissionData[]
  ) => {
    try {
      setIsSubmitting(true);
      
      console.log("Salvando permissões para o grupo:", groupId);
      
      // Primeiro, remover todas as permissões existentes do grupo
      const { error: deleteError } = await supabase
        .from("permission_group_modules")
        .delete()
        .eq("permission_group_id", groupId);
        
      if (deleteError) {
        console.error("Erro ao remover permissões existentes:", deleteError);
        throw deleteError;
      }
      
      // Preparar novos registros de permissão
      const newPermissions: any[] = [];
      
      modulePermissions.forEach(module => {
        module.actions.forEach(action => {
          if (action.granted) {
            newPermissions.push({
              permission_group_id: groupId,
              module_id: module.module_id,
              action_id: action.action_id,
              granted: true
            });
          }
        });
      });
      
      // Inserir novas permissões se houver alguma
      if (newPermissions.length > 0) {
        const { error: insertError } = await supabase
          .from("permission_group_modules")
          .insert(newPermissions);
          
        if (insertError) {
          console.error("Erro ao inserir novas permissões:", insertError);
          throw insertError;
        }
      }
      
      console.log("Permissões salvas com sucesso");
      toast({
        title: "Permissões atualizadas",
        description: "As permissões do grupo foram atualizadas com sucesso",
      });
    } catch (err: any) {
      console.error("Erro ao salvar permissões:", err);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as permissões",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isSubmitting,
    getGroupModulePermissions,
    saveGroupModulePermissions
  };
};
