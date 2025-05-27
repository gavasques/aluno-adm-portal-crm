
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
      
      const cleanMentorId = mentorId.trim();
      console.log('🔍 useCalendly - Buscando configuração Calendly para mentor ID:', `"${cleanMentorId}"`);
      
      // Primeiro tentar buscar por UUID (novo formato)
      let { data, error } = await supabase
        .from('calendly_configs')
        .select('*')
        .eq('mentor_id', cleanMentorId)
        .eq('active', true)
        .maybeSingle();

      if (error) {
        console.error('❌ useCalendly - Erro na busca por mentor_id UUID:', error);
        
        // Se falhou, tentar buscar o mentor por nome na tabela profiles
        console.log('🔄 useCalendly - Tentando buscar mentor por nome...');
        
        const { data: mentorProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('is_mentor', true)
          .ilike('name', `%${cleanMentorId}%`)
          .maybeSingle();

        if (profileError) {
          console.error('❌ useCalendly - Erro ao buscar mentor por nome:', profileError);
          return null;
        }

        if (mentorProfile) {
          console.log('✅ useCalendly - Mentor encontrado por nome:', mentorProfile);
          
          // Buscar configuração com o UUID correto
          const { data: configData, error: configError } = await supabase
            .from('calendly_configs')
            .select('*')
            .eq('mentor_id', mentorProfile.id)
            .eq('active', true)
            .maybeSingle();

          if (configError) {
            console.error('❌ useCalendly - Erro ao buscar config por UUID do mentor:', configError);
            return null;
          }

          data = configData;
        }
      }

      console.log('📋 useCalendly - Resultado da busca:', data);

      if (data) {
        console.log('✅ useCalendly - Configuração ativa encontrada');
        return data;
      }

      console.warn('❌ useCalendly - Nenhuma configuração ativa encontrada');
      return null;
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
