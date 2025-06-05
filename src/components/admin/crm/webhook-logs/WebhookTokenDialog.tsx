
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Key, Save, X, Calendar } from 'lucide-react';
import { useCRMWebhookTokens } from '@/hooks/crm/useCRMWebhookTokens';
import { toast } from 'sonner';

interface WebhookTokenDialogProps {
  pipelineId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WebhookTokenDialog = ({ pipelineId, open, onOpenChange }: WebhookTokenDialogProps) => {
  const [formData, setFormData] = useState({
    hasExpiration: false,
    expirationDate: '',
    expirationTime: '',
    reason: ''
  });

  const { generateToken } = useCRMWebhookTokens(pipelineId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let expiresAt: string | undefined;
      
      if (formData.hasExpiration && formData.expirationDate) {
        const dateTime = formData.expirationTime 
          ? `${formData.expirationDate}T${formData.expirationTime}:00.000Z`
          : `${formData.expirationDate}T23:59:59.000Z`;
        
        const expirationDateTime = new Date(dateTime);
        
        if (expirationDateTime <= new Date()) {
          toast.error('A data de expiração deve ser no futuro');
          return;
        }
        
        expiresAt = expirationDateTime.toISOString();
      }

      await generateToken.mutateAsync({
        pipeline_id: pipelineId,
        expires_at: expiresAt,
        reason: formData.reason || 'Token criado pelo administrador'
      });

      onOpenChange(false);
      setFormData({
        hasExpiration: false,
        expirationDate: '',
        expirationTime: '',
        reason: ''
      });
    } catch (error) {
      console.error('Erro ao gerar token:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Gerar Novo Token de Segurança
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo/Descrição</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Ex: Token para integração com sistema X"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hasExpiration"
              checked={formData.hasExpiration}
              onCheckedChange={(checked) => setFormData(prev => ({ 
                ...prev, 
                hasExpiration: checked,
                expirationDate: checked ? prev.expirationDate : '',
                expirationTime: checked ? prev.expirationTime : ''
              }))}
            />
            <Label htmlFor="hasExpiration">Definir data de expiração</Label>
          </div>

          {formData.hasExpiration && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="expirationDate">Data de Expiração</Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expirationTime">Horário (opcional)</Label>
                <Input
                  id="expirationTime"
                  type="time"
                  value={formData.expirationTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, expirationTime: e.target.value }))}
                />
                <p className="text-xs text-gray-500">
                  Se não definir horário, será 23:59 do dia selecionado
                </p>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h4 className="font-medium text-yellow-900 mb-1">⚠️ Importante</h4>
            <div className="text-sm text-yellow-800 space-y-1">
              <p>• O token atual será desativado automaticamente</p>
              <p>• Anote o novo token, ele não poderá ser visualizado novamente</p>
              <p>• Atualize suas integrações com o novo token</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={generateToken.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {generateToken.isPending ? 'Gerando...' : 'Gerar Token'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
