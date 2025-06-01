
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Columns3, List, RefreshCw, Settings, Tag } from 'lucide-react';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import CRMFilters from '../CRMFilters';
import OptimizedKanbanBoard from '../OptimizedKanbanBoard';
import CRMListView from '../CRMListView';
import CRMPipelineManager from '../CRMPipelineManager';
import CRMTagsManager from '../CRMTagsManager';
import CRMReportsOverview from '../reports/CRMReportsOverview';
import { CRMFilters as CRMFiltersType } from '@/types/crm.types';

interface CRMDashboardProps {
  onOpenLead?: (leadId: string) => void;
}

const CRMDashboard: React.FC<CRMDashboardProps> = ({ onOpenLead }) => {
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const [filters, setFilters] = useState<CRMFiltersType>({});
  const [showTagsManager, setShowTagsManager] = useState(false);
  
  const { pipelines, loading: pipelinesLoading, refetch } = useCRMPipelines();

  // Auto-select first pipeline if none selected
  React.useEffect(() => {
    if (pipelines.length > 0 && !selectedPipelineId) {
      setSelectedPipelineId(pipelines[0].id);
    }
  }, [pipelines, selectedPipelineId]);

  // Update filters when pipeline changes
  const effectiveFilters = useMemo(() => ({
    ...filters,
    pipeline_id: selectedPipelineId
  }), [filters, selectedPipelineId]);

  const handleFiltersChange = (newFilters: CRMFiltersType) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    refetch();
    window.location.reload();
  };

  if (pipelinesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Main CRM Interface */}
      <div className="flex-1 min-h-0">
        <Tabs defaultValue="pipeline" className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-4 px-6">
            <TabsList>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            </TabsList>

            {/* View Toggle - Só aparece na aba pipeline */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Pipeline: {pipelines.find(p => p.id === selectedPipelineId)?.name || 'Selecione'}
              </Badge>
              <div className="flex rounded-lg border border-gray-200 p-1">
                <Button
                  variant={activeView === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('kanban')}
                  className="h-8 px-3"
                >
                  <Columns3 className="h-4 w-4 mr-1" />
                  Kanban
                </Button>
                <Button
                  variant={activeView === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('list')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4 mr-1" />
                  Lista
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>

          <TabsContent value="pipeline" className="flex-1 flex flex-col space-y-4 px-6 min-h-0">
            {/* Filters */}
            <CRMFilters
              pipelineId={selectedPipelineId}
              onPipelineChange={setSelectedPipelineId}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />

            {/* Main Content */}
            <Card className="flex-1 min-h-0">
              <CardContent className="p-0 h-full">
                {activeView === 'kanban' ? (
                  <OptimizedKanbanBoard
                    filters={effectiveFilters}
                    pipelineId={selectedPipelineId}
                  />
                ) : (
                  <div className="p-4 h-full overflow-auto">
                    <CRMListView
                      filters={effectiveFilters}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios" className="flex-1 px-6 min-h-0">
            <CRMReportsOverview />
          </TabsContent>

          <TabsContent value="configuracoes" className="flex-1 px-6">
            <Card className="h-full">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configurações CRM
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Configure pipelines, colunas, tags e outras configurações do sistema CRM
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gerenciar Pipelines */}
                  <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <h3 className="font-semibold mb-2 flex items-center gap-2 text-blue-900">
                      <Columns3 className="h-5 w-5" />
                      Pipelines & Colunas
                    </h3>
                    <p className="text-sm text-blue-700 mb-4">
                      Configure e organize os pipelines e suas respectivas colunas
                    </p>
                    <CRMPipelineManager onRefresh={refetch} />
                  </div>

                  {/* Gerenciar Tags */}
                  <div className="p-6 border rounded-lg bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <h3 className="font-semibold mb-2 flex items-center gap-2 text-green-900">
                      <Tag className="h-5 w-5" />
                      Sistema de Tags
                    </h3>
                    <p className="text-sm text-green-700 mb-4">
                      Gerencie as tags para categorizar e organizar leads
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowTagsManager(true)}
                      className="w-full border-green-300 text-green-700 hover:bg-green-50"
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

      {/* Tags Manager Dialog */}
      <CRMTagsManager
        open={showTagsManager}
        onOpenChange={setShowTagsManager}
      />
    </div>
  );
};

export default CRMDashboard;
