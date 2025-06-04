
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';
import { toast } from 'sonner';

export const useUnifiedLeadMovement = (filters: CRMFilters) => {
  const queryClient = useQueryClient();

  const moveLeadToColumn = useCallback(async (leadId: string, newColumnId: string) => {
    const operationId = `unified_move_${leadId}_${Date.now()}`;
    
    console.group(`🚀 [LEAD_MOVEMENT_${operationId}] INÍCIO DA OPERAÇÃO`);
    console.log('📋 Dados iniciais:', {
      leadId,
      newColumnId,
      filters,
      timestamp: new Date().toISOString()
    });
    
    try {
      // 1. VALIDAÇÕES INICIAIS
      console.log('🔍 [VALIDAÇÃO] Verificando parâmetros...');
      if (!leadId || !newColumnId) {
        const error = 'IDs de lead ou coluna inválidos';
        console.error('❌ [VALIDAÇÃO]', error, { leadId, newColumnId });
        throw new Error(error);
      }
      console.log('✅ [VALIDAÇÃO] Parâmetros válidos');

      // 2. BUSCAR LEAD DIRETAMENTE DO BANCO (não depender apenas do cache local)
      console.log('🔍 [LEAD_CHECK] Buscando lead diretamente do banco...');
      const { data: currentLead, error: leadError } = await supabase
        .from('crm_leads')
        .select('id, name, column_id, pipeline_id, status')
        .eq('id', leadId)
        .single();

      console.log('📊 [LEAD_CHECK] Resultado da busca:', {
        leadFound: !!currentLead,
        currentLead: currentLead ? {
          id: currentLead.id,
          name: currentLead.name,
          currentColumn: currentLead.column_id,
          targetColumn: newColumnId,
          pipeline: currentLead.pipeline_id
        } : null,
        error: leadError ? {
          message: leadError.message,
          code: leadError.code
        } : null
      });

      if (leadError || !currentLead) {
        const error = `Lead não encontrado no banco: ${leadError?.message || 'Lead inexistente'}`;
        console.error('❌ [LEAD_CHECK]', error);
        toast.error('Lead não encontrado no banco de dados', {
          description: `ID: ${leadId.slice(0, 8)}...`,
          duration: 5000
        });
        throw new Error(error);
      }

      if (currentLead.column_id === newColumnId) {
        console.log('ℹ️ [LEAD_CHECK] Lead já está na coluna correta, cancelando operação');
        toast.info('Lead já está na coluna de destino');
        return;
      }

      // 3. VALIDAR COLUNA DE DESTINO
      console.log('🔍 [COLUMN_CHECK] Validando coluna de destino...');
      const { data: column, error: columnError } = await supabase
        .from('crm_pipeline_columns')
        .select('id, name, pipeline_id, is_active')
        .eq('id', newColumnId)
        .eq('is_active', true)
        .single();

      console.log('📊 [COLUMN_CHECK] Query result:', {
        column,
        error: columnError ? {
          message: columnError.message,
          code: columnError.code
        } : null
      });

      if (columnError || !column) {
        const error = `Coluna de destino não encontrada ou inativa: ${columnError?.message || 'Coluna inexistente'}`;
        console.error('❌ [COLUMN_CHECK]', error);
        toast.error('Coluna de destino não encontrada', {
          description: `ID: ${newColumnId.slice(0, 8)}...`,
          duration: 5000
        });
        throw new Error(error);
      }

      console.log('✅ [COLUMN_CHECK] Coluna válida:', {
        columnId: column.id,
        columnName: column.name,
        pipelineId: column.pipeline_id
      });

      // 4. ATUALIZAÇÃO OTIMISTA DO CACHE LOCAL
      console.log('🔄 [OPTIMISTIC] Aplicando atualização otimista...');
      const queryKeys = [
        ['unified-crm-leads', filters],
        ['optimized-crm-leads', filters],
        ['crm-leads']
      ];
      
      const backups = queryKeys.map(key => ({
        key,
        data: queryClient.getQueryData(key)
      }));

      // Aplicar update otimista apenas se o lead existir no cache
      queryKeys.forEach(key => {
        queryClient.setQueryData<LeadWithContacts[]>(key, (oldData) => {
          if (!oldData) return oldData;
          
          const leadExists = oldData.some(lead => lead.id === leadId);
          if (!leadExists) {
            console.warn('⚠️ [OPTIMISTIC] Lead não encontrado no cache local, pulando update otimista');
            return oldData;
          }
          
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
      console.log('✅ [OPTIMISTIC] Atualização otimista aplicada');

      // 5. ATUALIZAÇÃO SIMPLES NO BANCO
      console.log('💾 [DATABASE] Iniciando atualização no banco...');
      const updateData = {
        column_id: newColumnId,
        updated_at: new Date().toISOString()
      };

      console.log('📝 [DATABASE] Dados para atualização:', updateData);

      const { data: updatedLead, error: updateError } = await supabase
        .from('crm_leads')
        .update(updateData)
        .eq('id', leadId)
        .select('id, name, column_id, updated_at')
        .single();

      console.log('📊 [DATABASE] Resultado da atualização:', {
        updatedLead,
        error: updateError ? {
          message: updateError.message,
          code: updateError.code,
          details: updateError.details,
          hint: updateError.hint
        } : null
      });

      if (updateError) {
        console.error('❌ [DATABASE] Erro na atualização:', updateError);
        
        // Rollback da atualização otimista
        console.log('🔄 [ROLLBACK] Fazendo rollback...');
        backups.forEach(({ key, data }) => {
          if (data) {
            queryClient.setQueryData(key, data);
          }
        });
        
        toast.error(`Erro ao mover lead: ${updateError.message}`, {
          description: `Lead: ${currentLead.name} | Coluna: ${column.name}`,
          duration: 8000
        });
        
        throw new Error(`Erro no banco: ${updateError.message}`);
      }

      if (!updatedLead) {
        const error = 'Nenhum lead foi atualizado - possível problema de permissão';
        console.error('❌ [DATABASE]', error);
        
        // Rollback
        backups.forEach(({ key, data }) => {
          if (data) {
            queryClient.setQueryData(key, data);
          }
        });
        
        toast.error('Nenhum lead foi atualizado', {
          description: 'Verifique suas permissões',
          duration: 5000
        });
        
        throw new Error(error);
      }

      console.log('✅ [DATABASE] Lead atualizado com sucesso:', {
        leadId: updatedLead.id,
        newColumn: updatedLead.column_id,
        columnName: column.name,
        timestamp: updatedLead.updated_at
      });

      // 6. INVALIDAR CACHE PARA SINCRONIZAR
      console.log('🔄 [CACHE] Invalidando cache...');
      setTimeout(() => {
        queryKeys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
        console.log('✅ [CACHE] Cache invalidado');
      }, 300);

      // 7. FEEDBACK DE SUCESSO
      toast.success(`Lead "${currentLead.name}" movido com sucesso!`, {
        description: `Movido para "${column.name}"`,
        duration: 3000
      });

      console.log('🎉 [SUCCESS] Operação concluída com sucesso!');
      
    } catch (error) {
      console.error(`❌ [ERROR_${operationId}] Erro na operação:`, {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : error,
        leadId,
        newColumnId,
        timestamp: new Date().toISOString()
      });
      
      // Toast com erro mais específico
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      if (errorMessage.includes('Lead não encontrado no banco')) {
        toast.error('Lead não existe no banco de dados', {
          description: `Verifique se o lead ${leadId.slice(0, 8)}... ainda existe`,
          duration: 8000
        });
      } else if (errorMessage.includes('Coluna de destino não encontrada')) {
        toast.error('Coluna de destino inválida', {
          description: `A coluna ${newColumnId.slice(0, 8)}... não foi encontrada`,
          duration: 8000
        });
      } else {
        toast.error(`Erro ao mover lead: ${errorMessage}`, {
          description: `Lead: ${leadId.slice(0, 8)}... | Coluna: ${newColumnId.slice(0, 8)}...`,
          duration: 8000
        });
      }
      
      throw error;
    } finally {
      console.groupEnd();
    }
  }, [queryClient, filters]);

  return { moveLeadToColumn };
};
