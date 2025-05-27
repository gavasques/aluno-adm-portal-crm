
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import { EnrollmentInfoTab } from './tabs/EnrollmentInfoTab';
import { EnrollmentSessionsTab } from './tabs/EnrollmentSessionsTab';

interface EnhancedEnrollmentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment: StudentMentoringEnrollment | null;
  onSave?: (data: any) => void;
  onSessionUpdated?: () => void;
}

export const EnhancedEnrollmentDetailDialog: React.FC<EnhancedEnrollmentDetailDialogProps> = ({
  open,
  onOpenChange,
  enrollment,
  onSave,
  onSessionUpdated
}) => {
  const [activeTab, setActiveTab] = useState('info');

  if (!enrollment) return null;

  const handleSave = (data: any) => {
    if (onSave) {
      onSave(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Detalhes da Inscrição - {enrollment.mentoring.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações da Mentoria</TabsTrigger>
            <TabsTrigger value="sessions">Sessões ({enrollment.totalSessions})</TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <TabsContent value="info" className="mt-6">
              <EnrollmentInfoTab 
                enrollment={enrollment} 
                onSave={handleSave}
              />
            </TabsContent>

            <TabsContent value="sessions" className="mt-6">
              <EnrollmentSessionsTab 
                enrollment={enrollment}
                onSessionUpdated={onSessionUpdated}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
