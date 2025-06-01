
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  PieChart,
  CalendarIcon,
  Download,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCRMReports } from '@/hooks/crm/useCRMReports';
import CRMReportsOverview from './CRMReportsOverview';
import PipelineReports from './PipelineReports';
import ResponsibleReports from './ResponsibleReports';
import TrendReports from './TrendReports';

const CRMReports: React.FC = () => {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });

  const { 
    metrics, 
    pipelineMetrics, 
    responsibleMetrics, 
    periodData, 
    loading 
  } = useCRMReports(dateRange as { from: Date; to: Date });

  const handleExportReport = () => {
    // Implementar exportação de relatório
    console.log('Exportar relatório:', { dateRange, metrics, pipelineMetrics });
  };

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios CRM</h2>
          <p className="text-gray-600">Análise detalhada de performance e métricas</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Seletor de Data */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                  )
                ) : (
                  <span>Selecione o período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <CRMReportsOverview metrics={metrics} loading={loading} />

      {/* Tabs de Relatórios */}
      <Tabs defaultValue="pipeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipeline" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tendências
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          <PipelineReports 
            pipelineMetrics={pipelineMetrics} 
            loading={loading} 
          />
        </TabsContent>

        <TabsContent value="performance">
          <ResponsibleReports 
            responsibleMetrics={responsibleMetrics} 
            loading={loading} 
          />
        </TabsContent>

        <TabsContent value="trends">
          <TrendReports 
            periodData={periodData} 
            loading={loading} 
          />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Avançado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Analytics Avançado
                </h3>
                <p className="text-gray-500 mb-4">
                  Análises detalhadas de comportamento e previsões de vendas
                </p>
                <Button variant="outline" disabled>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Em desenvolvimento
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMReports;
