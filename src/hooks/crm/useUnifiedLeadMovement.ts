
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';
import { toast } from 'sonner';
import { debugLogger } from '@/utils/debug-logger';

export const useUnifiedLeadMovement = (filters: CRMFilters) => {
  const queryClient = useQueryClient();

  const moveLeadToColumn = useCallback(async (leadId: string, newColumnId: string) => {
    const operationId = `ultra_simple_move_${leadId}_${Date.now()}`;
    
    debugLogger.info(`🚀 [LEAD_MOVEMENT_${operationId}] INÍCIO - VERSÃO ULTRA SIMPLIFICADA`, {
      leadId,
      newColumnId,
      timestamp: new Date().toISOString()
    });
    
    try {
      // 1. VALIDAÇÕES BÁSICAS
      if (!leadId || !newColumnId) {
        const error = 'IDs de lead ou coluna inválidos';
        debugLogger.error(`❌ [VALIDAÇÃO] ${error}`, { leadId, newColumnId });
        throw new Error(error);
      }

      // 2. VERIFICAR SE O LEAD EXISTE NO BANCO
      debugLogger.info('🔍 [LEAD_CHECK] Verificando existência do lead...');
      const { data: currentLead, error: leadError } = await supabase
        .from('crm_leads')
        .select('id, name, column_id')
        .eq('id', leadId)
        .single();

      if (leadError || !currentLead) {
        const error = `Lead não encontrado: ${leadError?.message || 'Lead inexistente'}`;
        debugLogger.error(`❌ [LEAD_CHECK] ${error}`);
        toast.error('Lead não encontrado no banco de dados');
        throw new Error(error);
      }

      debugLogger.info('✅ [LEAD_CHECK] Lead encontrado:', currentLead);

      // Verificar se já está na coluna correta
      if (currentLead.column_id === newColumnId) {
        debugLogger.info('ℹ️ [LEAD_CHECK] Lead já está na coluna correta');
        toast.info('Lead já está na coluna de destino');
        return;
      }

      // 3. VERIFICAR SE A COLUNA EXISTE
      debugLogger.info('🔍 [COLUMN_CHECK] Verificando coluna...');
      const { data: column, error: columnError } = await supabase
        .from('crm_pipeline_columns')
        .select('id, name')
        .eq('id', newColumnId)
        .eq('is_active', true)
        .single();

      if (columnError || !column) {
        const error = `Coluna inválida: ${columnError?.message || 'Coluna não encontrada'}`;
        debugLogger.error(`❌ [COLUMN_CHECK] ${error}`);
        toast.error('Coluna de destino não encontrada');
        throw new Error(error);
      }

      debugLogger.info('✅ [COLUMN_CHECK] Coluna válida:', column);

      // 4. ATUALIZAÇÃO ULTRA SIMPLES NO BANCO
      debugLogger.info('💾 [DATABASE] Atualizando lead - versão ultra simples...');
      
      const { data: updatedLead, error: updateError } = await supabase
        .from('crm_leads')
        .update({ 
          column_id: newColumnId,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .select('id, name, column_id')
        .single();

      if (updateError) {
        debugLogger.error(`❌ [DATABASE] Erro na atualização:`, updateError);
        toast.error(`Erro ao mover lead: ${updateError.message}`);
        throw new Error(`Erro no banco: ${updateError.message}`);
      }

      if (!updatedLead) {
        const error = 'Nenhum lead foi atualizado';
        debugLogger.error(`❌ [DATABASE] ${error}`);
        toast.error('Nenhum lead foi atualizado');
        throw new Error(error);
      }

      debugLogger.info('✅ [DATABASE] Lead atualizado com sucesso:', updatedLead);

      // 5. INVALIDAR CACHE
      debugLogger.info('🔄 [CACHE] Invalidando queries...');
      const queryKeys = [
        ['unified-crm-leads'],
        ['optimized-crm-leads'], 
        ['crm-leads']
      ];

      queryKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      // 6. SUCESSO
      toast.success(`Lead "${currentLead.name}" movido com sucesso!`, {
        description: `Movido para "${column.name}"`,
        duration: 3000
      });

      debugLogger.info(`🎉 [SUCCESS] Operação concluída com sucesso!`);
      
    } catch (error) {
      debugLogger.error(`❌ [ERROR_${operationId}] Erro:`, error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast.error(`Erro ao mover lead: ${errorMessage}`, {
        description: `Lead: ${leadId.slice(0, 8)}...`,
        duration: 8000
      });
      
      throw error;
    }
  }, [queryClient, filters]);

  return { moveLeadToColumn };
};
