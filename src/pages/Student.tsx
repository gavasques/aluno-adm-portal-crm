
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Student = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Área do Aluno</h1>
        <p className="text-gray-600">Portal do estudante</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Meus Créditos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Gerenciar seus créditos</p>
            <Link to="/aluno/creditos">
              <Button>Acessar</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cursos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Seus cursos e materiais</p>
            <Button>Acessar</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mentoria</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Suas sessões de mentoria</p>
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

export default Student;
