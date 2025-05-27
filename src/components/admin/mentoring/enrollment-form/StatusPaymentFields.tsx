
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StatusPaymentFieldsProps {
  status: string;
  paymentStatus: string;
  onStatusChange: (value: string) => void;
  onPaymentStatusChange: (value: string) => void;
}

export const StatusPaymentFields = ({
  status,
  paymentStatus,
  onStatusChange,
  onPaymentStatusChange
}: StatusPaymentFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ativa">Ativa</SelectItem>
            <SelectItem value="pausada">Pausada</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="paymentStatus">Status do Pagamento</Label>
        <Select value={paymentStatus} onValueChange={onPaymentStatusChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
