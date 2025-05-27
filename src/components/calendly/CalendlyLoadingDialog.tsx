
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, X, Loader2 } from 'lucide-react';

interface CalendlyLoadingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName?: string;
  sessionInfo?: {
    sessionNumber: number;
    totalSessions: number;
  };
  scriptLoaded: boolean;
  configLoaded: boolean;
}

export const CalendlyLoadingDialog: React.FC<CalendlyLoadingDialogProps> = ({
  open,
  onOpenChange,
  studentName,
  sessionInfo,
  scriptLoaded,
  configLoaded
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agendar Mentoria
              {studentName && sessionInfo && (
                <span className="text-sm text-gray-600 ml-2">
                  - {studentName} (Sessão {sessionInfo.sessionNumber}/{sessionInfo.totalSessions})
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-center">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {!scriptLoaded ? 'Carregando Calendly...' : 
                 !configLoaded ? 'Configurando agendamento...' : 
                 'Processando agendamento...'}
              </p>
              <p className="text-sm text-gray-500">
                Isso pode levar alguns segundos
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
