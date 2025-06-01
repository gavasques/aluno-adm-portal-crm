
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Target, Clock, DollarSign } from 'lucide-react';

interface ConversionMetricsReportProps {
  dateRange: DateRange | undefined;
}

export const ConversionMetricsReport: React.FC<ConversionMetricsReportProps> = ({ dateRange }) => {
  // Mock data
  const conversionData = [
    { data: '01/12', leads: 45, conversoes: 8, taxa: 17.8, ticket_medio: 5200 },
    { data: '08/12', leads: 52, conversoes: 11, taxa: 21.2, ticket_medio: 4800 },
    { data: '15/12', leads: 38, conversoes: 6, taxa: 15.8, ticket_medio: 6100 },
    { data: '22/12', leads: 61, conversoes: 14, taxa: 22.9, ticket_medio: 5500 },
    { data: '29/12', leads: 48, conversoes: 9, taxa: 18.7, ticket_medio: 5800 }
  ];

  const funnelData = [
    { etapa: 'Lead Gerado', quantidade: 1000, taxa: 100 },
    { etapa: 'Qualificado', quantidade: 600, taxa: 60 },
    { etapa: 'Oportunidade', quantidade: 300, taxa: 30 },
    { etapa: 'Proposta', quantidade: 150, taxa: 15 },
    { etapa: 'Fechado', quantidade: 75, taxa: 7.5 }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-gray-900">19.3%</p>
                <p className="text-xs text-green-600">+2.1% vs período anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Ciclo de Vendas</p>
                <p className="text-2xl font-bold text-gray-900">18 dias</p>
                <p className="text-xs text-green-600">-3 dias vs período anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-gray-900">R$ 5.480</p>
                <p className="text-xs text-green-600">+8% vs período anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900">24.5%</p>
                <p className="text-xs text-green-600">+1.8% vs período anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Conversão ao Longo do Tempo */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução da Taxa de Conversão</CardTitle>
          <CardDescription>
            Tendência semanal da taxa de conversão e ticket médio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'taxa' ? `${value}%` : 
                  name === 'ticket_medio' ? `R$ ${value.toLocaleString()}` : value,
                  name === 'taxa' ? 'Taxa de Conversão' :
                  name === 'ticket_medio' ? 'Ticket Médio' :
                  name === 'leads' ? 'Leads' : 'Conversões'
                ]}
              />
              <Line yAxisId="left" type="monotone" dataKey="taxa" stroke="#3b82f6" strokeWidth={3} name="taxa" />
              <Line yAxisId="right" type="monotone" dataKey="ticket_medio" stroke="#10b981" strokeWidth={2} name="ticket_medio" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Funil de Conversão */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão Detalhado</CardTitle>
          <CardDescription>
            Análise completa do fluxo de conversão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="etapa" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'taxa' ? `${value}%` : value,
                  name === 'taxa' ? 'Taxa de Conversão' : 'Quantidade'
                ]}
              />
              <Area type="monotone" dataKey="quantidade" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela de Métricas Detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas Semanais Detalhadas</CardTitle>
          <CardDescription>
            Breakdown completo das métricas de conversão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-600">Período</th>
                  <th className="text-center p-3 font-medium text-gray-600">Leads</th>
                  <th className="text-center p-3 font-medium text-gray-600">Conversões</th>
                  <th className="text-center p-3 font-medium text-gray-600">Taxa</th>
                  <th className="text-center p-3 font-medium text-gray-600">Ticket Médio</th>
                  <th className="text-center p-3 font-medium text-gray-600">Receita</th>
                </tr>
              </thead>
              <tbody>
                {conversionData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{row.data}</td>
                    <td className="p-3 text-center">{row.leads}</td>
                    <td className="p-3 text-center">{row.conversoes}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded text-sm ${
                        row.taxa >= 20 ? 'bg-green-100 text-green-800' :
                        row.taxa >= 15 ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {row.taxa}%
                      </span>
                    </td>
                    <td className="p-3 text-center">R$ {row.ticket_medio.toLocaleString()}</td>
                    <td className="p-3 text-center font-medium">
                      R$ {(row.conversoes * row.ticket_medio).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
