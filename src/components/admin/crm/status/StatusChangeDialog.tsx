
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { LeadStatus } from '@/types/crm.types';
import { toast } from 'sonner';

interface StatusChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadName: string;
  currentStatus: LeadStatus;
  onStatusChange: (status: LeadStatus, reason?: string) => Promise<void>;
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
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: 'aberto', label: 'Aberto', icon: AlertTriangle, color: 'text-blue-600' },
    { value: 'ganho', label: 'Ganho', icon: CheckCircle, color: 'text-green-600' },
    { value: 'perdido', label: 'Perdido', icon: XCircle, color: 'text-red-600' }
  ];

  const requiresReason = newStatus === 'ganho' || newStatus === 'perdido';
  const hasStatusChanged = newStatus !== currentStatus;

  const handleSubmit = async () => {
    if (requiresReason && !reason.trim()) {
      toast.error('Por favor, informe o motivo da mudança de status');
      return;
    }

    if (!hasStatusChanged) {
      onOpenChange(false);
      return;
    }

    try {
      setLoading(true);
      await onStatusChange(newStatus, reason.trim() || undefined);
      toast.success(`Status alterado para "${statusOptions.find(s => s.value === newStatus)?.label}"`);
      onOpenChange(false);
      setReason('');
    } catch (error) {
      toast.error('Erro ao alterar status do lead');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewStatus(currentStatus);
    setReason('');
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

          {requiresReason && (
            <div className="space-y-2">
              <Label htmlFor="reason">
                Motivo {newStatus === 'ganho' ? 'do ganho' : 'da perda'} *
              </Label>
              <Textarea
                id="reason"
                placeholder={`Descreva o motivo ${newStatus === 'ganho' ? 'do ganho' : 'da perda'}...`}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[80px]"
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
            disabled={loading || (requiresReason && !reason.trim())}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusChangeDialog;
