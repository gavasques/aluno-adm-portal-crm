
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

const Index = () => {
  const { user } = useSimpleAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Portal LV - Educação Avançada
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Plataforma educacional completa com cursos, mentorias e recursos para crescimento profissional
          </p>
          
          {!user ? (
            <div className="space-x-4">
              <Link to="/login">
                <Button size="lg">Fazer Login</Button>
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/aluno">
                <Button size="lg">Área do Aluno</Button>
              </Link>
              <Link to="/admin">
                <Button size="lg" variant="outline">Área Administrativa</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Cursos e Mentorias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Acesso a cursos exclusivos e programas de mentoria personalizados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recursos Exclusivos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Ferramentas, fornecedores e parceiros para impulsionar seu negócio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>IA Assistente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Livi AI - Sua assistente inteligente para dúvidas e orientações
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
