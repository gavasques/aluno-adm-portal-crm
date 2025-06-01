
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Columns3, Tag, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CRMFilters from '../CRMFilters';
import CRMPipelineManager from '../CRMPipelineManager';
import CRMTagsManager from '../CRMTagsManager';
import CRMReports from '../reports/CRMReports';
import CRMLeadFormDialog from '../CRMLeadFormDialog';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { DashboardToolbar } from '../dashboard/DashboardToolbar';
import { DashboardContent } from '../dashboard/DashboardContent';
import { useDashboardState } from '@/hooks/crm/useDashboardState';
import { usePipelineSelection } from '@/hooks/crm/usePipelineSelection';

interface CRMDashboardProps {
  onOpenLead?: (leadId: string) => void;
}

const CRMDashboard: React.FC<CRMDashboardProps> = ({ onOpenLead }) => {
  const {
    activeView,
    setActiveView,
    selectedPipelineId,
    setSelectedPipelineId,
    filters,
    setFilters,
    effectiveFilters,
    showTagsManager,
    setShowTagsManager,
    showCreateModal,
    setShowCreateModal,
    selectedColumnForCreate,
    setSelectedColumnForCreate
  } = useDashboardState();

  const { pipelines, pipelinesLoading, refetch } = usePipelineSelection(
    selectedPipelineId,
    setSelectedPipelineId
  );

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Dados atualizados');
  };

  const handleCreateLead = (columnId?: string) => {
    if (!selectedPipelineId) {
      toast.error('Selecione um pipeline primeiro');
      return;
    }
    setSelectedColumnForCreate(columnId || '');
    setShowCreateModal(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setSelectedColumnForCreate('');
    refetch();
    toast.success('Lead criado com sucesso');
  };

  if (pipelinesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col">
        <DashboardHeader onRefresh={handleRefresh} />

        <div className="flex-1 px-6 pb-6">
          <Tabs defaultValue="pipeline" className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
                <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pipeline" className="flex-1 flex flex-col space-y-6">
              <DashboardToolbar
                activeView={activeView}
                onViewChange={setActiveView}
                pipelines={pipelines}
                selectedPipelineId={selectedPipelineId}
                onCreateLead={() => handleCreateLead()}
              />

              <CRMFilters
                pipelineId={selectedPipelineId}
                onPipelineChange={setSelectedPipelineId}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />

              <DashboardContent
                activeView={activeView}
                effectiveFilters={effectiveFilters}
                selectedPipelineId={selectedPipelineId}
                onCreateLead={handleCreateLead}
              />
            </TabsContent>

            <TabsContent value="relatorios" className="flex-1">
              <CRMReports />
            </TabsContent>

            <TabsContent value="configuracoes" className="flex-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configurações CRM
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Columns3 className="h-4 w-4" />
                        Pipelines
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Configure pipelines e colunas do CRM
                      </p>
                      <CRMPipelineManager onRefresh={refetch} />
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Tags
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Gerencie as tags para categorizar leads
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowTagsManager(true)}
                        className="w-full"
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Gerenciar Tags
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <CRMTagsManager
          open={showTagsManager}
          onOpenChange={setShowTagsManager}
        />
      </div>

      <CRMLeadFormDialog
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        pipelineId={selectedPipelineId}
        initialColumnId={selectedColumnForCreate}
        mode="create"
        onSuccess={handleCreateSuccess}
      />
    </>
  );
};

export default CRMDashboard;
