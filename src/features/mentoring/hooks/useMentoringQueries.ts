
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MentoringRepository } from '../services/MentoringRepository';
import { MentoringService } from '../services/MentoringService';
import { CreateMentoringCatalogData, CreateSessionData, CreateExtensionData } from '@/types/mentoring.types';
import { useMentoringValidation } from './useMentoringValidation';
import { useToast } from '@/hooks/use-toast';

const repository = new MentoringRepository();
const service = new MentoringService(repository);

// Query keys para cache organizado
export const mentoringQueryKeys = {
  all: ['mentoring'] as const,
  catalogs: () => [...mentoringQueryKeys.all, 'catalogs'] as const,
  catalog: (id: string) => [...mentoringQueryKeys.catalogs(), id] as const,
  enrollments: () => [...mentoringQueryKeys.all, 'enrollments'] as const,
  studentEnrollments: (studentId: string) => [...mentoringQueryKeys.enrollments(), 'student', studentId] as const,
  sessions: () => [...mentoringQueryKeys.all, 'sessions'] as const,
  enrollmentSessions: (enrollmentId: string) => [...mentoringQueryKeys.sessions(), 'enrollment', enrollmentId] as const,
  materials: () => [...mentoringQueryKeys.all, 'materials'] as const,
  enrollmentMaterials: (enrollmentId: string) => [...mentoringQueryKeys.materials(), 'enrollment', enrollmentId] as const,
};

export const useMentoringQueries = () => {
  const queryClient = useQueryClient();
  const { validateCatalog, validateSession, validateExtension, validateBusinessRules } = useMentoringValidation();
  const { toast } = useToast();

  // Queries para leitura
  const useCatalogs = () => {
    return useQuery({
      queryKey: mentoringQueryKeys.catalogs(),
      queryFn: () => repository.getCatalogs(),
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    });
  };

  const useCatalogById = (id: string) => {
    return useQuery({
      queryKey: mentoringQueryKeys.catalog(id),
      queryFn: () => repository.getCatalogById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  const useEnrollments = () => {
    return useQuery({
      queryKey: mentoringQueryKeys.enrollments(),
      queryFn: () => repository.getEnrollments(),
      staleTime: 2 * 60 * 1000, // 2 minutos
    });
  };

  const useStudentEnrollments = (studentId: string) => {
    return useQuery({
      queryKey: mentoringQueryKeys.studentEnrollments(studentId),
      queryFn: () => repository.getStudentEnrollments(studentId),
      enabled: !!studentId,
      staleTime: 2 * 60 * 1000,
    });
  };

  const useSessions = () => {
    return useQuery({
      queryKey: mentoringQueryKeys.sessions(),
      queryFn: () => repository.getSessions(),
      staleTime: 1 * 60 * 1000, // 1 minuto
    });
  };

  const useEnrollmentSessions = (enrollmentId: string) => {
    return useQuery({
      queryKey: mentoringQueryKeys.enrollmentSessions(enrollmentId),
      queryFn: () => repository.getEnrollmentSessions(enrollmentId),
      enabled: !!enrollmentId,
      staleTime: 1 * 60 * 1000,
    });
  };

  // Mutations para escrita
  const useCreateCatalog = () => {
    return useMutation({
      mutationFn: async (data: CreateMentoringCatalogData) => {
        // Validação de schema
        const schemaValidation = validateCatalog(data);
        if (!schemaValidation.success) {
          throw new Error(schemaValidation.errors.join(', '));
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

  const useCreateSession = () => {
    return useMutation({
      mutationFn: async (data: CreateSessionData) => {
        const validation = validateSession(data);
        if (!validation.success) {
          throw new Error(validation.errors.join(', '));
        }
        return repository.createSession(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.sessions() });
        toast({
          title: "Sucesso",
          description: "Sessão criada com sucesso!",
        });
      }
    });
  };

  const useAddExtension = () => {
    return useMutation({
      mutationFn: async (data: CreateExtensionData) => {
        const validation = validateExtension(data);
        if (!validation.success) {
          throw new Error(validation.errors.join(', '));
        }
        return repository.addExtension(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.enrollments() });
        toast({
          title: "Sucesso",
          description: "Extensão aplicada com sucesso!",
        });
      }
    });
  };

  return {
    // Queries
    useCatalogs,
    useCatalogById,
    useEnrollments,
    useStudentEnrollments,
    useSessions,
    useEnrollmentSessions,
    
    // Mutations
    useCreateCatalog,
    useUpdateCatalog,
    useDeleteCatalog,
    useCreateSession,
    useAddExtension,
    
    // Utilities
    invalidateAllQueries: () => queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.all }),
    clearCache: () => queryClient.clear()
  };
};
