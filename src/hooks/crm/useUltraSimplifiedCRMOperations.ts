
import { supabase } from '@/integrations/supabase/client';
import { debugLogger } from '@/utils/debug-logger';

export const useUltraSimplifiedCRMOperations = () => {
  const moveLeadToColumn = async (leadId: string, newColumnId: string) => {
    debugLogger.info('🔄 [ULTRA_SIMPLIFIED_CRM_OPERATIONS] Movendo lead:', {
      leadId,
      newColumnId,
      timestamp: new Date().toISOString()
    });

    try {
      const { error } = await supabase
        .from('crm_leads')
        .update({ column_id: newColumnId })
        .eq('id', leadId);

      if (error) {
        debugLogger.error('❌ [ULTRA_SIMPLIFIED_CRM_OPERATIONS] Erro ao mover lead:', error);
        throw error;
      }

      debugLogger.info('✅ [ULTRA_SIMPLIFIED_CRM_OPERATIONS] Lead movido com sucesso');
      
    } catch (error) {
      debugLogger.error('❌ [ULTRA_SIMPLIFIED_CRM_OPERATIONS] Erro:', error);
      throw error;
    }
  };

  return {
    moveLeadToColumn
  };
};
