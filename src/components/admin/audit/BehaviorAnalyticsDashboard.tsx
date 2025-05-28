
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  AlertTriangle, 
  Shield, 
  Activity,
  Users,
  TrendingUp,
  RefreshCw,
  Bot,
  Clock,
  Target
} from 'lucide-react';
import { useBehaviorAnalysis } from '@/hooks/admin/useBehaviorAnalysis';
import { useRealTimeSecurityMonitor } from '@/hooks/admin/useRealTimeSecurityMonitor';
import { Skeleton } from '@/components/ui/skeleton';

export const BehaviorAnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    analysis, 
    loading: behaviorLoading, 
    realTimeMonitoring,
    analyzeUserBehavior,
    startRealTimeMonitoring 
  } = useBehaviorAnalysis();
  
  const {
    threats,
    incidents,
    monitoring: securityMonitoring,
    autoResponse,
    setAutoResponse,
    startMonitoring,
    analyzeThreatIntelligence
  } = useRealTimeSecurityMonitor();

  const handleRefreshAnalysis = () => {
    analyzeUserBehavior();
    analyzeThreatIntelligence();
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  const getPatternIcon = (pattern: string) => {
    switch (pattern) {
      case 'UNUSUAL_HOURS_LOGIN': return <Clock className="h-4 w-4" />;
      case 'MULTIPLE_FAILURES': return <AlertTriangle className="h-4 w-4" />;
      case 'HIGH_SENSITIVE_ACCESS': return <Shield className="h-4 w-4" />;
      case 'RAPID_OPERATIONS': return <Bot className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (behaviorLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            Análise Comportamental e IA de Segurança
          </h1>
          <p className="text-gray-600">Detecção avançada de ameaças e análise de padrões comportamentais</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={startRealTimeMonitoring}
            disabled={realTimeMonitoring}
          >
            <Activity className={`h-4 w-4 mr-2 ${realTimeMonitoring ? 'animate-pulse' : ''}`} />
            {realTimeMonitoring ? 'Monitorando' : 'Iniciar Monitoramento'}
          </Button>
          <Button 
            variant="outline" 
            onClick={startMonitoring}
            disabled={securityMonitoring}
          >
            <Shield className={`h-4 w-4 mr-2 ${securityMonitoring ? 'animate-pulse' : ''}`} />
            {securityMonitoring ? 'Segurança Ativa' : 'Ativar Segurança'}
          </Button>
          <Button onClick={handleRefreshAnalysis}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Risco Global</p>
                <p className={`text-2xl font-bold ${
                  analysis?.global_risk_level === 'critical' ? 'text-red-600' :
                  analysis?.global_risk_level === 'high' ? 'text-orange-500' :
                  analysis?.global_risk_level === 'medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {analysis?.global_risk_level?.toUpperCase() || 'BAIXO'}
                </p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${
                analysis?.global_risk_level === 'critical' ? 'text-red-600' :
                analysis?.global_risk_level === 'high' ? 'text-orange-500' :
                analysis?.global_risk_level === 'medium' ? 'text-yellow-500' :
                'text-green-500'
              }`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuários Suspeitos</p>
                <p className="text-2xl font-bold text-orange-600">
                  {analysis?.suspicious_users.length || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ameaças Ativas</p>
                <p className="text-2xl font-bold text-red-600">
                  {threats?.active_threats.length || 0}
                </p>
              </div>
              <Target className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score de Segurança</p>
                <p className="text-2xl font-bold text-blue-600">
                  {threats?.system_health.security_score || 0}%
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status do Sistema */}
      {threats?.system_health && (
        <Alert className={`border-l-4 ${
          threats.system_health.overall_status === 'critical' ? 'border-red-500 bg-red-50' :
          threats.system_health.overall_status === 'warning' ? 'border-yellow-500 bg-yellow-50' :
          'border-green-500 bg-green-50'
        }`}>
          <Shield className={`h-4 w-4 ${
            threats.system_health.overall_status === 'critical' ? 'text-red-500' :
            threats.system_health.overall_status === 'warning' ? 'text-yellow-500' :
            'text-green-500'
          }`} />
          <AlertDescription className={
            threats.system_health.overall_status === 'critical' ? 'text-red-700' :
            threats.system_health.overall_status === 'warning' ? 'text-yellow-700' :
            'text-green-700'
          }>
            Sistema de Segurança: {threats.system_health.overall_status.toUpperCase()} 
            - Score: {threats.system_health.security_score}%
            {autoResponse && ' | Resposta Automática: ATIVA'}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários Suspeitos</TabsTrigger>
          <TabsTrigger value="patterns">Padrões Detectados</TabsTrigger>
          <TabsTrigger value="threats">Ameaças e Respostas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Padrões Comportamentais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis?.pattern_analysis.detected_patterns.map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {getPatternIcon(pattern)}
                      <span className="text-sm font-medium">{pattern}</span>
                    </div>
                    <Badge variant="outline">Detectado</Badge>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">Nenhum padrão suspeito detectado</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendações de Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis?.pattern_analysis.recommendations.map((rec, index) => (
                    <div key={index} className="p-2 bg-blue-50 border-l-2 border-blue-500 rounded">
                      <p className="text-sm text-blue-700">{rec}</p>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">Sistema funcionando normalmente</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuários com Comportamento Suspeito</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis?.suspicious_users.map((user, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{user.user_email}</p>
                        <p className="text-sm text-gray-500">ID: {user.user_id}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getRiskBadgeColor(
                          user.risk_score > 85 ? 'critical' :
                          user.risk_score > 70 ? 'high' :
                          user.risk_score > 50 ? 'medium' : 'low'
                        )}>
                          Risco: {user.risk_score}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Score de Risco:</p>
                      <Progress value={user.risk_score} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Padrões Detectados:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.behavior_patterns.map((pattern, pidx) => (
                          <Badge key={pidx} variant="outline" className="text-xs">
                            {pattern.pattern_type} ({pattern.frequency}x)
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {user.anomaly_indicators.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-red-600">Anomalias:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.anomaly_indicators.map((anomaly, aidx) => (
                            <Badge key={aidx} variant="destructive" className="text-xs">
                              {anomaly}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-8">Nenhum usuário suspeito identificado</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Padrões de Ameaças</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threats?.threat_patterns.map((pattern, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{pattern.pattern_name}</h4>
                      <Badge className={getRiskBadgeColor(
                        pattern.risk_level > 80 ? 'critical' :
                        pattern.risk_level > 60 ? 'high' :
                        pattern.risk_level > 40 ? 'medium' : 'low'
                      )}>
                        Risco: {pattern.risk_level}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Ocorrências:</span>
                        <span className="ml-2 font-medium">{pattern.occurrences}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Última ocorrência:</span>
                        <span className="ml-2 font-medium">
                          {new Date(pattern.last_seen).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-8">Nenhum padrão de ameaça detectado</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Gestão de Ameaças e Respostas</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm">Resposta Automática:</span>
              <Button 
                variant={autoResponse ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoResponse(!autoResponse)}
              >
                {autoResponse ? 'ATIVA' : 'INATIVA'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Ameaças Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {threats?.active_threats.slice(0, 5).map((threat, index) => (
                    <div key={index} className="p-3 border rounded bg-red-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{threat.incident_type}</span>
                        <Badge className={getRiskBadgeColor(threat.severity)}>
                          {threat.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{threat.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(threat.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">Nenhuma ameaça ativa</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Respostas Automáticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {threats?.automated_responses.map((response, index) => (
                    <div key={index} className="p-3 border rounded bg-blue-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{response.response_type}</span>
                        <Badge variant="outline">
                          {response.success_rate.toFixed(0)}% sucesso
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        Execuções: {response.executions}
                      </p>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">Nenhuma resposta automática registrada</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
