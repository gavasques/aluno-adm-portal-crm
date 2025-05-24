
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bonus, BonusType, AccessPeriod, BonusStats } from "@/types/bonus.types";

export const useBonuses = () => {
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<BonusStats>({
    total: 0,
    byType: {
      Software: 0,
      Sistema: 0,
      IA: 0,
      Ebook: 0,
      Lista: 0,
      Outros: 0
    },
    recentlyAdded: 0
  });

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

      const bonusData = data?.map(item => ({
        ...item,
        type: item.type as BonusType,
        access_period: item.access_period as AccessPeriod
      })) || [];

      setBonuses(bonusData);
      calculateStats(bonusData);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao carregar bônus');
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas
  const calculateStats = (bonusData: Bonus[]) => {
    const total = bonusData.length;
    const byType = bonusData.reduce((acc, bonus) => {
      acc[bonus.type] = (acc[bonus.type] || 0) + 1;
      return acc;
    }, {} as Record<BonusType, number>);

    // Preencher tipos faltantes com 0
    const allTypes: BonusType[] = ["Software", "Sistema", "IA", "Ebook", "Lista", "Outros"];
    allTypes.forEach(type => {
      if (!byType[type]) byType[type] = 0;
    });

    const recentlyAdded = bonusData.filter(bonus => {
      const createdAt = new Date(bonus.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdAt >= thirtyDaysAgo;
    }).length;

    setStats({ total, byType, recentlyAdded });
  };

  // Adicionar novo bônus
  const addBonus = async (bonusData: {
    name: string;
    type: BonusType;
    description: string;
    access_period: AccessPeriod;
    observations?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('bonuses')
        .insert([{
          ...bonusData,
          bonus_id: `BNS${String(Date.now()).slice(-6)}`
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar bônus:', error);
        toast.error('Erro ao adicionar bônus');
        return false;
      }

      const newBonus = {
        ...data,
        type: data.type as BonusType,
        access_period: data.access_period as AccessPeriod
      };

      setBonuses(prev => [newBonus, ...prev]);
      calculateStats([newBonus, ...bonuses]);
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

      const updatedBonus = {
        ...data,
        type: data.type as BonusType,
        access_period: data.access_period as AccessPeriod
      };

      setBonuses(prev => prev.map(bonus => 
        bonus.id === id ? updatedBonus : bonus
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

      setBonuses(prev => {
        const newBonuses = prev.filter(bonus => bonus.id !== id);
        calculateStats(newBonuses);
        return newBonuses;
      });
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

      return {
        ...data,
        type: data.type as BonusType,
        access_period: data.access_period as AccessPeriod
      };
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
    stats,
    addBonus,
    updateBonus,
    deleteBonus,
    getBonusById,
    loadBonuses
  };
};

// Exportar tipos corretamente
export type { BonusType, AccessPeriod } from "@/types/bonus.types";
