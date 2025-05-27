import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CalendlyConfig, CalendlyEvent } from '@/types/calendly.types';
import { useToast } from '@/hooks/use-toast';

export const useCalendly = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getCalendlyConfig = useCallback(async (mentorIdentifier: string): Promise<CalendlyConfig | null> => {
    try {
      console.log('🔍 Buscando configuração Calendly para:', mentorIdentifier);
      
      // Primeiro, tentar buscar por mentor_id (UUID) - caso seja um ID válido
      if (mentorIdentifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.log('🔍 Buscando por UUID...');
        const { data, error } = await supabase
          .from('calendly_configs')
          .select('*')
          .eq('mentor_id', mentorIdentifier)
          .eq('active', true)
          .maybeSingle();

        if (!error && data) {
          console.log('✅ Configuração encontrada por UUID:', data);
          return data;
        }
      }

      // Se não encontrou por ID ou não é UUID, buscar por todas as configurações ativas
      console.log('🔍 Buscando por nome do mentor...');
      const { data: allConfigs, error: allConfigsError } = await supabase
        .from('calendly_configs')
        .select('*')
        .eq('active', true);

      if (allConfigsError) {
        console.error('❌ Erro ao buscar todas as configurações:', allConfigsError);
        return null;
      }

      if (!allConfigs || allConfigs.length === 0) {
        console.log('❌ Nenhuma configuração ativa encontrada');
        return null;
      }

      console.log('📋 Configurações ativas encontradas:', allConfigs.length);

      // Normalizar o nome do mentor para busca mais eficiente
      const normalizedMentor = mentorIdentifier.toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/\s+/g, ' '); // Normaliza espaços
      
      console.log('🔍 Procurando por mentor normalizado:', normalizedMentor);
      
      // Buscar configuração por correspondência de nome
      const matchedConfig = allConfigs.find(config => {
        if (!config.mentor_id) return false;
        
        // Normalizar o mentor_id da configuração da mesma forma
        const configMentor = (config.mentor_id || '').toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' ');
        
        console.log('🔍 Comparando:', normalizedMentor, 'com:', configMentor);
        
        // Verificações de correspondência mais precisas
        const exactMatch = configMentor === normalizedMentor;
        const containsMatch = configMentor.includes(normalizedMentor) || normalizedMentor.includes(configMentor);
        
        // Para "Guilherme Mentore", fazer verificação específica
        const guilhermeMatch = (
          normalizedMentor.includes('guilherme') && 
          configMentor.includes('guilherme')
        );
        
        const isMatch = exactMatch || containsMatch || guilhermeMatch;
        
        if (isMatch) {
          console.log('✅ Encontrou correspondência:', config);
        }
        
        return isMatch;
      });

      if (matchedConfig) {
        console.log('✅ Configuração Calendly encontrada por nome:', matchedConfig);
        return matchedConfig;
      }

      // Se ainda não encontrou, verificar se há apenas uma configuração ativa (fallback)
      if (allConfigs.length === 1) {
        console.log('⚠️ Usando única configuração ativa como fallback:', allConfigs[0]);
        return allConfigs[0];
      }

      console.log('❌ Nenhuma configuração Calendly encontrada para:', mentorIdentifier);
      return null;

    } catch (error) {
      console.error('❌ Erro em getCalendlyConfig:', error);
      return null;
    }
  }, []);

  const saveCalendlyEvent = useCallback(async (eventData: Omit<CalendlyEvent, 'id' | 'created_at' | 'updated_at' | 'synced_at'>): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('calendly_events')
        .insert([eventData]);

      if (error) {
        console.error('Error saving Calendly event:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar evento do Calendly",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Agendamento sincronizado com sucesso!",
      });
      return true;
    } catch (error) {
      console.error('Error in saveCalendlyEvent:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar evento do Calendly",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getCalendlyEvents = useCallback(async (studentId?: string, mentorId?: string): Promise<CalendlyEvent[]> => {
    try {
      let query = supabase.from('calendly_events').select('*');

      if (studentId) {
        query = query.eq('student_id', studentId);
      }
      if (mentorId) {
        query = query.eq('mentor_id', mentorId);
      }

      const { data, error } = await query.order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching Calendly events:', error);
        return [];
      }

      return (data || []).map(item => ({
        ...item,
        status: item.status as 'scheduled' | 'cancelled' | 'completed'
      }));
    } catch (error) {
      console.error('Error in getCalendlyEvents:', error);
      return [];
    }
  }, []);

  const buildCalendlyUrl = useCallback((config: CalendlyConfig): string => {
    const baseUrl = `https://calendly.com/${config.calendly_username}/${config.event_type_slug}`;
    const params = new URLSearchParams({
      hide_gdpr_banner: '1',
      hide_event_type_details: '0'
    });
    
    return `${baseUrl}?${params.toString()}`;
  }, []);

  return {
    loading,
    getCalendlyConfig,
    saveCalendlyEvent,
    getCalendlyEvents,
    buildCalendlyUrl
  };
};
