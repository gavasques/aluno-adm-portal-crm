
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';
import { toast } from 'sonner';
import { debugLogger } from '@/utils/debug-logger';

export const useUnifiedLeadMovement = (filters: CRMFilters) => {
  const queryClient = useQueryClient();

  const moveLeadToColumn = useCallback(async (leadId: string, newColumnId: string) => {
    const operationId = `simple_move_${leadId}_${Date.now()}`;
    
    debugLogger.info(`🚀 [LEAD_MOVEMENT_${operationId}] INÍCIO DA OPERAÇÃO SIMPLIFICADA`, {
      leadId,
      newColumnId,
      filters,
      timestamp: new Date().toISOString()
    });
    
    try {
      // 1. VALIDAÇÕES BÁSICAS
      if (!leadId || !newColumnId) {
        const error = 'IDs de lead ou coluna inválidos';
        debugLogger.error(`❌ [VALIDAÇÃO] ${error}`, { leadId, newColumnId });
        throw new Error(error);
      }

      // 2. BUSCAR LEAD ATUAL (SEM JOINS)
      debugLogger.info('🔍 [LEAD_CHECK] Buscando lead atual...');
      const { data: currentLead, error: leadError } = await supabase
        .from('crm_leads')
        .select('id, name, column_id, pipeline_id, status')
        .eq('id', leadId)
        .single();

      debugLogger.info('📊 [LEAD_CHECK] Resultado:', {
        leadFound: !!currentLead,
        currentLead,
        error: leadError
      });

      if (leadError || !currentLead) {
        const error = `Lead não encontrado: ${leadError?.message || 'Lead inexistente'}`;
        debugLogger.error(`❌ [LEAD_CHECK] ${error}`);
        toast.error('Lead não encontrado no banco de dados');
        throw new Error(error);
      }

      // Verificar se já está na coluna correta
      if (currentLead.column_id === newColumnId) {
        debugLogger.info('ℹ️ [LEAD_CHECK] Lead já está na coluna correta');
        toast.info('Lead já está na coluna de destino');
        return;
      }

      // 3. VALIDAR COLUNA DE DESTINO (SEM JOINS)
      debugLogger.info('🔍 [COLUMN_CHECK] Validando coluna...');
      const { data: column, error: columnError } = await supabase
        .from('crm_pipeline_columns')
        .select('id, name, pipeline_id, is_active')
        .eq('id', newColumnId)
        .eq('is_active', true)
        .single();

      debugLogger.info('📊 [COLUMN_CHECK] Resultado:', {
        column,
        error: columnError
      });

      if (columnError || !column) {
        const error = `Coluna inválida: ${columnError?.message || 'Coluna não encontrada'}`;
        debugLogger.error(`❌ [COLUMN_CHECK] ${error}`);
        toast.error('Coluna de destino não encontrada');
        throw new Error(error);
      }

      // 4. ATUALIZAÇÃO OTIMISTA
      debugLogger.info('🔄 [OPTIMISTIC] Aplicando...');
      const queryKeys = [
        ['unified-crm-leads', filters],
        ['optimized-crm-leads', filters],
        ['crm-leads']
      ];
      
      const backups = queryKeys.map(key => ({
        key,
        data: queryClient.getQueryData(key)
      }));

      queryKeys.forEach(key => {
        queryClient.setQueryData<LeadWithContacts[]>(key, (oldData) => {
          if (!oldData) return oldData;
          
          return oldData.map(lead => 
            lead.id === leadId 
              ? { 
                  ...lead, 
                  column_id: newColumnId,
                  updated_at: new Date().toISOString()
                }
              : lead
          );
        });
      });

      // 5. ATUALIZAÇÃO SIMPLES NO BANCO (SEM JOINS)
      debugLogger.info('💾 [DATABASE] Atualizando...');
      const updateData = {
        column_id: newColumnId,
        updated_at: new Date().toISOString()
      };

      const { data: updatedLead, error: updateError } = await supabase
        .from('crm_leads')
        .update(updateData)
        .eq('id', leadId)
        .select('id, name, column_id, updated_at')
        .single();

      debugLogger.info('📊 [DATABASE] Resultado:', {
        updatedLead,
        error: updateError
      });

      if (updateError) {
        debugLogger.error(`❌ [DATABASE] Erro:`, updateError);
        
        // Rollback
        backups.forEach(({ key, data }) => {
          if (data) {
            queryClient.setQueryData(key, data);
          }
        });
        
        toast.error(`Erro ao mover lead: ${updateError.message}`);
        throw new Error(`Erro no banco: ${updateError.message}`);
      }

      if (!updatedLead) {
        const error = 'Nenhum lead foi atualizado';
        debugLogger.error(`❌ [DATABASE] ${error}`);
        
        // Rollback
        backups.forEach(({ key, data }) => {
          if (data) {
            queryClient.setQueryData(key, data);
          }
        });
        
        toast.error('Nenhum lead foi atualizado');
        throw new Error(error);
      }

      // 6. INVALIDAR CACHE
      debugLogger.info('🔄 [CACHE] Invalidando...');
      setTimeout(() => {
        queryKeys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }, 300);

      // 7. SUCESSO
      toast.success(`Lead "${currentLead.name}" movido com sucesso!`, {
        description: `Movido para "${column.name}"`,
        duration: 3000
      });

      debugLogger.info(`🎉 [SUCCESS] Operação concluída!`);
      
    } catch (error) {
      debugLogger.error(`❌ [ERROR_${operationId}] Erro:`, error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      if (errorMessage.includes('Lead não encontrado')) {
        toast.error('Lead não existe no banco de dados', {
          description: `Verifique se o lead ainda existe`,
          duration: 8000
        });
      } else if (errorMessage.includes('Coluna inválida')) {
        toast.error('Coluna de destino inválida', {
          description: `A coluna não foi encontrada`,
          duration: 8000
        });
      } else if (errorMessage.includes('FULL JOIN')) {
        toast.error('Erro interno de consulta no banco', {
          description: 'Entre em contato com o suporte técnico',
          duration: 8000
        });
      } else {
        toast.error(`Erro ao mover lead: ${errorMessage}`, {
          description: `Lead: ${leadId.slice(0, 8)}...`,
          duration: 8000
        });
      }
      
      throw error;
    }
  }, [queryClient, filters]);

  return { moveLeadToColumn };
};
