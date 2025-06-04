import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, FileText, AlertCircle, Trash2, Edit } from 'lucide-react';
import { useCRMWebhookFieldMappings } from '@/hooks/crm/useCRMWebhookFieldMappings';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CRMWebhookFieldMapping } from '@/types/crm-webhook.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TypeformFieldMappingDialog from './TypeformFieldMappingDialog';

interface WebhookFieldMappingsCardProps {
  pipelineId: string;
}

export const WebhookFieldMappingsCard: React.FC<WebhookFieldMappingsCardProps> = ({ pipelineId }) => {
  const { mappings, isLoading, createMapping, updateMapping, deleteMapping, syncStandardMappings } = useCRMWebhookFieldMappings(pipelineId);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showTypeformDialog, setShowTypeformDialog] = useState(false);
  const [editingMapping, setEditingMapping] = useState<CRMWebhookFieldMapping | null>(null);
  const [newMapping, setNewMapping] = useState({
    webhook_field_name: '',
    crm_field_name: '',
    crm_field_type: 'standard' as const,
    field_type: 'text' as const,
    is_required: false,
    transformation_rules: {}
  });

  const handleAddMapping = async () => {
    if (!newMapping.webhook_field_name || !newMapping.crm_field_name) return;
    
    await createMapping.mutateAsync({
      pipeline_id: pipelineId,
      ...newMapping
    });
    
    setNewMapping({
      webhook_field_name: '',
      crm_field_name: '',
      crm_field_type: 'standard',
      field_type: 'text',
      is_required: false,
      transformation_rules: {}
    });
    setShowAddDialog(false);
  };

  const handleUpdateMapping = async () => {
    if (!editingMapping) return;
    
    await updateMapping.mutateAsync({
      id: editingMapping.id,
      input: {
        webhook_field_name: editingMapping.webhook_field_name,
        crm_field_name: editingMapping.crm_field_name,
        crm_field_type: editingMapping.crm_field_type,
        field_type: editingMapping.field_type,
        is_required: editingMapping.is_required,
        transformation_rules: editingMapping.transformation_rules
      }
    });
    
    setEditingMapping(null);
  };

  const handleDeleteMapping = async (id: string) => {
    await deleteMapping.mutateAsync(id);
  };

  const handleSyncStandardMappings = async () => {
    await syncStandardMappings.mutateAsync(pipelineId);
  };

  const handleTypeformImport = (importedMappings: any[]) => {
    // Process imported mappings from Typeform
    importedMappings.forEach(async (mapping) => {
      await createMapping.mutateAsync({
        pipeline_id: pipelineId,
        ...mapping
      });
    });
    setShowTypeformDialog(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Mapeamento de Campos
            </CardTitle>
            <CardDescription>
              Configure como os campos do webhook serão mapeados para o CRM
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTypeformDialog(true)}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Typeform
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncStandardMappings}
              disabled={syncStandardMappings.isPending}
            >
              Sincronizar Campo Obrigatório
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Mapeamento
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-sm text-gray-600">Carregando mapeamentos...</div>
          </div>
        ) : mappings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-8 w-8 text-gray-400 mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">Nenhum mapeamento configurado</h3>
            <p className="text-sm text-gray-600 mb-4">
              Configure o mapeamento de campos para que os webhooks funcionem corretamente
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTypeformDialog(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Importar Typeform
              </Button>
              <Button
                size="sm"
                onClick={handleSyncStandardMappings}
                disabled={syncStandardMappings.isPending}
              >
                Sincronizar Campo Obrigatório
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campo Webhook</TableHead>
                  <TableHead>Campo CRM</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Obrigatório</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-mono text-sm">
                      {mapping.webhook_field_name}
                    </TableCell>
                    <TableCell>{mapping.crm_field_name}</TableCell>
                    <TableCell>
                      <Badge variant={mapping.crm_field_type === 'standard' ? 'default' : 'secondary'}>
                        {mapping.crm_field_type === 'standard' ? 'Padrão' : 'Personalizado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={mapping.is_required ? 'destructive' : 'secondary'}>
                        {mapping.is_required ? 'Sim' : 'Não'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingMapping(mapping)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMapping(mapping.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Add Mapping Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Mapeamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Campo no Webhook</label>
              <Input
                value={newMapping.webhook_field_name}
                onChange={(e) => setNewMapping(prev => ({ ...prev, webhook_field_name: e.target.value }))}
                placeholder="Ex: nome, email, telefone"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Campo no CRM</label>
              <Input
                value={newMapping.crm_field_name}
                onChange={(e) => setNewMapping(prev => ({ ...prev, crm_field_name: e.target.value }))}
                placeholder="Ex: name, email, phone"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo do Campo</label>
              <Select
                value={newMapping.field_type}
                onValueChange={(value: any) => setNewMapping(prev => ({ ...prev, field_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newMapping.is_required}
                onChange={(e) => setNewMapping(prev => ({ ...prev, is_required: e.target.checked }))}
              />
              <label className="text-sm">Campo obrigatório</label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddMapping}>
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Mapping Dialog */}
      <Dialog open={!!editingMapping} onOpenChange={(open) => !open && setEditingMapping(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Mapeamento</DialogTitle>
          </DialogHeader>
          {editingMapping && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Campo no Webhook</label>
                <Input
                  value={editingMapping.webhook_field_name}
                  onChange={(e) => setEditingMapping(prev => prev ? ({ ...prev, webhook_field_name: e.target.value }) : null)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Campo no CRM</label>
                <Input
                  value={editingMapping.crm_field_name}
                  onChange={(e) => setEditingMapping(prev => prev ? ({ ...prev, crm_field_name: e.target.value }) : null)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tipo do Campo</label>
                <Select
                  value={editingMapping.field_type}
                  onValueChange={(value: any) => setEditingMapping(prev => prev ? ({ ...prev, field_type: value }) : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Telefone</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingMapping.is_required}
                  onChange={(e) => setEditingMapping(prev => prev ? ({ ...prev, is_required: e.target.checked }) : null)}
                />
                <label className="text-sm">Campo obrigatório</label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingMapping(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateMapping}>
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Typeform Import Dialog */}
      <TypeformFieldMappingDialog
        open={showTypeformDialog}
        onOpenChange={setShowTypeformDialog}
        onImport={handleTypeformImport}
      />
    </Card>
  );
};
