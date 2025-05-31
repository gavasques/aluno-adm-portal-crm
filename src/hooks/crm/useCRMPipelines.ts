
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
      await fetchAllColumns();

    } catch (error) {
      console.error('❌ Erro ao buscar pipelines:', error);
      toast.error('Erro ao carregar pipelines');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchAllColumns = useCallback(async () => {
    try {
      const { data: columnsData, error: columnsError } = await supabase
        .from('crm_pipeline_columns')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (columnsError) throw columnsError;

      console.log('📊 Colunas encontradas:', columnsData?.length || 0);
      setColumns(columnsData || []);
    } catch (error) {
      console.error('❌ Erro ao buscar colunas:', error);
      toast.error('Erro ao carregar colunas');
    }
  }, [toast]);

  const fetchColumns = useCallback(async (pipelineId: string) => {
    try {
      const { data: columnsData, error: columnsError } = await supabase
        .from('crm_pipeline_columns')
        .select('*')
        .eq('pipeline_id', pipelineId)
        .eq('is_active', true)
        .order('sort_order');

      if (columnsError) throw columnsError;

      setColumns(columnsData || []);
      return columnsData || [];
    } catch (error) {
      console.error('❌ Erro ao buscar colunas do pipeline:', error);
      toast.error('Erro ao carregar colunas do pipeline');
      return [];
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

  const createPipeline = useCallback(async (data: Omit<CRMPipeline, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: newPipeline, error } = await supabase
        .from('crm_pipelines')
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      setPipelines(prev => [...prev, newPipeline]);
      return newPipeline;
    } catch (error) {
      console.error('❌ Erro ao criar pipeline:', error);
      throw error;
    }
  }, []);

  const updatePipeline = useCallback(async (id: string, data: Partial<CRMPipeline>) => {
    try {
      const { data: updatedPipeline, error } = await supabase
        .from('crm_pipelines')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPipelines(prev => prev.map(p => p.id === id ? updatedPipeline : p));
      return updatedPipeline;
    } catch (error) {
      console.error('❌ Erro ao atualizar pipeline:', error);
      throw error;
    }
  }, []);

  const deletePipeline = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('crm_pipelines')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      setPipelines(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('❌ Erro ao deletar pipeline:', error);
      throw error;
    }
  }, []);

  const createColumn = useCallback(async (data: Omit<CRMPipelineColumn, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: newColumn, error } = await supabase
        .from('crm_pipeline_columns')
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      setColumns(prev => [...prev, newColumn]);
      return newColumn;
    } catch (error) {
      console.error('❌ Erro ao criar coluna:', error);
      throw error;
    }
  }, []);

  const updateColumn = useCallback(async (id: string, data: Partial<CRMPipelineColumn>) => {
    try {
      const { data: updatedColumn, error } = await supabase
        .from('crm_pipeline_columns')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setColumns(prev => prev.map(c => c.id === id ? updatedColumn : c));
      return updatedColumn;
    } catch (error) {
      console.error('❌ Erro ao atualizar coluna:', error);
      throw error;
    }
  }, []);

  const deleteColumn = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('crm_pipeline_columns')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      setColumns(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('❌ Erro ao deletar coluna:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchPipelines();
  }, [fetchPipelines]);

  return {
    pipelines,
    columns,
    loading,
    fetchPipelines,
    fetchColumns,
    fetchAllColumns,
    createPipeline,
    updatePipeline,
    deletePipeline,
    createColumn,
    updateColumn,
    deleteColumn,
    refetch: fetchPipelines
  };
};
