
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCRMPipelines } from './useCRMPipelines';

interface FormDataHook {
  responsibles: Array<{id: string, name: string}>;
  pipelineColumns: Array<{id: string, name: string, sort_order: number}>;
  loading: boolean;
}

export const useLeadFormData = (pipelineId: string): FormDataHook => {
  const [responsibles, setResponsibles] = useState<Array<{id: string, name: string}>>([]);
  const [loading, setLoading] = useState(true);
  const { columns } = useCRMPipelines();

  const pipelineColumns = columns
    .filter(col => col.pipeline_id === pipelineId)
    .sort((a, b) => a.sort_order - b.sort_order);

  useEffect(() => {
    const fetchResponsibles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('role', 'Admin')
          .order('name');

        if (error) throw error;
        setResponsibles(data || []);
      } catch (error) {
        console.error('Erro ao buscar responsáveis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponsibles();
  }, []);

  return {
    responsibles,
    pipelineColumns,
    loading
  };
};
