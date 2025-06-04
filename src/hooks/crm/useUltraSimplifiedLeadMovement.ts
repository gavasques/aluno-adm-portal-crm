
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters } from '@/types/crm.types';
import { toast } from 'sonner';
import { debugLogger } from '@/utils/debug-logger';

export const useUltraSimplifiedLeadMovement = (filters: CRMFilters) => {
  const queryClient = useQueryClient();

  const moveLeadToColumn = useCallback(async (leadId: string, newColumnId: string) => {
    const operationId = `ultra_simple_move_${leadId}_${Date.now()}`;
    
    debugLogger.info(`🚀 [ULTRA_SIMPLE_MOVE_${operationId}] INÍCIO`, {
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

      // 2. VERIFICAR SE O LEAD EXISTE (query ultra simples)
      debugLogger.info('🔍 [LEAD_CHECK] Verificando lead...');
      const { data: currentLead, error: leadError } = await supabase
        .from('crm_leads')
        .select('id, name, column_id')
        .eq('id', leadId)
        .single();

      if (leadError || !currentLead) {
        const error = `Lead não encontrado: ${leadError?.message || 'Lead inexistente'}`;
        debugLogger.error(`❌ [LEAD_CHECK] ${error}`, { leadId, leadError });
        toast.error('Lead não encontrado');
        throw new Error(error);
      }

      debugLogger.info('✅ [LEAD_CHECK] Lead encontrado:', {
        id: currentLead.id,
        name: currentLead.name,
        currentColumn: currentLead.column_id
      });

      // Verificar se já está na coluna correta
      if (currentLead.column_id === newColumnId) {
        debugLogger.info('ℹ️ [LEAD_CHECK] Lead já está na coluna correta');
        toast.info('Lead já está na coluna de destino');
        return;
      }

      // 3. VERIFICAR SE A COLUNA EXISTE (query ultra simples)
      debugLogger.info('🔍 [COLUMN_CHECK] Verificando coluna...');
      const { data: column, error: columnError } = await supabase
        .from('crm_pipeline_columns')
        .select('id, name')
        .eq('id', newColumnId)
        .eq('is_active', true)
        .single();

      if (columnError || !column) {
        const error = `Coluna inválida: ${columnError?.message || 'Coluna não encontrada'}`;
        debugLogger.error(`❌ [COLUMN_CHECK] ${error}`, { newColumnId, columnError });
        toast.error('Coluna de destino não encontrada');
        throw new Error(error);
      }

      debugLogger.info('✅ [COLUMN_CHECK] Coluna válida:', {
        id: column.id,
        name: column.name
      });

      // 4. REALIZAR A ATUALIZAÇÃO ULTRA SIMPLES
      debugLogger.info('💾 [UPDATE] Atualizando lead...');
      
      const updateData = {
        column_id: newColumnId,
        updated_at: new Date().toISOString()
      };

      debugLogger.info('📋 [UPDATE] Dados para atualização:', updateData);

      const { data: updatedLead, error: updateError } = await supabase
        .from('crm_leads')
        .update(updateData)
        .eq('id', leadId)
        .select('id, name, column_id')
        .single();

      if (updateError) {
        debugLogger.error(`❌ [UPDATE] Erro na atualização:`, {
          error: updateError,
          leadId,
          newColumnId,
          updateData
        });
        toast.error(`Erro ao mover lead: ${updateError.message}`);
        throw new Error(`Erro no banco: ${updateError.message}`);
      }

      if (!updatedLead) {
        const error = 'Nenhum lead foi atualizado';
        debugLogger.error(`❌ [UPDATE] ${error}`, { leadId, newColumnId });
        toast.error('Nenhum lead foi atualizado');
        throw new Error(error);
      }

      debugLogger.info('✅ [UPDATE] Lead atualizado com sucesso:', {
        id: updatedLead.id,
        name: updatedLead.name,
        newColumn: updatedLead.column_id,
        previousColumn: currentLead.column_id
      });

      // 5. INVALIDAR CACHE ESPECÍFICO
      debugLogger.info('🔄 [CACHE] Invalidando queries específicas...');
      
      // Invalidar apenas as queries necessárias
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['unified-crm-leads'] }),
        queryClient.invalidateQueries({ queryKey: ['crm-leads'] })
      ]);

      // 6. SUCESSO
      toast.success(`Lead "${currentLead.name}" movido com sucesso!`, {
        description: `Movido para "${column.name}"`,
        duration: 3000
      });

      debugLogger.info(`🎉 [SUCCESS_${operationId}] Operação concluída com sucesso!`, {
        leadId,
        leadName: currentLead.name,
        fromColumn: currentLead.column_id,
        toColumn: newColumnId,
        columnName: column.name
      });
      
    } catch (error) {
      debugLogger.error(`❌ [ERROR_${operationId}] Erro crítico:`, {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : error,
        leadId,
        newColumnId
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast.error(`Erro ao mover lead: ${errorMessage}`, {
        description: `Lead: ${leadId.slice(0, 8)}... | Operação: ${operationId}`,
        duration: 8000
      });
      
      throw error;
    }
  }, [queryClient, filters]);

  return { moveLeadToColumn };
};
