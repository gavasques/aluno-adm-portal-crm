
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CRMFilters, CRMLead } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import OptimizedListView from './OptimizedListView';

interface CRMListViewProps {
  filters: CRMFilters;
  onCreateLead?: () => void;
}

const CRMListView: React.FC<CRMListViewProps> = ({ filters, onCreateLead }) => {
  const navigate = useNavigate();
  const { columns } = useCRMPipelines();
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenLeadDetails = (lead: CRMLead) => {
    console.log('🔗 CRMListView: Opening modern lead detail page for:', lead.id);
    navigate(`/admin/lead/${lead.id}`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with New Lead Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Lista de Leads</h3>
        {onCreateLead && (
          <Button 
            onClick={onCreateLead}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        )}
      </div>

      {/* OptimizedListView Component */}
      <div className="flex-1 min-h-0">
        <OptimizedListView
          filters={filters}
          columns={columns}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenLeadDetails={handleOpenLeadDetails}
        />
      </div>
    </div>
  );
};

export default CRMListView;
