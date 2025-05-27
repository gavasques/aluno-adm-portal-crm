
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendlyWidget } from './CalendlyWidget';
import { CalendlyEventPayload } from '@/types/calendly.types';
import { Calendar } from 'lucide-react';
import { useCalendly } from '@/hooks/useCalendly';
import { ButtonProps } from '@/components/ui/button';

interface CalendlyButtonProps extends Omit<ButtonProps, 'onClick'> {
  mentorId: string;
  onEventScheduled?: (eventData: CalendlyEventPayload) => void;
  children?: React.ReactNode;
}

export const CalendlyButton: React.FC<CalendlyButtonProps> = ({
  mentorId,
  onEventScheduled,
  children,
  className = '',
  disabled = false,
  variant,
  size,
  ...buttonProps
}) => {
  const [showWidget, setShowWidget] = useState(false);
  const { getCalendlyConfig } = useCalendly();

  const handleClick = async () => {
    console.log('🖱️ CalendlyButton clicked for mentor:', mentorId);
    
    // Verificar se existe configuração antes de abrir o widget
    const config = await getCalendlyConfig(mentorId);
    if (!config) {
      console.error('❌ Configuração Calendly não encontrada para:', mentorId);
      // O widget vai mostrar o erro apropriado
    }
    
    setShowWidget(true);
  };

  const handleEventScheduled = (eventData: CalendlyEventPayload) => {
    console.log('📅 Evento agendado via CalendlyButton:', eventData);
    if (onEventScheduled) {
      onEventScheduled(eventData);
    }
    setShowWidget(false);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className={className}
        disabled={disabled}
        variant={variant}
        size={size}
        {...buttonProps}
      >
        <Calendar className="h-4 w-4 mr-2" />
        {children || 'Agendar via Calendly'}
      </Button>

      <CalendlyWidget
        mentorId={mentorId}
        open={showWidget}
        onOpenChange={setShowWidget}
        onEventScheduled={handleEventScheduled}
      />
    </>
  );
};
