
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface TimeSeriesData {
  date: string;
  new_leads: number;
  converted_leads: number;
  active_leads: number;
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
}

const chartConfig = {
  new_leads: {
    label: "Novos Leads",
    color: "#3b82f6",
  },
  converted_leads: {
    label: "Convertidos",
    color: "#10b981",
  },
  active_leads: {
    label: "Ativos",
    color: "#f59e0b",
  },
};

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data }) => {
  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      })
    }));
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendência Temporal</CardTitle>
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
        <CardTitle>Tendência Temporal</CardTitle>
        <CardDescription>
          Evolução de leads nos últimos 7 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="new_leads" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                stroke="var(--color-new_leads)"
              />
              <Line 
                type="monotone" 
                dataKey="converted_leads" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                stroke="var(--color-converted_leads)"
              />
              <Line 
                type="monotone" 
                dataKey="active_leads" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                stroke="var(--color-active_leads)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
