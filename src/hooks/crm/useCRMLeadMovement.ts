
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';

export const useCRMLeadMovement = (debouncedFilters: CRMFilters) => {
  const queryClient = useQueryClient();

  const moveLeadToColumn = useCallback(async (leadId: string, newColumnId: string) => {
    const queryKey = ['optimized-crm-leads', debouncedFilters];
    
    console.log(`🔄 Iniciando movimento do lead ${leadId} para coluna ${newColumnId}`);
    
    // Validações iniciais
    if (!leadId || !newColumnId) {
      console.error('❌ IDs inválidos:', { leadId, newColumnId });
      throw new Error('IDs de lead ou coluna inválidos');
    }
    
    // 1. Backup dos dados atuais para rollback
    const previousData = queryClient.getQueryData<LeadWithContacts[]>(queryKey);
    
    if (!previousData) {
      console.error('❌ Dados anteriores não encontrados no cache');
      throw new Error('Dados não disponíveis para atualização');
    }

    // 2. Verificar se o lead existe nos dados atuais
    const currentLead = previousData.find(lead => lead.id === leadId);
    if (!currentLead) {
      console.error('❌ Lead não encontrado nos dados atuais:', leadId);
      throw new Error('Lead não encontrado');
    }

    if (currentLead.column_id === newColumnId) {
      console.log('🔄 Lead já está na coluna correta, nenhuma ação necessária');
      return;
    }

    console.log(`🔄 Aplicando atualização otimista: ${currentLead.column_id} → ${newColumnId}`);
    
    // 3. Atualização otimista do cache
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
      console.log('💾 Persistindo no banco de dados...');
      
      // Verificar se a coluna de destino existe
      const { data: columnExists, error: columnError } = await supabase
        .from('crm_pipeline_columns')
        .select('id')
        .eq('id', newColumnId)
        .eq('is_active', true)
        .single();

      if (columnError || !columnExists) {
        console.error('❌ Coluna de destino não encontrada ou inativa:', columnError);
        throw new Error('Coluna de destino não encontrada');
      }

      const { error } = await supabase
        .from('crm_leads')
        .update({ 
          column_id: newColumnId,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) {
        console.error('❌ Erro no banco de dados:', error);
        throw error;
      }

      console.log('✅ Lead movido com sucesso no banco de dados');
      
      // 4. Não fazer invalidação - confiar na atualização otimista
      // A UI já está atualizada e o banco também, não há necessidade de refetch
      
    } catch (error) {
      console.error('❌ Erro ao persistir movimento, fazendo rollback:', error);
      
      // 5. Rollback: restaurar dados anteriores apenas em caso de erro
      if (previousData) {
        console.log('🔄 Restaurando estado anterior do cache');
        queryClient.setQueryData(queryKey, previousData);
      }
      
      throw error;
    }
  }, [queryClient, debouncedFilters]);

  return { moveLeadToColumn };
};
