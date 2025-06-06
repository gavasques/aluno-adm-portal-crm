
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CreditCard, BookOpen, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
        <p className="text-gray-600">Visão geral do sistema e métricas principais</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+10% desde o mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Vendidos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground">+15% desde o mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 novos este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 23,450</div>
            <p className="text-xs text-muted-foreground">+8% desde o mês passado</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestão de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Gerenciar usuários, permissões e acessos</p>
            <Button>Acessar Usuários</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sistema de Créditos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Configurar pacotes e preços de créditos</p>
            <Button>Configurar Créditos</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Visualizar relatórios e análises</p>
            <Button>Ver Relatórios</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
