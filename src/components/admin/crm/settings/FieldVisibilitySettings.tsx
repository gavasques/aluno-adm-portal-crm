
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCRMFieldVisibility } from '@/hooks/crm/useCRMFieldVisibility';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const FieldVisibilitySettings: React.FC = () => {
  const { config, loading, updateFieldVisibility } = useCRMFieldVisibility();

  const handleToggle = async (field: keyof typeof config, value: boolean) => {
    const success = await updateFieldVisibility(field, value);
    if (success) {
      toast.success(`Seção ${getFieldLabel(field)} ${value ? 'ativada' : 'desativada'} com sucesso`);
    } else {
      toast.error('Erro ao atualizar configuração');
    }
  };

  const getFieldLabel = (field: string) => {
    const labels = {
      amazon_section: 'Amazon',
      business_section: 'Empresa',
      qualification_section: 'Qualificação',
      notes_section: 'Observações'
    };
    return labels[field as keyof typeof labels] || field;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Carregando configurações...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visibilidade dos Campos</CardTitle>
        <CardDescription>
          Configure quais seções devem aparecer nos formulários e detalhes dos leads.
          Estas configurações são baseadas nos grupos de campos customizados.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="amazon-section">Seção Amazon</Label>
            <p className="text-sm text-muted-foreground">
              Campos relacionados à Amazon (FBA, loja, etc.)
            </p>
          </div>
          <Switch
            id="amazon-section"
            checked={config.amazon_section}
            onCheckedChange={(checked) => handleToggle('amazon_section', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="business-section">Seção Empresa</Label>
            <p className="text-sm text-muted-foreground">
              Informações sobre a empresa do lead
            </p>
          </div>
          <Switch
            id="business-section"
            checked={config.business_section}
            onCheckedChange={(checked) => handleToggle('business_section', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="qualification-section">Seção Qualificação</Label>
            <p className="text-sm text-muted-foreground">
              Campos de qualificação do lead
            </p>
          </div>
          <Switch
            id="qualification-section"
            checked={config.qualification_section}
            onCheckedChange={(checked) => handleToggle('qualification_section', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notes-section">Seção Observações</Label>
            <p className="text-sm text-muted-foreground">
              Notas e observações sobre o lead
            </p>
          </div>
          <Switch
            id="notes-section"
            checked={config.notes_section}
            onCheckedChange={(checked) => handleToggle('notes_section', checked)}
          />
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Dica:</strong> Você também pode gerenciar a visibilidade dos campos através da 
            seção "Grupos de Campos" nas configurações do CRM.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
