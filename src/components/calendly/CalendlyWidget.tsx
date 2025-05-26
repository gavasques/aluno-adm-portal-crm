
import React, { useEffect, useRef, useState } from 'react';
import { CalendlyWidgetOptions, CalendlyEventPayload } from '@/types/calendly.types';
import { useCalendly } from '@/hooks/useCalendly';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendlyWidgetProps {
  mentorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventScheduled?: (eventData: CalendlyEventPayload) => void;
  className?: string;
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: any) => void;
      closePopupWidget: () => void;
    };
  }
}

export const CalendlyWidget: React.FC<CalendlyWidgetProps> = ({
  mentorId,
  open,
  onOpenChange,
  onEventScheduled,
  className
}) => {
  const { user } = useAuth();
  const { getCalendlyConfig, buildCalendlyUrl, saveCalendlyEvent } = useCalendly();
  const containerRef = useRef<HTMLDivElement>(null);
  const [calendlyUrl, setCalendlyUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadCalendlyScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.Calendly) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Calendly script'));
        document.head.appendChild(script);
      });
    };

    loadCalendlyScript().catch((err) => {
      console.error('Error loading Calendly script:', err);
      setError('Erro ao carregar o Calendly');
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!open || !mentorId) return;

    const loadCalendlyConfig = async () => {
      setIsLoading(true);
      setError('');

      try {
        const config = await getCalendlyConfig(mentorId);
        
        if (!config) {
          setError('Configuração do Calendly não encontrada para este mentor');
          setIsLoading(false);
          return;
        }

        const url = buildCalendlyUrl(config);
        setCalendlyUrl(url);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Calendly config:', err);
        setError('Erro ao carregar configuração do Calendly');
        setIsLoading(false);
      }
    };

    loadCalendlyConfig();
  }, [open, mentorId, getCalendlyConfig, buildCalendlyUrl]);

  useEffect(() => {
    if (!open || !calendlyUrl || !containerRef.current || !window.Calendly || isLoading) {
      return;
    }

    const options: CalendlyWidgetOptions = {
      url: calendlyUrl,
      prefill: {
        name: user?.name || '',
        email: user?.email || ''
      }
    };

    try {
      window.Calendly.initInlineWidget({
        url: options.url,
        parentElement: containerRef.current,
        prefill: options.prefill
      });
    } catch (err) {
      console.error('Error initializing Calendly widget:', err);
      setError('Erro ao inicializar o widget do Calendly');
    }
  }, [open, calendlyUrl, user, isLoading]);

  useEffect(() => {
    const handleCalendlyMessage = async (event: MessageEvent) => {
      if (event.origin !== 'https://calendly.com') return;

      const { data } = event;
      
      if (data.event === 'calendly.event_scheduled') {
        const payload = data as CalendlyEventPayload;
        
        try {
          // Encontrar o mentor no evento
          const mentorEmail = payload.payload.event_memberships?.[0]?.user?.email;
          
          const eventData = {
            calendly_event_uri: payload.payload.uri,
            student_id: user?.id || '',
            mentor_id: mentorId,
            event_name: payload.payload.event.name,
            start_time: payload.payload.event.start_time,
            end_time: payload.payload.event.end_time,
            duration_minutes: payload.payload.event.duration,
            status: 'scheduled' as const
          };

          await saveCalendlyEvent(eventData);
          
          if (onEventScheduled) {
            onEventScheduled(payload);
          }

          // Fechar o dialog após agendamento bem-sucedido
          setTimeout(() => {
            onOpenChange(false);
          }, 2000);

        } catch (err) {
          console.error('Error handling Calendly event:', err);
        }
      }
    };

    if (open) {
      window.addEventListener('message', handleCalendlyMessage);
    }

    return () => {
      window.removeEventListener('message', handleCalendlyMessage);
    };
  }, [open, user, mentorId, saveCalendlyEvent, onEventScheduled, onOpenChange]);

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Erro no Calendly
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agendar Mentoria
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando calendário...</p>
              </div>
            </div>
          ) : (
            <div 
              ref={containerRef}
              className={cn("calendly-inline-widget", "min-h-[600px] w-full", className)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
