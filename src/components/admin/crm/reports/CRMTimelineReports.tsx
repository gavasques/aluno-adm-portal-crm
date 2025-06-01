
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  Activity,
  TrendingUp,
  Users,
  Phone,
  Mail,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface CRMTimelineReportsProps {
  timeRange: string;
}

const CRMTimelineReports: React.FC<CRMTimelineReportsProps> = ({ timeRange }) => {
  const [viewMode, setViewMode] = useState('daily');

  const dailyData = [
    { date: '01/06', leads: 45, calls: 32, emails: 28, meetings: 5, conversions: 3 },
    { date: '02/06', leads: 52, calls: 38, emails: 35, meetings: 7, conversions: 4 },
    { date: '03/06', leads: 38, calls: 28, emails: 22, meetings: 4, conversions: 2 },
    { date: '04/06', leads: 61, calls: 45, emails: 40, meetings: 8, conversions: 5 },
    { date: '05/06', leads: 55, calls: 42, emails: 38, meetings: 6, conversions: 4 },
    { date: '06/06', leads: 28, calls: 20, emails: 15, meetings: 3, conversions: 1 },
    { date: '07/06', leads: 35, calls: 25, emails: 20, meetings: 4, conversions: 2 }
  ];

  const weeklyData = [
    { week: 'Sem 1', leads: 320, calls: 240, emails: 180, meetings: 32, conversions: 18 },
    { week: 'Sem 2', leads: 385, calls: 290, emails: 220, meetings: 38, conversions: 22 },
    { week: 'Sem 3', leads: 420, calls: 315, emails: 245, meetings: 42, conversions: 25 },
    { week: 'Sem 4', leads: 390, calls: 285, emails: 210, meetings: 35, conversions: 20 }
  ];

  const monthlyData = [
    { month: 'Jan', leads: 1200, calls: 900, emails: 750, meetings: 120, conversions: 72 },
    { month: 'Fev', leads: 1350, calls: 1020, emails: 820, meetings: 135, conversions: 81 },
    { month: 'Mar', leads: 1480, calls: 1110, emails: 890, meetings: 148, conversions: 89 },
    { month: 'Abr', leads: 1320, calls: 990, emails: 790, meetings: 132, conversions: 79 },
    { month: 'Mai', leads: 1560, calls: 1170, emails: 940, meetings: 156, conversions: 94 },
    { month: 'Jun', leads: 1650, calls: 1238, emails: 990, meetings: 165, conversions: 99 }
  ];

  const getCurrentData = () => {
    switch (viewMode) {
      case 'daily': return dailyData;
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      default: return dailyData;
    }
  };

  const activityTimeline = [
    { time: '09:00', activity: 'Reunião de equipe', type: 'meeting', participants: 8 },
    { time: '10:30', activity: '15 ligações realizadas', type: 'calls', participants: 15 },
    { time: '11:45', activity: '3 leads convertidos', type: 'conversion', participants: 3 },
    { time: '14:00', activity: 'Apresentação para cliente', type: 'presentation', participants: 1 },
    { time: '15:30', activity: '8 emails enviados', type: 'email', participants: 8 },
    { time: '16:45', activity: '2 reuniões agendadas', type: 'scheduling', participants: 2 }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'calls': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'conversion': return <Target className="h-4 w-4" />;
      case 'presentation': return <Activity className="h-4 w-4" />;
      case 'scheduling': return <Calendar className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-600';
      case 'calls': return 'bg-green-100 text-green-600';
      case 'email': return 'bg-purple-100 text-purple-600';
      case 'conversion': return 'bg-yellow-100 text-yellow-600';
      case 'presentation': return 'bg-red-100 text-red-600';
      case 'scheduling': return 'bg-indigo-100 text-indigo-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controles de visualização */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg w-fit">
        <Button
          variant={viewMode === 'daily' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('daily')}
        >
          Diário
        </Button>
        <Button
          variant={viewMode === 'weekly' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('weekly')}
        >
          Semanal
        </Button>
        <Button
          variant={viewMode === 'monthly' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('monthly')}
        >
          Mensal
        </Button>
      </div>

      {/* Gráfico principal de timeline */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Evolução Temporal das Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={getCurrentData()}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={viewMode === 'daily' ? 'date' : viewMode === 'weekly' ? 'week' : 'month'} />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="leads" 
                stackId="1"
                stroke="#3b82f6" 
                fill="url(#colorLeads)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="calls" 
                stackId="2"
                stroke="#10b981" 
                fill="url(#colorCalls)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="conversions" 
                stackId="3"
                stroke="#f59e0b" 
                fill="url(#colorConversions)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline de atividades de hoje */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Atividades de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityTimeline.map((activity, index) => (
                <motion.div
                  key={`${activity.time}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex flex-col items-center">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    {index < activityTimeline.length - 1 && (
                      <div className="w-px h-8 bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.participants} {activity.type === 'meeting' ? 'participantes' : 'itens'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Métricas de produtividade por horário */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Produtividade por Horário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { hour: '09h', calls: 12, conversions: 2 },
                { hour: '10h', calls: 18, conversions: 3 },
                { hour: '11h', calls: 22, conversions: 4 },
                { hour: '14h', calls: 25, conversions: 5 },
                { hour: '15h', calls: 20, conversions: 3 },
                { hour: '16h', calls: 15, conversions: 2 },
                { hour: '17h', calls: 8, conversions: 1 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="calls" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cards de resumo temporal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Tempo Médio por Lead</p>
                <p className="text-2xl font-bold text-blue-900">8.5 min</p>
                <p className="text-sm text-blue-600">Último período</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Pico de Produtividade</p>
                <p className="text-2xl font-bold text-green-900">14h-15h</p>
                <p className="text-sm text-green-600">Melhor horário</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Melhor Dia da Semana</p>
                <p className="text-2xl font-bold text-yellow-900">Quinta</p>
                <p className="text-sm text-yellow-600">Maior conversão</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-800">Atividades Hoje</p>
                <p className="text-2xl font-bold text-purple-900">47</p>
                <p className="text-sm text-purple-600">Em andamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CRMTimelineReports;
