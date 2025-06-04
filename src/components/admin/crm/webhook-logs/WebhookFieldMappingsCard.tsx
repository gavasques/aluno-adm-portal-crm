
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMWebhookFieldMappings } from '@/hooks/crm/useCRMWebhookFieldMappings';
import { useCRMCustomFields } from '@/hooks/crm/useCRMCustomFields';
import { RefreshCw, Settings, Eye, EyeOff, Plus } from 'lucide-react';

export const WebhookFieldMappingsCard = () => {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const { pipelines } = useCRMPipelines();
  const { mappings, isLoading: mappingsLoading, syncStandardMappings } = useCRMWebhookFieldMappings(selectedPipelineId);
  const { customFields } = useCRMCustomFields();

  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId);

  const handleSyncMappings = () => {
    if (selectedPipelineId) {
      syncStandardMappings.mutate(selectedPipelineId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Mapeamentos de Campos do Webhook
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seletor de Pipeline */}
        <div className="flex items-center gap-4">
          <select
            value={selectedPipelineId}
            onChange={(e) => setSelectedPipelineId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">Selecione um pipeline</option>
            {pipelines.map((pipeline) => (
              <option key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </option>
            ))}
          </select>
          
          {selectedPipelineId && (
            <Button 
              onClick={handleSyncMappings}
              disabled={syncStandardMappings.isPending}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${syncStandardMappings.isPending ? 'animate-spin' : ''}`} />
              Sincronizar Padrões
            </Button>
          )}
        </div>

        {selectedPipelineId && (
          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Campos Ativos ({mappings.filter(m => m.is_active).length})</TabsTrigger>
              <TabsTrigger value="inactive">Campos Inativos ({mappings.filter(m => !m.is_active).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Pipeline: <strong>{selectedPipeline?.name}</strong>
              </div>
              
              {mappingsLoading ? (
                <div className="text-center py-4">Carregando mapeamentos...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campo do Webhook</TableHead>
                      <TableHead>Campo do CRM</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Obrigatório</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mappings
                      .filter(mapping => mapping.is_active)
                      .map((mapping) => (
                        <TableRow key={mapping.id}>
                          <TableCell className="font-mono text-sm">
                            {mapping.webhook_field_name}
                          </TableCell>
                          <TableCell>
                            {mapping.crm_field_name}
                            {mapping.custom_field && (
                              <div className="text-xs text-gray-500">
                                ({mapping.custom_field.field_name})
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {mapping.field_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={mapping.crm_field_type === 'custom' ? 'secondary' : 'default'}>
                              {mapping.crm_field_type === 'custom' ? 'Customizado' : 'Padrão'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {mapping.is_required ? (
                              <Badge variant="destructive">Obrigatório</Badge>
                            ) : (
                              <Badge variant="outline">Opcional</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600">Ativo</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
              
              {mappings.filter(m => m.is_active).length === 0 && !mappingsLoading && (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhum mapeamento ativo encontrado</p>
                  <p className="text-sm">Use o botão "Sincronizar Padrões" para criar mapeamentos automáticos</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="inactive" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campo do Webhook</TableHead>
                    <TableHead>Campo do CRM</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings
                    .filter(mapping => !mapping.is_active)
                    .map((mapping) => (
                      <TableRow key={mapping.id} className="opacity-60">
                        <TableCell className="font-mono text-sm">
                          {mapping.webhook_field_name}
                        </TableCell>
                        <TableCell>
                          {mapping.crm_field_name}
                          {mapping.custom_field && (
                            <div className="text-xs text-gray-500">
                              ({mapping.custom_field.field_name})
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {mapping.field_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={mapping.crm_field_type === 'custom' ? 'secondary' : 'default'}>
                            {mapping.crm_field_type === 'custom' ? 'Customizado' : 'Padrão'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <EyeOff className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-400">Inativo</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              
              {mappings.filter(m => !m.is_active).length === 0 && !mappingsLoading && (
                <div className="text-center py-8 text-gray-500">
                  <EyeOff className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhum mapeamento inativo encontrado</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {!selectedPipelineId && (
          <div className="text-center py-8 text-gray-500">
            <Settings className="h-12 w-12 mx-auto mb-4" />
            <p>Selecione um pipeline para visualizar os mapeamentos</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
