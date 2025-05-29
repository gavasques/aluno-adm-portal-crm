
import { useState } from 'react';
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { toast } from '@/hooks/use-toast';

export const useUserUnbanning = () => {
  const [isUnbanning, setIsUnbanning] = useState(false);
  const { setPermissionGroup } = usePerformanceOptimizedUserContext();

  const unbanUser = async (userId: string, userEmail: string, newGroupId: string | null) => {
    const actionId = crypto.randomUUID();
    console.log(`🔓 [UNBAN-${actionId}] Iniciando desbanimento do usuário:`, userEmail);
    console.log(`🔓 [UNBAN-${actionId}] Novo grupo de permissão:`, newGroupId);
    
    setIsUnbanning(true);
    
    try {
      const success = await setPermissionGroup(userId, userEmail, newGroupId);
      
      if (success) {
        console.log(`✅ [UNBAN-${actionId}] Usuário desbanido com sucesso:`, userEmail);
        toast({
          title: "Usuário desbanido",
          description: `${userEmail} foi desbanido com sucesso.`,
        });
        return true;
      } else {
        console.error(`❌ [UNBAN-${actionId}] Falha ao desbanir usuário:`, userEmail);
        toast({
          title: "Erro ao desbanir",
          description: "Não foi possível desbanir o usuário. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error(`💥 [UNBAN-${actionId}] Erro no desbanimento:`, error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado ao desbanir o usuário.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUnbanning(false);
    }
  };

  return {
    unbanUser,
    isUnbanning
  };
};
