
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendlyService } from '@/services/calendly/CalendlyService';
import { CalendlyConfig } from '@/types/calendly.types';
import { Calendar, Settings } from 'lucide-react';

interface CalendlyIndicatorProps {
  mentorId: string;
  onConfigureClick?: () => void;
  showConfigButton?: boolean;
}

export const CalendlyIndicator: React.FC<CalendlyIndicatorProps> = ({
  mentorId,
  onConfigureClick,
  showConfigButton = false
}) => {
  const [config, setConfig] = useState<CalendlyConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, [mentorId]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const calendlyConfig = await CalendlyService.getCalendlyConfigByMentor(mentorId);
      setConfig(calendlyConfig);
    } catch (error) {
      console.error('Error loading Calendly config:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="text-xs text-gray-500">Verificando Calendly...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {config && config.active ? (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <Calendar className="h-3 w-3 mr-1" />
          Calendly Ativo
        </Badge>
      ) : (
        <Badge variant="outline" className="text-amber-700 border-amber-300">
          <Settings className="h-3 w-3 mr-1" />
          Calendly não configurado
        </Badge>
      )}
      
      {showConfigButton && onConfigureClick && (
        <Button
          size="sm"
          variant="outline"
          onClick={onConfigureClick}
          className="h-6 px-2 text-xs"
        >
          {config ? 'Editar' : 'Configurar'}
        </Button>
      )}
    </div>
  );
};
