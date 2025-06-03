
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';

export const useSimplifiedLeadMovement = (filters: CRMFilters) => {
  const queryClient = useQueryClient();

  const moveLeadToColumn = useCallback(async (leadId: string, newColumnId: string) => {
    console.log(`🔄 [MOVEMENT] Iniciando movimento do lead ${leadId} para coluna ${newColumnId}`);
    
    if (!leadId || !newColumnId) {
      throw new Error('IDs de lead ou coluna inválidos');
    }

    const queryKey = ['optimized-crm-leads', filters];
    
    // 1. Backup dos dados atuais
    const previousData = queryClient.getQueryData<LeadWithContacts[]>(queryKey);
    console.log('📊 [MOVEMENT] Dados anteriores obtidos:', previousData?.length || 0, 'leads');
    
    // 2. Validar se o lead existe
    const currentLead = previousData?.find(lead => lead.id === leadId);
    if (!currentLead) {
      console.error('❌ [MOVEMENT] Lead não encontrado nos dados locais');
      throw new Error('Lead não encontrado');
    }

    console.log('📋 [MOVEMENT] Lead encontrado:', {
      id: currentLead.id,
      name: currentLead.name,
      currentColumn: currentLead.column_id,
      targetColumn: newColumnId
    });

    // 3. Verificar se a coluna de destino existe (validação rápida no cache)
    const allLeads = previousData || [];
    const targetColumnExists = allLeads.some(lead => lead.column_id === newColumnId) || 
                              await validateTargetColumn(newColumnId);
    
    if (!targetColumnExists) {
      console.error('❌ [MOVEMENT] Coluna de destino não encontrada');
      throw new Error('Coluna de destino não encontrada');
    }

    // 4. Atualização otimista
    console.log('🔄 [MOVEMENT] Aplicando atualização otimista...');
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
      console.log('💾 [MOVEMENT] Persistindo no banco de dados...');
      
      const { error } = await supabase
        .from('crm_leads')
        .update({ 
          column_id: newColumnId,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) {
        console.error('❌ [MOVEMENT] Erro no banco de dados:', error);
        throw error;
      }

      console.log('✅ [MOVEMENT] Lead movido com sucesso no banco de dados');
      
      // 6. Invalidar queries após um pequeno delay para garantir consistência
      setTimeout(() => {
        console.log('🔄 [MOVEMENT] Invalidando queries para atualização');
        queryClient.invalidateQueries({ queryKey });
      }, 500);
      
    } catch (error) {
      console.error('❌ [MOVEMENT] Erro ao persistir movimento, fazendo rollback:', error);
      
      // 7. Rollback da atualização otimista
      if (previousData) {
        console.log('🔄 [MOVEMENT] Restaurando estado anterior');
        queryClient.setQueryData(queryKey, previousData);
      }
      
      throw error;
    }
  }, [queryClient, filters]);

  // Função auxiliar para validar coluna de destino
  const validateTargetColumn = async (columnId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('crm_pipeline_columns')
        .select('id')
        .eq('id', columnId)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        console.error('❌ [VALIDATION] Coluna não encontrada:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ [VALIDATION] Erro ao validar coluna:', error);
      return false;
    }
  };

  return { moveLeadToColumn };
};
