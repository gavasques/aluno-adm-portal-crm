
import { useState, useEffect } from 'react';
import { CRMLeadCardField } from '@/types/crm.types';

// Configurações padrão para os cards
const DEFAULT_PREFERENCES = {
  visible_fields: [
    'name', 'status', 'responsible', 'phone', 'email', 'pipeline', 'column', 'tags'
  ] as CRMLeadCardField[],
  field_order: [
    'name', 'status', 'responsible', 'phone', 'email', 'pipeline', 'column', 'tags'
  ] as CRMLeadCardField[]
};

/**
 * Hook simplificado para preferências de cards do CRM
 * Retorna configurações padrão para evitar erros de context
 */
export const useCRMCardPreferences = () => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Por enquanto, retorna configurações padrão
    // No futuro pode ser integrado com Supabase para persistir preferências do usuário
    console.log('📋 [CRM_CARD_PREFERENCES] Usando configurações padrão');
    setIsLoading(false);
  }, []);

  return {
    preferences,
    isLoading,
    updatePreferences: (newPreferences: Partial<typeof DEFAULT_PREFERENCES>) => {
      console.log('📋 [CRM_CARD_PREFERENCES] Atualizando preferências:', newPreferences);
      setPreferences(prev => ({ ...prev, ...newPreferences }));
    }
  };
};
