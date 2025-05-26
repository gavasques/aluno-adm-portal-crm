
import React from 'react';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Construction } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

const RegistersContent: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Cadastros' }
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
        <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white">
          <Database className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastros</h1>
          <p className="text-gray-600">Gerencie os cadastros do sistema</p>
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
              Área de Cadastros
            </h3>
            <p className="text-gray-500 mb-4">
              Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
            </p>
            <p className="text-sm text-gray-400">
              Aqui você poderá gerenciar cursos, mentorias, bônus e outros cadastros do sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Registers: React.FC = () => {
  return (
    <ErrorBoundary>
      <RegistersContent />
    </ErrorBoundary>
  );
};

export default Registers;
