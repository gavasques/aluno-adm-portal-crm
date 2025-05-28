
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, Calendar, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addDays, format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";

const CreditsReports = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [reportType, setReportType] = useState("usage");

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['credits-reports', reportType, dateRange],
    queryFn: async () => {
      if (!dateRange.from || !dateRange.to) return [];
      
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      const endDate = format(dateRange.to, 'yyyy-MM-dd');

      if (reportType === "usage") {
        // Relatório de uso diário
        const { data, error } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('type', 'uso')
          .gte('created_at', startDate)
          .lte('created_at', endDate)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Agrupar por dia
        const dailyUsage = data?.reduce((acc, transaction) => {
          const date = format(new Date(transaction.created_at), 'yyyy-MM-dd');
          acc[date] = (acc[date] || 0) + Math.abs(Number(transaction.amount) || 0);
          return acc;
        }, {} as Record<string, number>) || {};

        return Object.entries(dailyUsage).map(([date, amount]) => ({
          date: format(new Date(date), 'dd/MM'),
          credits: amount
        }));

      } else if (reportType === "purchases") {
        // Relatório de compras
        const { data, error } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('type', 'compra')
          .gte('created_at', startDate)
          .lte('created_at', endDate)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const dailyPurchases = data?.reduce((acc, transaction) => {
          const date = format(new Date(transaction.created_at), 'yyyy-MM-dd');
          const amount = Number(transaction.amount) || 0;
          acc[date] = (acc[date] || 0) + amount;
          return acc;
        }, {} as Record<string, number>) || {};

        return Object.entries(dailyPurchases).map(([date, amount]) => ({
          date: format(new Date(date), 'dd/MM'),
          credits: amount,
          revenue: amount * 0.1 // Assumindo R$ 0,10 por crédito
        }));

      } else if (reportType === "distribution") {
        // Distribuição de créditos por faixa
        const { data, error } = await supabase
          .from('user_credits')
          .select('current_credits, monthly_limit');

        if (error) throw error;

        const ranges = {
          'Sem créditos': 0,
          '1-10 créditos': 0,
          '11-50 créditos': 0,
          '51-100 créditos': 0,
          'Mais de 100': 0
        };

        data?.forEach(user => {
          const credits = Number(user.current_credits) || 0;
          if (credits === 0) ranges['Sem créditos']++;
          else if (credits <= 10) ranges['1-10 créditos']++;
          else if (credits <= 50) ranges['11-50 créditos']++;
          else if (credits <= 100) ranges['51-100 créditos']++;
          else ranges['Mais de 100']++;
        });

        return Object.entries(ranges).map(([range, count]) => ({
          range,
          count,
          percentage: ((count / (data?.length || 1)) * 100).toFixed(1)
        }));
      }

      return [];
    }
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const exportReport = () => {
    if (!reportData || reportData.length === 0) return;
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(reportData[0]).join(",") + "\n" +
      reportData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio-creditos-${reportType}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Relatórios de Créditos</span>
            <div className="flex items-center gap-2">
              <Button onClick={exportReport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usage">Uso de Créditos</SelectItem>
                  <SelectItem value="purchases">Compras</SelectItem>
                  <SelectItem value="distribution">Distribuição</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportType !== 'distribution' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={handleDateRangeChange}
                />
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="h-[400px]">
              {reportType === "usage" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="credits" fill="#8884d8" name="Créditos Usados" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {reportType === "purchases" && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="credits" fill="#82ca9d" name="Créditos Comprados" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#8884d8" name="Receita (R$)" />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {reportType === "distribution" && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, percentage }) => `${range}: ${percentage}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reportData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {reportData && reportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dados Detalhados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border max-h-[300px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(reportData[0]).map((key) => (
                      <th key={key} className="px-4 py-2 text-left text-sm font-medium">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, index) => (
                    <tr key={index} className="border-t">
                      {Object.values(row).map((value, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 text-sm">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreditsReports;
