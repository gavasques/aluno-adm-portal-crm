
import React from 'react';
import { MentoringProvider } from '@/features/mentoring/contexts/MentoringContext';
import { MentoringErrorBoundary } from '@/features/mentoring/shared/components/ErrorBoundary';
import { CatalogManagement } from '@/features/mentoring/admin/components/CatalogManagement';

const AdminMentoringCatalog = () => {
  return (
    <MentoringErrorBoundary>
      <MentoringProvider>
        <div className="container mx-auto py-6">
          <CatalogManagement />
        </div>
      </MentoringProvider>
    </MentoringErrorBoundary>
  );
};

export default AdminMentoringCatalog;
