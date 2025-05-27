
import React, { useEffect, useRef, useState } from 'react';
import { CalendlyWidgetOptions, CalendlyEventPayload } from '@/types/calendly.types';
import { useCalendly } from '@/hooks/useCalendly';
import { useAuth } from '@/hooks/useAuth';
import { useCalendlyScript } from '@/hooks/calendly/useCalendlyScript';
import { useCalendlyEvents } from '@/hooks/calendly/useCalendlyEvents';
import { CalendlyErrorDialog } from './CalendlyErrorDialog';
import { CalendlyLoadingDialog } from './CalendlyLoadingDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';
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
  sessionId?: string;
  onSessionUpdated?: () => void;
}

export const CalendlyWidget: React.FC<CalendlyWidgetProps> = ({
  mentorId,
  open,
  onOpenChange,
  onEventScheduled,
  className,
  studentName,
  sessionInfo,
  sessionId,
  onSessionUpdated
}) => {
  const { user } = useAuth();
  const { getCalendlyConfig, buildCalendlyUrl } = useCalendly();
  const containerRef = useRef<HTMLDivElement>(null);
  const [calendlyUrl, setCalendlyUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [configLoaded, setConfigLoaded] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  const { scriptLoaded, error: scriptError } = useCalendlyScript();

  useCalendlyEvents({
    open,
    mentorId,
    sessionId,
    onEventScheduled,
    onOpenChange,
    onSessionUpdated
  });

  // Carregar configuração do Calendly
  useEffect(() => {
    if (!open || !mentorId || !scriptLoaded) return;

    const loadCalendlyConfig = async () => {
      setIsLoading(true);
      setError('');
      setConfigLoaded(false);

      loadingTimeoutRef.current = setTimeout(() => {
        setError('Timeout ao carregar configuração. Tente novamente.');
        setIsLoading(false);
      }, 15000);

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

    containerRef.current.innerHTML = '';

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
          a1: customMessage
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

  const handleRetry = () => {
    setError('');
    setIsLoading(true);
    setConfigLoaded(false);
  };

  const handleClose = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    onOpenChange(false);
  };

  const currentError = error || scriptError;

  if (currentError) {
    return (
      <CalendlyErrorDialog
        open={open}
        onOpenChange={handleClose}
        error={currentError}
        onRetry={handleRetry}
      />
    );
  }

  if (isLoading) {
    return (
      <CalendlyLoadingDialog
        open={open}
        onOpenChange={handleClose}
        studentName={studentName}
        sessionInfo={sessionInfo}
        scriptLoaded={scriptLoaded}
        configLoaded={configLoaded}
      />
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
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <div 
            ref={containerRef}
            className={cn("calendly-inline-widget w-full h-[calc(95vh-120px)] min-h-[500px]", className)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
