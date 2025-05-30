
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMPipeline, CRMPipelineColumn } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMPipelines = () => {
  const [pipelines, setPipelines] = useState<CRMPipeline[]>([]);
  const [columns, setColumns] = useState<CRMPipelineColumn[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPipelines = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_pipelines')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setPipelines(data || []);
    } catch (error) {
      console.error('Erro ao buscar pipelines:', error);
      toast.error('Erro ao carregar pipelines');
    }
  };

  const fetchColumns = async (pipelineId?: string) => {
    try {
      let query = supabase
        .from('crm_pipeline_columns')
        .select('*')
        .order('sort_order');

      if (pipelineId) {
        query = query.eq('pipeline_id', pipelineId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setColumns(data || []);
    } catch (error) {
      console.error('Erro ao buscar colunas:', error);
      toast.error('Erro ao carregar colunas');
    }
  };

  const updateColumnOrder = async (columnId: string, newSortOrder: number) => {
    try {
      const { error } = await supabase
        .from('crm_pipeline_columns')
        .update({ sort_order: newSortOrder })
        .eq('id', columnId);

      if (error) throw error;
      
      // Recarregar colunas
      const activePipeline = pipelines[0]?.id;
      if (activePipeline) {
        await fetchColumns(activePipeline);
      }
    } catch (error) {
      console.error('Erro ao atualizar ordem da coluna:', error);
      toast.error('Erro ao reordenar coluna');
    }
  };

  const createColumn = async (pipelineId: string, name: string, color: string) => {
    try {
      const maxOrder = Math.max(...columns.filter(c => c.pipeline_id === pipelineId).map(c => c.sort_order), -1);
      
      const { error } = await supabase
        .from('crm_pipeline_columns')
        .insert({
          pipeline_id: pipelineId,
          name,
          color,
          sort_order: maxOrder + 1
        });

      if (error) throw error;
      
      await fetchColumns(pipelineId);
      toast.success('Coluna criada com sucesso');
    } catch (error) {
      console.error('Erro ao criar coluna:', error);
      toast.error('Erro ao criar coluna');
    }
  };

  const updateColumn = async (columnId: string, name: string, color: string) => {
    try {
      const { error } = await supabase
        .from('crm_pipeline_columns')
        .update({ name, color })
        .eq('id', columnId);

      if (error) throw error;
      
      // Atualizar estado local
      setColumns(prev => prev.map(col => 
        col.id === columnId ? { ...col, name, color } : col
      ));
      
      toast.success('Coluna atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar coluna:', error);
      toast.error('Erro ao atualizar coluna');
    }
  };

  const deleteColumn = async (columnId: string) => {
    try {
      const { error } = await supabase
        .from('crm_pipeline_columns')
        .delete()
        .eq('id', columnId);

      if (error) throw error;
      
      setColumns(prev => prev.filter(col => col.id !== columnId));
      toast.success('Coluna removida com sucesso');
    } catch (error) {
      console.error('Erro ao remover coluna:', error);
      toast.error('Erro ao remover coluna');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPipelines();
      await fetchColumns();
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    pipelines,
    columns,
    loading,
    fetchPipelines,
    fetchColumns,
    updateColumnOrder,
    createColumn,
    updateColumn,
    deleteColumn
  };
};
