
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações do Sistema</h1>
        <p className="text-gray-600">Configure parâmetros e preferências do sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
