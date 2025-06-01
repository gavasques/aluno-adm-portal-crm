
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Award, 
  Clock, 
  Target,
  Users,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface CRMPerformanceAnalyticsProps {
  timeRange: string;
}

const CRMPerformanceAnalytics: React.FC<CRMPerformanceAnalyticsProps> = ({ timeRange }) => {
  const [selectedMetric, setSelectedMetric] = useState('conversion');

  // Dados simulados de performance
  const performanceData = [
    { month: 'Jan', conversion: 6.5, leads: 850, calls: 320, meetings: 45 },
    { month: 'Fev', conversion: 7.2, leads: 920, calls: 380, meetings: 52 },
    { month: 'Mar', conversion: 8.1, leads: 1050, calls: 420, meetings: 68 },
    { month: 'Abr', conversion: 7.8, leads: 980, calls: 390, meetings: 61 },
    { month: 'Mai', conversion: 8.9, leads: 1120, calls: 480, meetings: 75 },
    { month: 'Jun', conversion: 9.2, leads: 1180, calls: 520, meetings: 82 }
  ];

  const teamPerformance = [
    { name: 'Ana Silva', leads: 45, conversions: 8, rate: 17.8, calls: 120 },
    { name: 'João Santos', leads: 38, conversions: 6, rate: 15.8, calls: 98 },
    { name: 'Maria Costa', leads: 52, conversions: 9, rate: 17.3, calls: 145 },
    { name: 'Pedro Lima', leads: 41, conversions: 5, rate: 12.2, calls: 89 },
    { name: 'Carla Dias', leads: 47, conversions: 7, rate: 14.9, calls: 132 }
  ];

  const channelPerformance = [
    { channel: 'Website', leads: 350, conversions: 28, cost: 2500 },
    { channel: 'Social Media', leads: 280, conversions: 22, cost: 1800 },
    { channel: 'Email Marketing', leads: 190, conversions: 18, cost: 800 },
    { channel: 'Indicações', leads: 160, conversions: 24, cost: 0 },
    { channel: 'Google Ads', leads: 420, conversions: 31, cost: 3200 }
  ];

  const metrics = [
    { key: 'conversion', label: 'Taxa de Conversão', color: '#3b82f6' },
    { key: 'leads', label: 'Leads Gerados', color: '#10b981' },
    { key: 'calls', label: 'Ligações', color: '#f59e0b' },
    { key: 'meetings', label: 'Reuniões', color: '#8b5cf6' }
  ];

  return (
    <div className="space-y-6">
      {/* Seletor de métricas */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg w-fit">
        {metrics.map((metric) => (
          <Button
            key={metric.key}
            variant={selectedMetric === metric.key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedMetric(metric.key)}
            className="h-8"
          >
            {metric.label}
          </Button>
        ))}
      </div>

      {/* Gráfico principal de performance */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Performance ao Longo do Tempo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metrics.find(m => m.key === selectedMetric)?.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={metrics.find(m => m.key === selectedMetric)?.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
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
                dataKey={selectedMetric} 
                stroke={metrics.find(m => m.key === selectedMetric)?.color}
                fillOpacity={1} 
                fill="url(#colorMetric)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance da equipe */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Performance da Equipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamPerformance.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.leads} leads • {member.calls} calls</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={member.rate > 15 ? 'default' : 'secondary'}>
                      {member.rate}%
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">{member.conversions} conversões</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance por canal */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Performance por Canal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="channel" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de eficiência */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Tempo Médio de Conversão</p>
                <p className="text-2xl font-bold text-blue-900">14 dias</p>
                <p className="text-sm text-blue-600">-2 dias vs anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Phone className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Taxa de Atendimento</p>
                <p className="text-2xl font-bold text-green-900">87%</p>
                <p className="text-sm text-green-600">+5% vs anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-800">Follow-up Médio</p>
                <p className="text-2xl font-bold text-purple-900">3.2x</p>
                <p className="text-sm text-purple-600">Por lead ativo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CRMPerformanceAnalytics;
