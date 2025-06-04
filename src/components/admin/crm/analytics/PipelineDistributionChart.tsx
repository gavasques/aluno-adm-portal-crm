
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface PipelineData {
  pipeline_id: string;
  pipeline_name: string;
  leads_count: number;
  conversion_rate: number;
}

interface PipelineDistributionChartProps {
  data: PipelineData[];
}

const chartConfig = {
  leads_count: {
    label: "Leads",
  },
};

export const PipelineDistributionChart: React.FC<PipelineDistributionChartProps> = ({ data }) => {
  const { chartData, totalLeads } = useMemo(() => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const total = data.reduce((sum, item) => sum + item.leads_count, 0);
    
    const processedData = data
      .filter(item => item.leads_count > 0)
      .map((item, index) => ({
        name: item.pipeline_name,
        value: item.leads_count,
        color: colors[index % colors.length],
        percentage: total > 0 ? ((item.leads_count / total) * 100).toFixed(1) : '0'
      }));

    return { chartData: processedData, totalLeads: total };
  }, [data]);

  if (!data || data.length === 0 || totalLeads === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Pipeline</CardTitle>
          <CardDescription>Nenhum dado disponível</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Sem dados para exibir
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Pipeline</CardTitle>
        <CardDescription>
          Volume de leads por pipeline ativo ({totalLeads} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name) => [value, 'Leads']}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
