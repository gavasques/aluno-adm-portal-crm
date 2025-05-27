
import { useEffect, useRef } from 'react';
import { CalendlyEventPayload } from '@/types/calendly.types';
import { useCalendly } from '@/hooks/useCalendly';
import { useAuth } from '@/hooks/useAuth';

interface UseCalendlyEventsProps {
  open: boolean;
  mentorId: string;
  sessionId?: string;
  onEventScheduled?: (eventData: CalendlyEventPayload) => void;
  onOpenChange: (open: boolean) => void;
  onSessionUpdated?: () => void;
}

export const useCalendlyEvents = ({
  open,
  mentorId,
  sessionId,
  onEventScheduled,
  onOpenChange,
  onSessionUpdated
}: UseCalendlyEventsProps) => {
  const { user } = useAuth();
  const { saveCalendlyEvent } = useCalendly();
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  const updateSessionFromCalendly = async (sessionId: string, payload: CalendlyEventPayload) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const sessionUpdateData = {
        status: 'agendada',
        scheduled_date: payload.payload.event?.start_time || new Date().toISOString(),
        duration_minutes: payload.payload.event?.duration || 60,
        calendly_link: payload.payload.uri || '',
        observations: `Agendado via Calendly: ${payload.payload.event?.name || 'Sessão de Mentoria'}`,
        updated_at: new Date().toISOString()
      };

      console.log('📝 Atualizando sessão com dados:', sessionUpdateData);

      const { error } = await supabase
        .from('mentoring_sessions')
        .update(sessionUpdateData)
        .eq('id', sessionId);

      if (error) {
        console.error('❌ Erro ao atualizar sessão:', error);
        throw error;
      }

      console.log('✅ Sessão atualizada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao atualizar sessão:', error);
      throw error;
    }
  };

  useEffect(() => {
    const handleCalendlyMessage = async (event: MessageEvent) => {
      if (event.origin !== 'https://calendly.com') return;

      const { data } = event;
      console.log('📅 Evento recebido do Calendly:', data);
      
      if (data.event === 'calendly.event_scheduled') {
        console.log('🎯 Evento de agendamento detectado:', data);
        const payload = data as CalendlyEventPayload;
        
        try {
          const eventDetails = {
            calendly_event_uri: payload.payload.uri || '',
            student_id: user?.id || '',
            mentor_id: mentorId,
            event_name: payload.payload.event?.name || 'Sessão de Mentoria',
            start_time: payload.payload.event?.start_time || new Date().toISOString(),
            end_time: payload.payload.event?.end_time || new Date().toISOString(),
            duration_minutes: payload.payload.event?.duration || 60,
            status: 'scheduled' as const,
            session_id: sessionId
          };

          console.log('💾 Salvando evento no banco de dados:', eventDetails);
          
          await saveCalendlyEvent(eventDetails);
          
          if (sessionId) {
            console.log('🔄 Atualizando sessão:', sessionId);
            await updateSessionFromCalendly(sessionId, payload);
          }
          
          if (onEventScheduled) {
            onEventScheduled(payload);
          }

          console.log('✅ Agendamento processado com sucesso!');
          
          if (onSessionUpdated) {
            onSessionUpdated();
          }
          
          setTimeout(() => {
            onOpenChange(false);
          }, 1000);

        } catch (err) {
          console.error('❌ Erro ao processar evento do Calendly:', err);
          throw err;
        }
      }
    };

    if (open) {
      window.addEventListener('message', handleCalendlyMessage);
    }

    return () => {
      window.removeEventListener('message', handleCalendlyMessage);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [open, user, mentorId, sessionId, saveCalendlyEvent, onEventScheduled, onOpenChange, onSessionUpdated]);

  return { updateSessionFromCalendly };
};
