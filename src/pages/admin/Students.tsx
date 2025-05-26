
import React from 'react';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Construction } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

const StudentsContent: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Gestão de Alunos' }
  ];

  return (
    <div className="w-full space-y-6">
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin"
        className="mb-6"
      />

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Alunos</h1>
          <p className="text-gray-600">Gerencie os alunos do sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-orange-500" />
            Em Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Construction className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Área de Gestão de Alunos
            </h3>
            <p className="text-gray-500 mb-4">
              Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
            </p>
            <p className="text-sm text-gray-400">
              Aqui você poderá gerenciar alunos, matrículas, histórico acadêmico e muito mais.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Students: React.FC = () => {
  return (
    <ErrorBoundary>
      <StudentsContent />
    </ErrorBoundary>
  );
};

export default Students;
