
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const StudentPartners = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parceiros</h1>
        <p className="text-muted-foreground">
          Conheça nossos parceiros estratégicos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Buscar Parceiros
          </CardTitle>
          <CardDescription>
            Encontre parceiros por nome ou área de atuação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Digite o nome do parceiro..." className="flex-1" />
            <Input placeholder="Área de atuação..." className="w-48" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2" />
            Lista de Parceiros
          </CardTitle>
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

export default StudentPartners;
