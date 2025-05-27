
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendlyWidget } from './CalendlyWidget';
import { CalendlyEventPayload } from '@/types/calendly.types';
import { Calendar, Loader2 } from 'lucide-react';
import { useCalendly } from '@/hooks/useCalendly';
import { ButtonProps } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CalendlyButtonProps extends Omit<ButtonProps, 'onClick'> {
  mentorId: string;
  onEventScheduled?: (eventData: CalendlyEventPayload) => void;
  children?: React.ReactNode;
  studentName?: string;
  sessionInfo?: {
    sessionNumber: number;
    totalSessions: number;
  };
}

export const CalendlyButton: React.FC<CalendlyButtonProps> = ({
  mentorId,
  onEventScheduled,
  children,
  className = '',
  disabled = false,
  variant,
  size,
  studentName,
  sessionInfo,
  ...buttonProps
}) => {
  const [showWidget, setShowWidget] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { getCalendlyConfig } = useCalendly();
  const { toast } = useToast();

  const handleClick = async () => {
    setIsChecking(true);
    
    try {
      console.log('🖱️ CalendlyButton clicked for mentor:', mentorId);
      
      // Verificar se existe configuração antes de abrir o widget
      const config = await getCalendlyConfig(mentorId);
      
      if (!config) {
        console.error('❌ Configuração Calendly não encontrada para:', mentorId);
        toast({
          title: "Calendly não configurado",
          description: `Configure o Calendly para o mentor "${mentorId}" antes de agendar.`,
          variant: "destructive",
        });
        setIsChecking(false);
        return;
      }

      console.log('✅ Configuração encontrada, abrindo widget...');
      setShowWidget(true);
    } catch (error) {
      console.error('❌ Erro ao verificar configuração:', error);
      toast({
        title: "Erro",
        description: "Erro ao verificar configuração do Calendly. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleEventScheduled = (eventData: CalendlyEventPayload) => {
    console.log('📅 Evento agendado via CalendlyButton:', eventData);
    if (onEventScheduled) {
      onEventScheduled(eventData);
    }
    setShowWidget(false);
  };

  const handleWidgetClose = (open: boolean) => {
    setShowWidget(open);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className={className}
        disabled={disabled || isChecking}
        variant={variant}
        size={size}
        {...buttonProps}
      >
        {isChecking ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Calendar className="h-4 w-4 mr-2" />
        )}
        {isChecking ? 'Verificando...' : (children || 'Agendar via Calendly')}
      </Button>

      <CalendlyWidget
        mentorId={mentorId}
        open={showWidget}
        onOpenChange={handleWidgetClose}
        onEventScheduled={handleEventScheduled}
        studentName={studentName}
        sessionInfo={sessionInfo}
      />
    </>
  );
};
