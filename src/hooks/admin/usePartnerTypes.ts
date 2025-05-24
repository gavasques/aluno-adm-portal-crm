
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PartnerType {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const usePartnerTypes = () => {
  const [partnerTypes, setPartnerTypes] = useState<PartnerType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPartnerTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('partner_types')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching partner types:', error);
        toast.error('Erro ao carregar tipos de parceiros');
        return;
      }

      setPartnerTypes(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao carregar tipos de parceiros');
    } finally {
      setLoading(false);
    }
  };

  const addPartnerType = async (data: { name: string; description?: string }) => {
    try {
      const { error } = await supabase
        .from('partner_types')
        .insert([data]);

      if (error) {
        console.error('Error adding partner type:', error);
        toast.error('Erro ao adicionar tipo de parceiro');
        return false;
      }

      toast.success('Tipo de parceiro adicionado com sucesso!');
      fetchPartnerTypes();
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao adicionar tipo de parceiro');
      return false;
    }
  };

  const deletePartnerType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('partner_types')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting partner type:', error);
        toast.error('Erro ao excluir tipo de parceiro');
        return false;
      }

      toast.success('Tipo de parceiro excluído com sucesso!');
      fetchPartnerTypes();
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao excluir tipo de parceiro');
      return false;
    }
  };

  useEffect(() => {
    fetchPartnerTypes();
  }, []);

  return {
    partnerTypes,
    loading,
    addPartnerType,
    deletePartnerType,
    refetch: fetchPartnerTypes
  };
};
