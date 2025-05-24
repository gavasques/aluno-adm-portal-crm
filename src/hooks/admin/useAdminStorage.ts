
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface UserStorageInfo {
  user_id: string;
  user_name: string;
  user_email: string;
  storage_used_mb: number;
  storage_limit_mb: number;
  usage_percentage: number;
}

interface StorageUpgrade {
  id: string;
  user_id: string;
  admin_id: string;
  previous_limit_mb: number;
  new_limit_mb: number;
  upgrade_amount_mb: number;
  upgrade_date: string;
  notes?: string;
}

export const useAdminStorage = () => {
  const { user } = useAuth();
  const [usersStorage, setUsersStorage] = useState<UserStorageInfo[]>([]);
  const [storageUpgrades, setStorageUpgrades] = useState<StorageUpgrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsersStorage = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          storage_used_mb,
          storage_limit_mb
        `)
        .order('storage_used_mb', { ascending: false });

      if (error) {
        console.error('Erro ao buscar armazenamento dos usuários:', error);
        return;
      }

      const storageData: UserStorageInfo[] = (data || []).map(user => ({
        user_id: user.id,
        user_name: user.name || 'Sem nome',
        user_email: user.email,
        storage_used_mb: user.storage_used_mb || 0,
        storage_limit_mb: user.storage_limit_mb || 100,
        usage_percentage: ((user.storage_used_mb || 0) / (user.storage_limit_mb || 100)) * 100
      }));

      setUsersStorage(storageData);
    } catch (error) {
      console.error('Erro ao buscar dados de armazenamento:', error);
    }
  };

  const fetchStorageUpgrades = async () => {
    try {
      const { data, error } = await supabase
        .from('storage_upgrades')
        .select('*')
        .order('upgrade_date', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erro ao buscar histórico de upgrades:', error);
        return;
      }

      setStorageUpgrades(data || []);
    } catch (error) {
      console.error('Erro ao buscar upgrades:', error);
    }
  };

  const addStorageUpgrade = async (
    targetUserId: string,
    upgradeMB: number = 100,
    notes?: string
  ): Promise<boolean> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    try {
      const { data, error } = await supabase.rpc('add_storage_upgrade', {
        target_user_id: targetUserId,
        admin_user_id: user.id,
        upgrade_mb: upgradeMB,
        upgrade_notes: notes
      });

      if (error) {
        console.error('Erro ao adicionar upgrade de armazenamento:', error);
        toast.error('Erro ao adicionar armazenamento: ' + error.message);
        return false;
      }

      if (data) {
        toast.success(`+${upgradeMB}MB de armazenamento adicionado com sucesso!`);
        await fetchUsersStorage();
        await fetchStorageUpgrades();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro na requisição de upgrade:', error);
      toast.error('Erro interno ao adicionar armazenamento');
      return false;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchUsersStorage(), fetchStorageUpgrades()]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return {
    usersStorage,
    storageUpgrades,
    isLoading,
    addStorageUpgrade,
    refreshData: () => {
      fetchUsersStorage();
      fetchStorageUpgrades();
    }
  };
};
