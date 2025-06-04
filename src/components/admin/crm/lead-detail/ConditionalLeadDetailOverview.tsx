
import React from 'react';
import { CRMLead } from '@/types/crm.types';
import { LeadDetailOverview } from './LeadDetailOverview';

interface ConditionalLeadDetailOverviewProps {
  lead: CRMLead;
  isEditing: boolean;
  onDataChange: (hasChanges: boolean) => void;
  onLeadUpdate: () => void;
}

export const ConditionalLeadDetailOverview = ({ 
  lead, 
  isEditing, 
  onDataChange, 
  onLeadUpdate 
}: ConditionalLeadDetailOverviewProps) => {
  // Por enquanto, sempre mostrar a versão de visualização
  // No futuro, você pode implementar uma versão de edição aqui
  
  return (
    <LeadDetailOverview 
      lead={lead} 
    />
  );
};
