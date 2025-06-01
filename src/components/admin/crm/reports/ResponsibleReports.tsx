
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ResponsibleMetrics } from '@/hooks/crm/useCRMReports';

interface ResponsibleReportsProps {
  responsibleMetrics?: ResponsibleMetrics[];
  loading: boolean;
}

const ResponsibleReports: React.FC<ResponsibleReportsProps> = ({ responsibleMetrics, loading }) => {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!responsibleMetrics || responsibleMetrics.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Nenhum dado de responsável encontrado</p>
        </CardContent>
      </Card>
    );
  }

  // Ordenar por total de leads
  const sortedMetrics = [...responsibleMetrics].sort((a, b) => b.totalLeads - a.totalLeads);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance por Responsável</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedMetrics.map((responsible, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>
                    {responsible.responsibleName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">
                    {responsible.responsibleName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {responsible.totalLeads} leads atribuídos
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {responsible.convertedLeads} convertidos
                  </p>
                  <Badge 
                    variant={responsible.conversionRate >= 20 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {responsible.conversionRate.toFixed(1)}% conversão
                  </Badge>
                </div>

                <div className="text-right">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(responsible.conversionRate, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {sortedMetrics.reduce((acc, curr) => acc + curr.totalLeads, 0)}
              </p>
              <p className="text-sm text-gray-500">Total de Leads</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {sortedMetrics.reduce((acc, curr) => acc + curr.convertedLeads, 0)}
              </p>
              <p className="text-sm text-gray-500">Total Convertidos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {(sortedMetrics.reduce((acc, curr, _, arr) => 
                  acc + curr.conversionRate, 0) / sortedMetrics.length).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">Conversão Média</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsibleReports;
