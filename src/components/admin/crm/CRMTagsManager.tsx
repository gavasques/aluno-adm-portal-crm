
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CRMTagsManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CRMTagsManager = ({ open, onOpenChange }: CRMTagsManagerProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Tags</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Gerenciador de tags em desenvolvimento...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CRMTagsManager;
