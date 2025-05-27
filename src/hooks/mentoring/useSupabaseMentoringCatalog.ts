
import { useState, useCallback } from 'react';
import { SupabaseMentoringRepository } from '@/services/mentoring/SupabaseMentoringRepository';
import { MentoringCatalog, CreateMentoringCatalogData } from '@/types/mentoring.types';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseMentoringCatalog = () => {
  const [catalogs, setCatalogs] = useState<MentoringCatalog[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const repository = new SupabaseMentoringRepository();

  const refreshCatalogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await repository.getCatalogs();
      console.log('📚 Catálogos carregados:', data.length);
      setCatalogs(data);
    } catch (error) {
      console.error('❌ Erro ao carregar catálogos:', error);
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
    try {
      setLoading(true);
      const newCatalog = await repository.createCatalog(data);
      await refreshCatalogs();
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
    try {
      setLoading(true);
      const success = await repository.updateCatalog(id, data);
      if (success) {
        await refreshCatalogs();
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
    try {
      setLoading(true);
      const success = await repository.deleteCatalog(id);
      if (success) {
        await refreshCatalogs();
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
    refreshCatalogs,
    repository
  };
};
