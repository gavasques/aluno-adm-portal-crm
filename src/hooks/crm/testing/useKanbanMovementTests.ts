import React from 'react';
import { useUnifiedCRMData } from '../useUnifiedCRMData';
import { useUltraSimplifiedLeadMovement } from '../useUltraSimplifiedLeadMovement';
import { useCRMPipelines } from '../useCRMPipelines';
import { supabase } from '@/integrations/supabase/client';
import { debugLogger } from '@/utils/debug-logger';

interface TestResult {
  success: boolean;
  message: string;
  duration?: number;
  details?: any;
}

interface KanbanTestScenario {
  name: string;
  description: string;
  test: () => Promise<TestResult>;
}

export const useKanbanMovementTests = (pipelineId: string) => {
  const { columns } = useCRMPipelines();
  const { leadsWithContacts, refetch } = useUnifiedCRMData({
    pipeline_id: pipelineId
  });

  const getColumnById = (columnId: string) => {
    return columns.find(col => col.id === columnId);
  };

  const getAllLeadsInColumn = (columnId: string) => {
    return leadsWithContacts.filter(lead => lead.column_id === columnId);
  };

  const testLeadMovement = async (leadId: string, initialColumnId: string, targetColumnId: string): Promise<TestResult> => {
    const start = Date.now();
    try {
      const initialLeads = getAllLeadsInColumn(initialColumnId).length;
      const targetLeadsBefore = getAllLeadsInColumn(targetColumnId).length;

      debugLogger.info(`🧪 Teste: Movendo lead ${leadId} de ${initialColumnId} para ${targetColumnId}`);
      await moveLeadToColumn(leadId, targetColumnId);
      await refetch(); // Garante que os dados estão atualizados

      const initialLeadsAfter = getAllLeadsInColumn(initialColumnId).length;
      const targetLeadsAfter = getAllLeadsInColumn(targetColumnId).length;

      if (initialLeadsAfter !== initialLeads - 1 || targetLeadsAfter !== targetLeadsBefore + 1) {
        return {
          success: false,
          message: `Falha ao mover lead ${leadId}. Contagem de leads nas colunas não corresponde.`,
          details: {
            initialColumn: { before: initialLeads, after: initialLeadsAfter },
            targetColumn: { before: targetLeadsBefore, after: targetLeadsAfter }
          }
        };
      }

      return {
        success: true,
        message: `Lead ${leadId} movido com sucesso de ${initialColumnId} para ${targetColumnId}.`,
        duration: Date.now() - start,
        details: {
          initialColumn: { before: initialLeads, after: initialLeadsAfter },
          targetColumn: { before: targetLeadsBefore, after: targetLeadsAfter }
        }
      };
    } catch (error: any) {
      debugLogger.error(`❌ Erro ao mover lead ${leadId}:`, error);
      return {
        success: false,
        message: `Erro ao mover lead ${leadId}: ${error.message || 'Erro desconhecido'}`,
        duration: Date.now() - start,
        details: error
      };
    }
  };

  const testColumnIntegrity = async (columnId: string): Promise<TestResult> => {
    const start = Date.now();
    try {
      const leadsInColumn = getAllLeadsInColumn(columnId);
      for (const lead of leadsInColumn) {
        if (lead.column_id !== columnId) {
          return {
            success: false,
            message: `Inconsistência detectada: Lead ${lead.id} está na coluna errada.`,
            duration: Date.now() - start,
            details: { leadId: lead.id, expectedColumnId: columnId, actualColumnId: lead.column_id }
          };
        }
      }
      return {
        success: true,
        message: `Integridade da coluna ${columnId} verificada com sucesso.`,
        duration: Date.now() - start,
        details: { leadCount: leadsInColumn.length }
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Erro ao verificar integridade da coluna ${columnId}: ${error.message || 'Erro desconhecido'}`,
        duration: Date.now() - start,
        details: error
      };
    }
  };

  const kanbanTestScenarios: KanbanTestScenario[] = [
    {
      name: 'Teste de Movimentação de Lead',
      description: 'Verifica se um lead pode ser movido de uma coluna para outra e se a contagem de leads nas colunas é atualizada corretamente.',
      test: async () => {
        if (!columns || columns.length < 2 || !leadsWithContacts || leadsWithContacts.length === 0) {
          return {
            success: false,
            message: 'Pré-condição não atendida: É necessário ter pelo menos duas colunas e um lead para executar este teste.',
            details: {
              columnsAvailable: !!columns && columns.length > 1,
              leadsAvailable: !!leadsWithContacts && leadsWithContacts.length > 0
            }
          };
        }

        const initialColumn = columns[0];
        const targetColumn = columns[1];
        const leadToMove = leadsWithContacts.find(lead => lead.column_id === initialColumn.id);

        if (!leadToMove) {
          return {
            success: false,
            message: `Não foi encontrado um lead na coluna inicial ${initialColumn.id} para mover.`,
            details: { initialColumnId: initialColumn.id }
          };
        }

        return testLeadMovement(leadToMove.id, initialColumn.id, targetColumn.id);
      }
    },
    {
      name: 'Teste de Integridade da Coluna',
      description: 'Verifica se todos os leads em uma coluna realmente pertencem a essa coluna.',
      test: async () => {
        if (!columns || columns.length === 0 || !leadsWithContacts || leadsWithContacts.length === 0) {
          return {
            success: false,
            message: 'Pré-condição não atendida: É necessário ter pelo menos uma coluna e um lead para executar este teste.',
            details: {
              columnsAvailable: !!columns && columns.length > 0,
              leadsAvailable: !!leadsWithContacts && leadsWithContacts.length > 0
            }
          };
        }

        const columnToCheck = columns[0];
        return testColumnIntegrity(columnToCheck.id);
      }
    }
  ];

  const { moveLeadToColumn } = useUltraSimplifiedLeadMovement({
    filters: {
      pipeline_id: pipelineId,
      responsible_id: '',
      tag_ids: [],
      search: '',
      contact_filter: ''
    }
  });

  return {
    kanbanTestScenarios,
    getColumnById,
    getAllLeadsInColumn
  };
};
