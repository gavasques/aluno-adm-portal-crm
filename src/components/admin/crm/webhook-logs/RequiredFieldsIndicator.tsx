
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RequiredFieldsIndicatorProps {
  mappings: any[];
}

export const RequiredFieldsIndicator = ({ mappings }: RequiredFieldsIndicatorProps) => {
  const requiredFields = mappings.filter(m => m.is_required && m.is_active);
  const hasRequiredFields = requiredFields.length > 0;

  if (!hasRequiredFields) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <span className="font-medium text-orange-900">Atenção: Nenhum campo obrigatório</span>
        </div>
        <p className="text-sm text-orange-800">
          Este pipeline não possui campos obrigatórios configurados. 
          Webhooks serão aceitos mesmo com dados incompletos.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <span className="font-medium text-green-900">
          Campos Obrigatórios ({requiredFields.length})
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {requiredFields.map((field) => (
          <Badge key={field.id} variant="destructive" className="text-xs">
            {field.webhook_field_name}
          </Badge>
        ))}
      </div>
      <p className="text-xs text-green-700 mt-2">
        Webhooks sem estes campos serão rejeitados com erro 400
      </p>
    </div>
  );
};
