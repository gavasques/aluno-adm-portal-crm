
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead } from '@/types/crm.types';
import { toast } from 'sonner';

interface UseLeadDetailMovementProps {
  lead: CRMLead;
  onLeadUpdate: () => void;
}

export const useLeadDetailMovement = ({ lead, onLeadUpdate }: UseLeadDetailMovementProps) => {
  const queryClient = useQueryClient();

  const moveLeadToColumn = useCallback(async (newColumnId: string) => {
    const operationId = `move_detail_${lead.id}_${Date.now()}`;
    console.log(`🔄 [LEAD_DETAIL_MOVEMENT_${operationId}] Iniciando movimento:`, {
      leadId: lead.id,
      leadName: lead.name,
      currentColumn: lead.column_id,
      newColumn: newColumnId
    });
    
    // Validações iniciais
    if (!lead || !newColumnId) {
      console.error(`❌ [LEAD_DETAIL_MOVEMENT_${operationId}] Parâmetros inválidos`);
      throw new Error('Parâmetros inválidos');
    }
    
    if (lead.column_id === newColumnId) {
      console.log(`🔄 [LEAD_DETAIL_MOVEMENT_${operationId}] Lead já está na coluna correta`);
      return;
    }

    try {
      // Atualizar diretamente no banco de dados
      console.log(`💾 [LEAD_DETAIL_MOVEMENT_${operationId}] Atualizando lead no banco...`);
      
      const { data: updatedLead, error } = await supabase
        .from('crm_leads')
        .update({ 
          column_id: newColumnId,
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id)
        .select(`
          id, name, column_id, updated_at,
          column:crm_pipeline_columns(id, name, color)
        `)
        .single();

      if (error) {
        console.error(`❌ [LEAD_DETAIL_MOVEMENT_${operationId}] Erro no banco:`, error);
        throw new Error(`Erro ao atualizar lead: ${error.message}`);
      }

      if (!updatedLead) {
        throw new Error('Nenhum lead foi atualizado');
      }

      console.log(`✅ [LEAD_DETAIL_MOVEMENT_${operationId}] Lead atualizado com sucesso:`, {
        leadId: updatedLead.id,
        newColumn: updatedLead.column_id,
        columnName: updatedLead.column?.name
      });
      
      // Invalidar queries relacionadas
      console.log(`🔄 [LEAD_DETAIL_MOVEMENT_${operationId}] Invalidando queries...`);
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['crm-lead-detail', lead.id] }),
        queryClient.invalidateQueries({ queryKey: ['unified-crm-leads'] }),
        queryClient.invalidateQueries({ queryKey: ['optimized-crm-leads'] }),
        queryClient.invalidateQueries({ queryKey: ['crm-leads'] })
      ]);
      
      // Chamar callback para atualizar a UI
      onLeadUpdate();
      
      toast.success(`Lead movido para "${updatedLead.column?.name || 'Nova coluna'}"`);
      
    } catch (error) {
      console.error(`❌ [LEAD_DETAIL_MOVEMENT_${operationId}] Erro:`, error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao mover lead: ${errorMessage}`);
      
      throw error;
    }
  }, [lead, queryClient, onLeadUpdate]);

  return { moveLeadToColumn };
};
