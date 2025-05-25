
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Calendar, 
  Star,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSecureMentoring } from '@/hooks/useSecureMentoring';
import { useRefactoredMentoring } from '@/hooks/mentoring/useRefactoredMentoring';
import { usePermissions } from '@/hooks/usePermissions';
import LoadingSpinner from '@/components/mentoring/LoadingSpinner';
import ErrorMessage from '@/components/mentoring/ErrorMessage';
import EmptyState from '@/components/mentoring/EmptyState';
import { StatsCard } from '@/components/mentoring/shared/StatsCard';
import { MentoringCard } from '@/components/mentoring/shared/MentoringCard';
import { SessionCard } from '@/components/mentoring/shared/SessionCard';

const StudentMentoring = () => {
  const navigate = useNavigate();
  const { permissions } = usePermissions();
  const { 
    getMyEnrollments,
    getMyUpcomingSessions,
    getEnrollmentProgress,
    loading 
  } = useRefactoredMentoring();
  const { 
    loading: secureLoading,
    error,
    clearError,
    isAuthenticated
  } = useSecureMentoring();

  // Verificar se o usuário pode acessar
  const canAccess = () => {
    if (permissions.hasAdminAccess) return true;
    if (permissions.allowedMenus.includes('student-mentoring')) return true;
    return isAuthenticated;
  };

  // Redirect if not authenticated or no permission
  if (!loading && !canAccess()) {
    navigate('/');
    return null;
  }

  // Show loading spinner
  if (loading || secureLoading) {
    return (
      <div className="container mx-auto py-6">
        <LoadingSpinner size="lg" message="Carregando suas mentorias..." />
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <ErrorMessage 
          message={error}
          onRetry={() => {
            clearError();
            window.location.reload();
          }}
        />
      </div>
    );
  }

  // Mock user ID - in real app, get from auth context
  const currentUserId = 'current-user-id';
  const enrollments = getMyEnrollments(currentUserId);
  const upcomingSessions = getMyUpcomingSessions(currentUserId);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {permissions.hasAdminAccess ? 'Mentorias (Visão Admin)' : 'Minhas Mentorias'}
        </h1>
        <p className="text-gray-600 mt-1">
          {permissions.hasAdminAccess 
            ? 'Visualizando mentorias como administrador' 
            : 'Acompanhe seu progresso e acesse materiais'
          }
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Mentorias Ativas"
          value={enrollments.filter(e => e.status === 'ativa').length}
          icon={BookOpen}
          color="green"
        />
        <StatsCard
          title="Próximas Sessões"
          value={upcomingSessions.length}
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Total Concluídas"
          value={enrollments.filter(e => e.status === 'concluida').length}
          icon={Star}
          color="purple"
        />
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Sessões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingSessions.slice(0, 3).map((session) => (
                <SessionCard
                  key={session.id}
                  title={session.title}
                  date={session.scheduledDate}
                  duration={session.durationMinutes}
                  status={session.status}
                  accessLink={session.accessLink}
                  onAccess={() => window.open(session.accessLink, '_blank')}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {permissions.hasAdminAccess ? 'Inscrições do Sistema' : 'Minhas Inscrições'} ({enrollments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <EmptyState type="enrollments" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => {
                const progress = getEnrollmentProgress(enrollment);
                return (
                  <MentoringCard
                    key={enrollment.id}
                    title={enrollment.mentoring.name}
                    status={enrollment.status}
                    mentor={enrollment.responsibleMentor}
                    progress={progress}
                    onClick={() => navigate(`/aluno/mentorias/${enrollment.id}`)}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentMentoring;
