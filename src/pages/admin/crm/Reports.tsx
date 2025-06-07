
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CRMReports = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios CRM</h1>
          <p className="text-muted-foreground">
            Analytics e relatórios de performance de vendas
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exportar Dados
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Vendas Mensais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.230</div>
            <p className="text-xs text-muted-foreground">
              +15% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Crescimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23%</div>
            <p className="text-xs text-muted-foreground">
              Taxa de crescimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Reuniões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">340%</div>
            <p className="text-xs text-muted-foreground">
              Retorno sobre investimento
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Detalhados</CardTitle>
          <CardDescription>
            Sistema de relatórios avançados em desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Os relatórios CRM incluirão:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Performance de vendas por período</li>
            <li>Análise de conversão de leads</li>
            <li>Relatórios de atividades dos vendedores</li>
            <li>Métricas de funil de vendas</li>
            <li>Análise de ROI por campanha</li>
            <li>Previsões de vendas</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMReports;
