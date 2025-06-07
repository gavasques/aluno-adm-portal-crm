
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, GraduationCap, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <img 
            src="/lovable-uploads/a9512e96-66c6-47b8-a7c6-5f1820a6c1a3.png"
            alt="Logo" 
            className="h-16 mx-auto mb-8"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Plataforma Educacional
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistema completo de gestão educacional com funcionalidades para administradores e alunos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                Área Administrativa
              </CardTitle>
              <CardDescription>
                Dashboard completo para gestão da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Gerencie usuários, CRM, mentorias, cursos e muito mais através de um painel administrativo completo.
              </p>
              <Link to="/admin">
                <Button className="w-full">
                  Acessar Admin
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-green-600" />
                Portal do Aluno
              </CardTitle>
              <CardDescription>
                Interface simplificada para estudantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Acesse seus cursos, fornecedores, mentoria e utilize a IA Livi para apoio ao aprendizado.
              </p>
              <Link to="/aluno">
                <Button variant="outline" className="w-full">
                  Acessar Portal
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500">
            Desenvolvido com React, TypeScript e Supabase
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
