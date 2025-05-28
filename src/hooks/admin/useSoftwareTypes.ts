
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SoftwareType {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useSoftwareTypes = () => {
  const [softwareTypes, setSoftwareTypes] = useState<SoftwareType[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchSoftwareTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('software_types')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching software types:', error);
        toast.error('Erro ao carregar tipos de ferramentas');
        return;
      }

      setSoftwareTypes(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao carregar tipos de ferramentas');
    } finally {
      setLoading(false);
    }
  };

  const addSoftwareType = async (data: { name: string; description?: string }) => {
    try {
      const { error } = await supabase
        .from('software_types')
        .insert([data]);

      if (error) {
        console.error('Error adding software type:', error);
        toast.error('Erro ao adicionar tipo de ferramenta');
        return false;
      }

      toast.success('Tipo de ferramenta adicionado com sucesso!');
      fetchSoftwareTypes();
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao adicionar tipo de ferramenta');
      return false;
    }
  };

  const updateSoftwareType = async (id: string, data: { name: string; description?: string }) => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('software_types')
        .update(data)
        .eq('id', id);

      if (error) {
        console.error('Error updating software type:', error);
        toast.error('Erro ao atualizar tipo de ferramenta');
        return false;
      }

      toast.success('Tipo de ferramenta atualizado com sucesso!');
      fetchSoftwareTypes();
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao atualizar tipo de ferramenta');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteSoftwareType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('software_types')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting software type:', error);
        toast.error('Erro ao excluir tipo de ferramenta');
        return false;
      }

      toast.success('Tipo de ferramenta excluído com sucesso!');
      fetchSoftwareTypes();
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao excluir tipo de ferramenta');
      return false;
    }
  };

  useEffect(() => {
    fetchSoftwareTypes();
  }, []);

  return {
    softwareTypes,
    loading,
    updating,
    addSoftwareType,
    updateSoftwareType,
    deleteSoftwareType,
    refetch: fetchSoftwareTypes
  };
};
