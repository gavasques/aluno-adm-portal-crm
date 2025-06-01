
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface LeadSourceData {
  source: string;
  total_leads: number;
  converted_leads: number;
  conversion_rate: number;
  avg_value: number;
  trend: 'up' | 'down' | 'stable';
}

interface LeadSourceAnalysisProps {
  data: LeadSourceData[];
}

export const LeadSourceAnalysis: React.FC<LeadSourceAnalysisProps> = ({ data }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const pieData = data.map((item, index) => ({
    name: item.source,
    value: item.total_leads,
    color: colors[index % colors.length]
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Conversão por Fonte */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão por Fonte</CardTitle>
            <CardDescription>
              Performance de conversão de cada canal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Taxa de Conversão']}
                />
                <Bar dataKey="conversion_rate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Distribuição de Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Leads por Fonte</CardTitle>
            <CardDescription>
              Volume total de leads por canal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Análise Detalhada por Fonte</CardTitle>
          <CardDescription>
            Métricas completas de performance de cada canal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{source.source}</h4>
                    <p className="text-sm text-gray-500">
                      {source.total_leads} leads • {source.converted_leads} conversões
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {source.conversion_rate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">Conversão</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      R$ {source.avg_value.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Ticket médio</p>
                  </div>
                  
                  <div className={`flex items-center px-2 py-1 rounded-full ${getTrendColor(source.trend)}`}>
                    {getTrendIcon(source.trend)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
