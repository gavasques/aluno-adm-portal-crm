
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Target, 
  DollarSign,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface CRMDashboardMetricsProps {
  timeRange: string;
}

const CRMDashboardMetrics: React.FC<CRMDashboardMetricsProps> = ({ timeRange }) => {
  // Dados simulados - em produção viriam da API
  const metrics = {
    totalLeads: 1247,
    convertedLeads: 89,
    conversionRate: 7.1,
    averageLeadValue: 2500,
    activeContacts: 156,
    completedCalls: 342,
    scheduledMeetings: 45,
    closedDeals: 23
  };

  const trends = {
    totalLeads: 12.5,
    convertedLeads: 8.3,
    conversionRate: -2.1,
    averageLeadValue: 15.7
  };

  const pipelineData = [
    { name: 'Prospecção', value: 45, leads: 450 },
    { name: 'Qualificação', value: 25, leads: 250 },
    { name: 'Proposta', value: 15, leads: 150 },
    { name: 'Negociação', value: 10, leads: 100 },
    { name: 'Fechado', value: 5, leads: 50 }
  ];

  const weeklyData = [
    { day: 'Seg', leads: 45, conversions: 3 },
    { day: 'Ter', leads: 52, conversions: 4 },
    { day: 'Qua', leads: 38, conversions: 2 },
    { day: 'Qui', leads: 61, conversions: 5 },
    { day: 'Sex', leads: 55, conversions: 4 },
    { day: 'Sáb', leads: 28, conversions: 1 },
    { day: 'Dom', leads: 15, conversions: 1 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = "blue" }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
            <div className={`p-3 rounded-full bg-${color}-100`}>
              <Icon className={`h-6 w-6 text-${color}-600`} />
            </div>
          </div>
          
          {trend !== undefined && (
            <div className="mt-4 flex items-center">
              {trend > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(trend)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Leads"
          value={metrics.totalLeads.toLocaleString()}
          icon={Users}
          trend={trends.totalLeads}
          color="blue"
        />
        
        <MetricCard
          title="Leads Convertidos"
          value={metrics.convertedLeads}
          subtitle={`${metrics.conversionRate}% conversão`}
          icon={Target}
          trend={trends.convertedLeads}
          color="green"
        />
        
        <MetricCard
          title="Valor Médio por Lead"
          value={`R$ ${metrics.averageLeadValue.toLocaleString()}`}
          icon={DollarSign}
          trend={trends.averageLeadValue}
          color="yellow"
        />
        
        <MetricCard
          title="Negócios Fechados"
          value={metrics.closedDeals}
          subtitle="Este período"
          icon={CheckCircle}
          color="purple"
        />
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de leads por dia */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Leads por Dia da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pipeline de vendas */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Distribuição do Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cards de atividades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Contatos Ativos"
          value={metrics.activeContacts}
          icon={Phone}
          color="blue"
        />
        
        <MetricCard
          title="Ligações Realizadas"
          value={metrics.completedCalls}
          icon={Phone}
          color="green"
        />
        
        <MetricCard
          title="Reuniões Agendadas"
          value={metrics.scheduledMeetings}
          icon={Calendar}
          color="yellow"
        />
        
        <MetricCard
          title="E-mails Enviados"
          value="428"
          icon={Mail}
          color="purple"
        />
      </div>
    </div>
  );
};

export default CRMDashboardMetrics;
