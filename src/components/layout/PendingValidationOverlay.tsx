
import React from 'react';
import { useAuth } from '@/hooks/auth';

const PendingValidationOverlay: React.FC = () => {
  const { user } = useAuth();

  // Se não há usuário, não mostrar overlay
  if (!user) {
    return null;
  }

  // Por enquanto, não mostrar overlay (pode ser implementado posteriormente)
  return null;
};

export default PendingValidationOverlay;
