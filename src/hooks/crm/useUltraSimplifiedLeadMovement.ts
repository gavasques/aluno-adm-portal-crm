
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters } from '@/types/crm.types';
import { toast } from 'sonner';
import { debugLogger } from '@/utils/debug-logger';
import { runCORSDiagnostics } from '@/utils/cors-diagnostics';

export const useUltraSimplifiedLeadMovement = (filters: CRMFilters) => {
  const queryClient = useQueryClient();

  const moveLeadToColumn = useCallback(async (leadId: string, newColumnId: string) => {
    const operationId = `ultra_simple_move_${leadId}_${Date.now()}`;
    
    debugLogger.info(`🚀 [ULTRA_SIMPLE_MOVE_${operationId}] INÍCIO`, {
      component: 'useUltraSimplifiedLeadMovement',
      operation: 'moveLeadToColumn',
      leadId,
      newColumnId,
      timestamp: new Date().toISOString()
    });
    
    try {
      // 1. VALIDAÇÕES BÁSICAS
      if (!leadId || !newColumnId) {
        const error = 'IDs de lead ou coluna inválidos';
        debugLogger.error(`❌ [VALIDAÇÃO] ${error}`, { 
          component: 'useUltraSimplifiedLeadMovement',
          leadId, 
          newColumnId 
        });
        throw new Error(error);
      }

      // 2. VERIFICAR SE O LEAD EXISTE (query ultra simples)
      debugLogger.info('🔍 [LEAD_CHECK] Verificando lead...', {
        component: 'useUltraSimplifiedLeadMovement',
        operation: 'checkLead'
      });
      
      const { data: currentLead, error: leadError } = await supabase
        .from('crm_leads')
        .select('id, name, column_id')
        .eq('id', leadId)
        .single();

      if (leadError || !currentLead) {
        // Verificar se é erro de CORS
        if (leadError?.message.includes('CORS') || 
            leadError?.message.includes('cross-origin') ||
            leadError?.message.includes('Access-Control-Allow-Origin')) {
          
          debugLogger.error('❌ [CORS_ERROR] Erro de CORS detectado', {
            component: 'useUltraSimplifiedLeadMovement',
            operation: 'checkLead',
            error: leadError
          });
          
          // Executar diagnóstico de CORS
          const corsInfo = await runCORSDiagnostics();
          
          toast.error('Erro de CORS detectado', {
            description: 'Verificando diagnóstico no console...',
            duration: 8000
          });
          
          throw new Error('Erro de CORS: Verifique as configurações do Supabase');
        }
        
        const error = `Lead não encontrado: ${leadError?.message || 'Lead inexistente'}`;
        debugLogger.error(`❌ [LEAD_CHECK] ${error}`, { 
          component: 'useUltraSimplifiedLeadMovement',
          leadId, 
          leadError 
        });
        toast.error('Lead não encontrado');
        throw new Error(error);
      }

      debugLogger.info('✅ [LEAD_CHECK] Lead encontrado:', {
        component: 'useUltraSimplifiedLeadMovement',
        id: currentLead.id,
        name: currentLead.name,
        currentColumn: currentLead.column_id
      });

      // Verificar se já está na coluna correta
      if (currentLead.column_id === newColumnId) {
        debugLogger.info('ℹ️ [LEAD_CHECK] Lead já está na coluna correta', {
          component: 'useUltraSimplifiedLeadMovement'
        });
        toast.info('Lead já está na coluna de destino');
        return;
      }

      // 3. VERIFICAR SE A COLUNA EXISTE (query ultra simples)
      debugLogger.info('🔍 [COLUMN_CHECK] Verificando coluna...', {
        component: 'useUltraSimplifiedLeadMovement',
        operation: 'checkColumn'
      });
      
      const { data: column, error: columnError } = await supabase
        .from('crm_pipeline_columns')
        .select('id, name')
        .eq('id', newColumnId)
        .eq('is_active', true)
        .single();

      if (columnError || !column) {
        const error = `Coluna inválida: ${columnError?.message || 'Coluna não encontrada'}`;
        debugLogger.error(`❌ [COLUMN_CHECK] ${error}`, { 
          component: 'useUltraSimplifiedLeadMovement',
          newColumnId, 
          columnError 
        });
        toast.error('Coluna de destino não encontrada');
        throw new Error(error);
      }

      debugLogger.info('✅ [COLUMN_CHECK] Coluna válida:', {
        component: 'useUltraSimplifiedLeadMovement',
        id: column.id,
        name: column.name
      });

      // 4. REALIZAR A ATUALIZAÇÃO ULTRA SIMPLES
      debugLogger.info('💾 [UPDATE] Atualizando lead...', {
        component: 'useUltraSimplifiedLeadMovement',
        operation: 'updateLead'
      });
      
      const updateData = {
        column_id: newColumnId,
        updated_at: new Date().toISOString()
      };

      debugLogger.info('📋 [UPDATE] Dados para atualização:', {
        component: 'useUltraSimplifiedLeadMovement',
        updateData
      });

      const { data: updatedLead, error: updateError } = await supabase
        .from('crm_leads')
        .update(updateData)
        .eq('id', leadId)
        .select('id, name, column_id')
        .single();

      if (updateError) {
        // Verificar se é erro de CORS
        if (updateError.message.includes('CORS') || 
            updateError.message.includes('cross-origin')) {
          
          debugLogger.error('❌ [CORS_ERROR] Erro de CORS na atualização', {
            component: 'useUltraSimplifiedLeadMovement',
            operation: 'updateLead',
            error: updateError
          });
          
          toast.error('Erro de CORS na atualização', {
            description: 'Verifique as configurações do Supabase',
            duration: 8000
          });
        }
        
        debugLogger.error(`❌ [UPDATE] Erro na atualização:`, {
          component: 'useUltraSimplifiedLeadMovement',
          error: updateError,
          leadId,
          newColumnId,
          updateData
        });
        toast.error(`Erro ao mover lead: ${updateError.message}`);
        throw new Error(`Erro no banco: ${updateError.message}`);
      }

      if (!updatedLead) {
        const error = 'Nenhum lead foi atualizado';
        debugLogger.error(`❌ [UPDATE] ${error}`, { 
          component: 'useUltraSimplifiedLeadMovement',
          leadId, 
          newColumnId 
        });
        toast.error('Nenhum lead foi atualizado');
        throw new Error(error);
      }

      debugLogger.info('✅ [UPDATE] Lead atualizado com sucesso:', {
        component: 'useUltraSimplifiedLeadMovement',
        id: updatedLead.id,
        name: updatedLead.name,
        newColumn: updatedLead.column_id,
        previousColumn: currentLead.column_id
      });

      // 5. INVALIDAR CACHE ESPECÍFICO
      debugLogger.info('🔄 [CACHE] Invalidando queries específicas...', {
        component: 'useUltraSimplifiedLeadMovement',
        operation: 'invalidateCache'
      });
      
      // Invalidar apenas as queries necessárias
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['unified-crm-leads'] }),
        queryClient.invalidateQueries({ queryKey: ['crm-leads'] })
      ]);

      // 6. SUCESSO
      toast.success(`Lead "${currentLead.name}" movido com sucesso!`, {
        description: `Movido para "${column.name}"`,
        duration: 3000
      });

      debugLogger.info(`🎉 [SUCCESS_${operationId}] Operação concluída com sucesso!`, {
        component: 'useUltraSimplifiedLeadMovement',
        leadId,
        leadName: currentLead.name,
        fromColumn: currentLead.column_id,
        toColumn: newColumnId,
        columnName: column.name
      });
      
    } catch (error) {
      debugLogger.error(`❌ [ERROR_${operationId}] Erro crítico:`, {
        component: 'useUltraSimplifiedLeadMovement',
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : error,
        leadId,
        newColumnId
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast.error(`Erro ao mover lead: ${errorMessage}`, {
        description: `Lead: ${leadId.slice(0, 8)}... | Operação: ${operationId}`,
        duration: 8000
      });
      
      throw error;
    }
  }, [queryClient, filters]);

  return { moveLeadToColumn };
};
