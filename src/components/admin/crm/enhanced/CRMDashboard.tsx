
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Columns3, Tag, Settings, RefreshCw, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import CRMFilters from '../CRMFilters';
import CRMPipelineManager from '../CRMPipelineManager';
import CRMTagsManager from '../CRMTagsManager';
import CRMReports from '../reports/CRMReports';
import CRMLeadFormDialog from '../CRMLeadFormDialog';
import { DashboardToolbar } from '../dashboard/DashboardToolbar';
import { DashboardContent } from '../dashboard/DashboardContent';
import { CRMStatsFooter } from '../dashboard/CRMStatsFooter';
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
      <div className="h-full flex flex-col bg-gray-50/30">
        {/* Header Principal */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Columns3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">CRM</h1>
                <p className="text-sm text-gray-500">Gestão de leads e pipeline de vendas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-2 text-gray-600 border-gray-300"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span>Alex Silva</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navegação por Tabs */}
        <div className="bg-white border-b border-gray-200 px-6">
          <Tabs defaultValue="pipeline" className="w-full">
            <TabsList className="h-12 bg-transparent border-none p-0">
              <TabsTrigger 
                value="pipeline" 
                className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent bg-transparent text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                <Columns3 className="h-4 w-4 mr-2" />
                Pipeline
              </TabsTrigger>
              <TabsTrigger 
                value="relatorios" 
                className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent bg-transparent text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                Relatórios
              </TabsTrigger>
              <TabsTrigger 
                value="configuracoes" 
                className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent bg-transparent text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </TabsTrigger>
            </TabsList>

            {/* Conteúdo das Tabs */}
            <div className="flex-1 flex flex-col">
              <TabsContent value="pipeline" className="mt-0 space-y-0 flex-1 flex flex-col">
                {/* Pipeline Header */}
                <div className="py-4 border-b border-gray-200">
                  <DashboardToolbar
                    activeView={activeView}
                    onViewChange={setActiveView}
                    pipelines={pipelines}
                    selectedPipelineId={selectedPipelineId}
                    onCreateLead={() => handleCreateLead()}
                  />
                </div>

                {/* Filtros */}
                <div className="py-4 border-b border-gray-100">
                  <CRMFilters
                    pipelineId={selectedPipelineId}
                    onPipelineChange={setSelectedPipelineId}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                  />
                </div>

                {/* Conteúdo Principal do Pipeline */}
                <div className="flex-1 overflow-hidden bg-gray-50">
                  <DashboardContent
                    activeView={activeView}
                    effectiveFilters={effectiveFilters}
                    selectedPipelineId={selectedPipelineId}
                    onCreateLead={handleCreateLead}
                  />
                </div>
                
                {/* Stats Footer */}
                <CRMStatsFooter />
              </TabsContent>

              <TabsContent value="relatorios" className="mt-0 flex-1">
                <div className="p-6">
                  <CRMReports />
                </div>
              </TabsContent>

              <TabsContent value="configuracoes" className="mt-0 flex-1">
                <div className="p-6">
                  <Card className="border-gray-200">
                    <CardHeader className="border-b border-gray-100">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Settings className="h-5 w-5" />
                        Configurações CRM
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50/30">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Columns3 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Pipelines</h3>
                              <p className="text-sm text-gray-600">Configure pipelines e colunas do CRM</p>
                            </div>
                          </div>
                          <CRMPipelineManager onRefresh={refetch} />
                        </div>

                        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50/30">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Tag className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Tags</h3>
                              <p className="text-sm text-gray-600">Gerencie as tags para categorizar leads</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowTagsManager(true)}
                            className="w-full border-green-200 text-green-700 hover:bg-green-50"
                          >
                            <Tag className="h-4 w-4 mr-2" />
                            Gerenciar Tags
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
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
