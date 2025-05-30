
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CRMPipelineManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CRMPipelineManager = ({ open, onOpenChange }: CRMPipelineManagerProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Pipelines</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Gerenciador de pipelines em desenvolvimento...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CRMPipelineManager;
