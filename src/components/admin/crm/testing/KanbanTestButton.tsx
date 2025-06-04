
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bug } from 'lucide-react';
import { KanbanTestPanel } from './KanbanTestPanel';

interface KanbanTestButtonProps {
  pipelineId: string;
  className?: string;
}

export const KanbanTestButton: React.FC<KanbanTestButtonProps> = ({
  pipelineId,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTestComplete = (results: any) => {
    console.log('🧪 [KANBAN_TESTS] Resultados dos testes:', results);
  };

  if (!pipelineId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${className}`}
        >
          <Bug className="h-4 w-4" />
          Testar Kanban
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Testes de Movimentação no Kanban</DialogTitle>
        </DialogHeader>
        
        <KanbanTestPanel
          pipelineId={pipelineId}
          onTestComplete={handleTestComplete}
        />
      </DialogContent>
    </Dialog>
  );
};
