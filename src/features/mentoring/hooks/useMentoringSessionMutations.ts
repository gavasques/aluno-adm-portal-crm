
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MentoringRepository } from '../services/MentoringRepository';
import { CreateSessionData, CreateExtensionData } from '@/types/mentoring.types';
import { useMentoringValidation } from './useMentoringValidation';
import { useToast } from '@/hooks/use-toast';
import { mentoringQueryKeys } from './queryKeys';

const repository = new MentoringRepository();

export const useMentoringSessionMutations = () => {
  const queryClient = useQueryClient();
  const { validateSession, validateExtension } = useMentoringValidation();
  const { toast } = useToast();

  const useCreateSession = () => {
    return useMutation({
      mutationFn: async (data: CreateSessionData) => {
        const validation = validateSession(data);
        if (!validation.success) {
          throw new Error('errors' in validation ? validation.errors.join(', ') : 'Erro de validação');
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
          throw new Error('errors' in validation ? validation.errors.join(', ') : 'Erro de validação');
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
    useCreateSession,
    useAddExtension,
  };
};
