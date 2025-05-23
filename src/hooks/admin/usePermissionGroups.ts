
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PermissionGroup {
  id: string;
  name: string;
  is_admin: boolean;
  allowed_menu_ids: string[];
  created_at: string;
}

export const usePermissionGroups = () => {
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissionGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to use the secure function first
      const { data: functionData, error: functionError } = await supabase.rpc(
        'get_permission_groups'
      );
      
      if (functionError) {
        console.warn("Erro ao buscar grupos via função segura:", functionError);
        
        // Fallback to direct query
        const { data: directData, error: directError } = await supabase
          .from('permission_groups')
          .select('*');
        
        if (directError) {
          throw directError;
        }
        
        setPermissionGroups(directData || []);
      } else {
        setPermissionGroups(functionData || []);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao carregar grupos de permissão";
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissionGroups();
  }, []);

  return {
    permissionGroups,
    isLoading,
    error,
    refetch: fetchPermissionGroups,
  };
};
