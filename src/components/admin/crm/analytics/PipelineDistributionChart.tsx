
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PipelineData {
  pipeline_id: string;
  pipeline_name: string;
  leads_count: number;
  conversion_rate: number;
}

interface PipelineDistributionChartProps {
  data: PipelineData[];
}

export const PipelineDistributionChart: React.FC<PipelineDistributionChartProps> = ({ data }) => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const chartData = data.map((item, index) => ({
    name: item.pipeline_name,
    value: item.leads_count,
    color: colors[index % colors.length]
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Pipeline</CardTitle>
        <CardDescription>
          Volume de leads por pipeline ativo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
