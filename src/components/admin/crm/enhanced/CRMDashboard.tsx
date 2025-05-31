
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { useCRMPerformance } from '@/hooks/crm/useCRMPerformance';
import CRMNotificationCenter from '../CRMNotificationCenter';
import { cn } from '@/lib/utils';

interface CRMDashboardProps {
  onOpenLead?: (leadId: string) => void;
}

const CRMDashboard: React.FC<CRMDashboardProps> = ({ onOpenLead }) => {
  const { metrics, insights, isLoading, refetch } = useCRMPerformance();

  const statsCards = [
    {
      title: 'Total de Leads',
      value: metrics?.totalLeads || 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Leads Este Mês',
      value: metrics?.leadsThisMonth || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Taxa de Conversão',
      value: `${(metrics?.conversionRate || 0).toFixed(1)}%`,
      icon: BarChart3,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Contatos Agendados',
      value: metrics?.contactsScheduled || 0,
      icon: Calendar,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      title: 'Contatos Realizados',
      value: metrics?.contactsCompleted || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Contatos em Atraso',
      value: metrics?.overdueContacts || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard CRM</h2>
          <p className="text-gray-600">Visão geral da performance e métricas</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={cn("p-3 rounded-full", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Insights de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insights && insights.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum insight disponível no momento
              </p>
            ) : (
              <div className="space-y-3">
                {insights && insights.map((insight, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant={
                              insight.type === 'success' ? 'default' :
                              insight.type === 'warning' ? 'destructive' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {insight.type === 'success' && 'Positivo'}
                            {insight.type === 'warning' && 'Atenção'}
                            {insight.type === 'info' && 'Informação'}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                        <p className="text-xs text-blue-600 mt-1">{insight.action}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Center */}
        <CRMNotificationCenter onOpenLead={onOpenLead} />
      </div>

      {/* Top Performers */}
      {metrics?.topPerformers && metrics.topPerformers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topPerformers.map((performer, index) => (
                <div key={performer.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{performer.name}</p>
                      <p className="text-sm text-gray-600">
                        {performer.leadsCount} leads atribuídos
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {performer.leadsCount} leads
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CRMDashboard;
