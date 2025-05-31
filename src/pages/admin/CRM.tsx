
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Tags, BarChart3 } from 'lucide-react';
import CRMFilters from '@/components/admin/crm/CRMFilters';
import CRMStatsCards from '@/components/admin/crm/CRMStatsCards';
import OptimizedKanbanBoard from '@/components/admin/crm/OptimizedKanbanBoard';
import CRMListView from '@/components/admin/crm/CRMListView';
import CRMLeadFormDialog from '@/components/admin/crm/CRMLeadFormDialog';
import CRMTagsManager from '@/components/admin/crm/CRMTagsManager';
import PipelineManagerDialog from '@/components/admin/crm/pipeline-manager/PipelineManagerDialog';
import CRMDashboard from '@/components/admin/crm/enhanced/CRMDashboard';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMData } from '@/hooks/crm/useCRMData';
import { useCRMRealtime } from '@/hooks/crm/useCRMRealtime';
import { CRMFilters as CRMFiltersType, CRMLead } from '@/types/crm.types';
import { motion } from 'framer-motion';

const CRM = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [showPipelineManager, setShowPipelineManager] = useState(false);
  const [showTagsManager, setShowTagsManager] = useState(false);
  const [editingLead, setEditingLead] = useState<CRMLead | null>(null);
  const [filters, setFilters] = useState<CRMFiltersType>({});

  const { pipelines, loading: pipelinesLoading, fetchPipelines } = useCRMPipelines();
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');

  // Usar o hook unificado para dados do CRM
  const { refetch } = useCRMData({ ...filters, pipeline_id: selectedPipelineId });

  // Setup realtime subscriptions
  useCRMRealtime({
    onLeadUpdate: refetch,
    onCommentAdded: refetch,
    onContactUpdate: refetch
  });

  React.useEffect(() => {
    if (pipelines.length > 0 && !selectedPipelineId) {
      setSelectedPipelineId(pipelines[0].id);
      setFilters(prev => ({ ...prev, pipeline_id: pipelines[0].id }));
    }
  }, [pipelines, selectedPipelineId]);

  const handleEditLead = (lead: CRMLead) => {
    setEditingLead(lead);
    setShowNewLeadForm(true);
  };

  const handleFormSuccess = () => {
    setShowNewLeadForm(false);
    setEditingLead(null);
    refetch();
  };

  const handlePipelineChange = (pipelineId: string) => {
    setSelectedPipelineId(pipelineId);
    setFilters(prev => ({ ...prev, pipeline_id: pipelineId }));
  };

  const handlePipelineManagerClose = () => {
    setShowPipelineManager(false);
    fetchPipelines();
  };

  const handleOpenLead = (leadId: string) => {
    console.log('Opening lead:', leadId);
    // Implementar navegação para detalhes do lead
  };

  if (pipelinesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (pipelines.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pipeline encontrado</h3>
          <p className="text-gray-500 mb-4">Configure pipelines para começar a usar o CRM.</p>
          <Button onClick={() => setShowPipelineManager(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configurar Pipelines
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center flex-shrink-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM</h1>
          <p className="text-gray-600 mt-1">Gestão de leads e pipeline de vendas</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowTagsManager(true)}>
            <Tags className="h-4 w-4 mr-2" />
            Tags
          </Button>
          <Button variant="outline" onClick={() => setShowPipelineManager(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Pipelines
          </Button>
          <Button onClick={() => setShowNewLeadForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards - Only show if not on dashboard tab */}
      {activeTab !== 'dashboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CRMStatsCards filters={{ ...filters, pipeline_id: selectedPipelineId }} />
        </motion.div>
      )}

      {/* Filters - Only show if not on dashboard tab */}
      {activeTab !== 'dashboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-shrink-0"
        >
          <CRMFilters 
            filters={filters} 
            onFiltersChange={setFilters}
            pipelineId={selectedPipelineId}
            onPipelineChange={handlePipelineChange}
          />
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center justify-between">
              <span>CRM</span>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="kanban">Kanban</TabsTrigger>
                  <TabsTrigger value="list">Lista</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsContent value="dashboard" className="flex-1 overflow-hidden m-0 p-6">
                <CRMDashboard onOpenLead={handleOpenLead} />
              </TabsContent>
              <TabsContent value="kanban" className="flex-1 overflow-hidden m-0 p-6">
                <OptimizedKanbanBoard 
                  pipelineId={selectedPipelineId} 
                  filters={{ ...filters, pipeline_id: selectedPipelineId }}
                />
              </TabsContent>
              <TabsContent value="list" className="flex-1 overflow-hidden m-0 p-6">
                <CRMListView 
                  filters={{ ...filters, pipeline_id: selectedPipelineId }}
                  onEditLead={handleEditLead}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modals */}
      <CRMLeadFormDialog
        open={showNewLeadForm}
        onOpenChange={setShowNewLeadForm}
        pipelineId={selectedPipelineId}
        leadId={editingLead?.id}
        mode={editingLead ? "edit" : "create"}
        onSuccess={handleFormSuccess}
      />

      <PipelineManagerDialog
        open={showPipelineManager}
        onOpenChange={handlePipelineManagerClose}
      />

      <CRMTagsManager
        open={showTagsManager}
        onOpenChange={setShowTagsManager}
      />
    </div>
  );
};

export default CRM;
