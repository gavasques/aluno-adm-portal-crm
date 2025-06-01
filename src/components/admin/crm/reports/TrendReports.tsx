
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { LeadsByPeriod } from '@/hooks/crm/useCRMReports';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TrendReportsProps {
  periodData?: LeadsByPeriod[];
  loading: boolean;
}

const TrendReports: React.FC<TrendReportsProps> = ({ periodData, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!periodData || periodData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Nenhum dado de tendência encontrado</p>
        </CardContent>
      </Card>
    );
  }

  // Formatar dados para os gráficos
  const chartData = periodData.map(item => ({
    ...item,
    month: format(parseISO(`${item.period}-01`), 'MMM/yy', { locale: ptBR })
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Linha - Tendência de Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Leads por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(label) => `Mês: ${label}`}
                  formatter={(value: number, name: string) => [
                    value, 
                    name === 'leads' ? 'Novos Leads' : 'Convertidos'
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Novos Leads"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="converted" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Convertidos"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Comparativo */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativo Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    value, 
                    name === 'leads' ? 'Novos Leads' : 'Convertidos'
                  ]}
                />
                <Legend />
                <Bar 
                  dataKey="leads" 
                  fill="#3b82f6" 
                  name="Novos Leads"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="converted" 
                  fill="#10b981" 
                  name="Convertidos"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Estatísticas Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {periodData.reduce((acc, curr) => acc + curr.leads, 0)}
              </p>
              <p className="text-sm text-blue-700">Total de Leads</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {periodData.reduce((acc, curr) => acc + curr.converted, 0)}
              </p>
              <p className="text-sm text-green-700">Total Convertidos</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {(periodData.reduce((acc, curr) => acc + curr.leads, 0) / periodData.length).toFixed(0)}
              </p>
              <p className="text-sm text-purple-700">Média Mensal</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {periodData.length > 1 ? 
                  ((periodData[periodData.length - 1].leads - periodData[periodData.length - 2].leads) / 
                   periodData[periodData.length - 2].leads * 100).toFixed(1) : 0}%
              </p>
              <p className="text-sm text-orange-700">Crescimento</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendReports;
