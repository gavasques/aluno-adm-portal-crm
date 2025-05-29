
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { UserCog, Plus } from 'lucide-react';

const AdminStudents = () => {
  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Gestão de Alunos' }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <BreadcrumbNav items={breadcrumbItems} showBackButton={true} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Alunos</h1>
          <p className="text-gray-600 mt-1">Gerencie os alunos cadastrados no sistema</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Aluno
        </Button>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <UserCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum aluno encontrado</h3>
          <p className="text-gray-600 mb-4">
            Comece adicionando o primeiro aluno ao sistema.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Aluno
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStudents;
