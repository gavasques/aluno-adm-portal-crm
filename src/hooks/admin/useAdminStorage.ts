
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

  const removeStorageUpgrade = async (
    targetUserId: string,
    removeMB: number,
    notes?: string
  ): Promise<boolean> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    try {
      // Buscar limite atual
      const { data: currentData, error: fetchError } = await supabase
        .from('user_storage')
        .select('storage_limit_mb')
        .eq('user_id', targetUserId)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar limite atual:', fetchError);
        toast.error('Erro ao buscar dados do usuário');
        return false;
      }

      const currentLimit = currentData.storage_limit_mb || 100;
      const newLimit = Math.max(0, currentLimit - removeMB);

      // Atualizar limite
      const { error: updateError } = await supabase
        .from('user_storage')
        .update({ 
          storage_limit_mb: newLimit,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', targetUserId);

      if (updateError) {
        console.error('Erro ao atualizar limite:', updateError);
        toast.error('Erro ao remover armazenamento');
        return false;
      }

      // Atualizar também na tabela profiles
      await supabase
        .from('profiles')
        .update({ storage_limit_mb: newLimit })
        .eq('id', targetUserId);

      // Registrar no histórico como upgrade negativo
      const { error: historyError } = await supabase
        .from('storage_upgrades')
        .insert({
          user_id: targetUserId,
          admin_id: user.id,
          previous_limit_mb: currentLimit,
          new_limit_mb: newLimit,
          upgrade_amount_mb: -removeMB,
          notes: notes || `Remoção de ${removeMB}MB de armazenamento`
        });

      if (historyError) {
        console.error('Erro ao registrar histórico:', historyError);
      }

      toast.success(`${removeMB}MB de armazenamento removido com sucesso!`);
      await fetchUsersStorage();
      await fetchStorageUpgrades();
      return true;
    } catch (error) {
      console.error('Erro na remoção de armazenamento:', error);
      toast.error('Erro interno ao remover armazenamento');
      return false;
    }
  };

  const adjustStorageLimit = async (
    targetUserId: string,
    newLimit: number,
    notes?: string
  ): Promise<boolean> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    try {
      // Buscar limite atual
      const { data: currentData, error: fetchError } = await supabase
        .from('user_storage')
        .select('storage_limit_mb')
        .eq('user_id', targetUserId)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar limite atual:', fetchError);
        toast.error('Erro ao buscar dados do usuário');
        return false;
      }

      const currentLimit = currentData.storage_limit_mb || 100;
      const difference = newLimit - currentLimit;

      // Atualizar limite
      const { error: updateError } = await supabase
        .from('user_storage')
        .update({ 
          storage_limit_mb: newLimit,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', targetUserId);

      if (updateError) {
        console.error('Erro ao ajustar limite:', updateError);
        toast.error('Erro ao ajustar armazenamento');
        return false;
      }

      // Atualizar também na tabela profiles
      await supabase
        .from('profiles')
        .update({ storage_limit_mb: newLimit })
        .eq('id', targetUserId);

      // Registrar no histórico
      const { error: historyError } = await supabase
        .from('storage_upgrades')
        .insert({
          user_id: targetUserId,
          admin_id: user.id,
          previous_limit_mb: currentLimit,
          new_limit_mb: newLimit,
          upgrade_amount_mb: difference,
          notes: notes || `Ajuste de armazenamento para ${newLimit}MB`
        });

      if (historyError) {
        console.error('Erro ao registrar histórico:', historyError);
      }

      const actionText = difference > 0 ? 'aumentado' : 'reduzido';
      toast.success(`Armazenamento ${actionText} para ${newLimit}MB com sucesso!`);
      await fetchUsersStorage();
      await fetchStorageUpgrades();
      return true;
    } catch (error) {
      console.error('Erro no ajuste de armazenamento:', error);
      toast.error('Erro interno ao ajustar armazenamento');
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
    removeStorageUpgrade,
    adjustStorageLimit,
    refreshData: () => {
      fetchUsersStorage();
      fetchStorageUpgrades();
    }
  };
};
