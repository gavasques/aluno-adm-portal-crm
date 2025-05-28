
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings, 
  CreditCard, 
  AlertTriangle, 
  Save,
  Zap,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

const CreditsSettings = () => {
  const [settings, setSettings] = useState({
    defaultMonthlyLimit: 50,
    defaultCreditsForNewUsers: 50,
    enableAutomaticRenewal: true,
    enableLowCreditAlerts: true,
    lowCreditThreshold: 10,
    enablePurchases: true,
    enableSubscriptions: true,
    creditPrice: 0.10, // R$ por crédito
    stripeEnabled: false,
    stripePublishableKey: "",
    stripeWebhookSecret: ""
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Aqui seria onde salvamos as configurações no banco
      // Por enquanto apenas simulamos
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const packageOptions = [
    { credits: 10, price: 1.00, popular: false },
    { credits: 20, price: 1.80, popular: false },
    { credits: 50, price: 4.00, popular: true },
    { credits: 100, price: 7.50, popular: false },
    { credits: 200, price: 14.00, popular: false },
    { credits: 500, price: 30.00, popular: false }
  ];

  const subscriptionOptions = [
    { credits: 50, price: 4.90, popular: false },
    { credits: 100, price: 8.90, popular: true },
    { credits: 200, price: 15.90, popular: false }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações Gerais de Créditos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="defaultLimit">Limite Mensal Padrão</Label>
              <Input
                id="defaultLimit"
                type="number"
                value={settings.defaultMonthlyLimit}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  defaultMonthlyLimit: parseInt(e.target.value)
                }))}
              />
              <p className="text-sm text-gray-500">
                Limite de créditos mensais para novos usuários
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultCredits">Créditos Iniciais</Label>
              <Input
                id="defaultCredits"
                type="number"
                value={settings.defaultCreditsForNewUsers}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  defaultCreditsForNewUsers: parseInt(e.target.value)
                }))}
              />
              <p className="text-sm text-gray-500">
                Créditos gratuitos para novos usuários
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lowThreshold">Limite de Alerta</Label>
              <Input
                id="lowThreshold"
                type="number"
                value={settings.lowCreditThreshold}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  lowCreditThreshold: parseInt(e.target.value)
                }))}
              />
              <p className="text-sm text-gray-500">
                Alertar quando créditos ficarem abaixo deste valor
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditPrice">Preço por Crédito (R$)</Label>
              <Input
                id="creditPrice"
                type="number"
                step="0.01"
                value={settings.creditPrice}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  creditPrice: parseFloat(e.target.value)
                }))}
              />
              <p className="text-sm text-gray-500">
                Valor unitário de cada crédito
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Funcionalidades</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Renovação Automática</Label>
                <p className="text-sm text-gray-500">
                  Renovar créditos automaticamente todo mês
                </p>
              </div>
              <Switch
                checked={settings.enableAutomaticRenewal}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  enableAutomaticRenewal: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Créditos Baixos</Label>
                <p className="text-sm text-gray-500">
                  Notificar usuários quando créditos estiverem baixos
                </p>
              </div>
              <Switch
                checked={settings.enableLowCreditAlerts}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  enableLowCreditAlerts: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compras Avulsas</Label>
                <p className="text-sm text-gray-500">
                  Permitir compra de pacotes de créditos
                </p>
              </div>
              <Switch
                checked={settings.enablePurchases}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  enablePurchases: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Assinaturas Recorrentes</Label>
                <p className="text-sm text-gray-500">
                  Permitir assinaturas mensais de créditos
                </p>
              </div>
              <Switch
                checked={settings.enableSubscriptions}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  enableSubscriptions: checked
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Pacotes de Créditos Avulsos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {packageOptions.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'border-blue-500' : ''}`}>
                {pkg.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Popular
                  </Badge>
                )}
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{pkg.credits}</div>
                  <div className="text-sm text-gray-500">créditos</div>
                  <div className="text-lg font-semibold text-green-600 mt-2">
                    R$ {pkg.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    R$ {(pkg.price / pkg.credits).toFixed(3)}/crédito
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Planos de Assinatura Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionOptions.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-blue-500' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Recomendado
                  </Badge>
                )}
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold">+{plan.credits}</div>
                  <div className="text-sm text-gray-500">créditos extras/mês</div>
                  <div className="text-xl font-semibold text-green-600 mt-4">
                    R$ {plan.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">/mês</div>
                  <div className="text-xs text-gray-500 mt-2">
                    R$ {(plan.price / plan.credits).toFixed(3)}/crédito
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Integração Stripe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Configure as chaves do Stripe para habilitar pagamentos reais. 
              Atualmente o sistema funciona em modo demonstração.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Habilitar Stripe</Label>
              <p className="text-sm text-gray-500">
                Ativar integração com Stripe para pagamentos
              </p>
            </div>
            <Switch
              checked={settings.stripeEnabled}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                stripeEnabled: checked
              }))}
            />
          </div>

          {settings.stripeEnabled && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripeKey">Chave Pública do Stripe</Label>
                <Input
                  id="stripeKey"
                  type="text"
                  placeholder="pk_..."
                  value={settings.stripePublishableKey}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    stripePublishableKey: e.target.value
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookSecret">Webhook Secret</Label>
                <Input
                  id="webhookSecret"
                  type="password"
                  placeholder="whsec_..."
                  value={settings.stripeWebhookSecret}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    stripeWebhookSecret: e.target.value
                  }))}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
};

export default CreditsSettings;
