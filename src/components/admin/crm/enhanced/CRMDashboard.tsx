
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Kanban, ListIcon, BarChart3, Settings, LayoutGrid } from 'lucide-react';
import { DashboardContent } from '../dashboard/DashboardContent';
import { CRMSettings } from '../settings/CRMSettings';
import { usePipelineSelection } from '@/hooks/crm/usePipelineSelection';

interface CRMDashboardProps {
  onOpenLead: (leadId: string) => void;
}

const CRMDashboard = ({ onOpenLead }: CRMDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPipelineId, setSelectedPipelineId] = useState('');
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');

  const { pipelines, pipelinesLoading } = usePipelineSelection(
    selectedPipelineId,
    setSelectedPipelineId
  );

  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId);

  const handleCreateLead = () => {
    // Implementar abertura do formulário de lead
    console.log('Criar novo lead no pipeline:', selectedPipelineId);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">CRM - Customer Relationship Management</h1>
        <p className="text-muted-foreground">
          Gerencie leads, oportunidades e relacionamento com clientes
        </p>
      </div>

      {/* Pipeline Selector */}
      {activeTab === 'dashboard' && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Pipeline:</span>
            </div>
            <Select 
              value={selectedPipelineId} 
              onValueChange={setSelectedPipelineId}
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

          {selectedPipelineId && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Pipeline ativo:</span>
              <span className="font-medium text-blue-700">
                {selectedPipeline?.name}
              </span>
            </div>
          )}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Kanban className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <ListIcon className="h-4 w-4" />
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
              effectiveFilters={{ pipeline_id: selectedPipelineId }}
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
          <Card>
            <CardHeader>
              <CardTitle>Relatórios do CRM</CardTitle>
              <CardDescription>
                Análises detalhadas de performance e conversões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Funcionalidade em desenvolvimento - será implementada em breve
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Avançado</CardTitle>
              <CardDescription>
                Métricas avançadas e insights de dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Funcionalidade em desenvolvimento - será implementada em breve
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <CRMSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMDashboard;
