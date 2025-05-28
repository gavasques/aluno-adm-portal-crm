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
  onRemoveExtension?: (extensionId: string) => void;
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
  onRemoveExtension,
  onSessionUpdated
}: IndividualEnrollmentsDialogsProps) => {

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

      {editingEnrollment && (
        <EditEnrollmentForm
          open={!!editingEnrollment}
          onOpenChange={(open) => {
            if (!open) onEditClose();
          }}
          enrollment={editingEnrollment}
          onEditSubmit={onEditSubmit}
        />
      )}

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
