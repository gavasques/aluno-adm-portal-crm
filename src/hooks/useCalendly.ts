
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CalendlyConfig, CalendlyEvent } from '@/types/calendly.types';
import { useToast } from '@/hooks/use-toast';

export const useCalendly = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getCalendlyConfig = useCallback(async (mentorId: string): Promise<CalendlyConfig | null> => {
    try {
      const { data, error } = await supabase
        .from('calendly_configs')
        .select('*')
        .eq('mentor_id', mentorId)
        .eq('active', true)
        .single();

      if (error) {
        console.error('Error fetching Calendly config:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getCalendlyConfig:', error);
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
    return `https://calendly.com/${config.calendly_username}/${config.event_type_slug}?hide_gdpr_banner=1`;
  }, []);

  return {
    loading,
    getCalendlyConfig,
    saveCalendlyEvent,
    getCalendlyEvents,
    buildCalendlyUrl
  };
};
