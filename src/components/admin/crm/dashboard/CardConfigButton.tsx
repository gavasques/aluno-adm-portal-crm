
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Eye } from 'lucide-react';
import { CRMCardConfigDialog } from '../card-config/CRMCardConfigDialog';
import { useCRMCardPreferences } from '@/hooks/crm/useCRMCardPreferences';
import { CRMLeadCardField } from '@/types/crm.types';

export const CardConfigButton: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const { preferences } = useCRMCardPreferences();

  // Safe parsing of visible fields
  const getVisibleFieldsCount = (): number => {
    if (Array.isArray(preferences.visible_fields)) {
      return (preferences.visible_fields as CRMLeadCardField[]).length;
    }
    return 0;
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        <Eye className="h-4 w-4" />
        Configurar Cards ({getVisibleFieldsCount()})
      </Button>

      <CRMCardConfigDialog
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
};
