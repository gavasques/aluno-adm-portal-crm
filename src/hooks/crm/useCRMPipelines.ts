
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
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setPipelines(data || []);
    } catch (error) {
      console.error('Erro ao buscar pipelines:', error);
    }
  };

  const fetchColumns = async (pipelineId?: string) => {
    try {
      let query = supabase
        .from('crm_pipeline_columns')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (pipelineId) {
        query = query.eq('pipeline_id', pipelineId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setColumns(data || []);
    } catch (error) {
      console.error('Erro ao buscar colunas:', error);
    }
  };

  const refetch = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchPipelines(), fetchColumns()]);
    } finally {
      setLoading(false);
    }
  };

  const createPipeline = async (pipelineData: { name: string; description?: string; sort_order?: number; is_active?: boolean }) => {
    try {
      const { data, error } = await supabase
        .from('crm_pipelines')
        .insert({ 
          name: pipelineData.name,
          description: pipelineData.description,
          sort_order: pipelineData.sort_order || pipelines.length,
          is_active: pipelineData.is_active !== undefined ? pipelineData.is_active : true
        })
        .select()
        .single();

      if (error) throw error;

      setPipelines(prev => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
      toast.success('Pipeline criado com sucesso!');
      return data;
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

      setPipelines(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
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

      setPipelines(prev => prev.filter(p => p.id !== id));
      toast.success('Pipeline removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover pipeline:', error);
      toast.error('Erro ao remover pipeline');
      throw error;
    }
  };

  const createColumn = async (columnData: { pipeline_id: string; name: string; color: string; sort_order?: number; is_active?: boolean }) => {
    try {
      const { data, error } = await supabase
        .from('crm_pipeline_columns')
        .insert({ 
          pipeline_id: columnData.pipeline_id, 
          name: columnData.name, 
          color: columnData.color, 
          sort_order: columnData.sort_order || 0,
          is_active: columnData.is_active !== undefined ? columnData.is_active : true 
        })
        .select()
        .single();

      if (error) throw error;

      setColumns(prev => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
      toast.success('Coluna criada com sucesso!');
      return data;
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

      setColumns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
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

      setColumns(prev => prev.filter(c => c.id !== id));
      toast.success('Coluna removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover coluna:', error);
      toast.error('Erro ao remover coluna');
      throw error;
    }
  };

  useEffect(() => {
    refetch();
  }, []);

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
