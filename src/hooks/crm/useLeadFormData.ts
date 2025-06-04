
import { useCRMPipelines } from './useCRMPipelines';
import { useCRMUsers } from './useCRMUsers';
import { debugLogger } from '@/utils/debug-logger';

export const useLeadFormData = (pipelineId: string) => {
  const { pipelines, columns, loading: pipelinesLoading } = useCRMPipelines();
  const { users, loading: usersLoading } = useCRMUsers();

  // Filtrar colunas do pipeline específico
  const pipelineColumns = columns.filter(col => 
    col.pipeline_id === pipelineId && col.is_active
  ).sort((a, b) => a.sort_order - b.sort_order);

  // Converter users para o formato esperado
  const responsibles = users.map(user => ({
    id: user.id,
    name: user.name || user.email || 'Usuário sem nome'
  }));

  const loading = pipelinesLoading || usersLoading;

  debugLogger.info('📊 [LEAD_FORM_DATA] Dados carregados', {
    component: 'useLeadFormData',
    pipelineId,
    loading,
    pipelinesCount: pipelines.length,
    pipelineColumnsCount: pipelineColumns.length,
    responsiblesCount: responsibles.length,
    pipelinesLoading,
    usersLoading
  });

  // Validação adicional
  if (!loading && pipelineColumns.length === 0) {
    debugLogger.warn('⚠️ [LEAD_FORM_DATA] Nenhuma coluna encontrada para o pipeline', {
      component: 'useLeadFormData',
      pipelineId,
      totalColumns: columns.length,
      allColumns: columns.map(c => ({ id: c.id, pipeline_id: c.pipeline_id, name: c.name }))
    });
  }

  return {
    pipelines,
    pipelineColumns,
    responsibles,
    loading,
    // Dados de depuração
    hasValidPipeline: pipelineColumns.length > 0,
    hasResponsibles: responsibles.length > 0
  };
};
