
import React from 'react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import { ModernIndividualEnrollmentCard } from '@/components/admin/mentoring/enrollments/ModernIndividualEnrollmentCard';
import { ModernIndividualEnrollmentsList } from '@/components/admin/mentoring/enrollments/ModernIndividualEnrollmentsList';
import { EnrollmentsPagination } from '@/components/admin/mentoring/enrollments/EnrollmentsPagination';

interface IndividualEnrollmentsContentProps {
  paginatedEnrollments: StudentMentoringEnrollment[];
  viewMode: 'cards' | 'list';
  selectedEnrollments: string[];
  pageInfo: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    startIndex: number;
    endIndex: number;
  };
  onView: (enrollment: StudentMentoringEnrollment) => void;
  onEdit: (enrollment: StudentMentoringEnrollment) => void;
  onDelete: (id: string) => void;
  onAddExtension: (enrollment: StudentMentoringEnrollment) => void;
  onToggleSelection: (id: string) => void;
  onPageChange: (page: number) => void;
}

export const IndividualEnrollmentsContent = ({
  paginatedEnrollments,
  viewMode,
  selectedEnrollments,
  pageInfo,
  onView,
  onEdit,
  onDelete,
  onAddExtension,
  onToggleSelection,
  onPageChange
}: IndividualEnrollmentsContentProps) => {
  return (
    <div className="space-y-4">
      {/* Cards ou Lista */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedEnrollments.map((enrollment) => (
            <ModernIndividualEnrollmentCard
              key={enrollment.id}
              enrollment={enrollment}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddExtension={onAddExtension}
              onToggleSelection={onToggleSelection}
              isSelected={selectedEnrollments.includes(enrollment.id)}
            />
          ))}
        </div>
      ) : (
        <ModernIndividualEnrollmentsList
          enrollments={paginatedEnrollments}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddExtension={onAddExtension}
          onToggleSelection={onToggleSelection}
          selectedEnrollments={selectedEnrollments}
        />
      )}

      {/* Paginação */}
      <EnrollmentsPagination
        currentPage={pageInfo.currentPage}
        totalPages={pageInfo.totalPages}
        onPageChange={onPageChange}
        totalItems={pageInfo.totalItems}
        startIndex={pageInfo.startIndex}
        endIndex={pageInfo.endIndex}
      />
    </div>
  );
};
