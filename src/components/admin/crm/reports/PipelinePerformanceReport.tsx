
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DateRange } from 'react-day-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Target, Clock, Users } from 'lucide-react';

interface PipelinePerformanceReportProps {
  dateRange: DateRange | undefined;
}

export const PipelinePerformanceReport: React.FC<PipelinePerformanceReportProps> = ({ dateRange }) => {
  // Mock data - substituir por dados reais
  const pipelineData = [
    { name: 'Vendas Principais', leads: 120, conversoes: 25, taxa: 20.8, tempo_medio: 15 },
    { name: 'Leads Qualificados', leads: 85, conversoes: 18, taxa: 21.2, tempo_medio: 12 },
    { name: 'Prospects Frios', leads: 200, conversoes: 15, taxa: 7.5, tempo_medio: 25 },
    { name: 'Parcerias', leads: 45, conversoes: 12, taxa: 26.7, tempo_medio: 8 }
  ];

  const timelineData = [
    { mes: 'Jan', vendas_principais: 95, leads_qualificados: 78, prospects_frios: 180 },
    { mes: 'Fev', vendas_principais: 108, leads_qualificados: 82, prospects_frios: 195 },
    { mes: 'Mar', vendas_principais: 120, leads_qualificados: 85, prospects_frios: 200 },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pipelines Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{pipelineData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pipelineData.reduce((acc, p) => acc + p.leads, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa Média</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(pipelineData.reduce((acc, p) => acc + p.taxa, 0) / pipelineData.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(pipelineData.reduce((acc, p) => acc + p.tempo_medio, 0) / pipelineData.length)} dias
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Performance por Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Pipeline</CardTitle>
          <CardDescription>
            Taxa de conversão e volume de leads por pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'taxa' ? `${value}%` : value,
                  name === 'taxa' ? 'Taxa de Conversão' : name === 'leads' ? 'Leads' : 'Conversões'
                ]}
              />
              <Bar dataKey="leads" fill="#3b82f6" name="leads" />
              <Bar dataKey="conversoes" fill="#10b981" name="conversoes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Evolução Temporal */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução Temporal</CardTitle>
          <CardDescription>
            Tendência de leads por pipeline nos últimos meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="vendas_principais" stroke="#3b82f6" strokeWidth={2} name="Vendas Principais" />
              <Line type="monotone" dataKey="leads_qualificados" stroke="#10b981" strokeWidth={2} name="Leads Qualificados" />
              <Line type="monotone" dataKey="prospects_frios" stroke="#f59e0b" strokeWidth={2} name="Prospects Frios" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Análise Detalhada por Pipeline</CardTitle>
          <CardDescription>
            Métricas completas de performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelineData.map((pipeline, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{pipeline.name}</h4>
                    <p className="text-sm text-gray-500">
                      {pipeline.leads} leads • {pipeline.conversoes} conversões
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{pipeline.taxa}%</p>
                    <p className="text-xs text-gray-500">Conversão</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{pipeline.tempo_medio} dias</p>
                    <p className="text-xs text-gray-500">Tempo médio</p>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={
                      pipeline.taxa >= 20 ? 'border-green-200 text-green-700 bg-green-50' :
                      pipeline.taxa >= 15 ? 'border-blue-200 text-blue-700 bg-blue-50' :
                      pipeline.taxa >= 10 ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                      'border-red-200 text-red-700 bg-red-50'
                    }
                  >
                    {pipeline.taxa >= 20 ? 'Excelente' :
                     pipeline.taxa >= 15 ? 'Bom' :
                     pipeline.taxa >= 10 ? 'Regular' : 'Abaixo'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
