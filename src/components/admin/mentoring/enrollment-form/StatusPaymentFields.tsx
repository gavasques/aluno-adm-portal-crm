
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
  console.log('StatusPaymentFields - status:', status, 'paymentStatus:', paymentStatus);
  
  // Garantir que status nunca seja undefined ou vazio
  const safeStatus = status || "ativa";
  const safePaymentStatus = paymentStatus || "pendente";
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={safeStatus} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um status" />
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
        <Select value={safePaymentStatus} onValueChange={onPaymentStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status do pagamento" />
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
