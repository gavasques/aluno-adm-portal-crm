
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';

export const useSimplifiedLeadMovement = (filters: CRMFilters) => {
  const queryClient = useQueryClient();

  const moveLeadToColumn = useCallback(async (leadId: string, newColumnId: string) => {
    console.log(`🔄 Iniciando movimento simplificado do lead ${leadId} para coluna ${newColumnId}`);
    
    if (!leadId || !newColumnId) {
      throw new Error('IDs de lead ou coluna inválidos');
    }

    const queryKey = ['optimized-crm-leads', filters];
    
    // 1. Atualização otimista simples
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
      // 2. Atualizar no banco de dados
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
      
      // 3. Invalidar queries para garantir consistência
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey });
      }, 100);
      
    } catch (error) {
      console.error('❌ Erro ao persistir movimento:', error);
      
      // Rollback da atualização otimista
      queryClient.invalidateQueries({ queryKey });
      
      throw error;
    }
  }, [queryClient, filters]);

  return { moveLeadToColumn };
};
