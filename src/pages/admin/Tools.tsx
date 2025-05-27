
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminTools = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ferramentas (Admin)</h1>
          <p className="text-muted-foreground">
            Gerencie todas as ferramentas do sistema
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Ferramenta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Buscar Ferramentas
          </CardTitle>
          <CardDescription>
            Encontre ferramentas por nome, categoria ou status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Nome da ferramenta..." className="flex-1" />
            <Input placeholder="Categoria..." className="w-48" />
            <Input placeholder="Status..." className="w-32" />
            <Button>Buscar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="h-5 w-5 mr-2" />
            Lista de Ferramentas
          </CardTitle>
          <CardDescription>
            Todas as ferramentas cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Carregando ferramentas...
            </h3>
            <p className="text-gray-500">
              A lista de ferramentas será exibida aqui
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTools;
