
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@integrations/supabase/client';
import { CRMLead } from '@/types/crm.types';
import { toast } from 'sonner';

interface UseLeadDetailMovementProps {
  lead: CRMLead;
  onLeadUpdate: () => void;
}

export const useLeadDetailMovement = ({ lead, onLeadUpdate }: UseLeadDetailMovementProps) => {
  const queryClient = useQueryClient();

  const moveLeadToColumn = useCallback(async (newColumnId: string) => {
    console.log(`🔄 Movendo lead ${lead.id} para coluna ${newColumnId}`);
    
    // Validações iniciais
    if (!lead || !newColumnId) {
      console.error('❌ Lead ou nova coluna não definidos');
      throw new Error('Parâmetros inválidos');
    }
    
    if (lead.column_id === newColumnId) {
      console.log('🔄 Lead já está na coluna correta');
      return;
    }

    try {
      // Verificar se a coluna de destino existe
      const { data: columnExists, error: columnError } = await supabase
        .from('crm_pipeline_columns')
        .select('id, name')
        .eq('id', newColumnId)
        .eq('is_active', true)
        .single();

      if (columnError || !columnExists) {
        console.error('❌ Coluna de destino não encontrada:', columnError);
        throw new Error('Coluna de destino não encontrada');
      }

      // Atualizar no banco de dados
      const { error } = await supabase
        .from('crm_leads')
        .update({ 
          column_id: newColumnId,
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id);

      if (error) {
        console.error('❌ Erro no banco de dados:', error);
        throw error;
      }

      console.log('✅ Lead movido com sucesso no banco de dados');
      
      // Invalidar queries relacionadas para forçar refetch
      queryClient.invalidateQueries({ queryKey: ['crm-lead-detail', lead.id] });
      queryClient.invalidateQueries({ queryKey: ['optimized-crm-leads'] });
      queryClient.invalidateQueries({ queryKey: ['crm-leads'] });
      
      // Chamar callback para atualizar a UI
      onLeadUpdate();
      
      toast.success(`Lead movido para "${columnExists.name}"`);
      
    } catch (error) {
      console.error('❌ Erro ao mover lead:', error);
      throw error;
    }
  }, [lead, queryClient, onLeadUpdate]);

  return { moveLeadToColumn };
};
