
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3, Table } from 'lucide-react';
import { CRMFilters } from '@/types/crm.types';
import { DashboardContent } from '../dashboard/DashboardContent';
import CRMLeadForm from '../CRMLeadForm';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMFiltersState } from '@/hooks/crm/useCRMFiltersState';

interface CRMDashboardProps {
  onOpenLead?: (leadId: string) => void;
}

const CRMDashboard: React.FC<CRMDashboardProps> = ({ onOpenLead }) => {
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
  const [filters, setFilters] = useState<CRMFilters>({});
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>();

  const { pipelines, loading: pipelinesLoading } = useCRMPipelines();
  
  // Use o hook de filtros
  const {
    searchValue,
    setSearchValue,
    isDebouncing
  } = useCRMFiltersState(filters, setFilters);

  // Configurar pipeline padrão sem animação
  React.useEffect(() => {
    if (pipelines.length > 0 && !selectedPipelineId) {
      const firstPipeline = pipelines[0];
      setSelectedPipelineId(firstPipeline.id);
      setFilters(prev => ({ ...prev, pipeline_id: firstPipeline.id }));
    }
  }, [pipelines, selectedPipelineId]);

  const effectiveFilters = useMemo(() => ({
    ...filters,
    pipeline_id: selectedPipelineId || undefined
  }), [filters, selectedPipelineId]);

  const handleCreateLead = (columnId?: string) => {
    setSelectedColumnId(columnId);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedColumnId(undefined);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedColumnId(undefined);
  };

  const handlePipelineChange = (pipelineId: string) => {
    setSelectedPipelineId(pipelineId);
    setFilters(prev => ({ ...prev, pipeline_id: pipelineId }));
  };

  if (pipelinesLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header otimizado */}
      <div className="flex-none border-b border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
          <Button onClick={() => handleCreateLead()}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>

        {/* Filtros sem animação */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Pipeline Selection */}
            <div className="flex items-center gap-2 min-w-[200px]">
              <select 
                value={selectedPipelineId} 
                onChange={(e) => handlePipelineChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um Pipeline</option>
                {pipelines.map(pipeline => (
                  <option key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar leads..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
              {isDebouncing && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* Controles de visualização */}
          <div className="flex items-center justify-between">
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'kanban' | 'list')}>
              <TabsList className="grid w-auto grid-cols-2">
                <TabsTrigger value="kanban" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Kanban
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  Lista
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Conteúdo principal sem animações */}
      <div className="flex-1 min-h-0">
        <DashboardContent
          activeView={activeView}
          effectiveFilters={effectiveFilters}
          selectedPipelineId={selectedPipelineId}
          onCreateLead={handleCreateLead}
        />
      </div>

      {/* Modal do formulário */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Novo Lead</h2>
              <CRMLeadForm
                pipelineId={selectedPipelineId}
                initialColumnId={selectedColumnId}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMDashboard;
