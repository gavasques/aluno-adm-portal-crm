
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronRight, 
  Users, 
  GraduationCap,
  Plus,
  Eye,
  Edit,
  Trash2,
  Timer
} from 'lucide-react';
import { GroupEnrollment } from '@/types/mentoring.types';

interface GroupEnrollmentCardProps {
  group: GroupEnrollment;
  onView: (group: GroupEnrollment) => void;
  onEdit: (group: GroupEnrollment) => void;
  onDelete: (id: string) => void;
  onAddStudent: (group: GroupEnrollment) => void;
  onRemoveStudent: (groupId: string, studentId: string) => void;
  onToggleSelection: (id: string) => void;
  isSelected: boolean;
}

export const GroupEnrollmentCard: React.FC<GroupEnrollmentCardProps> = ({
  group,
  onView,
  onEdit,
  onDelete,
  onAddStudent,
  onRemoveStudent,
  onToggleSelection,
  isSelected
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800 border-green-200';
      case 'concluida': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pausada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalSessionsUsed = group.participants.reduce((sum, p) => sum + p.sessionsUsed, 0);
  const totalSessionsAvailable = group.participants.reduce((sum, p) => sum + p.totalSessions, 0);
  const progressPercentage = totalSessionsAvailable > 0 ? (totalSessionsUsed / totalSessionsAvailable) * 100 : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('input[type="checkbox"]') ||
      (e.target as HTMLElement).closest('button')
    ) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
        isSelected ? 'ring-2 ring-blue-500 shadow-md' : ''
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div onClick={handleCheckboxClick}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelection(group.id)}
                  className="rounded border-gray-300"
                />
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg">{group.groupName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{group.mentoring.type}</Badge>
                  <span className="text-sm text-gray-500">{group.participants.length} participantes</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(group.status)} text-xs`}>
                {group.status}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mentoria Info */}
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-gray-400" />
            <div>
              <span className="font-medium text-sm">{group.mentoring.name}</span>
              <div className="text-xs text-gray-500">Mentor: {group.responsibleMentor}</div>
            </div>
          </div>

          {/* Progresso Geral */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progresso Geral</span>
              <span className="font-medium">{totalSessionsUsed}/{totalSessionsAvailable} sessões</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 text-center">
              {Math.round(progressPercentage)}% concluído
            </div>
          </div>

          {/* Lista de Participantes (Expandível) */}
          {isExpanded && (
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Participantes</h4>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddStudent(group);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar
                </Button>
              </div>

              <div className="space-y-2">
                {group.participants.map((participant) => (
                  <div 
                    key={participant.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium">Aluno {participant.studentId}</div>
                      <div className="text-xs text-gray-500">
                        {participant.sessionsUsed}/{participant.totalSessions} sessões
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(participant.status)}`}
                      >
                        {participant.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveStudent(group.id, participant.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onView(group);
                }}
                className="h-8 w-8 p-0 hover:bg-blue-50"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(group);
                }}
                className="h-8 w-8 p-0 hover:bg-green-50"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddStudent(group);
                }}
                className="h-8 w-8 p-0 hover:bg-purple-50"
                title="Adicionar Aluno"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(group.id);
              }}
              className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
