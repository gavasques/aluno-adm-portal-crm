
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Columns3, Tag, Settings, RefreshCw } from 'lucide-react';
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
              <p className="text-sm text-gray-600 mt-1">Gestão de leads e pipeline de vendas</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Navegação por Tabs */}
        <div className="bg-white border-b border-gray-200 px-6">
          <Tabs defaultValue="pipeline" className="w-full">
            <TabsList className="grid w-fit grid-cols-3 bg-gray-100/50">
              <TabsTrigger value="pipeline" className="data-[state=active]:bg-white">
                Pipeline
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="data-[state=active]:bg-white">
                Relatórios
              </TabsTrigger>
              <TabsTrigger value="configuracoes" className="data-[state=active]:bg-white">
                Configurações
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 pt-6">
              <TabsContent value="pipeline" className="mt-0 space-y-6">
                {/* Toolbar com View Toggle e Novo Lead */}
                <DashboardToolbar
                  activeView={activeView}
                  onViewChange={setActiveView}
                  pipelines={pipelines}
                  selectedPipelineId={selectedPipelineId}
                  onCreateLead={() => handleCreateLead()}
                />

                {/* Área de Filtros Reorganizada */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <CRMFilters
                    pipelineId={selectedPipelineId}
                    onPipelineChange={setSelectedPipelineId}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                  />
                </div>
              </TabsContent>

              <TabsContent value="relatorios" className="mt-0">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <CRMReports />
                </div>
              </TabsContent>

              <TabsContent value="configuracoes" className="mt-0">
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
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 p-6">
          <DashboardContent
            activeView={activeView}
            effectiveFilters={effectiveFilters}
            selectedPipelineId={selectedPipelineId}
            onCreateLead={handleCreateLead}
          />
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
