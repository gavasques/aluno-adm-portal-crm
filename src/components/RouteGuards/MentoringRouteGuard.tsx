
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useSecureMentoring } from '@/hooks/useSecureMentoring';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface MentoringRouteGuardProps {
  children: React.ReactNode;
  requireEnrollmentAccess?: boolean;
}

const MentoringRouteGuard = ({ 
  children, 
  requireEnrollmentAccess = false 
}: MentoringRouteGuardProps) => {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const { isAuthenticated, verifyEnrollmentOwnership } = useSecureMentoring();

  // Verificar se o usuário está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Verificar acesso à inscrição se necessário
  if (requireEnrollmentAccess && enrollmentId) {
    if (!verifyEnrollmentOwnership(enrollmentId)) {
      return (
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-gray-900 mb-2">Acesso Negado</h2>
              <p className="text-gray-500 mb-4">
                Você não tem permissão para acessar esta mentoria.
              </p>
              <Navigate to="/aluno/mentorias" replace />
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default MentoringRouteGuard;
