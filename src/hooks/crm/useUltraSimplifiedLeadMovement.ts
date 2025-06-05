
import { useCallback } from 'react';
import { useCRMActions } from '@/contexts/CRMContext';
import { useUltraSimplifiedCRMOperations } from './useUltraSimplifiedCRMOperations';
import { CRMFilters } from '@/types/crm.types';
import { debugLogger } from '@/utils/debug-logger';
import { toast } from 'sonner';

interface UseUltraSimplifiedLeadMovementProps {
  filters: CRMFilters;
}

export const useUltraSimplifiedLeadMovement = ({ filters }: UseUltraSimplifiedLeadMovementProps) => {
  const actions = useCRMActions();
  const { moveLeadToColumn: operationMoveLeadToColumn } = useUltraSimplifiedCRMOperations();

  const moveLeadToColumn = useCallback(async (leadId: string, newColumnId: string) => {
    debugLogger.info('🚀 [ULTRA_SIMPLIFIED_LEAD_MOVEMENT] Iniciando movimento do lead:', {
      leadId,
      newColumnId,
      timestamp: new Date().toISOString()
    });

    try {
      // Update otimista local primeiro
      actions.moveLead(leadId, newColumnId);
      
      // Executar operação no backend
      await operationMoveLeadToColumn(leadId, newColumnId);
      
      // Forçar refresh dos dados após movimento bem-sucedido
      actions.refreshData();
      
      debugLogger.info('✅ [ULTRA_SIMPLIFIED_LEAD_MOVEMENT] Lead movido com sucesso:', {
        leadId,
        newColumnId,
        timestamp: new Date().toISOString()
      });

      toast.success('Lead movido com sucesso!');
      
    } catch (error) {
      debugLogger.error('❌ [ULTRA_SIMPLIFIED_LEAD_MOVEMENT] Erro ao mover lead:', {
        leadId,
        newColumnId,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      });
      
      // Reverter update otimista em caso de erro
      actions.refreshData();
      
      toast.error('Erro ao mover lead. Tente novamente.');
      throw error;
    }
  }, [actions, operationMoveLeadToColumn]);

  return {
    moveLeadToColumn
  };
};
