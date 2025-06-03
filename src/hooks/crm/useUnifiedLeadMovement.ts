
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';

export const useUnifiedLeadMovement = (filters: CRMFilters) => {
  const queryClient = useQueryClient();

  const validateTargetColumn = useCallback(async (columnId: string): Promise<boolean> => {
    try {
      console.log('🔍 [UNIFIED_MOVEMENT] Validando coluna de destino:', columnId);

      const { data: column, error } = await supabase
        .from('crm_pipeline_columns')
        .select('id, name, pipeline_id, is_active')
        .eq('id', columnId)
        .eq('is_active', true)
        .single();

      if (error || !column) {
        console.error('❌ [UNIFIED_MOVEMENT] Coluna não encontrada:', error);
        return false;
      }

      console.log('✅ [UNIFIED_MOVEMENT] Coluna válida:', column.name);
      return true;
    } catch (error) {
      console.error('❌ [UNIFIED_MOVEMENT] Erro na validação:', error);
      return false;
    }
  }, []);

  const moveLeadToColumn = useCallback(async (leadId: string, newColumnId: string) => {
    const operationId = `move_${leadId}_${Date.now()}`;
    console.log(`🚀 [UNIFIED_MOVEMENT_${operationId}] Iniciando movimento do lead:`, {
      leadId,
      newColumnId
    });
    
    // Validações iniciais
    if (!leadId || !newColumnId) {
      const error = new Error('IDs de lead ou coluna inválidos');
      console.error(`❌ [UNIFIED_MOVEMENT_${operationId}] Validação inicial falhou`);
      throw error;
    }

    const queryKey = ['unified-crm-leads', filters];
    
    // 1. Backup dos dados atuais para possível rollback
    const previousData = queryClient.getQueryData<LeadWithContacts[]>(queryKey);
    console.log(`📊 [UNIFIED_MOVEMENT_${operationId}] Dados anteriores obtidos:`, {
      hasData: !!previousData,
      totalLeads: previousData?.length || 0
    });
    
    // 2. Validar se o lead existe
    const currentLead = previousData?.find(lead => lead.id === leadId);
    if (!currentLead) {
      const error = new Error('Lead não encontrado nos dados locais');
      console.error(`❌ [UNIFIED_MOVEMENT_${operationId}] Lead não encontrado:`, leadId);
      throw error;
    }

    console.log(`📋 [UNIFIED_MOVEMENT_${operationId}] Lead encontrado:`, {
      id: currentLead.id,
      name: currentLead.name,
      currentColumn: currentLead.column_id,
      targetColumn: newColumnId
    });

    // 3. Validar coluna de destino
    const isValidColumn = await validateTargetColumn(newColumnId);
    if (!isValidColumn) {
      throw new Error('Coluna de destino inválida');
    }

    // 4. Atualização otimista
    console.log(`🔄 [UNIFIED_MOVEMENT_${operationId}] Aplicando atualização otimista...`);
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
      console.log(`💾 [UNIFIED_MOVEMENT_${operationId}] Persistindo no banco de dados...`);
      
      const { data: updatedLead, error } = await supabase
        .from('crm_leads')
        .update({
          column_id: newColumnId,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .select('id, name, column_id, updated_at')
        .single();

      if (error) {
        console.error(`❌ [UNIFIED_MOVEMENT_${operationId}] Erro no banco de dados:`, error);
        throw new Error(`Erro no banco: ${error.message}`);
      }

      if (!updatedLead) {
        throw new Error('Nenhum lead foi atualizado');
      }

      console.log(`✅ [UNIFIED_MOVEMENT_${operationId}] Lead atualizado com sucesso:`, {
        leadId: updatedLead.id,
        newColumn: updatedLead.column_id
      });
      
      // 6. Invalidar queries relacionadas após delay
      setTimeout(() => {
        console.log(`🔄 [UNIFIED_MOVEMENT_${operationId}] Invalidando queries para sincronização`);
        queryClient.invalidateQueries({ 
          queryKey: ['unified-crm-leads'] 
        });
      }, 500);
      
    } catch (error) {
      console.error(`❌ [UNIFIED_MOVEMENT_${operationId}] Erro ao persistir movimento:`, error);
      
      // 7. Rollback da atualização otimista
      if (previousData) {
        console.log(`🔄 [UNIFIED_MOVEMENT_${operationId}] Restaurando estado anterior`);
        queryClient.setQueryData(queryKey, previousData);
      }
      
      throw error;
    }
  }, [queryClient, filters, validateTargetColumn]);

  return { moveLeadToColumn };
};
