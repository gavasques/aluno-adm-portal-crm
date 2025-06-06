
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRange } from 'react-day-picker';
import { Download, FileText, BarChart3, Calendar } from 'lucide-react';
import CRMReports from './CRMReports';
import { PipelinePerformanceReport } from './PipelinePerformanceReport';
import { ConversionMetricsReport } from './ConversionMetricsReport';

interface ReportsContentProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const ReportsContent: React.FC<ReportsContentProps> = ({ 
  dateRange, 
  onDateRangeChange 
}) => {
  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exportando relatório em formato: ${format}`);
    // Implementar lógica de exportação
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios CRM</h2>
          <p className="text-gray-600">Análises detalhadas de performance e métricas</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExportReport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExportReport('excel')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExportReport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Tabs de Relatórios */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="conversion">Conversão</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <CRMReports />
        </TabsContent>

        <TabsContent value="pipeline">
          <PipelinePerformanceReport dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="conversion">
          <ConversionMetricsReport dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
