
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { CalendlyWidget } from './CalendlyWidget';
import { CalendlyEventPayload } from '@/types/calendly.types';

interface CalendlyButtonProps {
  mentorId: string;
  onEventScheduled?: (eventData: CalendlyEventPayload) => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export const CalendlyButton: React.FC<CalendlyButtonProps> = ({
  mentorId,
  onEventScheduled,
  variant = 'default',
  size = 'default',
  className,
  children
}) => {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  const handleEventScheduled = (eventData: CalendlyEventPayload) => {
    if (onEventScheduled) {
      onEventScheduled(eventData);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsCalendlyOpen(true)}
      >
        <Calendar className="h-4 w-4 mr-2" />
        {children || 'Agendar via Calendly'}
      </Button>

      <CalendlyWidget
        mentorId={mentorId}
        open={isCalendlyOpen}
        onOpenChange={setIsCalendlyOpen}
        onEventScheduled={handleEventScheduled}
      />
    </>
  );
};
