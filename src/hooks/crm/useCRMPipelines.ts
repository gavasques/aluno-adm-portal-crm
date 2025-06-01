
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCRMPipelines = () => {
  const queryClient = useQueryClient();

  const { data: pipelines = [], isLoading, refetch } = useQuery({
    queryKey: ['crm-pipelines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_pipelines')
        .select(`
          *,
          columns:crm_pipeline_columns(*)
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      return (data || []).map(pipeline => ({
        ...pipeline,
        columns: (pipeline.columns || []).sort((a: any, b: any) => a.sort_order - b.sort_order)
      }));
    }
  });

  // Extrair todas as colunas de todos os pipelines
  const columns = pipelines.flatMap(pipeline => 
    (pipeline.columns || []).map(column => ({
      ...column,
      pipeline_id: pipeline.id
    }))
  );

  // Mutations para pipelines
  const createPipelineMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('crm_pipelines')
        .insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      toast.success('Pipeline criado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao criar pipeline');
    }
  });

  const updatePipelineMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('crm_pipelines')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      toast.success('Pipeline atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar pipeline');
    }
  });

  const deletePipelineMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crm_pipelines')
        .update({ is_active: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      toast.success('Pipeline excluído com sucesso');
    },
    onError: () => {
      toast.error('Erro ao excluir pipeline');
    }
  });

  // Mutations para colunas
  const createColumnMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('crm_pipeline_columns')
        .insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      toast.success('Coluna criada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao criar coluna');
    }
  });

  const updateColumnMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('crm_pipeline_columns')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      toast.success('Coluna atualizada com sucesso');
    },
    onError: () => {
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
      toast.success('Coluna excluída com sucesso');
    },
    onError: () => {
      toast.error('Erro ao excluir coluna');
    }
  });

  // Funções wrapper para compatibilidade com os componentes existentes
  const updatePipeline = (id: string, data: any) => {
    updatePipelineMutation.mutate({ id, data });
  };

  const updateColumn = (id: string, data: any) => {
    updateColumnMutation.mutate({ id, data });
  };

  const fetchColumns = async (pipelineId?: string) => {
    // Para compatibilidade, apenas faz refetch
    await refetch();
  };

  const fetchPipelines = async () => {
    await refetch();
  };

  return {
    pipelines,
    columns,
    isLoading,
    loading: isLoading, // Alias para compatibilidade
    refetch,
    fetchPipelines,
    fetchColumns,
    createPipeline: createPipelineMutation.mutate,
    updatePipeline,
    deletePipeline: deletePipelineMutation.mutate,
    createColumn: createColumnMutation.mutate,
    updateColumn,
    deleteColumn: deleteColumnMutation.mutate,
  };
};
