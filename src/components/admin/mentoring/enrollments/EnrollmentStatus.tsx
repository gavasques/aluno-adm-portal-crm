
import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EnrollmentStatusProps {
  status: string;
  className?: string;
}

export const EnrollmentStatus = memo<EnrollmentStatusProps>(({ status, className }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ativa':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200', 
          icon: <div className="w-2 h-2 bg-green-500 rounded-full"></div>,
          label: 'Ativa' 
        };
      case 'concluida':
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200', 
          icon: <div className="w-2 h-2 bg-blue-500 rounded-full"></div>,
          label: 'Concluída' 
        };
      case 'pausada':
        return { 
          color: 'bg-orange-100 text-orange-800 border-orange-200', 
          icon: <div className="w-2 h-2 bg-orange-500 rounded-full"></div>,
          label: 'Pausada' 
        };
      case 'cancelada':
        return { 
          color: 'bg-red-100 text-red-800 border-red-200', 
          icon: <div className="w-2 h-2 bg-red-500 rounded-full"></div>,
          label: 'Cancelada' 
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          icon: <div className="w-2 h-2 bg-gray-500 rounded-full"></div>,
          label: status 
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <Badge className={cn(statusConfig.color, "flex items-center gap-1", className)}>
      {statusConfig.icon}
      {statusConfig.label}
    </Badge>
  );
});

EnrollmentStatus.displayName = 'EnrollmentStatus';
