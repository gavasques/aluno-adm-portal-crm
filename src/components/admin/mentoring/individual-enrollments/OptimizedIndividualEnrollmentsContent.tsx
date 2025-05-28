
import React from 'react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import ModernIndividualEnrollmentCard from '../enrollments/ModernIndividualEnrollmentCard';

interface OptimizedIndividualEnrollmentsContentProps {
  enrollments: StudentMentoringEnrollment[];
  viewMode?: "cards" | "list";
  selectedEnrollments?: string[];
  pageInfo?: any;
  onView?: (enrollment: StudentMentoringEnrollment) => void;
  onEdit?: (enrollment: StudentMentoringEnrollment) => void;
  onDelete?: (id: string) => void;
  onAddExtension?: (enrollment: StudentMentoringEnrollment) => void;
  onToggleSelection?: (id: string) => void;
  onSessionUpdated?: () => Promise<void>;
}

const OptimizedIndividualEnrollmentsContent: React.FC<OptimizedIndividualEnrollmentsContentProps> = ({ 
  enrollments,
  viewMode = "cards",
  selectedEnrollments = [],
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onAddExtension = () => {},
  onToggleSelection = () => {},
}) => {
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

export default OptimizedIndividualEnrollmentsContent;
