
import React, { useEffect, useRef, useState } from 'react';
import { CalendlyWidgetOptions, CalendlyEventPayload } from '@/types/calendly.types';
import { useCalendly } from '@/hooks/useCalendly';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, X, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendlyWidgetProps {
  mentorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventScheduled?: (eventData: CalendlyEventPayload) => void;
  className?: string;
  studentName?: string;
  sessionInfo?: {
    sessionNumber: number;
    totalSessions: number;
  };
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
  className,
  studentName,
  sessionInfo
}) => {
  const { user } = useAuth();
  const { getCalendlyConfig, buildCalendlyUrl, saveCalendlyEvent } = useCalendly();
  const containerRef = useRef<HTMLDivElement>(null);
  const [calendlyUrl, setCalendlyUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  // Carregar script do Calendly com timeout
  useEffect(() => {
    const loadCalendlyScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.Calendly) {
          setScriptLoaded(true);
          resolve();
          return;
        }

        console.log('📦 Carregando script do Calendly...');
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        
        const timeout = setTimeout(() => {
          reject(new Error('Timeout ao carregar script do Calendly'));
        }, 10000); // 10 segundos timeout

        script.onload = () => {
          clearTimeout(timeout);
          console.log('✅ Script do Calendly carregado com sucesso');
          setScriptLoaded(true);
          resolve();
        };
        
        script.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Falha ao carregar script do Calendly'));
        };
        
        document.head.appendChild(script);
      });
    };

    loadCalendlyScript().catch((err) => {
      console.error('❌ Erro ao carregar script do Calendly:', err);
      setError('Erro ao carregar o Calendly. Verifique sua conexão com a internet.');
      setIsLoading(false);
    });
  }, []);

  // Carregar configuração do Calendly
  useEffect(() => {
    if (!open || !mentorId || !scriptLoaded) return;

    const loadCalendlyConfig = async () => {
      setIsLoading(true);
      setError('');
      setConfigLoaded(false);

      // Timeout para carregamento da configuração
      loadingTimeoutRef.current = setTimeout(() => {
        setError('Timeout ao carregar configuração. Tente novamente.');
        setIsLoading(false);
      }, 15000); // 15 segundos timeout

      try {
        console.log('🔍 Carregando configuração do Calendly para:', mentorId);
        
        const config = await getCalendlyConfig(mentorId);
        
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        
        if (!config) {
          setError('Configuração do Calendly não encontrada para este mentor. Configure o Calendly primeiro.');
          setIsLoading(false);
          return;
        }

        const url = buildCalendlyUrl(config);
        console.log('🔗 URL do Calendly gerada:', url);
        setCalendlyUrl(url);
        setConfigLoaded(true);
        setIsLoading(false);
      } catch (err) {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        console.error('❌ Erro ao carregar configuração do Calendly:', err);
        setError('Erro ao carregar configuração do Calendly. Tente novamente.');
        setIsLoading(false);
      }
    };

    loadCalendlyConfig();

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [open, mentorId, scriptLoaded, getCalendlyConfig, buildCalendlyUrl]);

  // Inicializar widget do Calendly
  useEffect(() => {
    if (!open || !calendlyUrl || !containerRef.current || !window.Calendly || !configLoaded) {
      return;
    }

    console.log('🚀 Inicializando widget do Calendly...');

    // Limpar container
    containerRef.current.innerHTML = '';

    // Criar mensagem personalizada
    let customMessage = '';
    if (studentName && sessionInfo) {
      customMessage = `${studentName}\n\nSessão ${sessionInfo.sessionNumber} de ${sessionInfo.totalSessions}`;
    } else if (studentName) {
      customMessage = studentName;
    }

    const options: CalendlyWidgetOptions = {
      url: calendlyUrl,
      prefill: {
        name: studentName || user?.email || '',
        email: user?.email || '',
        customAnswers: {
          a1: customMessage // Campo personalizado para informações da sessão
        }
      }
    };

    try {
      window.Calendly.initInlineWidget({
        url: options.url,
        parentElement: containerRef.current,
        prefill: options.prefill
      });
      console.log('✅ Widget do Calendly inicializado com sucesso');
    } catch (err) {
      console.error('❌ Erro ao inicializar widget do Calendly:', err);
      setError('Erro ao inicializar o widget do Calendly');
    }
  }, [open, calendlyUrl, user, configLoaded, studentName, sessionInfo]);

  // Listener para eventos do Calendly
  useEffect(() => {
    const handleCalendlyMessage = async (event: MessageEvent) => {
      if (event.origin !== 'https://calendly.com') return;

      const { data } = event;
      
      if (data.event === 'calendly.event_scheduled') {
        console.log('📅 Evento agendado via Calendly:', data);
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
          console.error('❌ Erro ao processar evento do Calendly:', err);
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

  const handleRetry = () => {
    setError('');
    setIsLoading(true);
    setConfigLoaded(false);
    // Re-trigger da configuração
    if (mentorId && scriptLoaded) {
      // O useEffect vai detectar a mudança e recarregar
    }
  };

  const handleClose = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    onOpenChange(false);
  };

  if (error) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Erro no Calendly
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleRetry} variant="outline">
                Tentar Novamente
              </Button>
              <Button onClick={handleClose}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agendar Mentoria
              {studentName && sessionInfo && (
                <span className="text-sm text-gray-600 ml-2">
                  - {studentName} (Sessão {sessionInfo.sessionNumber}/{sessionInfo.totalSessions})
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {!scriptLoaded ? 'Carregando Calendly...' : 
                   !configLoaded ? 'Configurando agendamento...' : 
                   'Preparando calendário...'}
                </p>
                <p className="text-sm text-gray-500">
                  Isso pode levar alguns segundos
                </p>
              </div>
            </div>
          ) : (
            <div 
              ref={containerRef}
              className={cn("calendly-inline-widget w-full h-[calc(95vh-120px)] min-h-[500px]", className)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
