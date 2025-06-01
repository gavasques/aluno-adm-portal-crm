import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Kanban, ListIcon, BarChart3, Settings, LayoutGrid, Filter, Eye, Target } from 'lucide-react';
import { DashboardContent } from '../dashboard/DashboardContent';
import { CRMSettings } from '../settings/CRMSettings';
import CRMFilters from '../CRMFilters';
import { usePipelineSelection } from '@/hooks/crm/usePipelineSelection';
import { CRMFilters as CRMFiltersType } from '@/types/crm.types';
import { ReportsContent } from '../reports/ReportsContent';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';

interface CRMDashboardProps {
  onOpenLead: (leadId: string) => void;
}

const CRMDashboard = ({ onOpenLead }: CRMDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPipelineId, setSelectedPipelineId] = useState('');
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CRMFiltersType>({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const { pipelines, pipelinesLoading } = usePipelineSelection(
    selectedPipelineId,
    setSelectedPipelineId
  );

  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId);

  // Combinar filtros com pipeline selecionado
  const effectiveFilters: CRMFiltersType = {
    ...filters,
    pipeline_id: selectedPipelineId
  };

  // Garantir que dateRange sempre tenha from e to definidos para Analytics
  const safeDateRange = {
    from: dateRange?.from || subDays(new Date(), 30),
    to: dateRange?.to || new Date()
  };

  const handleCreateLead = () => {
    // Implementar abertura do formulário de lead
    console.log('Criar novo lead no pipeline:', selectedPipelineId);
  };

  const handleFiltersChange = (newFilters: CRMFiltersType) => {
    setFilters(newFilters);
  };

  const handlePipelineChange = (pipelineId: string) => {
    setSelectedPipelineId(pipelineId);
    // Limpar filtros ao trocar pipeline
    setFilters({});
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">CRM - Customer Relationship Management</h1>
        <p className="text-muted-foreground">
          Gerencie leads, oportunidades e relacionamento com clientes
        </p>
      </div>

      {/* Pipeline Selector e Controles */}
      {activeTab === 'dashboard' && (
        <div className="mb-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Pipeline:</span>
              </div>
              <Select 
                value={selectedPipelineId} 
                onValueChange={handlePipelineChange}
                disabled={pipelinesLoading}
              >
                <SelectTrigger className="w-64">
                  <SelectValue 
                    placeholder={pipelinesLoading ? "Carregando..." : "Selecione um pipeline"} 
                  />
                </SelectTrigger>
                <SelectContent>
                  {pipelines.map((pipeline) => (
                    <SelectItem key={pipeline.id} value={pipeline.id}>
                      {pipeline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              {selectedPipelineId && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                  </Button>
                  
                  <div className="flex items-center gap-1 border rounded-md">
                    <Button
                      variant={activeView === 'kanban' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveView('kanban')}
                      className="rounded-r-none"
                    >
                      <Kanban className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={activeView === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveView('list')}
                      className="rounded-l-none"
                    >
                      <ListIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}

              <div className="text-sm text-gray-600">
                {selectedPipeline && (
                  <span className="font-medium text-blue-700">
                    {selectedPipeline.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Filtros */}
          {showFilters && selectedPipelineId && (
            <Card>
              <CardContent className="pt-4">
                <CRMFilters 
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  pipelineId={selectedPipelineId}
                  onPipelineChange={handlePipelineChange}
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="flex-1">
          {selectedPipelineId ? (
            <DashboardContent 
              activeView={activeView}
              effectiveFilters={effectiveFilters}
              selectedPipelineId={selectedPipelineId}
              onCreateLead={handleCreateLead}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Card className="w-96">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LayoutGrid className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Selecione um Pipeline</CardTitle>
                  <CardDescription>
                    Escolha um pipeline acima para visualizar e gerenciar os leads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pipelinesLoading ? (
                    <p className="text-center text-sm text-gray-500">
                      Carregando pipelines...
                    </p>
                  ) : pipelines.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">
                      Nenhum pipeline encontrado. Configure um pipeline nas configurações.
                    </p>
                  ) : (
                    <p className="text-center text-sm text-gray-500">
                      {pipelines.length} pipeline(s) disponível(is)
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportsContent 
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsDashboard 
            dateRange={safeDateRange}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <CRMSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMDashboard;
