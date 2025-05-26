
import { useState, useEffect, useCallback } from 'react';
import { MentoringCatalog, CreateMentoringCatalogData } from '@/types/mentoring.types';
import { SupabaseMentoringRepository } from '@/services/mentoring/SupabaseMentoringRepository';
import { useToast } from '@/hooks/use-toast';

const repository = new SupabaseMentoringRepository();

export const useSupabaseMentoringCatalog = () => {
  const [catalogs, setCatalogs] = useState<MentoringCatalog[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCatalogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await repository.getCatalogs();
      setCatalogs(data);
    } catch (error) {
      console.error('Error fetching catalogs:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar catálogo de mentorias",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createCatalog = useCallback(async (data: CreateMentoringCatalogData): Promise<MentoringCatalog> => {
    setLoading(true);
    try {
      const newCatalog = await repository.createCatalog(data);
      setCatalogs(prev => [newCatalog, ...prev]);
      toast({
        title: "Sucesso",
        description: "Mentoria criada com sucesso!",
      });
      return newCatalog;
    } catch (error) {
      console.error('Error creating catalog:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar mentoria. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateCatalog = useCallback(async (id: string, data: Partial<CreateMentoringCatalogData>): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await repository.updateCatalog(id, data);
      if (success) {
        await fetchCatalogs(); // Reload data
        toast({
          title: "Sucesso",
          description: "Mentoria atualizada com sucesso!",
        });
      }
      return success;
    } catch (error) {
      console.error('Error updating catalog:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar mentoria. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCatalogs, toast]);

  const deleteCatalog = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await repository.deleteCatalog(id);
      if (success) {
        setCatalogs(prev => prev.filter(c => c.id !== id));
        toast({
          title: "Sucesso",
          description: "Mentoria excluída com sucesso!",
        });
      }
      return success;
    } catch (error) {
      console.error('Error deleting catalog:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir mentoria. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCatalogs();
  }, [fetchCatalogs]);

  return {
    catalogs,
    loading,
    createCatalog,
    updateCatalog,
    deleteCatalog,
    refreshCatalogs: fetchCatalogs
  };
};
