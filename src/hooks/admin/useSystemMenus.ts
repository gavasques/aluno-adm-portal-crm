
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchSystemMenus = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from("system_menus")
          .select("*")
          .order("display_name");
          
        if (error) {
          throw error;
        }
        
        setSystemMenus(data || []);
      } catch (err: any) {
        console.error("Erro ao carregar menus do sistema:", err);
        setError("Não foi possível carregar os menus do sistema.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemMenus();
  }, []);

  const refreshSystemMenus = async () => {
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
      console.error("Erro ao recarregar menus do sistema:", err);
      setError("Não foi possível recarregar os menus do sistema.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    systemMenus,
    isLoading,
    error,
    refreshSystemMenus
  };
};
