
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const StudentSuppliers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
        <p className="text-muted-foreground">
          Explore a base de fornecedores disponíveis
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Buscar Fornecedores
          </CardTitle>
          <CardDescription>
            Encontre fornecedores por nome, categoria ou localização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Digite o nome do fornecedor..." className="flex-1" />
            <Input placeholder="Categoria..." className="w-48" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Lista de Fornecedores
          </CardTitle>
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

export default StudentSuppliers;
