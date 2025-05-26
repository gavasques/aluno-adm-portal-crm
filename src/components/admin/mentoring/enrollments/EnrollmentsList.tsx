
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Timer } from 'lucide-react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';

interface EnrollmentsListProps {
  enrollments: StudentMentoringEnrollment[];
  onView: (enrollment: StudentMentoringEnrollment) => void;
  onEdit: (enrollment: StudentMentoringEnrollment) => void;
  onDelete: (id: string) => void;
  onAddExtension: (enrollment: StudentMentoringEnrollment) => void;
  onToggleSelection: (id: string) => void;
  selectedEnrollments: string[];
  onSelectAll: () => void;
}

export const EnrollmentsList: React.FC<EnrollmentsListProps> = ({
  enrollments,
  onView,
  onEdit,
  onDelete,
  onAddExtension,
  onToggleSelection,
  selectedEnrollments,
  onSelectAll
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800 border-green-200';
      case 'concluida': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pausada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRowClick = (enrollment: StudentMentoringEnrollment, e: React.MouseEvent) => {
    // Não abrir se clicou no checkbox ou nos botões de ação
    if (
      (e.target as HTMLElement).closest('input[type="checkbox"]') ||
      (e.target as HTMLElement).closest('button')
    ) {
      return;
    }
    onView(enrollment);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={selectedEnrollments.length === enrollments.length && enrollments.length > 0}
                onChange={onSelectAll}
                className="rounded border-gray-300"
              />
            </TableHead>
            <TableHead className="font-semibold">Aluno</TableHead>
            <TableHead className="font-semibold">Mentoria</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Progresso</TableHead>
            <TableHead className="font-semibold text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map((enrollment) => (
            <TableRow 
              key={enrollment.id} 
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={(e) => handleRowClick(enrollment, e)}
            >
              <TableCell>
                <div onClick={handleCheckboxClick}>
                  <input
                    type="checkbox"
                    checked={selectedEnrollments.includes(enrollment.id)}
                    onChange={() => onToggleSelection(enrollment.id)}
                    className="rounded border-gray-300"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-sm">Bianca Mentora</div>
                  <div className="text-xs text-gray-500">{enrollment.responsibleMentor}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-sm">{enrollment.mentoring.name}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{enrollment.mentoring.type}</Badge>
                    {enrollment.hasExtension && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                        <Timer className="h-3 w-3 mr-1" />
                        Extensão
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(enrollment.status)} text-xs`}>
                  {enrollment.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-xs text-gray-600">
                    {enrollment.sessionsUsed}/{enrollment.totalSessions} sessões
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${(enrollment.sessionsUsed / enrollment.totalSessions) * 100}%` }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(enrollment);
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
                      onEdit(enrollment);
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
                      onAddExtension(enrollment);
                    }}
                    className="h-8 w-8 p-0 hover:bg-orange-50"
                    title="Adicionar Extensão"
                  >
                    <Timer className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(enrollment.id);
                    }}
                    className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
