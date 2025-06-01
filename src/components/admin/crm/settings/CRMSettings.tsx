
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Database, Users, Tags } from 'lucide-react';
import { CRMFieldManager } from '../custom-fields/CRMFieldManager';

export const CRMSettings = () => {
  const [activeTab, setActiveTab] = useState('fields');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações do CRM</h2>
        <p className="text-muted-foreground">
          Gerencie as configurações e personalizações do sistema CRM
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fields" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Campos
          </TabsTrigger>
          <TabsTrigger value="pipelines" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Pipelines
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <Tags className="h-4 w-4" />
            Tags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fields" className="space-y-4">
          <CRMFieldManager />
        </TabsContent>

        <TabsContent value="pipelines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Pipelines</CardTitle>
              <CardDescription>
                Configure pipelines e colunas do sistema CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Funcionalidade em desenvolvimento - será implementada em breve
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Usuários</CardTitle>
              <CardDescription>
                Gerencie permissões e configurações de usuários do CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Funcionalidade em desenvolvimento - será implementada em breve
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Tags</CardTitle>
              <CardDescription>
                Configure tags e etiquetas do sistema CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Funcionalidade em desenvolvimento - será implementada em breve
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
