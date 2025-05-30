
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, LayoutGrid, List, Settings } from 'lucide-react';
import CRMKanbanBoard from '@/components/admin/crm/CRMKanbanBoard';
import CRMListView from '@/components/admin/crm/CRMListView';
import CRMFilters from '@/components/admin/crm/CRMFilters';
import CRMLeadFormDialog from '@/components/admin/crm/CRMLeadFormDialog';
import CRMPipelineManager from '@/components/admin/crm/CRMPipelineManager';
import CRMTagsManager from '@/components/admin/crm/CRMTagsManager';
import LeadDetailModal from '@/components/admin/crm/LeadDetailModal';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { CRMFilters as CRMFiltersType, ViewMode, CRMLead } from '@/types/crm.types';

const AdminCRM = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [filters, setFilters] = useState<CRMFiltersType>({});
  const [selectedPipeline, setSelectedPipeline] = useState<string>('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showPipelineManager, setShowPipelineManager] = useState(false);
  const [showTagsManager, setShowTagsManager] = useState(false);
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingLead, setEditingLead] = useState<CRMLead | null>(null);

  const { pipelines, loading: pipelinesLoading } = useCRMPipelines();

  // Selecionar primeiro pipeline por padrão
  React.useEffect(() => {
    if (pipelines.length > 0 && !selectedPipeline) {
      setSelectedPipeline(pipelines[0].id);
      setFilters(prev => ({ ...prev, pipeline_id: pipelines[0].id }));
    }
  }, [pipelines, selectedPipeline]);

  const handlePipelineChange = (pipelineId: string) => {
    setSelectedPipeline(pipelineId);
    setFilters(prev => ({ ...prev, pipeline_id: pipelineId }));
  };

  const handleFiltersChange = (newFilters: CRMFiltersType) => {
    setFilters(newFilters);
  };

  const handleOpenDetail = (lead: CRMLead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const handleEditLead = (lead: CRMLead) => {
    setEditingLead(lead);
    setShowLeadForm(true);
  };

  const handleLeadUpdate = () => {
    // Refresh leads será feito automaticamente pelo hook
    setShowDetailModal(false);
    setSelectedLead(null);
  };

  const handleFormSuccess = () => {
    setShowLeadForm(false);
    setEditingLead(null);
  };

  if (pipelinesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM - Gestão de Leads</h1>
          <p className="text-muted-foreground">
            Gerencie leads, closers e processo de onboarding
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTagsManager(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Tags
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPipelineManager(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Pipelines
          </Button>

          <Button onClick={() => setShowLeadForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <CardTitle>Pipeline de Vendas</CardTitle>
              
              {pipelines.length > 0 && (
                <Tabs value={selectedPipeline} onValueChange={handlePipelineChange}>
                  <TabsList>
                    {pipelines.map(pipeline => (
                      <TabsTrigger key={pipeline.id} value={pipeline.id}>
                        {pipeline.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Kanban
              </Button>
              
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-2" />
                Lista
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <CRMFilters 
              filters={filters} 
              onFiltersChange={handleFiltersChange}
              pipelineId={selectedPipeline}
            />

            {viewMode === 'kanban' ? (
              <CRMKanbanBoard 
                filters={filters} 
                pipelineId={selectedPipeline}
              />
            ) : (
              <CRMListView 
                filters={filters}
                onOpenDetail={handleOpenDetail}
                onEditLead={handleEditLead}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CRMLeadFormDialog
        open={showLeadForm}
        onOpenChange={setShowLeadForm}
        pipelineId={selectedPipeline}
        lead={editingLead}
        onSuccess={handleFormSuccess}
      />

      <LeadDetailModal
        lead={selectedLead}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        onLeadUpdate={handleLeadUpdate}
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

export default AdminCRM;
