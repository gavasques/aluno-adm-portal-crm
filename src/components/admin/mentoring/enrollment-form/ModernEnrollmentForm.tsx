
import React from 'react';
import SteppedEnrollmentForm from './SteppedEnrollmentForm';

interface ModernEnrollmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ModernEnrollmentForm = ({ onSuccess, onCancel }: ModernEnrollmentFormProps) => {
  return (
    <SteppedEnrollmentForm 
      open={true}
      onOpenChange={(open) => !open && onCancel?.()}
      onSuccess={onSuccess} 
    />
  );
};
