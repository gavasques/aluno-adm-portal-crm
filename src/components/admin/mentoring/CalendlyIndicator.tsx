
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
      console.log('📋 CalendlyIndicator - Tipo do mentorId:', typeof mentorId);
      console.log('📋 CalendlyIndicator - MentorId limpo:', `"${mentorId.trim()}"`);
      
      if (!mentorId || mentorId.trim() === '') {
        console.warn('⚠️ CalendlyIndicator - MentorId vazio ou nulo');
        setError('ID do mentor não informado');
        setLoading(false);
        return;
      }
      
      const calendlyConfig = await getCalendlyConfig(mentorId.trim());
      
      console.log('📋 CalendlyIndicator - Configuração retornada:', calendlyConfig);
      console.log('✅ CalendlyIndicator - Config ativa?', calendlyConfig?.active);
      
      setConfig(calendlyConfig);
      
      if (!calendlyConfig) {
        console.warn(`❌ CalendlyIndicator - Nenhuma configuração encontrada para mentor: "${mentorId}"`);
        setError(`Calendly não configurado`);
      } else if (!calendlyConfig.active) {
        console.warn(`⚠️ CalendlyIndicator - Configuração encontrada mas inativa para mentor: "${mentorId}"`);
        setError(`Calendly inativo`);
      } else {
        console.log(`✅ CalendlyIndicator - Configuração ativa encontrada para mentor: "${mentorId}"`);
      }
    } catch (error) {
      console.error('❌ CalendlyIndicator - Erro ao carregar configuração:', error);
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
