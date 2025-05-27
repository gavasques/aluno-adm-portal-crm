
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, DollarSign, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminCRM = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM / Gestão de Leads</h1>
          <p className="text-muted-foreground">
            Gerencie leads e oportunidades de venda
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              No pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Conversões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23%</div>
            <p className="text-xs text-muted-foreground">
              Taxa este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.2k</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Novos Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline de Vendas</CardTitle>
          <CardDescription>
            Visualização em Kanban do pipeline de vendas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-center p-2 bg-gray-100 rounded">Lead In</h3>
              <div className="space-y-2">
                <div className="p-3 bg-white border rounded-lg shadow-sm">
                  <p className="font-medium text-sm">João Silva</p>
                  <p className="text-xs text-gray-500">Curso E-commerce</p>
                  <p className="text-xs text-green-600">R$ 1.200</p>
                </div>
                <div className="p-3 bg-white border rounded-lg shadow-sm">
                  <p className="font-medium text-sm">Maria Santos</p>
                  <p className="text-xs text-gray-500">Mentoria</p>
                  <p className="text-xs text-green-600">R$ 800</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-center p-2 bg-blue-100 rounded">Call Apresentação</h3>
              <div className="space-y-2">
                <div className="p-3 bg-white border rounded-lg shadow-sm">
                  <p className="font-medium text-sm">Carlos Oliveira</p>
                  <p className="text-xs text-gray-500">Consultoria</p>
                  <p className="text-xs text-green-600">R$ 2.500</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-center p-2 bg-yellow-100 rounded">Reunião</h3>
              <div className="space-y-2">
                <div className="p-3 bg-white border rounded-lg shadow-sm">
                  <p className="font-medium text-sm">Ana Costa</p>
                  <p className="text-xs text-gray-500">Curso Completo</p>
                  <p className="text-xs text-green-600">R$ 3.200</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-center p-2 bg-orange-100 rounded">Acompanhamento</h3>
              <div className="space-y-2">
                <div className="p-3 bg-white border rounded-lg shadow-sm">
                  <p className="font-medium text-sm">Pedro Lima</p>
                  <p className="text-xs text-gray-500">Mentoria VIP</p>
                  <p className="text-xs text-green-600">R$ 1.800</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-center p-2 bg-green-100 rounded">Fechado</h3>
              <div className="space-y-2">
                <div className="p-3 bg-white border rounded-lg shadow-sm">
                  <p className="font-medium text-sm">Lucia Ferreira</p>
                  <p className="text-xs text-gray-500">Curso Básico</p>
                  <p className="text-xs text-green-600">R$ 600</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCRM;
