
import React from 'react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import { EnhancedEnrollmentDetailDialog } from './EnhancedEnrollmentDetailDialog';

interface EnrollmentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment: StudentMentoringEnrollment | null;
  onSessionUpdated?: () => void;
}

export const EnrollmentDetailDialog: React.FC<EnrollmentDetailDialogProps> = ({
  open,
  onOpenChange,
  enrollment,
  onSessionUpdated
}) => {
  const handleSave = (data: any) => {
    console.log('Salvando dados da inscrição:', data);
    // TODO: Implementar salvamento real via API
  };

  return (
    <EnhancedEnrollmentDetailDialog
      open={open}
      onOpenChange={onOpenChange}
      enrollment={enrollment}
      onSave={handleSave}
      onSessionUpdated={onSessionUpdated}
    />
  );
};
