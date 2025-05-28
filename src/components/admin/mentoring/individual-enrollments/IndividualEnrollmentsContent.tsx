
import React from 'react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import ModernIndividualEnrollmentCard from '../enrollments/ModernIndividualEnrollmentCard';

interface IndividualEnrollmentsContentProps {
  enrollments: StudentMentoringEnrollment[];
  viewMode?: "cards" | "list";
  selectedEnrollments?: string[];
  onToggleSelection?: (id: string) => void;
  onView?: (enrollment: StudentMentoringEnrollment) => void;
  onEdit?: (enrollment: StudentMentoringEnrollment) => void;
  onDelete?: (id: string) => void;
  onAddExtension?: (enrollment: StudentMentoringEnrollment) => void;
}

const IndividualEnrollmentsContent: React.FC<IndividualEnrollmentsContentProps> = ({ 
  enrollments,
  viewMode = "cards",
  selectedEnrollments = [],
  onToggleSelection = () => {},
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onAddExtension = () => {}
}) => {
  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        {enrollments.map(enrollment => (
          <div key={enrollment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedEnrollments.includes(enrollment.id)}
                  onChange={() => onToggleSelection(enrollment.id)}
                  className="rounded"
                />
                <div>
                  <h3 className="font-medium">{enrollment.mentoring.name}</h3>
                  <p className="text-sm text-gray-600">Estudante: {enrollment.studentId}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onView(enrollment)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Ver
                </button>
                <button
                  onClick={() => onEdit(enrollment)}
                  className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(enrollment.id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {enrollments.map(enrollment => (
        <ModernIndividualEnrollmentCard 
          key={enrollment.id} 
          enrollment={enrollment}
          selected={selectedEnrollments.includes(enrollment.id)}
          onToggleSelection={() => onToggleSelection(enrollment.id)}
          onView={() => onView(enrollment)}
          onEdit={() => onEdit(enrollment)}
          onDelete={() => onDelete(enrollment.id)}
          onAddExtension={() => onAddExtension(enrollment)}
        />
      ))}
    </div>
  );
};

export default IndividualEnrollmentsContent;
