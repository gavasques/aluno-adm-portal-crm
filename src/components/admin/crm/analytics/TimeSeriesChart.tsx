
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TimeSeriesData {
  date: string;
  new_leads: number;
  converted_leads: number;
  active_leads: number;
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência Temporal</CardTitle>
        <CardDescription>
          Evolução de leads nos últimos 30 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="new_leads" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Novos Leads"
            />
            <Line 
              type="monotone" 
              dataKey="converted_leads" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Convertidos"
            />
            <Line 
              type="monotone" 
              dataKey="active_leads" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Ativos"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
