
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Edit, Trash2, Plus, Calendar, User, Clock, Target, ChevronRight } from 'lucide-react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import { EnrollmentProgress } from './EnrollmentProgress';
import { EnrollmentStatus } from './EnrollmentStatus';
import { useSupabaseMentoringSessions } from '@/hooks/mentoring/useSupabaseMentoringSessions';
import PendingSessionsCard from '../PendingSessionsCard';

interface ModernIndividualEnrollmentCardProps {
  enrollment: StudentMentoringEnrollment;
  onView: (enrollment: StudentMentoringEnrollment) => void;
  onEdit: (enrollment: StudentMentoringEnrollment) => void;
  onDelete: (id: string) => void;
  onAddExtension: (enrollment: StudentMentoringEnrollment) => void;
  onToggleSelection: (id: string) => void;
  isSelected: boolean;
  onSessionUpdated?: () => void;
}

export const ModernIndividualEnrollmentCard = ({
  enrollment,
  onView,
  onEdit,
  onDelete,
  onAddExtension,
  onToggleSelection,
  isSelected,
  onSessionUpdated
}: ModernIndividualEnrollmentCardProps) => {
  const [showSessionsDialog, setShowSessionsDialog] = useState(false);
  const { 
    sessions, 
    createSession, 
    deleteSession, 
    loading 
  } = useSupabaseMentoringSessions();

  // Filtrar sessões desta inscrição
  const enrollmentSessions = sessions.filter(s => s.enrollmentId === enrollment.id);
  const pendingSessions = enrollmentSessions.filter(s => s.status === 'aguardando_agendamento');

  const handleCreateSession = async (data: any) => {
    await createSession(data);
    if (onSessionUpdated) {
      onSessionUpdated();
    }
  };

  const handleSessionScheduled = (sessionId: string) => {
    console.log('Sessão agendada:', sessionId);
    if (onSessionUpdated) {
      onSessionUpdated();
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(sessionId);
    if (onSessionUpdated) {
      onSessionUpdated();
    }
  };

  return (
    <>
      <Card className={`group hover:shadow-lg transition-all duration-200 border-l-4 ${
        isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      } ${
        enrollment.status === 'ativa' 
          ? 'border-l-green-500 hover:border-l-green-600' 
          : enrollment.status === 'pausada'
          ? 'border-l-yellow-500 hover:border-l-yellow-600'
          : enrollment.status === 'concluida'
          ? 'border-l-blue-500 hover:border-l-blue-600'
          : 'border-l-red-500 hover:border-l-red-600'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {enrollment.mentoring.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {enrollment.mentoring.type}
                </Badge>
                <EnrollmentStatus status={enrollment.status} />
              </div>
            </div>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelection(enrollment.id)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Informações básicas */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 truncate">{enrollment.responsibleMentor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {new Date(enrollment.startDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{enrollment.mentoring.durationMonths} meses</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {enrollment.sessionsUsed}/{enrollment.totalSessions} sessões
              </span>
            </div>
          </div>

          {/* Progress */}
          <EnrollmentProgress 
            sessionsUsed={enrollment.sessionsUsed} 
            totalSessions={enrollment.totalSessions} 
          />

          {/* Sessões pendentes */}
          {pendingSessions.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">
                    {pendingSessions.length} sessão(ões) pendente(s)
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowSessionsDialog(true)}
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  Gerenciar
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(enrollment)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(enrollment)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddExtension(enrollment)}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(enrollment.id)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para gerenciar sessões */}
      <Dialog open={showSessionsDialog} onOpenChange={setShowSessionsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Sessões Pendentes - {enrollment.mentoring.name}
            </DialogTitle>
          </DialogHeader>
          <PendingSessionsCard
            enrollment={enrollment}
            pendingSessions={pendingSessions}
            onCreateSession={handleCreateSession}
            onSessionScheduled={handleSessionScheduled}
            onDeleteSession={handleDeleteSession}
            isLoading={loading}
            allSessions={enrollmentSessions}
            onSessionUpdated={onSessionUpdated}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
