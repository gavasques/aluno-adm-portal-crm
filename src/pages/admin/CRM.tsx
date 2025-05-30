import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Tags, BarChart3, List, Kanban } from 'lucide-react';
import CRMStatsCards from '@/components/admin/crm/CRMStatsCards';
import CRMFilters from '@/components/admin/crm/CRMFilters';
import CRMKanbanBoard from '@/components/admin/crm/CRMKanbanBoard';
import CRMListView from '@/components/admin/crm/CRMListView';
import CRMLeadFormDialog from '@/components/admin/crm/CRMLeadFormDialog';
import CRMPipelineManager from '@/components/admin/crm/CRMPipelineManager';
import CRMTagsManager from '@/components/admin/crm/CRMTagsManager';
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

  const { pipelines, loading: pipelinesLoading } = useCRMPipelines();
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

  if (pipelinesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
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

      {/* Stats Cards */}
      <CRMStatsCards filters={filters} />

      {/* Filters */}
      <CRMFilters 
        filters={filters} 
        onFiltersChange={setFilters}
        pipelineId={selectedPipelineId}
        onPipelineChange={handlePipelineChange}
      />

      {/* Main Content */}
      <Card>
        <CardHeader>
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
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="kanban">
              <CRMKanbanBoard 
                pipelineId={selectedPipelineId} 
                filters={filters}
              />
            </TabsContent>
            <TabsContent value="list">
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
        lead={editingLead}
        onSuccess={handleFormSuccess}
      />

      <CRMPipelineManager
        open={showPipelineManager}
        onOpenChange={setShowPipelineManager}
      />

      <CRMTagsManager
        open={showTagsManager}
        onOpenChange={setShowTagsManager}
      />
    </div>
  );
};

export default CRM;
