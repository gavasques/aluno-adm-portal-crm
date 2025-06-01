
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  const fetchConfig = async () => {
    try {
      console.log('🔍 Carregando configuração de visibilidade dos campos...');
      
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

      console.log('✅ Configuração carregada:', newConfig);
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
      console.log(`🔧 Atualizando visibilidade: ${field} = ${visible}`);
      
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
      
      // Invalidar cache para forçar atualização dos formulários
      queryClient.invalidateQueries({ queryKey: ['crm-custom-field-groups-all'] });
      queryClient.invalidateQueries({ queryKey: ['crm-custom-fields-all'] });
      queryClient.invalidateQueries({ queryKey: ['crm-leads'] });
      queryClient.invalidateQueries({ queryKey: ['crm-lead-detail'] });
      
      console.log('✅ Visibilidade atualizada e cache invalidado');
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
