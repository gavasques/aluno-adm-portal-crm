
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Target, 
  Clock,
  Phone,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  Star
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface CRMTeamPerformanceProps {
  timeRange: string;
}

const CRMTeamPerformance: React.FC<CRMTeamPerformanceProps> = ({ timeRange }) => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const teamMembers = [
    {
      id: '1',
      name: 'Ana Silva',
      role: 'Senior Sales',
      avatar: 'AS',
      leads: 85,
      conversions: 18,
      rate: 21.2,
      calls: 240,
      emails: 180,
      meetings: 32,
      revenue: 45000,
      rank: 1,
      trend: 8.5
    },
    {
      id: '2',
      name: 'João Santos',
      role: 'Sales Rep',
      avatar: 'JS',
      leads: 72,
      conversions: 14,
      rate: 19.4,
      calls: 198,
      emails: 156,
      meetings: 28,
      revenue: 35000,
      rank: 2,
      trend: 5.2
    },
    {
      id: '3',
      name: 'Maria Costa',
      role: 'Senior Sales',
      avatar: 'MC',
      leads: 78,
      conversions: 15,
      rate: 19.2,
      calls: 215,
      emails: 165,
      meetings: 30,
      revenue: 37500,
      rank: 3,
      trend: -2.1
    },
    {
      id: '4',
      name: 'Pedro Lima',
      role: 'Sales Rep',
      avatar: 'PL',
      leads: 65,
      conversions: 11,
      rate: 16.9,
      calls: 175,
      emails: 142,
      meetings: 22,
      revenue: 27500,
      rank: 4,
      trend: 3.8
    },
    {
      id: '5',
      name: 'Carla Dias',
      role: 'Junior Sales',
      avatar: 'CD',
      leads: 58,
      conversions: 9,
      rate: 15.5,
      calls: 160,
      emails: 128,
      meetings: 18,
      revenue: 22500,
      rank: 5,
      trend: 12.3
    }
  ];

  const teamMetrics = [
    { metric: 'Leads', ana: 85, joao: 72, maria: 78, pedro: 65, carla: 58 },
    { metric: 'Conversões', ana: 18, joao: 14, maria: 15, pedro: 11, carla: 9 },
    { metric: 'Ligações', ana: 240, joao: 198, maria: 215, pedro: 175, carla: 160 },
    { metric: 'Reuniões', ana: 32, joao: 28, maria: 30, pedro: 22, carla: 18 }
  ];

  const skillsData = selectedMember ? [
    { skill: 'Prospecção', value: 85 },
    { skill: 'Apresentação', value: 90 },
    { skill: 'Negociação', value: 88 },
    { skill: 'Fechamento', value: 92 },
    { skill: 'Follow-up', value: 86 },
    { skill: 'Relacionamento', value: 94 }
  ] : [];

  const achievements = [
    { title: 'Top Performer', description: 'Maior taxa de conversão do mês', icon: Trophy, color: 'gold' },
    { title: 'Most Calls', description: 'Maior número de ligações', icon: Phone, color: 'blue' },
    { title: 'Team Player', description: 'Melhor colaboração em equipe', icon: Users, color: 'green' },
    { title: 'Rising Star', description: 'Maior crescimento no período', icon: Star, color: 'purple' }
  ];

  const getMemberRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-600 bg-yellow-100';
      case 2: return 'text-gray-600 bg-gray-100';
      case 3: return 'text-orange-600 bg-orange-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getMemberRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  return (
    <div className="space-y-6">
      {/* Ranking da equipe */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Ranking da Equipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedMember === member.id 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMemberRankIcon(member.rank)}</span>
                      <Badge className={getMemberRankColor(member.rank)}>
                        #{member.rank}
                      </Badge>
                    </div>
                    
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-8 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{member.leads}</p>
                      <p className="text-xs text-gray-500">Leads</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{member.conversions}</p>
                      <p className="text-xs text-gray-500">Conversões</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{member.rate}%</p>
                      <p className="text-xs text-gray-500">Taxa</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">R$ {(member.revenue / 1000).toFixed(0)}k</p>
                      <p className="text-xs text-gray-500">Receita</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${member.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp className={`h-4 w-4 ${member.trend < 0 ? 'rotate-180' : ''}`} />
                      <span className="text-sm font-medium">{Math.abs(member.trend)}%</span>
                    </div>
                    <p className="text-xs text-gray-500">vs anterior</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico comparativo da equipe */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Comparativo da Equipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ana" fill="#3b82f6" name="Ana" />
                <Bar dataKey="joao" fill="#10b981" name="João" />
                <Bar dataKey="maria" fill="#f59e0b" name="Maria" />
                <Bar dataKey="pedro" fill="#ef4444" name="Pedro" />
                <Bar dataKey="carla" fill="#8b5cf6" name="Carla" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skills do membro selecionado */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              {selectedMember ? `Skills - ${teamMembers.find(m => m.id === selectedMember)?.name}` : 'Selecione um membro'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMember ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Clique em um membro da equipe para ver suas habilidades</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conquistas e reconhecimentos */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            Conquistas do Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 border-${achievement.color}-200 bg-${achievement.color}-50`}
              >
                <div className="text-center space-y-2">
                  <div className={`w-12 h-12 mx-auto rounded-full bg-${achievement.color}-100 flex items-center justify-center`}>
                    <achievement.icon className={`h-6 w-6 text-${achievement.color}-600`} />
                  </div>
                  <h3 className={`font-semibold text-${achievement.color}-900`}>{achievement.title}</h3>
                  <p className={`text-sm text-${achievement.color}-700`}>{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas de colaboração */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Colaboração em Equipe</p>
                <p className="text-2xl font-bold text-blue-900">94%</p>
                <p className="text-sm text-blue-600">Índice de colaboração</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Produtividade Média</p>
                <p className="text-2xl font-bold text-green-900">87%</p>
                <p className="text-sm text-green-600">Acima da meta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-800">Meta da Equipe</p>
                <p className="text-2xl font-bold text-purple-900">112%</p>
                <p className="text-sm text-purple-600">Acima do objetivo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CRMTeamPerformance;
