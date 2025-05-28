
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';

interface BehaviorPattern {
  pattern_type: string;
  risk_score: number;
  frequency: number;
  last_occurrence: string;
  metadata: Record<string, any>;
}

interface UserBehaviorProfile {
  user_id: string;
  user_email: string;
  risk_score: number;
  behavior_patterns: BehaviorPattern[];
  anomaly_indicators: string[];
  last_analysis: string;
}

interface BehaviorAnalysisResult {
  suspicious_users: UserBehaviorProfile[];
  global_risk_level: 'low' | 'medium' | 'high' | 'critical';
  pattern_analysis: {
    detected_patterns: string[];
    risk_indicators: string[];
    recommendations: string[];
  };
  real_time_alerts: {
    active_threats: number;
    escalated_incidents: number;
    automated_responses: number;
  };
}

export const useBehaviorAnalysis = () => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<BehaviorAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(false);

  // Análise de padrões comportamentais
  const analyzeUserBehavior = useCallback(async (targetUserId?: string) => {
    try {
      setLoading(true);

      // Buscar logs dos últimos 7 dias
      const { data: recentLogs, error } = await supabase
        .from('audit_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userBehaviors = analyzePatterns(recentLogs || []);
      const globalRisk = calculateGlobalRisk(userBehaviors);

      const result: BehaviorAnalysisResult = {
        suspicious_users: userBehaviors,
        global_risk_level: globalRisk,
        pattern_analysis: {
          detected_patterns: extractDetectedPatterns(userBehaviors),
          risk_indicators: extractRiskIndicators(userBehaviors),
          recommendations: generateRecommendations(userBehaviors, globalRisk)
        },
        real_time_alerts: {
          active_threats: userBehaviors.filter(u => u.risk_score > 70).length,
          escalated_incidents: userBehaviors.filter(u => u.risk_score > 85).length,
          automated_responses: userBehaviors.filter(u => 
            u.anomaly_indicators.includes('AUTO_BLOCKED')
          ).length
        }
      };

      setAnalysis(result);
      
      // Gerar alertas para casos críticos
      if (globalRisk === 'critical' || result.real_time_alerts.active_threats > 0) {
        await generateSecurityAlert(result);
      }

    } catch (error) {
      console.error('Erro na análise comportamental:', error);
      toast.error('Erro ao analisar comportamento dos usuários');
    } finally {
      setLoading(false);
    }
  }, []);

  // Análise de padrões em logs
  const analyzePatterns = (logs: any[]): UserBehaviorProfile[] => {
    // Verificar se logs é um array válido
    if (!Array.isArray(logs)) {
      console.warn('Logs recebidos não são um array válido:', logs);
      return [];
    }

    const userGroups = logs.reduce((acc, log) => {
      if (!log.user_id) return acc;
      if (!acc[log.user_id]) {
        acc[log.user_id] = [];
      }
      acc[log.user_id].push(log);
      return acc;
    }, {} as Record<string, any[]>);

    return Object.entries(userGroups).map(([userId, userLogs]) => {
      // Garantir que userLogs seja um array
      const safeUserLogs = Array.isArray(userLogs) ? userLogs : [];
      const patterns = detectBehaviorPatterns(safeUserLogs);
      const riskScore = calculateUserRiskScore(patterns, safeUserLogs);
      const anomalies = detectAnomalies(safeUserLogs, patterns);

      return {
        user_id: userId,
        user_email: safeUserLogs[0]?.metadata?.user_email || 'Unknown',
        risk_score: riskScore,
        behavior_patterns: patterns,
        anomaly_indicators: anomalies,
        last_analysis: new Date().toISOString()
      };
    }).filter(profile => profile.risk_score > 30); // Filtrar apenas usuários com risco significativo
  };

  // Detectar padrões específicos
  const detectBehaviorPatterns = (userLogs: any[]): BehaviorPattern[] => {
    // Verificar se userLogs é um array válido
    if (!Array.isArray(userLogs)) {
      console.warn('UserLogs não é um array válido:', userLogs);
      return [];
    }

    const patterns: BehaviorPattern[] = [];

    // Padrão 1: Tentativas de login fora do horário
    const nightLogins = userLogs.filter(log => 
      log.event_type === 'auth_login' && isNightTime(log.created_at)
    );
    if (nightLogins.length > 2) {
      patterns.push({
        pattern_type: 'UNUSUAL_HOURS_LOGIN',
        risk_score: 25,
        frequency: nightLogins.length,
        last_occurrence: nightLogins[0]?.created_at,
        metadata: { total_attempts: nightLogins.length }
      });
    }

    // Padrão 2: Múltiplas falhas consecutivas
    const failedAttempts = userLogs.filter(log => !log.success);
    if (failedAttempts.length > 3) {
      patterns.push({
        pattern_type: 'MULTIPLE_FAILURES',
        risk_score: 30,
        frequency: failedAttempts.length,
        last_occurrence: failedAttempts[0]?.created_at,
        metadata: { failure_rate: failedAttempts.length / userLogs.length }
      });
    }

    // Padrão 3: Acesso a dados sensíveis
    const sensitiveAccess = userLogs.filter(log => 
      log.entity_type && ['profiles', 'permission_groups', 'mentoring_enrollments'].includes(log.entity_type)
    );
    if (sensitiveAccess.length > 10) {
      patterns.push({
        pattern_type: 'HIGH_SENSITIVE_ACCESS',
        risk_score: 40,
        frequency: sensitiveAccess.length,
        last_occurrence: sensitiveAccess[0]?.created_at,
        metadata: { access_types: [...new Set(sensitiveAccess.map(l => l.entity_type))] }
      });
    }

    // Padrão 4: Velocidade anormal de operações
    const rapidOperations = detectRapidOperations(userLogs);
    if (rapidOperations.count > 20) {
      patterns.push({
        pattern_type: 'RAPID_OPERATIONS',
        risk_score: 35,
        frequency: rapidOperations.count,
        last_occurrence: rapidOperations.lastTime,
        metadata: { operations_per_minute: rapidOperations.rate }
      });
    }

    return patterns;
  };

  // Detectar operações muito rápidas
  const detectRapidOperations = (logs: any[]) => {
    if (!Array.isArray(logs) || logs.length < 2) {
      return { count: 0, rate: 0, lastTime: null };
    }

    const sortedLogs = logs.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    let rapidCount = 0;
    let maxRate = 0;

    for (let i = 0; i < sortedLogs.length - 1; i++) {
      const timeDiff = new Date(sortedLogs[i].created_at).getTime() - 
                      new Date(sortedLogs[i + 1].created_at).getTime();
      
      if (timeDiff < 5000) { // Menos de 5 segundos entre operações
        rapidCount++;
        const rate = 60000 / timeDiff; // Operações por minuto
        maxRate = Math.max(maxRate, rate);
      }
    }

    return {
      count: rapidCount,
      rate: maxRate,
      lastTime: sortedLogs[0]?.created_at
    };
  };

  // Verificar se é horário noturno (2-6 AM)
  const isNightTime = (timestamp: string): boolean => {
    const hour = new Date(timestamp).getHours();
    return hour >= 2 && hour <= 6;
  };

  // Calcular score de risco do usuário
  const calculateUserRiskScore = (patterns: BehaviorPattern[], logs: any[]): number => {
    const baseScore = patterns.reduce((acc, pattern) => acc + pattern.risk_score, 0);
    
    // Multiplicadores baseados na atividade
    const activityMultiplier = logs.length > 50 ? 1.2 : 1.0;
    const failureMultiplier = 1 + (logs.filter(l => !l.success).length / logs.length);
    
    return Math.min(Math.round(baseScore * activityMultiplier * failureMultiplier), 100);
  };

  // Detectar anomalias
  const detectAnomalies = (logs: any[], patterns: BehaviorPattern[]): string[] => {
    const anomalies: string[] = [];

    // Anomalia 1: Score de risco muito alto
    const totalRisk = patterns.reduce((acc, p) => acc + p.risk_score, 0);
    if (totalRisk > 80) {
      anomalies.push('HIGH_RISK_SCORE');
    }

    // Anomalia 2: Padrão de bot
    const rapidOps = patterns.find(p => p.pattern_type === 'RAPID_OPERATIONS');
    if (rapidOps && rapidOps.frequency > 30) {
      anomalies.push('BOT_BEHAVIOR');
    }

    // Anomalia 3: Tentativas de acesso não autorizado
    const unauthorizedAttempts = logs.filter(log => 
      log.event_type.includes('unauthorized') || log.risk_level === 'critical'
    );
    if (unauthorizedAttempts.length > 0) {
      anomalies.push('UNAUTHORIZED_ACCESS');
    }

    return anomalies;
  };

  // Calcular risco global do sistema
  const calculateGlobalRisk = (profiles: UserBehaviorProfile[]): 'low' | 'medium' | 'high' | 'critical' => {
    if (profiles.length === 0) return 'low';

    const avgRisk = profiles.reduce((acc, p) => acc + p.risk_score, 0) / profiles.length;
    const criticalUsers = profiles.filter(p => p.risk_score > 85).length;
    const highRiskUsers = profiles.filter(p => p.risk_score > 70).length;

    if (criticalUsers > 0 || avgRisk > 80) return 'critical';
    if (highRiskUsers > 2 || avgRisk > 60) return 'high';
    if (highRiskUsers > 0 || avgRisk > 40) return 'medium';
    return 'low';
  };

  // Extrair padrões detectados
  const extractDetectedPatterns = (profiles: UserBehaviorProfile[]): string[] => {
    const allPatterns = profiles.flatMap(p => p.behavior_patterns.map(bp => bp.pattern_type));
    return [...new Set(allPatterns)];
  };

  // Extrair indicadores de risco
  const extractRiskIndicators = (profiles: UserBehaviorProfile[]): string[] => {
    const indicators: string[] = [];
    
    const highRiskUsers = profiles.filter(p => p.risk_score > 70).length;
    if (highRiskUsers > 0) {
      indicators.push(`${highRiskUsers} usuário(s) com alto risco`);
    }

    const botBehaviors = profiles.filter(p => 
      p.anomaly_indicators.includes('BOT_BEHAVIOR')
    ).length;
    if (botBehaviors > 0) {
      indicators.push(`${botBehaviors} comportamento(s) de bot detectado(s)`);
    }

    return indicators;
  };

  // Gerar recomendações
  const generateRecommendations = (profiles: UserBehaviorProfile[], globalRisk: string): string[] => {
    const recommendations: string[] = [];

    if (globalRisk === 'critical') {
      recommendations.push('Implementar bloqueio temporário para usuários críticos');
      recommendations.push('Ativar monitoramento 24/7');
    }

    const botUsers = profiles.filter(p => p.anomaly_indicators.includes('BOT_BEHAVIOR'));
    if (botUsers.length > 0) {
      recommendations.push('Implementar CAPTCHA para usuários suspeitos');
      recommendations.push('Revisar configurações de rate limiting');
    }

    const nightUsers = profiles.filter(p => 
      p.behavior_patterns.some(bp => bp.pattern_type === 'UNUSUAL_HOURS_LOGIN')
    );
    if (nightUsers.length > 0) {
      recommendations.push('Configurar alertas para logins em horários incomuns');
    }

    return recommendations;
  };

  // Gerar alerta de segurança
  const generateSecurityAlert = async (analysis: BehaviorAnalysisResult) => {
    try {
      // Converter o objeto complexo para um formato compatível com JSON
      const alertMetadata = {
        suspicious_users_count: analysis.suspicious_users.length,
        global_risk_level: analysis.global_risk_level,
        detected_patterns: analysis.pattern_analysis.detected_patterns,
        active_threats: analysis.real_time_alerts.active_threats,
        detection_time: new Date().toISOString(),
        auto_generated: true
      };

      await supabase.from('security_alerts').insert({
        alert_type: 'behavior_analysis',
        severity: analysis.global_risk_level === 'critical' ? 'critical' : 'high',
        title: 'Análise Comportamental: Atividade Suspeita Detectada',
        description: `Sistema detectou ${analysis.suspicious_users.length} usuário(s) com comportamento suspeito. Nível de risco global: ${analysis.global_risk_level}`,
        metadata: alertMetadata
      });
    } catch (error) {
      console.error('Erro ao gerar alerta:', error);
    }
  };

  // Monitoramento em tempo real
  const startRealTimeMonitoring = useCallback(() => {
    setRealTimeMonitoring(true);
    
    const channel = supabase
      .channel('behavior_monitoring')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'audit_logs'
        },
        async (payload) => {
          const newLog = payload.new;
          
          // Análise rápida do log recém-inserido
          if (newLog.risk_level === 'critical' || 
              (newLog.user_id && !newLog.success)) {
            
            console.log('🚨 Atividade suspeita detectada em tempo real:', newLog);
            
            // Executar análise completa se necessário
            await analyzeUserBehavior(newLog.user_id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      setRealTimeMonitoring(false);
    };
  }, [analyzeUserBehavior]);

  // Executar análise inicial
  useEffect(() => {
    analyzeUserBehavior();
  }, [analyzeUserBehavior]);

  return {
    analysis,
    loading,
    realTimeMonitoring,
    analyzeUserBehavior,
    startRealTimeMonitoring
  };
};
