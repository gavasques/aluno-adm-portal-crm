
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
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar pipelines:', error);
      toast.error('Erro ao carregar pipelines');
      return [];
    }
  };

  const fetchColumns = async (pipelineId?: string) => {
    try {
      let query = supabase
        .from('crm_pipeline_columns')
        .select('*')
        .eq('is_active', true);

      if (pipelineId) {
        query = query.eq('pipeline_id', pipelineId);
      }

      const { data, error } = await query.order('sort_order');

      if (error) throw error;
      setColumns(data || []);
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar colunas:', error);
      toast.error('Erro ao carregar colunas');
      return [];
    }
  };

  const createPipeline = async (pipeline: Omit<CRMPipeline, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('crm_pipelines')
        .insert(pipeline)
        .select()
        .single();

      if (error) throw error;
      
      await fetchPipelines();
      toast.success('Pipeline criado com sucesso');
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
      
      await fetchPipelines();
      toast.success('Pipeline atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar pipeline:', error);
      toast.error('Erro ao atualizar pipeline');
      throw error;
    }
  };

  const deletePipeline = async (id: string) => {
    try {
      // Primeiro, verificar se há leads associados
      const { data: leads, error: leadsError } = await supabase
        .from('crm_leads')
        .select('id')
        .eq('pipeline_id', id)
        .limit(1);

      if (leadsError) throw leadsError;

      if (leads && leads.length > 0) {
        toast.error('Não é possível excluir um pipeline que contém leads. Mova os leads primeiro.');
        return;
      }

      // Desativar colunas do pipeline
      const { error: columnsError } = await supabase
        .from('crm_pipeline_columns')
        .update({ is_active: false })
        .eq('pipeline_id', id);

      if (columnsError) throw columnsError;

      // Desativar pipeline
      const { error } = await supabase
        .from('crm_pipelines')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      
      await fetchPipelines();
      await fetchColumns();
      toast.success('Pipeline removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover pipeline:', error);
      toast.error('Erro ao remover pipeline');
      throw error;
    }
  };

  const createColumn = async (column: Omit<CRMPipelineColumn, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('crm_pipeline_columns')
        .insert(column)
        .select()
        .single();

      if (error) throw error;
      
      await fetchColumns(column.pipeline_id);
      toast.success('Coluna criada com sucesso');
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
      
      await fetchColumns();
      toast.success('Coluna atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar coluna:', error);
      toast.error('Erro ao atualizar coluna');
      throw error;
    }
  };

  const deleteColumn = async (id: string) => {
    try {
      // Verificar se há leads na coluna
      const { data: leads, error: leadsError } = await supabase
        .from('crm_leads')
        .select('id')
        .eq('column_id', id)
        .limit(1);

      if (leadsError) throw leadsError;

      if (leads && leads.length > 0) {
        toast.error('Não é possível excluir uma coluna que contém leads. Mova os leads primeiro.');
        return;
      }

      const { error } = await supabase
        .from('crm_pipeline_columns')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      
      await fetchColumns();
      toast.success('Coluna removida com sucesso');
    } catch (error) {
      console.error('Erro ao remover coluna:', error);
      toast.error('Erro ao remover coluna');
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPipelines(), fetchColumns()]);
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
    createPipeline,
    updatePipeline,
    deletePipeline,
    createColumn,
    updateColumn,
    deleteColumn
  };
};
