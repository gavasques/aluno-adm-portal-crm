
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminTasks = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lista de Tarefas</h1>
          <p className="text-muted-foreground">
            Gerencie suas tarefas, mentorias e reuniões agendadas
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Tarefas agendadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Para fazer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Concluídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Atrasadas
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
          <CardTitle>Agenda da Semana</CardTitle>
          <CardDescription>
            Suas mentorias, reuniões e tarefas importantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Mentoria - João Silva</p>
                <p className="text-sm text-muted-foreground">Hoje, 14:00 - E-commerce Avançado</p>
              </div>
              <Badge variant="secondary">Mentoria</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Reunião de Planejamento</p>
                <p className="text-sm text-muted-foreground">Amanhã, 10:00 - Estratégia Q1</p>
              </div>
              <Badge variant="secondary">Reunião</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Review de Conteúdo</p>
                <p className="text-sm text-muted-foreground">Quinta, 16:00 - Novos materiais</p>
              </div>
              <Badge variant="secondary">Tarefa</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Badge component temporário
const Badge = ({ children, variant }: { children: React.ReactNode; variant: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    variant === 'secondary' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
  }`}>
    {children}
  </span>
);

export default AdminTasks;
