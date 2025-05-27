
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, User, Shield, Database } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações gerais do sistema
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Configurações de Usuário
            </CardTitle>
            <CardDescription>
              Configurações relacionadas aos usuários do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Registro automático</span>
                <span className="text-sm text-green-600">Ativo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Validação de email</span>
                <span className="text-sm text-green-600">Ativo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Limite de armazenamento padrão</span>
                <span className="text-sm">100 MB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configurações de segurança e auditoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Log de auditoria</span>
                <span className="text-sm text-green-600">Ativo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Autenticação 2FA</span>
                <span className="text-sm text-yellow-600">Opcional</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sessão máxima</span>
                <span className="text-sm">24 horas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Sistema
            </CardTitle>
            <CardDescription>
              Informações e configurações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Versão</span>
                <span className="text-sm">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Banco de dados</span>
                <span className="text-sm text-green-600">Conectado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup automático</span>
                <span className="text-sm text-green-600">Diário</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Manutenção
            </CardTitle>
            <CardDescription>
              Ferramentas de manutenção do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Limpeza de cache</span>
                <span className="text-sm text-blue-600">Executar</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Otimizar banco</span>
                <span className="text-sm text-blue-600">Executar</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Último backup</span>
                <span className="text-sm">Hoje, 03:00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
