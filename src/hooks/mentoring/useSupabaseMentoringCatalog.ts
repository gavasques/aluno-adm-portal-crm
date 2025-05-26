
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
      console.log('📚 Catálogos carregados com extensões:', data);
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
      console.log('🔄 Iniciando criação de catálogo:', data);
      console.log('📦 Extensões a serem criadas:', data.extensions);
      
      const newCatalog = await repository.createCatalog(data);
      
      console.log('✅ Catálogo criado com sucesso:', newCatalog);
      console.log('📦 Extensões do catálogo criado:', newCatalog.extensions);
      
      setCatalogs(prev => [newCatalog, ...prev]);
      
      toast({
        title: "Sucesso",
        description: `Mentoria criada com sucesso${newCatalog.extensions && newCatalog.extensions.length > 0 ? ` com ${newCatalog.extensions.length} extensão(ões)` : ''}!`,
      });
      
      return newCatalog;
    } catch (error) {
      console.error('❌ Erro ao criar mentoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar mentoria. Verifique os dados e tente novamente.",
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
      console.log('🔄 Iniciando atualização do catálogo:', id, data);
      console.log('📦 Extensões a serem atualizadas:', data.extensions);
      
      const success = await repository.updateCatalog(id, data);
      
      if (success) {
        console.log('✅ Catálogo atualizado, recarregando dados...');
        await fetchCatalogs(); // Reload data
        
        toast({
          title: "Sucesso",
          description: "Mentoria atualizada com sucesso!",
        });
      }
      
      return success;
    } catch (error) {
      console.error('❌ Erro ao atualizar mentoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar mentoria. Verifique os dados e tente novamente.",
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
