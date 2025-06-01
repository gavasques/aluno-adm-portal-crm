
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Kanban, ListIcon, BarChart3, Settings } from 'lucide-react';
import { DashboardContent } from '../dashboard/DashboardContent';
import { CRMSettings } from '../settings/CRMSettings';

interface CRMDashboardProps {
  onOpenLead: (leadId: string) => void;
}

const CRMDashboard = ({ onOpenLead }: CRMDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">CRM - Customer Relationship Management</h1>
        <p className="text-muted-foreground">
          Gerencie leads, oportunidades e relacionamento com clientes
        </p>
      </div>

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
          <DashboardContent />
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
