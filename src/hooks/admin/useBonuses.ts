
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type BonusType = "Software" | "Sistema" | "IA" | "Ebook" | "Lista" | "Outros";
export type AccessPeriod = "7 dias" | "15 dias" | "30 dias" | "2 Meses" | "3 Meses" | "6 Meses" | "1 Ano" | "Vitalício";

export interface Bonus {
  id: string;
  bonus_id: string;
  name: string;
  type: BonusType;
  description: string;
  access_period: AccessPeriod;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export const useBonuses = () => {
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar bônus do Supabase
  const loadBonuses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bonuses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar bônus:', error);
        toast.error('Erro ao carregar bônus');
        return;
      }

      setBonuses(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao carregar bônus');
    } finally {
      setLoading(false);
    }
  };

  // Adicionar novo bônus
  const addBonus = async (bonusData: Omit<Bonus, "id" | "bonus_id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from('bonuses')
        .insert([bonusData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar bônus:', error);
        toast.error('Erro ao adicionar bônus');
        return false;
      }

      setBonuses(prev => [data, ...prev]);
      toast.success('Bônus adicionado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao adicionar bônus');
      return false;
    }
  };

  // Atualizar bônus
  const updateBonus = async (id: string, bonusData: Partial<Bonus>) => {
    try {
      const { data, error } = await supabase
        .from('bonuses')
        .update(bonusData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar bônus:', error);
        toast.error('Erro ao atualizar bônus');
        return false;
      }

      setBonuses(prev => prev.map(bonus => 
        bonus.id === id ? data : bonus
      ));
      toast.success('Bônus atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao atualizar bônus');
      return false;
    }
  };

  // Excluir bônus
  const deleteBonus = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bonuses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir bônus:', error);
        toast.error('Erro ao excluir bônus');
        return false;
      }

      setBonuses(prev => prev.filter(bonus => bonus.id !== id));
      toast.success('Bônus excluído com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao excluir bônus');
      return false;
    }
  };

  // Buscar bônus por ID
  const getBonusById = async (id: string): Promise<Bonus | null> => {
    try {
      const { data, error } = await supabase
        .from('bonuses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar bônus:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro inesperado:', error);
      return null;
    }
  };

  // Filtrar bônus baseado na pesquisa
  const filteredBonuses = bonuses.filter(bonus => 
    bonus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bonus.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bonus.bonus_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Carregar bônus na inicialização
  useEffect(() => {
    loadBonuses();
  }, []);

  return {
    bonuses: filteredBonuses,
    loading,
    searchTerm,
    setSearchTerm,
    addBonus,
    updateBonus,
    deleteBonus,
    getBonusById,
    loadBonuses
  };
};
