
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Tags, BarChart3, List, Kanban } from 'lucide-react';
import CRMFilters from '@/components/admin/crm/CRMFilters';
import CRMKanbanBoard from '@/components/admin/crm/CRMKanbanBoard';
import CRMListView from '@/components/admin/crm/CRMListView';
import CRMLeadFormDialog from '@/components/admin/crm/CRMLeadFormDialog';
import CRMTagsManager from '@/components/admin/crm/CRMTagsManager';
import PipelineManagerDialog from '@/components/admin/crm/pipeline-manager/PipelineManagerDialog';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { CRMFilters as CRMFiltersType, CRMLead } from '@/types/crm.types';

const CRM = () => {
  const [activeTab, setActiveTab] = useState('kanban');
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [showPipelineManager, setShowPipelineManager] = useState(false);
  const [showTagsManager, setShowTagsManager] = useState(false);
  const [editingLead, setEditingLead] = useState<CRMLead | null>(null);
  const [filters, setFilters] = useState<CRMFiltersType>({
    search: '',
    responsible_id: undefined,
    column_id: undefined,
    tags: []
  });

  const { pipelines, loading: pipelinesLoading, fetchPipelines } = useCRMPipelines();
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');

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
  };

  const handlePipelineChange = (pipelineId: string) => {
    setSelectedPipelineId(pipelineId);
    setFilters(prev => ({ ...prev, pipeline_id: pipelineId }));
  };

  const handlePipelineManagerClose = () => {
    setShowPipelineManager(false);
    fetchPipelines(); // Refresh pipelines after changes
  };

  if (pipelinesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center flex-shrink-0">
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
      </div>

      {/* Filters */}
      <div className="flex-shrink-0">
        <CRMFilters 
          filters={filters} 
          onFiltersChange={setFilters}
          pipelineId={selectedPipelineId}
          onPipelineChange={handlePipelineChange}
        />
      </div>

      {/* Main Content - Expanded to fill remaining space */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center justify-between">
            <span>Pipeline de Vendas</span>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="kanban" className="flex items-center gap-2">
                  <Kanban className="h-4 w-4" />
                  Kanban
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Lista
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsContent value="kanban" className="flex-1 overflow-hidden m-0 p-6">
              <CRMKanbanBoard 
                pipelineId={selectedPipelineId} 
                filters={filters}
              />
            </TabsContent>
            <TabsContent value="list" className="flex-1 overflow-hidden m-0 p-6">
              <CRMListView 
                filters={filters}
                onEditLead={handleEditLead}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
