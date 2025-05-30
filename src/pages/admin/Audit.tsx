
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck, Eye, Activity, AlertTriangle } from 'lucide-react';

const AdminAudit = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Auditoria</h1>
        <p className="text-muted-foreground">
          Monitore atividades e logs do sistema
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardCheck className="h-5 w-5 mr-2" />
              Eventos Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              Registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Acessos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">
              Únicos hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Ações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">789</div>
            <p className="text-xs text-muted-foreground">
              Executadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Requer atenção
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sistema de Auditoria</CardTitle>
          <CardDescription>
            Funcionalidade será implementada em breve
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            O sistema de auditoria completo incluirá:
          </p>
          <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Logs detalhados de todas as ações</li>
            <li>Relatórios de atividade por usuário</li>
            <li>Monitoramento de segurança</li>
            <li>Alertas automáticos para atividades suspeitas</li>
            <li>Exportação de relatórios de auditoria</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAudit;
