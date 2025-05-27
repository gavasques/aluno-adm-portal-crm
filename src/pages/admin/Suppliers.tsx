
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminSuppliers = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fornecedores (Admin)</h1>
          <p className="text-muted-foreground">
            Gerencie todos os fornecedores do sistema
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Fornecedor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Buscar Fornecedores
          </CardTitle>
          <CardDescription>
            Encontre fornecedores por nome, categoria ou status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Nome do fornecedor..." className="flex-1" />
            <Input placeholder="Categoria..." className="w-48" />
            <Input placeholder="Status..." className="w-32" />
            <Button>Buscar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Lista de Fornecedores
          </CardTitle>
          <CardDescription>
            Todos os fornecedores cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Carregando fornecedores...
            </h3>
            <p className="text-gray-500">
              A lista de fornecedores será exibida aqui
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSuppliers;
