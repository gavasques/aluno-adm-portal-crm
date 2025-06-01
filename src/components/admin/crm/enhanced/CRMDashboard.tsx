import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Columns3, List, RefreshCw, Settings, Tag, Sparkles, BarChart3 } from 'lucide-react';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { DesignCard } from '@/design-system';
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
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-slate-600 dark:text-slate-300">Carregando pipeline...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <DesignCard 
      variant="glass" 
      size="lg" 
      className="h-full border-white/30 bg-white/40 dark:bg-black/10 backdrop-blur-xl shadow-xl"
    >
      <div className="h-full flex flex-col">
        <Tabs defaultValue="pipeline" className="h-full flex flex-col">
          {/* Enhanced Header with Modern Controls */}
          <motion.div 
            className="flex items-center justify-between mb-4 px-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TabsList className="bg-white/80 dark:bg-black/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-xl">
              <TabsTrigger 
                value="pipeline" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-md rounded-lg transition-all duration-200"
              >
                <Columns3 className="h-4 w-4 mr-2" />
                Pipeline
              </TabsTrigger>
              <TabsTrigger 
                value="relatorios"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-md rounded-lg transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Relatórios
              </TabsTrigger>
              <TabsTrigger 
                value="configuracoes"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-md rounded-lg transition-all duration-200"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </TabsTrigger>
            </TabsList>

            {/* Modern Control Panel */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge 
                variant="outline" 
                className="text-xs bg-white/60 dark:bg-black/20 border-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {pipelines.find(p => p.id === selectedPipelineId)?.name || 'Selecione Pipeline'}
              </Badge>
              
              {/* View Toggle with Glass Effect */}
              <div className="flex rounded-xl border border-white/30 bg-white/60 dark:bg-black/20 backdrop-blur-sm p-1 shadow-lg">
                <Button
                  variant={activeView === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('kanban')}
                  className={`h-8 px-3 rounded-lg transition-all duration-200 ${
                    activeView === 'kanban' 
                      ? 'bg-white dark:bg-white/10 shadow-md' 
                      : 'hover:bg-white/50 dark:hover:bg-white/5'
                  }`}
                >
                  <Columns3 className="h-4 w-4 mr-1" />
                  Kanban
                </Button>
                <Button
                  variant={activeView === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('list')}
                  className={`h-8 px-3 rounded-lg transition-all duration-200 ${
                    activeView === 'list' 
                      ? 'bg-white dark:bg-white/10 shadow-md' 
                      : 'hover:bg-white/50 dark:hover:bg-white/5'
                  }`}
                >
                  <List className="h-4 w-4 mr-1" />
                  Lista
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                className="bg-white/60 dark:bg-black/20 border-white/30 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </motion.div>
          </motion.div>

          <TabsContent value="pipeline" className="flex-1 flex flex-col min-h-0 px-1">
            {/* Enhanced Filters */}
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DesignCard 
                variant="glass" 
                size="sm" 
                className="border-white/20 bg-white/30 dark:bg-black/10 backdrop-blur-md"
              >
                <CRMFilters
                  pipelineId={selectedPipelineId}
                  onPipelineChange={setSelectedPipelineId}
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </DesignCard>
            </motion.div>

            {/* Main Content with Enhanced Design */}
            <motion.div 
              className="flex-1 min-h-0"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {activeView === 'kanban' ? (
                <OptimizedKanbanBoard
                  filters={effectiveFilters}
                  pipelineId={selectedPipelineId}
                />
              ) : (
                <DesignCard 
                  variant="glass" 
                  size="md" 
                  className="h-full border-white/20 bg-white/30 dark:bg-black/10 backdrop-blur-md overflow-hidden"
                >
                  <div className="h-full overflow-auto">
                    <CRMListView filters={effectiveFilters} />
                  </div>
                </DesignCard>
              )}
            </motion.div>
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

        {/* Tags Manager Dialog */}
        <CRMTagsManager
          open={showTagsManager}
          onOpenChange={setShowTagsManager}
        />
      </div>
    </DesignCard>
  );
};

export default CRMDashboard;
