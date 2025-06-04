
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CRMFilters, CRMLead } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useKanbanNavigation } from '@/hooks/crm/useKanbanNavigation';
import OptimizedListView from './OptimizedListView';

interface CRMListViewProps {
  filters: CRMFilters;
  onCreateLead?: () => void;
}

const CRMListView: React.FC<CRMListViewProps> = ({
  filters,
  onCreateLead
}) => {
  const navigate = useNavigate();
  const { handleOpenDetail } = useKanbanNavigation();

  const handleOpenLeadDetails = (lead: CRMLead) => {
    console.log('🔗 CRMListView: Abrindo detalhes do lead:', lead.id);
    handleOpenDetail(lead);
  };

  return (
    <div className="h-full flex flex-col">
      {/* OptimizedListView Component */}
      <div className="flex-1 min-h-0">
        <OptimizedListView 
          filters={filters}
          onCreateLead={onCreateLead || (() => {})}
        />
      </div>
    </div>
  );
};

export default CRMListView;
