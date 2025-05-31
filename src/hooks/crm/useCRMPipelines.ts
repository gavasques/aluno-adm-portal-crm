
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMPipeline, CRMPipelineColumn } from '@/types/crm.types';
import { useToastManager } from '@/hooks/useToastManager';

export const useCRMPipelines = () => {
  const [pipelines, setPipelines] = useState<CRMPipeline[]>([]);
  const [columns, setColumns] = useState<CRMPipelineColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToastManager();

  const fetchPipelines = useCallback(async () => {
    try {
      console.log('📊 Buscando pipelines...');
      
      const { data: pipelinesData, error: pipelinesError } = await supabase
        .from('crm_pipelines')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (pipelinesError) throw pipelinesError;

      console.log('📊 Pipelines encontrados:', pipelinesData?.length || 0);
      setPipelines(pipelinesData || []);

      // Se não há pipelines, criar um pipeline padrão
      if (!pipelinesData || pipelinesData.length === 0) {
        console.log('📊 Criando pipeline padrão...');
        await createDefaultPipeline();
        return;
      }

      // Buscar colunas
      const { data: columnsData, error: columnsError } = await supabase
        .from('crm_pipeline_columns')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (columnsError) throw columnsError;

      console.log('📊 Colunas encontradas:', columnsData?.length || 0);
      setColumns(columnsData || []);

    } catch (error) {
      console.error('❌ Erro ao buscar pipelines:', error);
      toast.error('Erro ao carregar pipelines');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createDefaultPipeline = async () => {
    try {
      // Criar pipeline padrão
      const { data: pipelineData, error: pipelineError } = await supabase
        .from('crm_pipelines')
        .insert({
          name: 'Pipeline Principal',
          description: 'Pipeline principal do CRM',
          sort_order: 0,
          is_active: true
        })
        .select()
        .single();

      if (pipelineError) throw pipelineError;

      console.log('📊 Pipeline padrão criado:', pipelineData);

      // Criar colunas padrão
      const defaultColumns = [
        { name: 'Lead In', color: '#3b82f6', sort_order: 0 },
        { name: 'Contato', color: '#8b5cf6', sort_order: 1 },
        { name: 'Proposta', color: '#f59e0b', sort_order: 2 },
        { name: 'Negociação', color: '#10b981', sort_order: 3 },
        { name: 'Fechado', color: '#6b7280', sort_order: 4 }
      ];

      const { data: columnsData, error: columnsError } = await supabase
        .from('crm_pipeline_columns')
        .insert(
          defaultColumns.map(col => ({
            ...col,
            pipeline_id: pipelineData.id,
            is_active: true
          }))
        )
        .select();

      if (columnsError) throw columnsError;

      console.log('📊 Colunas padrão criadas:', columnsData?.length);

      // Atualizar estado
      setPipelines([pipelineData]);
      setColumns(columnsData || []);
      
      toast.success('Pipeline padrão criado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao criar pipeline padrão:', error);
      toast.error('Erro ao criar pipeline padrão');
    }
  };

  useEffect(() => {
    fetchPipelines();
  }, [fetchPipelines]);

  return {
    pipelines,
    columns,
    loading,
    fetchPipelines,
    refetch: fetchPipelines
  };
};
