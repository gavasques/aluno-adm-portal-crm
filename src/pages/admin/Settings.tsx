
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bot, Save, Settings, Database } from 'lucide-react';
import { toast } from 'sonner';
import { CRMFieldManager } from '@/components/admin/crm/custom-fields/CRMFieldManager';

const AdminSettings = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Carregar URL atual do localStorage
  useEffect(() => {
    const savedUrl = localStorage.getItem('admin_webhook_config');
    setWebhookUrl(savedUrl || 'https://n8n.guilhermevasques.club/webhook/mensagem');
  }, []);

  // Validar URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Salvar configurações
  const handleSave = async () => {
    if (!webhookUrl.trim()) {
      toast.error('URL do webhook é obrigatória');
      return;
    }

    if (!isValidUrl(webhookUrl)) {
      toast.error('Por favor, insira uma URL válida');
      return;
    }

    setIsSaving(true);
    try {
      localStorage.setItem('admin_webhook_config', webhookUrl);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  // Resetar para padrão
  const handleReset = () => {
    const defaultUrl = 'https://n8n.guilhermevasques.club/webhook/mensagem';
    setWebhookUrl(defaultUrl);
    localStorage.setItem('admin_webhook_config', defaultUrl);
    toast.success('URL resetada para o valor padrão');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações gerais do sistema
        </p>
      </div>

      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Inteligência Artificial
          </TabsTrigger>
          <TabsTrigger value="crm-fields" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Campos do CRM
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Configurações de Inteligência Artificial
              </CardTitle>
              <CardDescription>
                Configure a URL do webhook para integração com o Livi AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">URL do Webhook</Label>
                <Input
                  id="webhookUrl"
                  type="url"
                  placeholder="https://n8n.guilhermevasques.club/webhook/mensagem"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">
                  URL do webhook N8N onde as mensagens do Livi AI serão enviadas
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving || !webhookUrl.trim()}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Resetar Padrão
                </Button>
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Bot className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Configuração Atual
                    </p>
                    <p className="text-blue-700 dark:text-blue-300 break-all">
                      {webhookUrl || 'Nenhuma URL configurada'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crm-fields" className="space-y-6">
          <CRMFieldManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
