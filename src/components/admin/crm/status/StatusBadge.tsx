
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { LeadStatus } from '@/types/crm.types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, onClick }) => {
  const getStatusConfig = (status: LeadStatus) => {
    switch (status) {
      case 'ganho':
        return {
          label: 'Ganho',
          icon: CheckCircle,
          className: 'bg-green-100 text-green-800 hover:bg-green-200'
        };
      case 'perdido':
        return {
          label: 'Perdido',
          icon: XCircle,
          className: 'bg-red-100 text-red-800 hover:bg-red-200'
        };
      case 'aberto':
      default:
        return {
          label: 'Aberto',
          icon: Clock,
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      className={cn(
        "px-2 py-1 font-medium text-xs flex items-center gap-1",
        config.className,
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
