
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { CalendlyService } from '@/services/calendly/CalendlyService';
import { CalendlyConfig } from '@/types/calendly.types';
import { ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface CalendlyConfigFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentorId: string;
  mentorName: string;
  existingConfig?: CalendlyConfig;
  onSuccess: () => void;
}

export const CalendlyConfigForm: React.FC<CalendlyConfigFormProps> = ({
  open,
  onOpenChange,
  mentorId,
  mentorName,
  existingConfig,
  onSuccess
}) => {
  const [calendlyUsername, setCalendlyUsername] = useState(existingConfig?.calendly_username || '');
  const [eventTypeSlug, setEventTypeSlug] = useState(existingConfig?.event_type_slug || '');
  const [isActive, setIsActive] = useState(existingConfig?.active ?? true);
  const [loading, setLoading] = useState(false);
  const [testingUrl, setTestingUrl] = useState(false);
  const { toast } = useToast();

  const previewUrl = calendlyUsername && eventTypeSlug 
    ? `https://calendly.com/${calendlyUsername}/${eventTypeSlug}`
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!calendlyUsername.trim() || !eventTypeSlug.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const configData = {
        mentor_id: mentorId,
        calendly_username: calendlyUsername.trim(),
        event_type_slug: eventTypeSlug.trim(),
        active: isActive
      };

      let success = false;
      if (existingConfig) {
        success = await CalendlyService.updateCalendlyConfig(existingConfig.id, configData);
      } else {
        const result = await CalendlyService.createCalendlyConfig(configData);
        success = !!result;
      }

      if (success) {
        toast({
          title: "Sucesso",
          description: `Configuração do Calendly ${existingConfig ? 'atualizada' : 'criada'} com sucesso!`,
        });
        onSuccess();
        onOpenChange(false);
        resetForm();
      } else {
        throw new Error('Falha ao salvar configuração');
      }
    } catch (error) {
      console.error('Error saving Calendly config:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configuração do Calendly",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (!existingConfig) {
      setCalendlyUsername('');
      setEventTypeSlug('');
      setIsActive(true);
    }
  };

  const testCalendlyUrl = async () => {
    if (!previewUrl) return;
    
    setTestingUrl(true);
    try {
      // Abrir a URL em uma nova aba para teste
      window.open(previewUrl, '_blank');
      
      toast({
        title: "Teste do Calendly",
        description: "URL aberta em nova aba. Verifique se a página carrega corretamente.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao abrir URL do Calendly",
        variant: "destructive",
      });
    } finally {
      setTestingUrl(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingConfig ? 'Editar' : 'Configurar'} Calendly - {mentorName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="calendlyUsername">Username do Calendly *</Label>
            <Input
              id="calendlyUsername"
              value={calendlyUsername}
              onChange={(e) => setCalendlyUsername(e.target.value)}
              placeholder="Ex: joao-mentor"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Encontre em: calendly.com/seu-username
            </p>
          </div>

          <div>
            <Label htmlFor="eventTypeSlug">Event Type Slug *</Label>
            <Input
              id="eventTypeSlug"
              value={eventTypeSlug}
              onChange={(e) => setEventTypeSlug(e.target.value)}
              placeholder="Ex: mentoria-individual"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Nome do tipo de evento (URL final)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="active">Configuração ativa</Label>
          </div>

          {previewUrl && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 mb-1">Preview da URL:</p>
                  <p className="text-xs text-blue-700 break-all">{previewUrl}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={testCalendlyUrl}
                  disabled={testingUrl}
                  className="ml-2"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-800">
                <p className="font-medium mb-1">Como obter essas informações:</p>
                <p>1. Acesse calendly.com e faça login</p>
                <p>2. Vá em "Event Types" e clique no evento desejado</p>
                <p>3. Copie o username e slug da URL de agendamento</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : existingConfig ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
