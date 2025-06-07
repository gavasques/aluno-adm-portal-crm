
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Settings, Link, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const CalendlyConfig = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuração Calendly</h1>
        <p className="text-muted-foreground">
          Configure a integração com Calendly para agendamentos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-lg font-bold">Conectado</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Integração ativa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              Visitantes → Agendamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cancelamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Configurações da API
            </CardTitle>
            <CardDescription>
              Configure a conexão com Calendly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Digite sua API key do Calendly"
                value="••••••••••••••••••••••••••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://seu-dominio.com/webhooks/calendly"
                value="https://app.exemplo.com/webhooks/calendly"
              />
            </div>
            <Button>Salvar Configurações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Link className="h-5 w-5 mr-2" />
              Links de Agendamento
            </CardTitle>
            <CardDescription>
              Gerencie seus links do Calendly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="main-link">Link Principal</Label>
              <Input
                id="main-link"
                placeholder="https://calendly.com/seu-usuario"
                value="https://calendly.com/guilherme-vasques"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mentoring-link">Link Mentoria</Label>
              <Input
                id="mentoring-link"
                placeholder="https://calendly.com/seu-usuario/mentoria"
                value="https://calendly.com/guilherme-vasques/mentoria"
              />
            </div>
            <Button variant="outline">Testar Links</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Avançadas</CardTitle>
          <CardDescription>
            Opções adicionais de integração
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Sincronização Automática</Label>
              <p className="text-sm text-muted-foreground">
                Sincronizar agendamentos automaticamente
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Notificações Email</Label>
              <p className="text-sm text-muted-foreground">
                Enviar notificações por email
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Webhook Eventos</Label>
              <p className="text-sm text-muted-foreground">
                Receber webhooks do Calendly
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendlyConfig;
