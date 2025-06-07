
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GroupRegistrations = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inscrições em Grupo</h1>
          <p className="text-muted-foreground">
            Gerencie inscrições em grupo nas mentorias
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Inscrição de Grupo
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Grupos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Grupos em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              Total de alunos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Média por Grupo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.4</div>
            <p className="text-xs text-muted-foreground">
              Alunos por grupo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa Conclusão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              Grupos concluídos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Grupos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os grupos de mentoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Buscar grupos..."
                className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
          
          <div className="border rounded-lg">
            <div className="p-4 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Sistema de inscrições em grupo será implementado em breve</p>
              <p className="text-sm">Esta funcionalidade está em desenvolvimento</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupRegistrations;
