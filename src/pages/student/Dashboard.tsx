
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, GraduationCap, BarChart, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard do Aluno</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu portal de aprendizado
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Meus Fornecedores
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Fornecedores cadastrados
            </p>
            <Link 
              to="/aluno/meus-fornecedores" 
              className="text-sm text-blue-600 hover:underline mt-2 block"
            >
              Ver todos →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mentorias Ativas
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Em andamento
            </p>
            <Link 
              to="/aluno/mentorias" 
              className="text-sm text-blue-600 hover:underline mt-2 block"
            >
              Acessar →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recursos Gerais
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground">
              Fornecedores disponíveis
            </p>
            <Link 
              to="/aluno/fornecedores" 
              className="text-sm text-blue-600 hover:underline mt-2 block"
            >
              Explorar →
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
            <CardDescription>
              Links para as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link 
              to="/aluno/fornecedores" 
              className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 text-blue-600" />
              <span>Fornecedores</span>
            </Link>
            <Link 
              to="/aluno/parceiros" 
              className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart className="h-5 w-5 text-green-600" />
              <span>Parceiros</span>
            </Link>
            <Link 
              to="/aluno/ferramentas" 
              className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Wrench className="h-5 w-5 text-purple-600" />
              <span>Ferramentas</span>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Suas últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Novo fornecedor adicionado</p>
                  <p className="text-xs text-muted-foreground">2 horas atrás</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Mentoria agendada</p>
                  <p className="text-xs text-muted-foreground">1 dia atrás</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Avaliação enviada</p>
                  <p className="text-xs text-muted-foreground">3 dias atrás</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
