
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Columns3, List, Plus, Refresh } from 'lucide-react';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import CRMStatsCards from '../CRMStatsCards';
import CRMFilters from '../CRMFilters';
import OptimizedKanbanBoard from '../OptimizedKanbanBoard';
import CRMListView from '../CRMListView';
import { CRMFilters as CRMFiltersType } from '@/types/crm.types';

interface CRMDashboardProps {
  onOpenLead?: (leadId: string) => void;
}

const CRMDashboard: React.FC<CRMDashboardProps> = ({ onOpenLead }) => {
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const [filters, setFilters] = useState<CRMFiltersType>({});
  
  const { pipelines, loading: pipelinesLoading } = useCRMPipelines();

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

  if (pipelinesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM</h1>
          <p className="text-gray-600">Gestão de leads e pipeline de vendas</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            <Refresh className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Dashboard CRM Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Dashboard CRM</span>
            <span className="text-sm font-normal text-gray-600">
              Visão geral da performance e métricas
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CRMStatsCards filters={effectiveFilters} />
        </CardContent>
      </Card>

      {/* Main CRM Interface */}
      <Tabs defaultValue="pipeline" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          {/* View Toggle */}
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
          </div>
        </div>

        <TabsContent value="pipeline" className="space-y-6">
          {/* Filters */}
          <CRMFilters
            pipelines={pipelines}
            selectedPipelineId={selectedPipelineId}
            onPipelineChange={setSelectedPipelineId}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {/* Main Content */}
          <Card className="min-h-[600px]">
            <CardContent className="p-0">
              {activeView === 'kanban' ? (
                <OptimizedKanbanBoard
                  filters={effectiveFilters}
                  pipelineId={selectedPipelineId}
                />
              ) : (
                <CRMListView
                  filters={effectiveFilters}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios CRM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <p>Módulo de relatórios em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes">
          <Card>
            <CardHeader>
              <CardTitle>Configurações CRM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <p>Configurações do CRM em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMDashboard;
