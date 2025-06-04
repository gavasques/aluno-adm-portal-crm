
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';
import { toast } from 'sonner';

export const useUnifiedLeadMovement = (filters: CRMFilters) => {
  const queryClient = useQueryClient();

  const moveLeadToColumn = useCallback(async (leadId: string, newColumnId: string) => {
    const operationId = `unified_move_${leadId}_${Date.now()}`;
    console.log(`🚀 [UNIFIED_MOVEMENT_${operationId}] Iniciando movimento:`, {
      leadId,
      newColumnId
    });
    
    // Validações iniciais
    if (!leadId || !newColumnId) {
      throw new Error('IDs de lead ou coluna inválidos');
    }

    const queryKeys = [
      ['unified-crm-leads', filters],
      ['optimized-crm-leads', filters],
      ['crm-leads']
    ];
    
    // Backup dos dados para rollback
    const backups = queryKeys.map(key => ({
      key,
      data: queryClient.getQueryData(key)
    }));
    
    // Validar se lead existe nos dados locais
    const currentData = queryClient.getQueryData<LeadWithContacts[]>(['unified-crm-leads', filters]);
    const currentLead = currentData?.find(lead => lead.id === leadId);
    
    if (!currentLead) {
      throw new Error('Lead não encontrado nos dados locais');
    }

    if (currentLead.column_id === newColumnId) {
      console.log(`📋 [UNIFIED_MOVEMENT_${operationId}] Lead já está na coluna correta`);
      return;
    }

    console.log(`📋 [UNIFIED_MOVEMENT_${operationId}] Lead encontrado:`, {
      id: currentLead.id,
      name: currentLead.name,
      currentColumn: currentLead.column_id,
      targetColumn: newColumnId
    });

    try {
      // Validar coluna de destino
      const { data: column, error: columnError } = await supabase
        .from('crm_pipeline_columns')
        .select('id, name, pipeline_id, is_active')
        .eq('id', newColumnId)
        .eq('is_active', true)
        .single();

      if (columnError || !column) {
        throw new Error('Coluna de destino não encontrada ou inativa');
      }

      // Atualização otimista em todas as queries
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

      console.log(`💾 [UNIFIED_MOVEMENT_${operationId}] Persistindo no banco...`);
      
      // Atualizar no banco de dados
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
        console.error(`❌ [UNIFIED_MOVEMENT_${operationId}] Erro no banco:`, error);
        throw new Error(`Erro no banco: ${error.message}`);
      }

      if (!updatedLead) {
        throw new Error('Nenhum lead foi atualizado');
      }

      console.log(`✅ [UNIFIED_MOVEMENT_${operationId}] Lead movido com sucesso:`, {
        leadId: updatedLead.id,
        newColumn: updatedLead.column_id,
        columnName: column.name
      });
      
      toast.success(`Lead "${currentLead.name}" movido para "${column.name}"`);
      
      // Invalidar queries após delay para evitar conflitos
      setTimeout(() => {
        queryKeys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }, 500);
      
    } catch (error) {
      console.error(`❌ [UNIFIED_MOVEMENT_${operationId}] Erro:`, error);
      
      // Rollback das atualizações otimistas
      backups.forEach(({ key, data }) => {
        if (data) {
          queryClient.setQueryData(key, data);
        }
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao mover lead: ${errorMessage}`);
      
      throw error;
    }
  }, [queryClient, filters]);

  return { moveLeadToColumn };
};
