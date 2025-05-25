
import { useState, useCallback } from 'react';
import { MentoringCatalog, CreateMentoringCatalogData } from '@/types/mentoring.types';
import { MentoringDataService } from '@/services/mentoring/MentoringDataService';
import { useToast } from '@/hooks/use-toast';

const dataService = new MentoringDataService();

export const useMentoringCatalog = () => {
  const [catalogs, setCatalogs] = useState<MentoringCatalog[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refreshCatalogs = useCallback(() => {
    setCatalogs([...dataService.getCatalogs()]);
  }, []);

  const createCatalog = useCallback(async (data: CreateMentoringCatalogData): Promise<MentoringCatalog> => {
    setLoading(true);
    try {
      const newCatalog = dataService.createCatalog(data);
      refreshCatalogs();
      
      toast({
        title: "Sucesso",
        description: "Mentoria criada com sucesso!",
      });
      
      return newCatalog;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar mentoria. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshCatalogs, toast]);

  const updateCatalog = useCallback(async (id: string, data: Partial<CreateMentoringCatalogData>): Promise<boolean> => {
    setLoading(true);
    try {
      const success = dataService.updateCatalog(id, data);
      if (success) {
        refreshCatalogs();
        toast({
          title: "Sucesso",
          description: "Mentoria atualizada com sucesso!",
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar mentoria. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshCatalogs, toast]);

  const deleteCatalog = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = dataService.deleteCatalog(id);
      if (success) {
        refreshCatalogs();
        toast({
          title: "Sucesso",
          description: "Mentoria excluída com sucesso!",
        });
      }
      return success;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir mentoria. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshCatalogs, toast]);

  return {
    catalogs,
    loading,
    createCatalog,
    updateCatalog,
    deleteCatalog,
    refreshCatalogs
  };
};
