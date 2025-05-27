
import { useState, useCallback } from 'react';
import { CalendlyConfig } from '@/types/calendly.types';
import { useToast } from '@/hooks/use-toast';

export const useCalendly = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getCalendlyConfig = useCallback(async (mentorId: string): Promise<CalendlyConfig | null> => {
    try {
      setLoading(true);
      const { supabase } = await import('@/integrations/supabase/client');
      
      console.log('🔍 useCalendly - Buscando configuração Calendly para mentor:', mentorId);
      console.log('📋 useCalendly - Tipo do mentorId:', typeof mentorId, 'Comprimento:', mentorId.length);
      
      // Buscar configuração exata primeiro
      let { data, error } = await supabase
        .from('calendly_configs')
        .select('*')
        .eq('mentor_id', mentorId)
        .eq('active', true)
        .maybeSingle();

      if (error) {
        console.error('❌ useCalendly - Erro na primeira busca:', error);
        throw error;
      }

      // Se não encontrou, tentar busca case-insensitive
      if (!data) {
        console.log('🔄 useCalendly - Tentando busca case-insensitive...');
        const { data: allConfigs, error: allError } = await supabase
          .from('calendly_configs')
          .select('*')
          .eq('active', true);

        if (allError) {
          console.error('❌ useCalendly - Erro na busca geral:', allError);
          throw allError;
        }

        console.log('📋 useCalendly - Todas as configurações encontradas:', allConfigs);
        
        // Buscar por correspondência case-insensitive
        data = allConfigs?.find(config => 
          config.mentor_id?.toLowerCase().trim() === mentorId.toLowerCase().trim()
        ) || null;

        if (data) {
          console.log('✅ useCalendly - Configuração encontrada com busca case-insensitive:', data);
        }
      }

      if (!data) {
        console.warn('❌ useCalendly - Nenhuma configuração ativa encontrada para mentor:', mentorId);
        
        // Mostrar todas as configurações disponíveis para debug
        const { data: debugConfigs } = await supabase
          .from('calendly_configs')
          .select('mentor_id, active');
        
        console.log('🔍 useCalendly - Configurações disponíveis no banco:', debugConfigs);
        return null;
      }

      console.log('✅ useCalendly - Configuração encontrada:', data);
      return data;
    } catch (error) {
      console.error('❌ useCalendly - Erro ao obter configuração do Calendly:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const buildCalendlyUrl = useCallback((config: CalendlyConfig): string => {
    const baseUrl = `https://calendly.com/${config.calendly_username}/${config.event_type_slug}`;
    console.log('🔗 useCalendly - URL do Calendly construída:', baseUrl);
    return baseUrl;
  }, []);

  const saveCalendlyEvent = useCallback(async (eventData: any): Promise<void> => {
    try {
      setLoading(true);
      const { supabase } = await import('@/integrations/supabase/client');
      
      console.log('💾 useCalendly - Salvando evento do Calendly:', eventData);
      
      const { error } = await supabase
        .from('calendly_events')
        .insert([{
          calendly_event_uri: eventData.calendly_event_uri,
          student_id: eventData.student_id,
          mentor_id: eventData.mentor_id,
          event_name: eventData.event_name,
          start_time: eventData.start_time,
          end_time: eventData.end_time,
          duration_minutes: eventData.duration_minutes,
          status: eventData.status || 'scheduled'
        }]);

      if (error) {
        console.error('❌ useCalendly - Erro ao salvar evento:', error);
        throw error;
      }

      console.log('✅ useCalendly - Evento salvo com sucesso!');
    } catch (error) {
      console.error('❌ useCalendly - Erro ao salvar evento do Calendly:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar dados do agendamento. Verifique o console.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    getCalendlyConfig,
    buildCalendlyUrl,
    saveCalendlyEvent
  };
};
