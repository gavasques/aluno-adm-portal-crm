
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { useCreditSettings, SystemCreditSettings as SystemCreditSettingsType } from '@/hooks/credits/useCreditSettings';

const defaultSettings: SystemCreditSettingsType = {
  monthly_free_credits: 50,
  credit_base_price: 1.00,
  enable_purchases: true,
  enable_subscriptions: true,
  low_credit_threshold: 10
};

export const SystemCreditSettings: React.FC = () => {
  const { creditSettings, updateSystemSetting } = useCreditSettings();
  const [settings, setSettings] = useState<SystemCreditSettingsType>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  React.useEffect(() => {
    if (creditSettings?.systemSettings) {
      setSettings(creditSettings.systemSettings);
    }
  }, [creditSettings?.systemSettings]);

  const handleSettingChange = (key: keyof SystemCreditSettingsType, value: any, type: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!creditSettings?.systemSettings) return;

    for (const [key, value] of Object.entries(settings)) {
      const originalValue = creditSettings.systemSettings[key as keyof SystemCreditSettingsType];
      
      if (value !== originalValue) {
        const type = typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string';
        await updateSystemSetting.mutateAsync({
          key,
          value: value.toString(),
          type
        });
      }
    }
    
    setHasChanges(false);
  };

  if (!creditSettings) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Configurações do Sistema</CardTitle>
          {hasChanges && (
            <Button onClick={handleSave} disabled={updateSystemSetting.isPending}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="monthly_free_credits">Créditos Gratuitos Mensais</Label>
            <Input
              id="monthly_free_credits"
              type="number"
              value={settings.monthly_free_credits}
              onChange={(e) => handleSettingChange('monthly_free_credits', parseInt(e.target.value), 'number')}
            />
            <p className="text-sm text-gray-600">
              Quantidade de créditos que cada usuário recebe gratuitamente por mês
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credit_base_price">Preço Base por Crédito (R$)</Label>
            <Input
              id="credit_base_price"
              type="number"
              step="0.01"
              value={settings.credit_base_price}
              onChange={(e) => handleSettingChange('credit_base_price', parseFloat(e.target.value), 'number')}
            />
            <p className="text-sm text-gray-600">
              Preço base de referência por crédito em reais
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="low_credit_threshold">Limite de Alerta de Créditos Baixos</Label>
            <Input
              id="low_credit_threshold"
              type="number"
              value={settings.low_credit_threshold}
              onChange={(e) => handleSettingChange('low_credit_threshold', parseInt(e.target.value), 'number')}
            />
            <p className="text-sm text-gray-600">
              Quantidade de créditos para exibir alerta de créditos baixos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div>
              <Label>Habilitar Compras Avulsas</Label>
              <p className="text-sm text-gray-600">
                Permite que usuários comprem créditos avulsos
              </p>
            </div>
            <Switch
              checked={settings.enable_purchases}
              onCheckedChange={(checked) => handleSettingChange('enable_purchases', checked, 'boolean')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Habilitar Assinaturas</Label>
              <p className="text-sm text-gray-600">
                Permite que usuários assinem planos mensais
              </p>
            </div>
            <Switch
              checked={settings.enable_subscriptions}
              onCheckedChange={(checked) => handleSettingChange('enable_subscriptions', checked, 'boolean')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
