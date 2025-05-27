
import React, { memo } from 'react';
import { StudentMentoringEnrollment } from '@/types/mentoring.types';
import { ModernIndividualEnrollmentCard } from '../enrollments/ModernIndividualEnrollmentCard';
import { EnrollmentsList } from '../enrollments/EnrollmentsList';
import { EnrollmentsPagination } from '../enrollments/EnrollmentsPagination';

interface OptimizedIndividualEnrollmentsContentProps {
  paginatedEnrollments: StudentMentoringEnrollment[];
  viewMode: 'cards' | 'list';
  selectedEnrollments: string[];
  pageInfo: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    itemsPerPage: number;
    startItem: number;
    endItem: number;
  };
  onView: (enrollment: StudentMentoringEnrollment) => void;
  onEdit: (enrollment: StudentMentoringEnrollment) => void;
  onDelete: (id: string) => void;
  onAddExtension: (enrollment: StudentMentoringEnrollment) => void;
  onToggleSelection: (id: string) => void;
  onPageChange: (page: number) => void;
}

export const OptimizedIndividualEnrollmentsContent = memo<OptimizedIndividualEnrollmentsContentProps>(({
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
}) => {
  return (
    <div className="space-y-6">
      {/* Conteúdo */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <EnrollmentsList
          enrollments={paginatedEnrollments}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddExtension={onAddExtension}
          onToggleSelection={onToggleSelection}
          selectedEnrollments={selectedEnrollments}
          onSelectAll={() => {
            // Implementar select all se necessário
          }}
        />
      )}

      {/* Paginação */}
      {pageInfo.totalPages > 1 && (
        <EnrollmentsPagination
          currentPage={pageInfo.currentPage}
          totalPages={pageInfo.totalPages}
          onPageChange={onPageChange}
          totalItems={pageInfo.totalItems}
          startIndex={pageInfo.startItem}
          endIndex={pageInfo.endItem}
        />
      )}
    </div>
  );
});

OptimizedIndividualEnrollmentsContent.displayName = 'OptimizedIndividualEnrollmentsContent';

export default OptimizedIndividualEnrollmentsContent;
