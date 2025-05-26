
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
    const catalogsData = dataService.getCatalogs();
    
    // Simular extensões para cada catálogo (em um ambiente real, isso viria do backend)
    const catalogsWithExtensions = catalogsData.map(catalog => ({
      ...catalog,
      extensions: catalog.extensions || [
        {
          id: `ext-1-${catalog.id}`,
          months: 3,
          price: catalog.price * 0.3,
          description: `Extensão de 3 meses para ${catalog.name}`,
          checkoutLinks: {
            mercadoPago: 'https://mercadopago.com/checkout/ext-3-months',
            hubla: 'https://hubla.com/checkout/ext-3-months',
            hotmart: 'https://hotmart.com/checkout/ext-3-months'
          }
        },
        {
          id: `ext-2-${catalog.id}`,
          months: 6,
          price: catalog.price * 0.5,
          description: `Extensão de 6 meses para ${catalog.name}`,
          checkoutLinks: {
            mercadoPago: 'https://mercadopago.com/checkout/ext-6-months',
            hubla: 'https://hubla.com/checkout/ext-6-months'
          }
        }
      ]
    }));

    setCatalogs(catalogsWithExtensions);
  }, []);

  const createCatalog = useCallback(async (data: CreateMentoringCatalogData): Promise<MentoringCatalog> => {
    setLoading(true);
    try {
      const newCatalog = dataService.createCatalog(data);
      
      // Adicionar extensões padrão ao novo catálogo
      const catalogWithExtensions = {
        ...newCatalog,
        extensions: data.extensions || [
          {
            id: `ext-1-${newCatalog.id}`,
            months: 3,
            price: newCatalog.price * 0.3,
            description: `Extensão de 3 meses para ${newCatalog.name}`,
            checkoutLinks: {
              mercadoPago: 'https://mercadopago.com/checkout/ext-3-months',
              hubla: 'https://hubla.com/checkout/ext-3-months',
              hotmart: 'https://hotmart.com/checkout/ext-3-months'
            }
          }
        ]
      };
      
      refreshCatalogs();
      
      toast({
        title: "Sucesso",
        description: "Mentoria criada com sucesso!",
      });
      
      return catalogWithExtensions;
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
