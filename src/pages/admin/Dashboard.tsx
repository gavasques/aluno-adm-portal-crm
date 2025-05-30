
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-1">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,234</p>
            <p className="text-sm text-gray-600">+12% este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads CRM</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">89</p>
            <p className="text-sm text-gray-600">23 novos hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mentorias Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">45</p>
            <p className="text-sm text-gray-600">8 iniciando hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ 25.4k</p>
            <p className="text-sm text-gray-600">+8% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
