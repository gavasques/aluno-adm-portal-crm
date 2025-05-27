
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCalendly } from '@/hooks/useCalendly';
import { CalendlyConfig } from '@/types/calendly.types';
import { Calendar, Settings, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface CalendlyIndicatorProps {
  mentorId: string;
  onConfigureClick?: () => void;
  showConfigButton?: boolean;
}

export const CalendlyIndicator: React.FC<CalendlyIndicatorProps> = ({
  mentorId,
  onConfigureClick,
  showConfigButton = true
}) => {
  const [config, setConfig] = useState<CalendlyConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { getCalendlyConfig } = useCalendly();

  useEffect(() => {
    loadConfig();
  }, [mentorId]);

  const loadConfig = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔍 CalendlyIndicator - Buscando config para mentor:', mentorId);
      
      const calendlyConfig = await getCalendlyConfig(mentorId);
      
      console.log('📋 Configuração retornada:', calendlyConfig);
      setConfig(calendlyConfig);
      
      if (!calendlyConfig) {
        setError(`Calendly não configurado para "${mentorId}"`);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configuração Calendly:', error);
      setError('Erro ao carregar configuração');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span className="text-xs text-gray-500">Verificando Calendly...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {config && config.active ? (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Calendly Ativo
          <span className="ml-1 text-xs">(@{config.calendly_username})</span>
        </Badge>
      ) : (
        <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {error || 'Calendly não configurado'}
        </Badge>
      )}
      
      {showConfigButton && onConfigureClick && (
        <Button
          size="sm"
          variant="outline"
          onClick={onConfigureClick}
          className="h-6 px-2 text-xs"
        >
          <Settings className="h-3 w-3 mr-1" />
          {config ? 'Editar' : 'Configurar'}
        </Button>
      )}
    </div>
  );
};
