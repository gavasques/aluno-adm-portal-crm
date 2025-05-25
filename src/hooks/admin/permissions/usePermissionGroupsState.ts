
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

export const usePermissionGroupsState = () => {
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
  };
};
