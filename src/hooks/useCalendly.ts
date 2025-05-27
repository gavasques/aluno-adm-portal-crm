
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
      
      // Primeiro, tentar buscar por mentor_id (UUID)
      let { data, error } = await supabase
        .from('calendly_configs')
        .select('*')
        .eq('mentor_id', mentorIdentifier)
        .eq('active', true)
        .maybeSingle();

      // Se não encontrou por ID, tentar buscar por correspondência de nome
      if (!data && !error) {
        console.log('🔍 Não encontrou por ID, buscando por similaridade de nome...');
        
        // Buscar todas as configurações ativas
        const { data: allConfigs, error: allConfigsError } = await supabase
          .from('calendly_configs')
          .select('*')
          .eq('active', true);

        if (allConfigsError) {
          console.error('Erro ao buscar todas as configurações:', allConfigsError);
          return null;
        }

        if (allConfigs && allConfigs.length > 0) {
          // Normalizar o nome do mentor para busca
          const normalizedMentor = mentorIdentifier.toLowerCase()
            .replace(/\s+/g, ' ')
            .trim();
          
          console.log('🔍 Procurando por mentor normalizado:', normalizedMentor);
          
          // Tentar encontrar por correspondência parcial
          data = allConfigs.find(config => {
            const username = config.calendly_username?.toLowerCase() || '';
            
            // Verificações de correspondência
            const checks = [
              // Correspondência exata de username
              username === normalizedMentor,
              // Username contém o nome do mentor
              username.includes(normalizedMentor),
              // Nome do mentor contém o username
              normalizedMentor.includes(username),
              // Correspondência específica para "Guilherme"
              normalizedMentor.includes('guilherme') && username.includes('guilherme'),
              // Correspondência por palavras-chave
              normalizedMentor.includes('mentor') && username.includes('guilherme')
            ];
            
            const match = checks.some(check => check);
            if (match) {
              console.log('✅ Encontrou correspondência:', config);
            }
            return match;
          }) || null;
          
          // Se ainda não encontrou, tentar busca mais flexível
          if (!data) {
            console.log('🔍 Tentando busca mais flexível...');
            data = allConfigs[0] || null; // Usar a primeira configuração ativa como fallback
            if (data) {
              console.log('⚠️ Usando configuração padrão como fallback:', data);
            }
          }
        }
      }

      if (error) {
        console.error('❌ Erro ao buscar configuração Calendly:', error);
        return null;
      }

      if (data) {
        console.log('✅ Configuração Calendly encontrada:', data);
      } else {
        console.log('❌ Nenhuma configuração Calendly encontrada para:', mentorIdentifier);
      }

      return data;
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
