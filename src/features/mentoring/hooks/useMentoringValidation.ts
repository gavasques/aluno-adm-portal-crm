
import { useCallback } from 'react';
import { 
  createMentoringCatalogSchema,
  createSessionSchema,
  createExtensionSchema,
  validateMentoringData
} from '../schemas/mentoring.schemas';
import { CreateMentoringCatalogData, CreateSessionData, CreateExtensionData } from '@/types/mentoring.types';
import { useToast } from '@/hooks/use-toast';

export const useMentoringValidation = () => {
  const { toast } = useToast();

  const validateCatalog = useCallback((data: CreateMentoringCatalogData) => {
    const result = validateMentoringData(createMentoringCatalogSchema, data);
    
    if (!result.success) {
      toast({
        title: "Erro de validação",
        description: result.errors.join(', '),
        variant: "destructive",
      });
    }
    
    return result;
  }, [toast]);

  const validateSession = useCallback((data: CreateSessionData) => {
    const result = validateMentoringData(createSessionSchema, data);
    
    if (!result.success) {
      toast({
        title: "Erro de validação da sessão",
        description: result.errors.join(', '),
        variant: "destructive",
      });
    }
    
    return result;
  }, [toast]);

  const validateExtension = useCallback((data: CreateExtensionData) => {
    const result = validateMentoringData(createExtensionSchema, data);
    
    if (!result.success) {
      toast({
        title: "Erro de validação da extensão",
        description: result.errors.join(', '),
        variant: "destructive",
      });
    }
    
    return result;
  }, [toast]);

  const validateBusinessRules = useCallback((data: CreateMentoringCatalogData) => {
    const errors: string[] = [];

    // Regra de negócio: preço mínimo para mentorias individuais
    if (data.type === 'Individual' && data.price < 100) {
      errors.push('Mentorias individuais devem ter preço mínimo de R$ 100');
    }

    // Regra de negócio: número de sessões vs duração
    const sessionsPerWeek = data.numberOfSessions / data.durationWeeks;
    if (sessionsPerWeek > 3) {
      errors.push('Máximo de 3 sessões por semana permitidas');
    }

    // Regra de negócio: mentorias em grupo devem ter mais sessões
    if (data.type === 'Grupo' && data.numberOfSessions < 4) {
      errors.push('Mentorias em grupo devem ter pelo menos 4 sessões');
    }

    if (errors.length > 0) {
      toast({
        title: "Erro nas regras de negócio",
        description: errors.join(', '),
        variant: "destructive",
      });
      return { success: false, errors };
    }

    return { success: true, errors: [] };
  }, [toast]);

  return {
    validateCatalog,
    validateSession,
    validateExtension,
    validateBusinessRules
  };
};
