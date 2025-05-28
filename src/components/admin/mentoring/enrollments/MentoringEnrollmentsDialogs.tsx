import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StudentMentoringEnrollment, CreateExtensionData } from '@/types/mentoring.types';
import EnrollmentForm from '@/components/admin/mentoring/EnrollmentForm';
import EditEnrollmentForm from '@/components/admin/mentoring/EditEnrollmentForm';
import ExtensionDialog from '@/components/admin/mentoring/ExtensionDialog';
import { EnrollmentDetailDialog } from '@/components/admin/mentoring/EnrollmentDetailDialog';

interface MentoringEnrollmentsDialogsProps {
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
}

export const MentoringEnrollmentsDialogs: React.FC<MentoringEnrollmentsDialogsProps> = ({
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
  onExtensionSubmit
}) => {
  return (
    <>
      <Dialog open={showForm} onOpenChange={(open) => {
        if (!open) onFormClose();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Inscrição</DialogTitle>
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
