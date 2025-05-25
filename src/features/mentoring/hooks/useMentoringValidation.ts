
import { CreateMentoringCatalogData, CreateSessionData, CreateExtensionData } from '@/types/mentoring.types';

export const useMentoringValidation = () => {
  const validateCatalog = (data: CreateMentoringCatalogData) => {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    }
    if (!data.instructor || data.instructor.trim().length < 2) {
      errors.push('Instrutor é obrigatório');
    }
    if (!data.durationWeeks || data.durationWeeks < 1) {
      errors.push('Duração deve ser de pelo menos 1 semana');
    }
    if (!data.numberOfSessions || data.numberOfSessions < 1) {
      errors.push('Deve ter pelo menos 1 sessão');
    }
    if (!data.price || data.price < 0) {
      errors.push('Preço deve ser maior que zero');
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return { success: true, data };
  };

  const validateBusinessRules = (data: CreateMentoringCatalogData) => {
    const errors: string[] = [];

    // Regra: Mentoria individual não pode ter mais de 20 sessões
    if (data.type === 'Individual' && data.numberOfSessions > 20) {
      errors.push('Mentoria individual não pode ter mais de 20 sessões');
    }

    // Regra: Mentoria em grupo deve ter preço menor
    if (data.type === 'Grupo' && data.price > 5000) {
      errors.push('Mentoria em grupo deve ter preço máximo de R$ 5.000');
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return { success: true, data };
  };

  const validateSession = (data: CreateSessionData) => {
    const errors: string[] = [];

    if (!data.enrollmentId) {
      errors.push('Inscrição é obrigatória');
    }
    if (!data.title || data.title.trim().length < 3) {
      errors.push('Título deve ter pelo menos 3 caracteres');
    }
    if (!data.scheduledDate) {
      errors.push('Data da sessão é obrigatória');
    }
    if (!data.durationMinutes || data.durationMinutes < 30) {
      errors.push('Duração deve ser de pelo menos 30 minutos');
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return { success: true, data };
  };

  const validateExtension = (data: CreateExtensionData) => {
    const errors: string[] = [];

    if (!data.enrollmentId) {
      errors.push('Inscrição é obrigatória');
    }
    if (!data.extensionMonths || data.extensionMonths < 1) {
      errors.push('Extensão deve ser de pelo menos 1 mês');
    }
    if (data.extensionMonths > 12) {
      errors.push('Extensão não pode ser maior que 12 meses');
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return { success: true, data };
  };

  return {
    validateCatalog,
    validateBusinessRules,
    validateSession,
    validateExtension,
  };
};
