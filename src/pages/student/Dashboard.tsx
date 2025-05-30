
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StudentDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard do Aluno</h1>
        <p className="text-gray-600 mt-1">Bem-vindo ao seu painel de controle</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Meus Créditos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">50</p>
            <p className="text-sm text-gray-600">Créditos disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mentorias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm text-gray-600">Programas ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fornecedores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-gray-600">Na sua lista</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ferramentas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-gray-600">Disponíveis</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
