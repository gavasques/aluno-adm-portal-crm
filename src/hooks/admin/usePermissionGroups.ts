
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PermissionGroup {
  id: string;
  name: string;
  description?: string;
  allow_admin_access: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export const usePermissionGroups = () => {
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissionGroups = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('permission_groups')
        .select('*')
        .order('name');

      if (error) throw error;

      setPermissionGroups(data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar grupos de permissão:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
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
    refetch: fetchPermissionGroups
  };
};
