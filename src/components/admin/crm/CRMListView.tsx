
import React from 'react';
import { CRMFilters } from '@/types/crm.types';

interface CRMListViewProps {
  filters: CRMFilters;
}

const CRMListView = ({ filters }: CRMListViewProps) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Lista de Leads</h3>
      <p className="text-sm text-muted-foreground">
        Lista de leads em desenvolvimento...
      </p>
    </div>
  );
};

export default CRMListView;
