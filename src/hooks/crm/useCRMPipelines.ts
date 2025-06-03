
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMPipeline, CRMPipelineColumn } from '@/types/crm.types';
import { toast } from 'sonner';

export interface PipelineWithColumns extends CRMPipeline {
  columns: CRMPipelineColumn[];
}

export const useCRMPipelines = () => {
  const queryClient = useQueryClient();

  const { data: pipelines = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['crm-pipelines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_pipelines')
        .select(`
          *,
          columns:crm_pipeline_columns(*)
        `)
        .order('sort_order');

      if (error) throw error;

      return data.map(pipeline => ({
        ...pipeline,
        columns: (pipeline.columns || []).sort((a, b) => a.sort_order - b.sort_order)
      })) as PipelineWithColumns[];
    }
  });

  const { data: columns = [] } = useQuery({
    queryKey: ['crm-pipeline-columns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_pipeline_columns')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      return data as CRMPipelineColumn[];
    }
  });

  const createPipelineMutation = useMutation({
    mutationFn: async (pipelineData: { name: string; description?: string; sort_order?: number; is_active?: boolean }) => {
      const { data, error } = await supabase
        .from('crm_pipelines')
        .insert(pipelineData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      toast.success('Pipeline criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar pipeline:', error);
      toast.error('Erro ao criar pipeline');
    }
  });

  const updatePipelineMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<CRMPipeline>) => {
      const { error } = await supabase
        .from('crm_pipelines')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      toast.success('Pipeline atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar pipeline:', error);
      toast.error('Erro ao atualizar pipeline');
    }
  });

  const deletePipelineMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crm_pipelines')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      toast.success('Pipeline excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir pipeline:', error);
      toast.error('Erro ao excluir pipeline');
    }
  });

  // Column mutations
  const createColumnMutation = useMutation({
    mutationFn: async (columnData: Omit<CRMPipelineColumn, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('crm_pipeline_columns')
        .insert(columnData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      queryClient.invalidateQueries({ queryKey: ['crm-pipeline-columns'] });
      toast.success('Coluna criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar coluna:', error);
      toast.error('Erro ao criar coluna');
    }
  });

  const updateColumnMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<CRMPipelineColumn>) => {
      const { error } = await supabase
        .from('crm_pipeline_columns')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      queryClient.invalidateQueries({ queryKey: ['crm-pipeline-columns'] });
      toast.success('Coluna atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar coluna:', error);
      toast.error('Erro ao atualizar coluna');
    }
  });

  const deleteColumnMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crm_pipeline_columns')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      queryClient.invalidateQueries({ queryKey: ['crm-pipeline-columns'] });
      toast.success('Coluna desativada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao desativar coluna:', error);
      toast.error('Erro ao desativar coluna');
    }
  });

  // Método para buscar pipelines manualmente
  const fetchPipelines = () => {
    refetch();
  };

  // Método para buscar colunas de um pipeline específico
  const fetchColumns = async (pipelineId: string) => {
    queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
    queryClient.invalidateQueries({ queryKey: ['crm-pipeline-columns'] });
  };

  const createPipeline = (pipelineData: { name: string; description?: string; sort_order?: number; is_active?: boolean }) => {
    return createPipelineMutation.mutateAsync(pipelineData);
  };

  const updatePipeline = (id: string, updateData: Partial<CRMPipeline>) => {
    return updatePipelineMutation.mutateAsync({ id, ...updateData });
  };

  const deletePipeline = (id: string) => {
    return deletePipelineMutation.mutateAsync(id);
  };

  const createColumn = (columnData: Omit<CRMPipelineColumn, 'id' | 'created_at' | 'updated_at'>) => {
    return createColumnMutation.mutateAsync(columnData);
  };

  const updateColumn = (id: string, updateData: Partial<CRMPipelineColumn>) => {
    return updateColumnMutation.mutateAsync({ id, ...updateData });
  };

  const deleteColumn = (id: string) => {
    return deleteColumnMutation.mutateAsync(id);
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
