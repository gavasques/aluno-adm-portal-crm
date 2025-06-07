
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react';

const StudentMySuppliers = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerencie seus fornecedores pessoais
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
            <Package className="h-5 w-5 mr-2" />
            Seus Fornecedores
          </CardTitle>
          <CardDescription>
            Lista dos fornecedores que você cadastrou
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum fornecedor cadastrado
            </h3>
            <p className="text-gray-500 mb-4">
              Comece adicionando seu primeiro fornecedor
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Fornecedor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentMySuppliers;
