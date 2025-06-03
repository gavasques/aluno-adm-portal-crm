
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { Zap, Plus } from 'lucide-react';

const AdminBonus = () => {
  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Cadastro de Bônus' }
  ];

  return (
    <div className="p-8 space-y-6">
      <BreadcrumbNav items={breadcrumbItems} showBackButton={true} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cadastro de Bônus</h1>
          <p className="text-gray-600 mt-1">Gerencie os bônus disponíveis no sistema</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Bônus
        </Button>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum bônus encontrado</h3>
          <p className="text-gray-600 mb-4">
            Comece adicionando o primeiro bônus ao sistema.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Bônus
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBonus;
