
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { Shield, Plus } from 'lucide-react';

const AdminMentoringCatalogManagement = () => {
  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Cadastro de Mentorias' }
  ];

  return (
    <div className="h-full w-full">
      <BreadcrumbNav items={breadcrumbItems} showBackButton={true} />
      
      <div className="flex items-center justify-between mt-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cadastro de Mentorias</h1>
          <p className="text-gray-600 mt-1">Gerencie o catálogo de mentorias disponíveis</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Mentoria
        </Button>
      </div>

      <Card className="mt-6">
        <CardContent className="p-8 text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma mentoria cadastrada</h3>
          <p className="text-gray-600 mb-4">
            Comece criando sua primeira mentoria no catálogo.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeira Mentoria
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMentoringCatalogManagement;
