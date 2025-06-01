
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CRMFilters, CRMLead } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import ListView from './ListView';

interface CRMListViewProps {
  filters: CRMFilters;
}

const CRMListView: React.FC<CRMListViewProps> = ({ filters }) => {
  const navigate = useNavigate();
  const { columns } = useCRMPipelines();
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenLeadDetails = (lead: CRMLead) => {
    console.log('🔗 CRMListView: Opening modern lead detail page for:', lead.id);
    navigate(`/admin/lead/${lead.id}`);
  };

  return (
    <ListView
      filters={filters}
      columns={columns}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onOpenLeadDetails={handleOpenLeadDetails}
    />
  );
};

export default CRMListView;
