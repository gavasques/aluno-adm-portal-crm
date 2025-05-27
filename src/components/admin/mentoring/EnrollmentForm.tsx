
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EnrollmentFormHeader } from './enrollment-form/EnrollmentFormHeader';
import { StudentMentoringSelector } from './enrollment-form/StudentMentoringSelector';
import { ExtensionsSelection } from './enrollment-form/ExtensionsSelection';
import { StatusPaymentFields } from './enrollment-form/StatusPaymentFields';
import { DateFields } from './enrollment-form/DateFields';
import { MentorObservationsFields } from './enrollment-form/MentorObservationsFields';
import { FormActions } from './enrollment-form/FormActions';
import { useEnrollmentForm } from './enrollment-form/useEnrollmentForm';

interface EnrollmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EnrollmentForm = ({ onSuccess, onCancel }: EnrollmentFormProps) => {
  const {
    formData,
    selectedMentoring,
    loading,
    handleInputChange,
    handleExtensionToggle,
    handleSubmit,
    calculateTotalSessions
  } = useEnrollmentForm(onSuccess);

  console.log('🎯 Mentoria selecionada:', selectedMentoring);
  console.log('🔗 Extensões disponíveis:', selectedMentoring?.extensions);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <EnrollmentFormHeader
        title="Nova Inscrição Individual"
        description="Crie uma nova inscrição para mentoria individual"
      />
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <StudentMentoringSelector
            studentId={formData.studentId}
            mentoringId={formData.mentoringId}
            onStudentChange={(value) => handleInputChange('studentId', value)}
            onMentoringChange={(value) => handleInputChange('mentoringId', value)}
          />

          <ExtensionsSelection
            selectedMentoring={selectedMentoring}
            selectedExtensions={formData.selectedExtensions}
            onExtensionToggle={handleExtensionToggle}
            calculateTotalSessions={calculateTotalSessions}
          />

          <StatusPaymentFields
            status={formData.status}
            paymentStatus={formData.paymentStatus}
            onStatusChange={(value) => handleInputChange('status', value)}
            onPaymentStatusChange={(value) => handleInputChange('paymentStatus', value)}
          />

          <DateFields
            enrollmentDate={formData.enrollmentDate}
            startDate={formData.startDate}
            endDate={formData.endDate}
            onEnrollmentDateChange={(value) => handleInputChange('enrollmentDate', value)}
            onStartDateChange={(value) => handleInputChange('startDate', value)}
            onEndDateChange={(value) => handleInputChange('endDate', value)}
          />

          <MentorObservationsFields
            responsibleMentor={formData.responsibleMentor}
            observations={formData.observations}
            onMentorChange={(value) => handleInputChange('responsibleMentor', value)}
            onObservationsChange={(value) => handleInputChange('observations', value)}
          />

          <FormActions loading={loading} onCancel={onCancel} />
        </form>
      </CardContent>
    </Card>
  );
};

export default EnrollmentForm;
