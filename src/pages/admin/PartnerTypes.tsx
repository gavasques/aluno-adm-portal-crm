
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PartnerTypes = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tipos de Parceiros</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias de parceiros
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Tipo
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Total de Tipos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Categorias ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mais Usado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Educacional</div>
            <p className="text-xs text-muted-foreground">
              45 parceiros
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Novos Este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Tipos adicionados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parceiros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Total cadastrados
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos</CardTitle>
          <CardDescription>
            Organize os parceiros por categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Buscar tipos..."
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
              <p>Sistema de tipos de parceiros será implementado em breve</p>
              <p className="text-sm">Esta funcionalidade está em desenvolvimento</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerTypes;
