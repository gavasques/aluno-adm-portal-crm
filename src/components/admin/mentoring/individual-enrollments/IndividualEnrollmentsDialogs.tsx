
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StudentMentoringEnrollment, CreateExtensionData } from '@/types/mentoring.types';
import EnrollmentForm from '@/components/admin/mentoring/EnrollmentForm';
import EditEnrollmentForm from '@/components/admin/mentoring/EditEnrollmentForm';
import ExtensionDialog from '@/components/admin/mentoring/ExtensionDialog';
import { EnrollmentDetailDialog } from '@/components/admin/mentoring/enrollments/EnrollmentDetailDialog';

interface IndividualEnrollmentsDialogsProps {
  showForm: boolean;
  editingEnrollment: StudentMentoringEnrollment | null;
  viewingEnrollment: StudentMentoringEnrollment | null;
  showExtensionDialog: boolean;
  selectedEnrollmentForExtension: StudentMentoringEnrollment | null;
  onFormClose: () => void;
  onEditClose: () => void;
  onViewClose: () => void;
  onExtensionClose: () => void;
  onCreateSuccess: () => void;
  onEditSubmit: (data: any) => void;
  onExtensionSubmit: (data: CreateExtensionData) => void;
  onSessionUpdated?: () => void;
}

export const IndividualEnrollmentsDialogs = ({
  showForm,
  editingEnrollment,
  viewingEnrollment,
  showExtensionDialog,
  selectedEnrollmentForExtension,
  onFormClose,
  onEditClose,
  onViewClose,
  onExtensionClose,
  onCreateSuccess,
  onEditSubmit,
  onExtensionSubmit,
  onSessionUpdated
}: IndividualEnrollmentsDialogsProps) => {
  
  const handleAddExtension = (enrollment: StudentMentoringEnrollment) => {
    // Simular a adição de extensão da mentoria (baseada nas extensões do catálogo)
    console.log('Adicionar extensão da mentoria para:', enrollment.id);
    // Aqui você pode abrir um dialog específico para extensões da mentoria
  };

  const handleAddCustomMonths = (enrollment: StudentMentoringEnrollment) => {
    // Simular a adição de meses avulsos
    const customExtension: CreateExtensionData = {
      enrollmentId: enrollment.id,
      extensionMonths: 1,
      notes: 'Mês avulso adicionado'
    };
    onExtensionSubmit(customExtension);
  };

  return (
    <>
      <Dialog open={showForm} onOpenChange={(open) => {
        if (!open) onFormClose();
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Inscrição Individual</DialogTitle>
          </DialogHeader>
          <EnrollmentForm
            onSuccess={onCreateSuccess}
            onCancel={onFormClose}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingEnrollment} onOpenChange={(open) => {
        if (!open) onEditClose();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Inscrição Individual</DialogTitle>
          </DialogHeader>
          {editingEnrollment && (
            <EditEnrollmentForm
              enrollment={editingEnrollment}
              onSubmit={onEditSubmit}
              onCancel={onEditClose}
              onAddExtension={handleAddExtension}
              onAddCustomMonths={handleAddCustomMonths}
            />
          )}
        </DialogContent>
      </Dialog>

      <EnrollmentDetailDialog
        open={!!viewingEnrollment}
        onOpenChange={(open) => {
          if (!open) onViewClose();
        }}
        enrollment={viewingEnrollment}
        onSessionUpdated={onSessionUpdated}
      />

      <ExtensionDialog
        open={showExtensionDialog}
        onOpenChange={onExtensionClose}
        enrollment={selectedEnrollmentForExtension}
        onSubmit={onExtensionSubmit}
      />
    </>
  );
};
