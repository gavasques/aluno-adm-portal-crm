
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, CreditCard, Download } from 'lucide-react';

const Settings = () => {
  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
      </div>

      <div className="grid gap-6">
        {/* Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil
            </CardTitle>
            <CardDescription>Informações básicas da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" placeholder="Seu nome" defaultValue="João Silva" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" defaultValue="joao@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" placeholder="(11) 99999-9999" defaultValue="(11) 99999-9999" />
            </div>
            <Button>Salvar Alterações</Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>Configure como você quer receber notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Notificações por email</Label>
                <p className="text-sm text-gray-600">Receber atualizações importantes por email</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="mentoring-reminders">Lembretes de mentoria</Label>
                <p className="text-sm text-gray-600">Notificações sobre sessões de mentoria</p>
              </div>
              <Switch id="mentoring-reminders" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="credit-alerts">Alertas de créditos</Label>
                <p className="text-sm text-gray-600">Avisar quando os créditos estão baixos</p>
              </div>
              <Switch id="credit-alerts" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>Configurações de segurança da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha atual</Label>
              <Input id="current-password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input id="new-password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <Input id="confirm-password" type="password" placeholder="••••••••" />
            </div>
            <Button>Alterar Senha</Button>
          </CardContent>
        </Card>

        {/* Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Seus Dados
            </CardTitle>
            <CardDescription>Baixe ou exclua seus dados pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Exportar dados</h4>
                <p className="text-sm text-gray-600">Baixe uma cópia de todos os seus dados</p>
              </div>
              <Button variant="outline">Baixar Dados</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-600">Excluir conta</h4>
                <p className="text-sm text-gray-600">Exclua permanentemente sua conta e dados</p>
              </div>
              <Button variant="destructive">Excluir Conta</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
