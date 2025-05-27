
import React from 'react';
import { ModernEnrollmentForm } from './enrollment-form/ModernEnrollmentForm';

interface EnrollmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EnrollmentForm = ({ onSuccess, onCancel }: EnrollmentFormProps) => {
  return (
    <ModernEnrollmentForm 
      onSuccess={onSuccess} 
      onCancel={onCancel} 
    />
  );
};

export default EnrollmentForm;
