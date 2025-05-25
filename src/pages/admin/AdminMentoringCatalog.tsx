
import React from 'react';
import { MentoringProviders } from '@/features/mentoring/providers/MentoringProviders';
import { CatalogManagement } from '@/features/mentoring/admin/components/CatalogManagement';

const AdminMentoringCatalog = () => {
  return (
    <MentoringProviders>
      <div className="container mx-auto py-6">
        <CatalogManagement />
      </div>
    </MentoringProviders>
  );
};

export default AdminMentoringCatalog;
