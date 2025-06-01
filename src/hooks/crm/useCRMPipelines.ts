
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMPipeline, CRMPipelineColumn } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMPipelines = () => {
  const queryClient = useQueryClient();

  // Query otimizada para pipelines
  const { data: pipelines = [], isLoading: pipelinesLoading } = useQuery({
    queryKey: ['crm-pipelines'],
    queryFn: async () => {
      console.log('🔍 Fetching CRM pipelines...');
      const { data, error } = await supabase
        .from('crm_pipelines')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      console.log(`✅ Loaded ${data?.length || 0} pipelines`);
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutos - pipelines são muito estáticos
    refetchOnWindowFocus: false,
  });

  // Query otimizada para colunas
  const { data: columns = [], isLoading: columnsLoading } = useQuery({
    queryKey: ['crm-pipeline-columns'],
    queryFn: async () => {
      console.log('🔍 Fetching CRM pipeline columns...');
      const { data, error } = await supabase
        .from('crm_pipeline_columns')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      console.log(`✅ Loaded ${data?.length || 0} columns`);
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutos - colunas são muito estáticas
    refetchOnWindowFocus: false,
  });

  const loading = pipelinesLoading || columnsLoading;

  const refetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] }),
      queryClient.invalidateQueries({ queryKey: ['crm-pipeline-columns'] })
    ]);
  };

  const fetchPipelines = async () => {
    await queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
  };

  const fetchColumns = async (pipelineId?: string) => {
    await queryClient.invalidateQueries({ queryKey: ['crm-pipeline-columns'] });
  };

  const createPipeline = async (data: Omit<CRMPipeline, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: newPipeline, error } = await supabase
        .from('crm_pipelines')
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      // Invalidar apenas os pipelines
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      toast.success('Pipeline criado com sucesso!');
      return newPipeline;
    } catch (error) {
      console.error('Erro ao criar pipeline:', error);
      toast.error('Erro ao criar pipeline');
      throw error;
    }
  };

  const updatePipeline = async (id: string, updates: Partial<CRMPipeline>) => {
    try {
      const { error } = await supabase
        .from('crm_pipelines')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      toast.success('Pipeline atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar pipeline:', error);
      toast.error('Erro ao atualizar pipeline');
      throw error;
    }
  };

  const deletePipeline = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crm_pipelines')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      toast.success('Pipeline removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover pipeline:', error);
      toast.error('Erro ao remover pipeline');
      throw error;
    }
  };

  const createColumn = async (data: Omit<CRMPipelineColumn, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: newColumn, error } = await supabase
        .from('crm_pipeline_columns')
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['crm-pipeline-columns'] });
      toast.success('Coluna criada com sucesso!');
      return newColumn;
    } catch (error) {
      console.error('Erro ao criar coluna:', error);
      toast.error('Erro ao criar coluna');
      throw error;
    }
  };

  const updateColumn = async (id: string, updates: Partial<CRMPipelineColumn>) => {
    try {
      const { error } = await supabase
        .from('crm_pipeline_columns')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['crm-pipeline-columns'] });
      toast.success('Coluna atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar coluna:', error);
      toast.error('Erro ao atualizar coluna');
      throw error;
    }
  };

  const deleteColumn = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crm_pipeline_columns')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['crm-pipeline-columns'] });
      toast.success('Coluna removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover coluna:', error);
      toast.error('Erro ao remover coluna');
      throw error;
    }
  };

  return {
    pipelines,
    columns,
    loading,
    refetch,
    fetchPipelines,
    fetchColumns,
    createPipeline,
    updatePipeline,
    deletePipeline,
    createColumn,
    updateColumn,
    deleteColumn
  };
};
