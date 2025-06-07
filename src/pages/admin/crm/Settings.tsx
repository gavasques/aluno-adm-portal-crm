
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Webhook, Mail, Users, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CRMSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações CRM</h1>
        <p className="text-muted-foreground">
          Configure as opções do sistema de CRM
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Webhook className="h-5 w-5 mr-2" />
              Webhooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Configurados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Usuários CRM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Com acesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Integrações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Conectadas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
            <CardDescription>
              Configurações básicas do CRM
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Pipeline de Vendas</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Configure os estágios do pipeline
              </p>
              <Button variant="outline" size="sm">Gerenciar Estágios</Button>
            </div>
            <div>
              <h4 className="font-medium mb-2">Campos Personalizados</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Adicione campos específicos para seu negócio
              </p>
              <Button variant="outline" size="sm">Configurar Campos</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automações</CardTitle>
            <CardDescription>
              Configure fluxos automáticos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Email Marketing</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Configurar sequências automáticas
              </p>
              <Button variant="outline" size="sm">Configurar</Button>
            </div>
            <div>
              <h4 className="font-medium mb-2">Notificações</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Alertas e lembretes automáticos
              </p>
              <Button variant="outline" size="sm">Configurar</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Avançadas</CardTitle>
          <CardDescription>
            Funcionalidade será implementada em breve
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            As configurações do CRM incluirão:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Configuração de webhooks e integrações</li>
            <li>Templates de email personalizados</li>
            <li>Regras de automação</li>
            <li>Configuração de permissões</li>
            <li>Configuração de relatórios</li>
            <li>API keys e conectores externos</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMSettings;
