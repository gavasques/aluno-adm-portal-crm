
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Área Administrativa</h1>
        <p className="text-gray-600">Painel de controle do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Gerenciar usuários do sistema</p>
            <Button>Acessar</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Créditos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Configurações de créditos</p>
            <Button>Acessar</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Relatórios e estatísticas</p>
            <Button>Acessar</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Link to="/">
          <Button variant="outline">Voltar ao Início</Button>
        </Link>
      </div>
    </div>
  );
};

export default Admin;
