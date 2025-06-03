
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
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('crm_pipelines')
        .insert({ name, description })
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
    mutationFn: async ({ id, name, description }: { id: string; name: string; description?: string }) => {
      const { error } = await supabase
        .from('crm_pipelines')
        .update({ name, description })
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

  // Método para buscar pipelines manualmente
  const fetchPipelines = () => {
    refetch();
  };

  const createPipeline = (name: string, description?: string) => {
    return createPipelineMutation.mutateAsync({ name, description });
  };

  const updatePipeline = (id: string, name: string, description?: string) => {
    return updatePipelineMutation.mutateAsync({ id, name, description });
  };

  const deletePipeline = (id: string) => {
    return deletePipelineMutation.mutateAsync(id);
  };

  return {
    pipelines,
    columns,
    loading,
    refetch,
    fetchPipelines,
    createPipeline,
    updatePipeline,
    deletePipeline
  };
};
