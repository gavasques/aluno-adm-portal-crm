
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CRMLeadFormDialog from './CRMLeadFormDialog';

const DebugModalTest = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button 
        onClick={() => {
          console.log('🧪 Abrindo modal de teste do novo design');
          setOpen(true);
        }}
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
      >
        🧪 Testar Novo Design do Modal
      </Button>
      
      <CRMLeadFormDialog
        open={open}
        onOpenChange={setOpen}
        mode="create"
        pipelineId="test"
        onSuccess={() => {
          console.log('✅ Modal fechado com sucesso');
          setOpen(false);
        }}
      />
    </div>
  );
};

export default DebugModalTest;
