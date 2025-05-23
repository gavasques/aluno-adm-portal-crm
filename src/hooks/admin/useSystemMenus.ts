
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SystemMenu {
  id: string;
  menu_key: string;
  display_name: string;
  description: string | null;
  icon: string | null;
}

export const useSystemMenus = () => {
  const [systemMenus, setSystemMenus] = useState<SystemMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("system_menus")
        .select("*")
        .order("display_name");
        
      if (error) throw error;
      
      setSystemMenus(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar menus do sistema:", err);
      setError("Não foi possível carregar os menus do sistema.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystemMenus();
  }, [fetchSystemMenus]);

  return {
    systemMenus,
    isLoading,
    error,
    refreshSystemMenus: fetchSystemMenus
  };
};
