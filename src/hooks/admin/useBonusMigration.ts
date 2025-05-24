import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BonusType, AccessPeriod } from "@/types/bonus.types";

interface LocalStorageBonus {
  id: string;
  bonusId: string;
  name: string;
  type: BonusType;
  description: string;
  accessPeriod: AccessPeriod;
  observations?: string;
  createdAt: Date;
}

export const useBonusMigration = () => {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'checking' | 'migrating' | 'completed' | 'error'>('idle');
  const [migratedCount, setMigratedCount] = useState(0);

  const migrateFromLocalStorage = async () => {
    try {
      setMigrationStatus('checking');

      const localBonuses = localStorage.getItem("bonuses");
      if (!localBonuses) {
        setMigrationStatus('completed');
        return;
      }

      const parsedBonuses: LocalStorageBonus[] = JSON.parse(localBonuses);
      if (parsedBonuses.length === 0) {
        setMigrationStatus('completed');
        return;
      }

      setMigrationStatus('migrating');

      const { data: existingBonuses, error: checkError } = await supabase
        .from('bonuses')
        .select('bonus_id');

      if (checkError) {
        console.error('Erro ao verificar bônus existentes:', checkError);
        setMigrationStatus('error');
        return;
      }

      const existingBonusIds = new Set(existingBonuses?.map(b => b.bonus_id) || []);

      const bonusesToMigrate = parsedBonuses.filter(bonus => 
        !existingBonusIds.has(bonus.bonusId)
      );

      if (bonusesToMigrate.length === 0) {
        setMigrationStatus('completed');
        toast.info('Todos os bônus já estão sincronizados com o Supabase');
        return;
      }

      let migrated = 0;
      for (const localBonus of bonusesToMigrate) {
        try {
          const { error } = await supabase
            .from('bonuses')
            .insert([{
              bonus_id: localBonus.bonusId,
              name: localBonus.name,
              type: localBonus.type,
              description: localBonus.description,
              access_period: localBonus.accessPeriod,
              observations: localBonus.observations
            }]);

          if (error) {
            console.error(`Erro ao migrar bônus ${localBonus.bonusId}:`, error);
          } else {
            migrated++;
            setMigratedCount(migrated);
          }
        } catch (error) {
          console.error(`Erro inesperado ao migrar bônus ${localBonus.bonusId}:`, error);
        }
      }

      if (migrated > 0) {
        toast.success(`${migrated} bônus migrados com sucesso para o Supabase!`);
      }

      setMigrationStatus('completed');
    } catch (error) {
      console.error('Erro geral na migração:', error);
      setMigrationStatus('error');
      toast.error('Erro durante a migração dos dados');
    }
  };

  useEffect(() => {
    migrateFromLocalStorage();
  }, []);

  return {
    migrationStatus,
    migratedCount,
    migrateFromLocalStorage
  };
};
