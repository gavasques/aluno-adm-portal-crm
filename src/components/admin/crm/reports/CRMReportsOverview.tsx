
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  Activity,
  Clock,
  Trophy
} from 'lucide-react';
import CRMDashboardMetrics from './CRMDashboardMetrics';
import CRMPerformanceAnalytics from './CRMPerformanceAnalytics';
import CRMConversionFunnel from './CRMConversionFunnel';
import CRMTimelineReports from './CRMTimelineReports';
import CRMTeamPerformance from './CRMTeamPerformance';

const CRMReportsOverview = () => {
  const [activeTimeRange, setActiveTimeRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular refresh dos dados
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const timeRanges = [
    { key: '7d', label: '7 dias' },
    { key: '30d', label: '30 dias' },
    { key: '90d', label: '90 dias' },
    { key: '1y', label: '1 ano' },
  ];

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Relatórios CRM
          </h2>
          <p className="text-gray-600 mt-1">
            Análises completas de performance e conversão
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Seletor de período */}
          <div className="flex items-center gap-1 bg-white border rounded-lg p-1">
            {timeRanges.map((range) => (
              <Button
                key={range.key}
                variant={activeTimeRange === range.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTimeRange(range.key)}
                className="h-8 px-3 text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>
          
          {/* Botões de ação */}
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </motion.div>

      {/* Tabs dos relatórios */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white border rounded-lg p-1">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="conversion" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Conversão
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Equipe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <CRMDashboardMetrics timeRange={activeTimeRange} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <CRMPerformanceAnalytics timeRange={activeTimeRange} />
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6">
          <CRMConversionFunnel timeRange={activeTimeRange} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <CRMTimelineReports timeRange={activeTimeRange} />
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <CRMTeamPerformance timeRange={activeTimeRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMReportsOverview;
