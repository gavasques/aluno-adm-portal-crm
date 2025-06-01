
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

// Mapeamento dos nomes dos grupos para as chaves de configuração
const GROUP_NAME_MAPPING: Record<string, keyof FieldVisibilityConfig> = {
  'Amazon': 'amazon_section',
  'Empresa': 'business_section',
  'Informações da Empresa': 'business_section',
  'Qualificação': 'qualification_section',
  'Observações': 'notes_section',
  'Notas': 'notes_section'
};

export const useCRMFieldVisibility = () => {
  const [config, setConfig] = useState<FieldVisibilityConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const { data: groups, error } = await supabase
        .from('crm_custom_field_groups')
        .select('name, is_active')
        .eq('is_active', true);

      if (error) {
        console.error('Erro ao buscar grupos de campos:', error);
        setConfig(DEFAULT_CONFIG);
        return;
      }

      // Iniciar com configuração padrão (tudo desabilitado se não encontrar grupos)
      const newConfig: FieldVisibilityConfig = {
        amazon_section: false,
        business_section: false,
        qualification_section: false,
        notes_section: false
      };

      // Ativar seções baseado nos grupos ativos
      if (groups) {
        groups.forEach(group => {
          const configKey = GROUP_NAME_MAPPING[group.name];
          if (configKey) {
            newConfig[configKey] = group.is_active;
          }
        });
      }

      setConfig(newConfig);
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      setConfig(DEFAULT_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  const updateFieldVisibility = async (field: keyof FieldVisibilityConfig, visible: boolean) => {
    try {
      // Encontrar o nome do grupo baseado na chave
      const groupName = Object.keys(GROUP_NAME_MAPPING).find(
        name => GROUP_NAME_MAPPING[name] === field
      );

      if (!groupName) {
        console.error('Grupo não encontrado para o campo:', field);
        return false;
      }

      // Atualizar o status do grupo
      const { error } = await supabase
        .from('crm_custom_field_groups')
        .update({ is_active: visible })
        .eq('name', groupName);

      if (error) {
        console.error('Erro ao atualizar grupo:', error);
        return false;
      }

      // Atualizar o estado local
      setConfig(prev => ({ ...prev, [field]: visible }));
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
