
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Eye, Layers } from 'lucide-react';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { FieldGroupManager } from './FieldGroupManager';
import { CustomFieldsList } from './CustomFieldsList';
import { CustomFieldFormDialog } from './CustomFieldFormDialog';
import { FieldGroupFormDialog } from './FieldGroupFormDialog';
import { CRMFieldPreview } from './CRMFieldPreview';

export const CRMFieldManager = () => {
  const [activeTab, setActiveTab] = useState('fields');
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);

  const { isLoading } = useCRMCustomFields();

  const handleCreateField = () => {
    setEditingField(null);
    setIsFieldDialogOpen(true);
  };

  const handleEditField = (field: any) => {
    setEditingField(field);
    setIsFieldDialogOpen(true);
  };

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setIsGroupDialogOpen(true);
  };

  const handleEditGroup = (group: any) => {
    setEditingGroup(group);
    setIsGroupDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Settings className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Campos do CRM</h2>
        <p className="text-muted-foreground">
          Configure campos customizáveis para os formulários de leads do CRM
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fields" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Campos
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Grupos
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fields" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Campos Customizáveis</CardTitle>
                  <CardDescription>
                    Gerencie os campos que aparecerão nos formulários de leads
                  </CardDescription>
                </div>
                <Button onClick={handleCreateField} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Campo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CustomFieldsList onEditField={handleEditField} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Grupos de Campos</CardTitle>
                  <CardDescription>
                    Organize campos em seções para melhor organização do formulário
                  </CardDescription>
                </div>
                <Button onClick={handleCreateGroup} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Grupo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <FieldGroupManager onEditGroup={handleEditGroup} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview do Formulário</CardTitle>
              <CardDescription>
                Visualize como os campos aparecerão no formulário de criação/edição de leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CRMFieldPreview />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CustomFieldFormDialog
        open={isFieldDialogOpen}
        onOpenChange={setIsFieldDialogOpen}
        field={editingField}
      />

      <FieldGroupFormDialog
        open={isGroupDialogOpen}
        onOpenChange={setIsGroupDialogOpen}
        group={editingGroup}
      />
    </div>
  );
};
