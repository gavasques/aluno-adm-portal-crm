
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  loading: boolean;
  onCancel?: () => void;
}

export const FormActions = ({ loading, onCancel }: FormActionsProps) => {
  return (
    <div className="flex gap-2 pt-4">
      <Button type="submit" disabled={loading}>
        {loading ? 'Criando...' : 'Criar Inscrição'}
      </Button>
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      )}
    </div>
  );
};
