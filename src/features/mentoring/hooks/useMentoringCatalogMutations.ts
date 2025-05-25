
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MentoringRepository } from '../services/MentoringRepository';
import { CreateMentoringCatalogData } from '@/types/mentoring.types';
import { useMentoringValidation } from './useMentoringValidation';
import { useToast } from '@/hooks/use-toast';
import { mentoringQueryKeys } from './queryKeys';

const repository = new MentoringRepository();

export const useMentoringCatalogMutations = () => {
  const queryClient = useQueryClient();
  const { validateCatalog, validateBusinessRules } = useMentoringValidation();
  const { toast } = useToast();

  const useCreateCatalog = () => {
    return useMutation({
      mutationFn: async (data: CreateMentoringCatalogData) => {
        // Validação de schema
        const schemaValidation = validateCatalog(data);
        if (!schemaValidation.success) {
          throw new Error('errors' in schemaValidation ? schemaValidation.errors.join(', ') : 'Erro de validação');
        }

        // Validação de regras de negócio
        const businessValidation = validateBusinessRules(data);
        if (!businessValidation.success) {
          throw new Error(businessValidation.errors.join(', '));
        }

        return repository.createCatalog(data);
      },
      onSuccess: (newCatalog) => {
        // Invalidar cache dos catálogos
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.catalogs() });
        
        // Adicionar ao cache otimisticamente
        queryClient.setQueryData(mentoringQueryKeys.catalogs(), (old: any[]) => 
          old ? [...old, newCatalog] : [newCatalog]
        );

        toast({
          title: "Sucesso",
          description: "Mentoria criada com sucesso!",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Erro",
          description: error.message || "Erro ao criar mentoria",
          variant: "destructive",
        });
      }
    });
  };

  const useUpdateCatalog = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<CreateMentoringCatalogData> }) => {
        return repository.updateCatalog(id, data);
      },
      onSuccess: (_, { id, data }) => {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.catalogs() });
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.catalog(id) });

        // Atualizar cache otimisticamente
        queryClient.setQueryData(mentoringQueryKeys.catalogs(), (old: any[]) => 
          old ? old.map(catalog => catalog.id === id ? { ...catalog, ...data } : catalog) : []
        );

        toast({
          title: "Sucesso",
          description: "Mentoria atualizada com sucesso!",
        });
      },
      onError: () => {
        toast({
          title: "Erro",
          description: "Erro ao atualizar mentoria",
          variant: "destructive",
        });
      }
    });
  };

  const useDeleteCatalog = () => {
    return useMutation({
      mutationFn: (id: string) => repository.deleteCatalog(id),
      onSuccess: (_, id) => {
        // Invalidar e remover do cache
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.catalogs() });
        queryClient.removeQueries({ queryKey: mentoringQueryKeys.catalog(id) });

        // Remover do cache otimisticamente
        queryClient.setQueryData(mentoringQueryKeys.catalogs(), (old: any[]) => 
          old ? old.filter(catalog => catalog.id !== id) : []
        );

        toast({
          title: "Sucesso",
          description: "Mentoria excluída com sucesso!",
        });
      },
      onError: () => {
        toast({
          title: "Erro",
          description: "Erro ao excluir mentoria",
          variant: "destructive",
        });
      }
    });
  };

  return {
    useCreateCatalog,
    useUpdateCatalog,
    useDeleteCatalog,
  };
};
