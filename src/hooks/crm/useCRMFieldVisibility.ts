
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FieldVisibilityConfig {
  amazon_section: boolean;
  business_section: boolean;
  qualification_section: boolean;
  notes_section: boolean;
}

const DEFAULT_CONFIG: FieldVisibilityConfig = {
  amazon_section: true,
  business_section: true,
  qualification_section: true,
  notes_section: true
};

export const useCRMFieldVisibility = () => {
  const [config, setConfig] = useState<FieldVisibilityConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_field_configurations' as any)
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar configuração de campos:', error);
        setConfig(DEFAULT_CONFIG);
        return;
      }

      if (data) {
        setConfig({
          amazon_section: data.amazon_section ?? true,
          business_section: data.business_section ?? true,
          qualification_section: data.qualification_section ?? true,
          notes_section: data.notes_section ?? true,
        });
      } else {
        setConfig(DEFAULT_CONFIG);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      setConfig(DEFAULT_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  const updateFieldVisibility = async (field: keyof FieldVisibilityConfig, visible: boolean) => {
    try {
      const newConfig = { ...config, [field]: visible };
      
      // Primeiro tenta atualizar, se não existir, cria
      const { error: updateError } = await supabase
        .from('crm_field_configurations' as any)
        .upsert(newConfig, { onConflict: 'id' });

      if (updateError) {
        console.error('Erro ao atualizar configuração:', updateError);
        return false;
      }

      setConfig(newConfig);
      return true;
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    updateFieldVisibility,
    refetch: fetchConfig
  };
};
