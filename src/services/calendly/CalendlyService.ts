
import { supabase } from '@/integrations/supabase/client';
import { CalendlyConfig, CalendlyEvent } from '@/types/calendly.types';

export class CalendlyService {
  static async createCalendlyConfig(config: Omit<CalendlyConfig, 'id' | 'created_at' | 'updated_at'>): Promise<CalendlyConfig | null> {
    try {
      const { data, error } = await supabase
        .from('calendly_configs')
        .insert([config])
        .select()
        .single();

      if (error) {
        console.error('Error creating Calendly config:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createCalendlyConfig:', error);
      return null;
    }
  }

  static async getCalendlyConfigByMentor(mentorId: string): Promise<CalendlyConfig | null> {
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
      console.error('Error in getCalendlyConfigByMentor:', error);
      return null;
    }
  }

  static async updateCalendlyConfig(id: string, updates: Partial<CalendlyConfig>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('calendly_configs')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating Calendly config:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateCalendlyConfig:', error);
      return false;
    }
  }

  static async syncCalendlyEvent(eventData: Omit<CalendlyEvent, 'id' | 'created_at' | 'updated_at' | 'synced_at'>): Promise<CalendlyEvent | null> {
    try {
      // Primeiro, verificar se o evento já existe
      const { data: existingEvent } = await supabase
        .from('calendly_events')
        .select('*')
        .eq('calendly_event_uri', eventData.calendly_event_uri)
        .single();

      if (existingEvent) {
        // Atualizar evento existente
        const { data, error } = await supabase
          .from('calendly_events')
          .update({ ...eventData, synced_at: new Date().toISOString() })
          .eq('calendly_event_uri', eventData.calendly_event_uri)
          .select()
          .single();

        if (error) {
          console.error('Error updating Calendly event:', error);
          return null;
        }

        return {
          ...data,
          status: data.status as 'scheduled' | 'cancelled' | 'completed'
        };
      } else {
        // Criar novo evento
        const { data, error } = await supabase
          .from('calendly_events')
          .insert([eventData])
          .select()
          .single();

        if (error) {
          console.error('Error creating Calendly event:', error);
          return null;
        }

        return {
          ...data,
          status: data.status as 'scheduled' | 'cancelled' | 'completed'
        };
      }
    } catch (error) {
      console.error('Error in syncCalendlyEvent:', error);
      return null;
    }
  }

  static async getCalendlyEventsByStudent(studentId: string): Promise<CalendlyEvent[]> {
    try {
      const { data, error } = await supabase
        .from('calendly_events')
        .select('*')
        .eq('student_id', studentId)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching student Calendly events:', error);
        return [];
      }

      return (data || []).map(item => ({
        ...item,
        status: item.status as 'scheduled' | 'cancelled' | 'completed'
      }));
    } catch (error) {
      console.error('Error in getCalendlyEventsByStudent:', error);
      return [];
    }
  }

  static async getCalendlyEventsByMentor(mentorId: string): Promise<CalendlyEvent[]> {
    try {
      const { data, error } = await supabase
        .from('calendly_events')
        .select('*')
        .eq('mentor_id', mentorId)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching mentor Calendly events:', error);
        return [];
      }

      return (data || []).map(item => ({
        ...item,
        status: item.status as 'scheduled' | 'cancelled' | 'completed'
      }));
    } catch (error) {
      console.error('Error in getCalendlyEventsByMentor:', error);
      return [];
    }
  }
}
