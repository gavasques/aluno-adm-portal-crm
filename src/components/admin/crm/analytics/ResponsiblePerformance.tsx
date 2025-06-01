
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Target, Clock, Users } from 'lucide-react';

interface ResponsibleData {
  responsible_id: string;
  responsible_name: string;
  leads_count: number;
  conversion_rate: number;
  avg_time_to_convert: number;
}

interface ResponsiblePerformanceProps {
  data: ResponsibleData[];
}

export const ResponsiblePerformance: React.FC<ResponsiblePerformanceProps> = ({ data }) => {
  const sortedByConversion = [...data].sort((a, b) => b.conversion_rate - a.conversion_rate);
  const topPerformer = sortedByConversion[0];

  const getPerformanceLevel = (conversionRate: number) => {
    if (conversionRate >= 20) return { level: 'Excelente', color: 'green' };
    if (conversionRate >= 15) return { level: 'Bom', color: 'blue' };
    if (conversionRate >= 10) return { level: 'Regular', color: 'yellow' };
    return { level: 'Abaixo', color: 'red' };
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Responsáveis Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Conversão Média</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.length > 0 ? (data.reduce((acc, curr) => acc + curr.conversion_rate, 0) / data.length).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Top Performer</p>
                <p className="text-lg font-bold text-gray-900 truncate">
                  {topPerformer?.responsible_name || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.length > 0 ? Math.round(data.reduce((acc, curr) => acc + curr.avg_time_to_convert, 0) / data.length) : 0} dias
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Responsável</CardTitle>
          <CardDescription>
            Taxa de conversão e volume de leads por responsável
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedByConversion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="responsible_name" 
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'conversion_rate' ? `${value}%` : value,
                  name === 'conversion_rate' ? 'Taxa de Conversão' : 'Leads'
                ]}
              />
              <Bar dataKey="conversion_rate" fill="#3b82f6" name="conversion_rate" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lista Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Performance</CardTitle>
          <CardDescription>
            Classificação detalhada por métricas de performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedByConversion.map((responsible, index) => {
              const performance = getPerformanceLevel(responsible.conversion_rate);
              
              return (
                <div key={responsible.responsible_id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-400 w-6">
                        {index + 1}
                      </span>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {getInitials(responsible.responsible_name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {responsible.responsible_name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {responsible.leads_count} leads atribuídos
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {responsible.conversion_rate.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500">Conversão</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {responsible.avg_time_to_convert || 0} dias
                      </p>
                      <p className="text-xs text-gray-500">Tempo médio</p>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={`
                        ${performance.color === 'green' ? 'border-green-200 text-green-700 bg-green-50' : ''}
                        ${performance.color === 'blue' ? 'border-blue-200 text-blue-700 bg-blue-50' : ''}
                        ${performance.color === 'yellow' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' : ''}
                        ${performance.color === 'red' ? 'border-red-200 text-red-700 bg-red-50' : ''}
                      `}
                    >
                      {performance.level}
                    </Badge>
                    
                    {index === 0 && (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
