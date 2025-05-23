
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface SystemModule {
  id: string;
  module_key: string;
  module_name: string;
  description: string | null;
  icon: string | null;
  category: string | null;
  is_premium: boolean;
  stripe_price_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModuleAction {
  id: string;
  module_id: string;
  action_key: string;
  action_name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ModuleWithActions extends SystemModule {
  actions: ModuleAction[];
}

export const useSystemModules = () => {
  const [modules, setModules] = useState<ModuleWithActions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModulesWithActions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Carregando módulos do sistema...");
      
      // Buscar todos os módulos
      const { data: modulesData, error: modulesError } = await supabase
        .from("system_modules")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
        
      if (modulesError) {
        console.error("Erro ao buscar módulos:", modulesError);
        throw modulesError;
      }
      
      // Buscar todas as ações
      const { data: actionsData, error: actionsError } = await supabase
        .from("module_actions")
        .select("*")
        .eq("is_active", true);
        
      if (actionsError) {
        console.error("Erro ao buscar ações:", actionsError);
        throw actionsError;
      }
      
      // Combinar módulos com suas ações
      const modulesWithActions: ModuleWithActions[] = (modulesData || []).map(module => ({
        ...module,
        actions: (actionsData || []).filter(action => action.module_id === module.id)
      }));
      
      console.log("Módulos carregados com novas ações:", modulesWithActions);
      setModules(modulesWithActions);
    } catch (err: any) {
      console.error("Erro ao carregar módulos:", err);
      setError("Não foi possível carregar os módulos do sistema");
      toast({
        title: "Erro",
        description: "Não foi possível carregar os módulos do sistema",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getModulesByCategory = useCallback(() => {
    const categories: Record<string, ModuleWithActions[]> = {};
    
    modules.forEach(module => {
      const category = module.category || 'outros';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(module);
    });
    
    return categories;
  }, [modules]);

  // Adicionar função para atualizar dados após mudanças
  const forceRefresh = useCallback(() => {
    fetchModulesWithActions();
  }, [fetchModulesWithActions]);

  useEffect(() => {
    fetchModulesWithActions();
  }, [fetchModulesWithActions]);

  return {
    modules,
    isLoading,
    error,
    refreshModules: fetchModulesWithActions,
    forceRefresh,
    getModulesByCategory
  };
};
