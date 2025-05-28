
import { useState } from 'react';
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { usePermissionGroups } from '@/hooks/admin/usePermissionGroups';
import { toast } from '@/hooks/use-toast';

export const useUserBanning = () => {
  const [isBanning, setIsBanning] = useState(false);
  const { setPermissionGroup, forceRefresh } = usePerformanceOptimizedUserContext();
  const { permissionGroups } = usePermissionGroups();

  const banUser = async (userId: string, userEmail: string): Promise<boolean> => {
    try {
      setIsBanning(true);
      
      // Encontrar o grupo "Banido"
      const bannedGroup = permissionGroups.find(group => 
        group.name.toLowerCase() === "banido"
      );

      if (!bannedGroup) {
        toast({
          title: "Erro",
          description: "Grupo 'Banido' não encontrado. Verifique se foi criado corretamente.",
          variant: "destructive",
        });
        return false;
      }

      // Definir o usuário para o grupo "Banido"
      const success = await setPermissionGroup(userId, userEmail, bannedGroup.id);
      
      if (success) {
        toast({
          title: "Usuário banido",
          description: `${userEmail} foi banido com sucesso.`,
        });
        
        // Forçar refresh da lista
        setTimeout(() => {
          forceRefresh?.();
        }, 300);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível banir o usuário.",
          variant: "destructive",
        });
      }

      return success;
    } catch (error) {
      console.error('Erro ao banir usuário:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao banir usuário.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsBanning(false);
    }
  };

  return {
    banUser,
    isBanning
  };
};
