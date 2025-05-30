
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StorageInfo {
  storage_used_mb: number;
  storage_limit_mb: number;
  storage_percentage: number;
}

export const useUserStorage = () => {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStorageInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_storage')
        .select('storage_used_mb, storage_limit_mb')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // Se não existe registro, criar um
        const { data: newRecord, error: insertError } = await supabase
          .from('user_storage')
          .insert({
            user_id: user.id,
            storage_used_mb: 0,
            storage_limit_mb: 100
          })
          .select('storage_used_mb, storage_limit_mb')
          .single();

        if (!insertError && newRecord) {
          setStorageInfo({
            ...newRecord,
            storage_percentage: 0
          });
        }
      } else if (data) {
        setStorageInfo({
          ...data,
          storage_percentage: (data.storage_used_mb / data.storage_limit_mb) * 100
        });
      }
    } catch (error) {
      console.error('Erro ao buscar informações de armazenamento:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageInfo();
  }, []);

  return {
    storageInfo,
    loading,
    refetch: fetchStorageInfo
  };
};
