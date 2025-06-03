
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';

export const useSimplifiedLeadMovement = (filters: CRMFilters) => {
  const queryClient = useQueryClient();

  const validateTargetColumn = useCallback(async (columnId: string, leadPipelineId?: string): Promise<boolean> => {
    try {
      console.log('🔍 [VALIDATION] Validando coluna de destino:', {
        columnId,
        leadPipelineId
      });

      const { data: column, error } = await supabase
        .from('crm_pipeline_columns')
        .select('id, name, pipeline_id, is_active')
        .eq('id', columnId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('❌ [VALIDATION] Erro ao buscar coluna:', error);
        return false;
      }

      if (!column) {
        console.error('❌ [VALIDATION] Coluna não encontrada:', columnId);
        return false;
      }

      // Validar se a coluna pertence ao mesmo pipeline do lead
      if (leadPipelineId && column.pipeline_id !== leadPipelineId) {
        console.error('❌ [VALIDATION] Pipeline incompatível:', {
          columnPipeline: column.pipeline_id,
          leadPipeline: leadPipelineId,
          columnName: column.name
        });
        throw new Error(`Não é possível mover para "${column.name}" - pipeline incompatível`);
      }

      console.log('✅ [VALIDATION] Coluna válida:', {
        columnId: column.id,
        columnName: column.name,
        pipelineId: column.pipeline_id
      });

      return true;
    } catch (error) {
      console.error('❌ [VALIDATION] Erro na validação:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao validar coluna de destino');
    }
  }, []);

  const moveLeadToColumn = useCallback(async (leadId: string, newColumnId: string) => {
    const operationId = `move_${leadId}_${Date.now()}`;
    console.log(`🚀 [MOVEMENT_${operationId}] Iniciando movimento do lead:`, {
      leadId,
      newColumnId,
      timestamp: new Date().toISOString()
    });
    
    // Validações iniciais
    if (!leadId || !newColumnId) {
      const error = new Error('IDs de lead ou coluna inválidos');
      console.error(`❌ [MOVEMENT_${operationId}] Validação inicial falhou:`, {
        leadId,
        newColumnId
      });
      throw error;
    }

    const queryKey = ['optimized-crm-leads', filters];
    
    // 1. Backup dos dados atuais
    const previousData = queryClient.getQueryData<LeadWithContacts[]>(queryKey);
    console.log(`📊 [MOVEMENT_${operationId}] Dados anteriores obtidos:`, {
      hasData: !!previousData,
      totalLeads: previousData?.length || 0
    });
    
    // 2. Validar se o lead existe
    const currentLead = previousData?.find(lead => lead.id === leadId);
    if (!currentLead) {
      const error = new Error('Lead não encontrado nos dados locais');
      console.error(`❌ [MOVEMENT_${operationId}] Lead não encontrado:`, {
        leadId,
        availableLeads: previousData?.map(l => ({ id: l.id, name: l.name })) || []
      });
      throw error;
    }

    console.log(`📋 [MOVEMENT_${operationId}] Lead encontrado:`, {
      id: currentLead.id,
      name: currentLead.name,
      currentColumn: currentLead.column_id,
      targetColumn: newColumnId,
      pipeline: currentLead.pipeline_id
    });

    // 3. Validar coluna de destino
    try {
      const isValidColumn = await validateTargetColumn(newColumnId, currentLead.pipeline_id);
      if (!isValidColumn) {
        throw new Error('Coluna de destino inválida');
      }
    } catch (error) {
      console.error(`❌ [MOVEMENT_${operationId}] Validação de coluna falhou:`, error);
      throw error;
    }

    // 4. Atualização otimista
    console.log(`🔄 [MOVEMENT_${operationId}] Aplicando atualização otimista...`);
    queryClient.setQueryData<LeadWithContacts[]>(queryKey, (oldData) => {
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

    try {
      // 5. Atualizar no banco de dados
      console.log(`💾 [MOVEMENT_${operationId}] Persistindo no banco de dados...`);
      
      const updateData = {
        column_id: newColumnId,
        updated_at: new Date().toISOString()
      };

      const { data: updatedLead, error } = await supabase
        .from('crm_leads')
        .update(updateData)
        .eq('id', leadId)
        .select('id, name, column_id, updated_at')
        .single();

      if (error) {
        console.error(`❌ [MOVEMENT_${operationId}] Erro no banco de dados:`, {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Erro no banco: ${error.message}`);
      }

      if (!updatedLead) {
        throw new Error('Nenhum lead foi atualizado - possível problema de permissão');
      }

      console.log(`✅ [MOVEMENT_${operationId}] Lead atualizado com sucesso no banco:`, {
        leadId: updatedLead.id,
        newColumn: updatedLead.column_id,
        updatedAt: updatedLead.updated_at
      });
      
      // 6. Invalidar queries para garantir consistência
      setTimeout(() => {
        console.log(`🔄 [MOVEMENT_${operationId}] Invalidando queries para atualização`);
        queryClient.invalidateQueries({ queryKey });
        
        // Invalidar também queries relacionadas
        queryClient.invalidateQueries({ 
          queryKey: ['crm-leads'] 
        });
      }, 500);
      
    } catch (error) {
      console.error(`❌ [MOVEMENT_${operationId}] Erro ao persistir movimento:`, {
        error,
        leadName: currentLead.name,
        fromColumn: currentLead.column_id,
        toColumn: newColumnId
      });
      
      // 7. Rollback da atualização otimista
      if (previousData) {
        console.log(`🔄 [MOVEMENT_${operationId}] Restaurando estado anterior`);
        queryClient.setQueryData(queryKey, previousData);
      }
      
      // Re-lançar o erro com contexto adicional
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Erro desconhecido ao mover lead');
      }
    }
  }, [queryClient, filters, validateTargetColumn]);

  return { moveLeadToColumn };
};
