
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { LeadStatus } from '@/types/crm.types';
import { useCRMLossReasons } from '@/hooks/crm/useCRMLossReasons';
import { toast } from 'sonner';

interface StatusChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadName: string;
  currentStatus: LeadStatus;
  onStatusChange: (status: LeadStatus, reason?: string, lossReasonId?: string) => Promise<void>;
}

const StatusChangeDialog: React.FC<StatusChangeDialogProps> = ({
  open,
  onOpenChange,
  leadName,
  currentStatus,
  onStatusChange
}) => {
  const [newStatus, setNewStatus] = useState<LeadStatus>(currentStatus);
  const [reason, setReason] = useState('');
  const [selectedLossReasonId, setSelectedLossReasonId] = useState('');
  const [loading, setLoading] = useState(false);
  const { lossReasons } = useCRMLossReasons();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setNewStatus(currentStatus);
      setReason('');
      setSelectedLossReasonId('');
    }
  }, [open, currentStatus]);

  const statusOptions = [
    { value: 'aberto', label: 'Aberto', icon: AlertTriangle, color: 'text-blue-600' },
    { value: 'ganho', label: 'Ganho', icon: CheckCircle, color: 'text-green-600' },
    { value: 'perdido', label: 'Perdido', icon: XCircle, color: 'text-red-600' }
  ];

  const requiresReason = newStatus === 'ganho';
  const requiresLossReason = newStatus === 'perdido';
  const hasStatusChanged = newStatus !== currentStatus;

  const handleSubmit = async () => {
    if (requiresReason && !reason.trim()) {
      toast.error('Por favor, informe o motivo do ganho');
      return;
    }

    if (requiresLossReason && !selectedLossReasonId) {
      toast.error('Por favor, selecione o motivo da perda');
      return;
    }

    if (!hasStatusChanged) {
      onOpenChange(false);
      return;
    }

    try {
      setLoading(true);
      await onStatusChange(
        newStatus, 
        reason.trim() || undefined,
        selectedLossReasonId || undefined
      );
      toast.success(`Status alterado para "${statusOptions.find(s => s.value === newStatus)?.label}"`);
      onOpenChange(false);
      setReason('');
      setSelectedLossReasonId('');
    } catch (error) {
      toast.error('Erro ao alterar status do lead');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewStatus(currentStatus);
    setReason('');
    setSelectedLossReasonId('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Status do Lead</DialogTitle>
          <DialogDescription>
            Altere o status de <strong>{leadName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Novo Status</Label>
            <Select value={newStatus} onValueChange={(value: LeadStatus) => setNewStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${option.color}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {requiresLossReason && (
            <div className="space-y-2">
              <Label htmlFor="lossReason">Motivo da Perda *</Label>
              <Select value={selectedLossReasonId} onValueChange={setSelectedLossReasonId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o motivo da perda" />
                </SelectTrigger>
                <SelectContent>
                  {lossReasons.map((lossReason) => (
                    <SelectItem key={lossReason.id} value={lossReason.id}>
                      <div>
                        <div className="font-medium">{lossReason.name}</div>
                        {lossReason.description && (
                          <div className="text-xs text-gray-500">{lossReason.description}</div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {requiresReason && (
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo do ganho *</Label>
              <Textarea
                id="reason"
                placeholder="Descreva o motivo do ganho..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          )}

          {/* Observações adicionais sempre disponíveis */}
          {(requiresLossReason || requiresReason) && (
            <div className="space-y-2">
              <Label htmlFor="additional-notes">
                {requiresLossReason ? 'Observações Adicionais' : 'Observações'}
              </Label>
              <Textarea
                id="additional-notes"
                placeholder={requiresLossReason 
                  ? "Observações adicionais sobre a perda (opcional)..."
                  : "Observações sobre o ganho (opcional)..."
                }
                value={requiresLossReason ? reason : ''}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[60px]"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || (requiresReason && !reason.trim()) || (requiresLossReason && !selectedLossReasonId)}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusChangeDialog;
