
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminPartners = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parceiros (Admin)</h1>
          <p className="text-muted-foreground">
            Gerencie todos os parceiros do sistema
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Parceiro
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Buscar Parceiros
          </CardTitle>
          <CardDescription>
            Encontre parceiros por nome, tipo ou status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Nome do parceiro..." className="flex-1" />
            <Input placeholder="Tipo..." className="w-48" />
            <Input placeholder="Status..." className="w-32" />
            <Button>Buscar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2" />
            Lista de Parceiros
          </CardTitle>
          <CardDescription>
            Todos os parceiros cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Carregando parceiros...
            </h3>
            <p className="text-gray-500">
              A lista de parceiros será exibida aqui
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPartners;
