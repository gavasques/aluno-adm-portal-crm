
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
      console.log('🔍 useCalendly - Buscando configuração Calendly para mentor:', `"${cleanMentorId}"`);
      console.log('📋 useCalendly - Tipo do mentorId:', typeof cleanMentorId, 'Comprimento:', cleanMentorId.length);
      
      // Primeiro, vamos ver todas as configurações disponíveis
      const { data: allConfigs, error: allError } = await supabase
        .from('calendly_configs')
        .select('*');

      if (allError) {
        console.error('❌ useCalendly - Erro ao buscar todas as configurações:', allError);
        throw allError;
      }

      console.log('📋 useCalendly - Todas as configurações no banco:', allConfigs);
      console.log('📋 useCalendly - Configurações ativas:', allConfigs?.filter(c => c.active));

      // Buscar configuração exata primeiro (case-sensitive)
      let { data, error } = await supabase
        .from('calendly_configs')
        .select('*')
        .eq('mentor_id', cleanMentorId)
        .eq('active', true)
        .maybeSingle();

      if (error) {
        console.error('❌ useCalendly - Erro na primeira busca:', error);
        throw error;
      }

      console.log('📋 useCalendly - Resultado da busca exata:', data);

      // Se não encontrou, tentar busca case-insensitive em todas as configurações
      if (!data && allConfigs) {
        console.log('🔄 useCalendly - Tentando busca case-insensitive...');
        
        // Buscar por correspondência case-insensitive e trim
        data = allConfigs.find(config => {
          const configMentorId = config.mentor_id?.toString().trim() || '';
          const searchMentorId = cleanMentorId.toLowerCase();
          const configMentorIdLower = configMentorId.toLowerCase();
          
          console.log(`🔍 Comparando: "${configMentorIdLower}" com "${searchMentorId}"`);
          
          return configMentorIdLower === searchMentorId && config.active;
        }) || null;

        if (data) {
          console.log('✅ useCalendly - Configuração encontrada com busca case-insensitive:', data);
        }
      }

      // Se ainda não encontrou, tentar busca por substring (inclui)
      if (!data && allConfigs) {
        console.log('🔄 useCalendly - Tentando busca por substring...');
        
        data = allConfigs.find(config => {
          const configMentorId = config.mentor_id?.toString().trim() || '';
          const searchMentorId = cleanMentorId.toLowerCase();
          const configMentorIdLower = configMentorId.toLowerCase();
          
          const includesMatch = configMentorIdLower.includes(searchMentorId) || 
                               searchMentorId.includes(configMentorIdLower);
          
          console.log(`🔍 Verificando substring: "${configMentorIdLower}" <-> "${searchMentorId}" = ${includesMatch}`);
          
          return includesMatch && config.active;
        }) || null;

        if (data) {
          console.log('✅ useCalendly - Configuração encontrada com busca por substring:', data);
        }
      }

      if (!data) {
        console.warn('❌ useCalendly - Nenhuma configuração ativa encontrada para mentor:', `"${cleanMentorId}"`);
        
        // Log detalhado para debug
        console.log('🔍 useCalendly - IDs dos mentores disponíveis:', 
          allConfigs?.map(c => `"${c.mentor_id}"`) || []);
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
