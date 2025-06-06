
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StudentMySuppliers = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Fornecedores</h1>
        <p className="text-gray-600">Gerencie sua lista pessoal de fornecedores</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus Fornecedores Salvos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentMySuppliers;
