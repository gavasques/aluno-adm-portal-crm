
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { LeadStatus } from '@/types/crm.types';

interface StatusFilterProps {
  value?: LeadStatus;
  onValueChange: (status?: LeadStatus) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ value, onValueChange }) => {
  const statusOptions = [
    { value: 'aberto', label: 'Aberto', icon: AlertTriangle, color: 'text-blue-600' },
    { value: 'ganho', label: 'Ganho', icon: CheckCircle, color: 'text-green-600' },
    { value: 'perdido', label: 'Perdido', icon: XCircle, color: 'text-red-600' }
  ];

  return (
    <Select value={value || 'all'} onValueChange={(val) => onValueChange(val === 'all' ? undefined : val as LeadStatus)}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4" />
            Todos os status
          </div>
        </SelectItem>
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
  );
};

export default StatusFilter;
