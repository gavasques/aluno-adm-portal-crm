import React from 'react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import ModernIndividualEnrollmentCard from '../enrollments/ModernIndividualEnrollmentCard';

interface OptimizedIndividualEnrollmentsContentProps {
  enrollments: StudentMentoringEnrollment[];
}

const OptimizedIndividualEnrollmentsContent: React.FC<OptimizedIndividualEnrollmentsContentProps> = ({ enrollments }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {enrollments.map(enrollment => (
        <ModernIndividualEnrollmentCard key={enrollment.id} enrollment={enrollment} />
      ))}
    </div>
  );
};

export default OptimizedIndividualEnrollmentsContent;
