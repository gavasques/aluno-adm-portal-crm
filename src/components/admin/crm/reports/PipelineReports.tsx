
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PipelineMetrics } from '@/hooks/crm/useCRMReports';

interface PipelineReportsProps {
  pipelineMetrics?: PipelineMetrics[];
  loading: boolean;
}

const PipelineReports: React.FC<PipelineReportsProps> = ({ pipelineMetrics, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!pipelineMetrics || pipelineMetrics.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Nenhum dado de pipeline encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {pipelineMetrics.map((pipeline, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pipeline: {pipeline.pipelineName}</span>
              <span className="text-sm font-normal text-gray-500">
                {pipeline.totalLeads} leads total
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Breakdown por coluna */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Distribuição por Estágio</h4>
                {pipeline.columnBreakdown.map((column, colIndex) => (
                  <div key={colIndex} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {column.columnName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {column.count} ({column.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress 
                      value={column.percentage} 
                      className="h-2"
                      style={{ 
                        background: `${column.color}20`,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Gráfico de Pizza */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pipeline.columnBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="count"
                      nameKey="columnName"
                    >
                      {pipeline.columnBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value} leads`, 'Quantidade']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PipelineReports;
