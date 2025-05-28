
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';

interface SecurityIncident {
  id: string;
  incident_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'resolved';
  user_id?: string;
  user_email?: string;
  description: string;
  auto_response?: string;
  created_at: string;
  metadata: Record<string, any>;
}

interface ThreatIntelligence {
  active_threats: SecurityIncident[];
  threat_patterns: {
    pattern_name: string;
    occurrences: number;
    last_seen: string;
    risk_level: number;
  }[];
  automated_responses: {
    response_type: string;
    executions: number;
    success_rate: number;
  }[];
  system_health: {
    overall_status: 'healthy' | 'warning' | 'critical';
    security_score: number;
    last_assessment: string;
  };
}

export const useRealTimeSecurityMonitor = () => {
  const { user } = useAuth();
  const [threats, setThreats] = useState<ThreatIntelligence | null>(null);
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [monitoring, setMonitoring] = useState(false);
  const [autoResponse, setAutoResponse] = useState(true);

  // Detectar e classificar ameaças
  const detectThreat = useCallback(async (auditLog: any): Promise<SecurityIncident | null> => {
    try {
      // Regras de detecção de ameaças
      const threatRules = [
        {
          name: 'BRUTE_FORCE_ATTACK',
          condition: (log: any) => 
            log.event_type === 'auth_login_failed' && 
            log.metadata?.consecutive_failures > 5,
          severity: 'high' as const,
          autoResponse: 'BLOCK_USER_IP'
        },
        {
          name: 'PRIVILEGE_ESCALATION',
          condition: (log: any) => 
            log.event_type === 'permission_change' && 
            log.new_values?.role === 'Admin',
          severity: 'critical' as const,
          autoResponse: 'ALERT_ADMINS'
        },
        {
          name: 'DATA_EXFILTRATION',
          condition: (log: any) => 
            log.event_type === 'bulk_export' && 
            log.metadata?.record_count > 1000,
          severity: 'critical' as const,
          autoResponse: 'SUSPEND_USER'
        },
        {
          name: 'UNUSUAL_LOCATION',
          condition: (log: any) => 
            log.metadata?.ip_geolocation && 
            log.metadata?.ip_geolocation !== log.metadata?.usual_location,
          severity: 'medium' as const,
          autoResponse: 'REQUIRE_2FA'
        },
        {
          name: 'AFTER_HOURS_ACCESS',
          condition: (log: any) => {
            const hour = new Date(log.created_at).getHours();
            return hour >= 22 || hour <= 6;
          },
          severity: 'medium' as const,
          autoResponse: 'LOG_DETAILED'
        }
      ];

      // Verificar cada regra
      for (const rule of threatRules) {
        if (rule.condition(auditLog)) {
          const incident: SecurityIncident = {
            id: crypto.randomUUID(),
            incident_type: rule.name,
            severity: rule.severity,
            status: 'active',
            user_id: auditLog.user_id,
            user_email: auditLog.metadata?.user_email,
            description: generateThreatDescription(rule.name, auditLog),
            auto_response: rule.autoResponse,
            created_at: new Date().toISOString(),
            metadata: {
              audit_log_id: auditLog.id,
              detection_rule: rule.name,
              original_log: auditLog,
              threat_score: calculateThreatScore(rule, auditLog)
            }
          };

          // Executar resposta automática se habilitada
          if (autoResponse && rule.autoResponse) {
            await executeAutoResponse(rule.autoResponse, incident);
          }

          return incident;
        }
      }

      return null;
    } catch (error) {
      console.error('Erro na detecção de ameaças:', error);
      return null;
    }
  }, [autoResponse]);

  // Gerar descrição da ameaça
  const generateThreatDescription = (threatType: string, log: any): string => {
    const descriptions: Record<string, string> = {
      BRUTE_FORCE_ATTACK: `Tentativa de ataque de força bruta detectada. ${log.metadata?.consecutive_failures} falhas consecutivas de login.`,
      PRIVILEGE_ESCALATION: `Tentativa de escalação de privilégios detectada. Usuário tentou alterar role para Admin.`,
      DATA_EXFILTRATION: `Possível exfiltração de dados. Export em massa de ${log.metadata?.record_count} registros.`,
      UNUSUAL_LOCATION: `Acesso de localização incomum detectado. IP: ${log.ip_address}`,
      AFTER_HOURS_ACCESS: `Acesso fora do horário comercial detectado às ${new Date(log.created_at).toLocaleTimeString()}.`
    };

    return descriptions[threatType] || `Ameaça ${threatType} detectada.`;
  };

  // Calcular pontuação da ameaça
  const calculateThreatScore = (rule: any, log: any): number => {
    let score = 0;

    // Pontuação base por severidade
    const severityScores = { low: 20, medium: 50, high: 75, critical: 95 };
    score += severityScores[rule.severity];

    // Modificadores baseados no contexto
    if (log.user_id && log.metadata?.is_admin) score += 15;
    if (!log.success) score += 10;
    if (log.risk_level === 'critical') score += 20;

    return Math.min(score, 100);
  };

  // Executar resposta automática
  const executeAutoResponse = async (responseType: string, incident: SecurityIncident) => {
    try {
      console.log(`🤖 Executando resposta automática: ${responseType}`);

      switch (responseType) {
        case 'BLOCK_USER_IP':
          // Simular bloqueio de IP
          await logAutoResponse(incident, 'IP bloqueado temporariamente');
          break;

        case 'ALERT_ADMINS':
          // Enviar alerta para admins
          await createSecurityAlert(incident);
          await logAutoResponse(incident, 'Administradores alertados');
          break;

        case 'SUSPEND_USER':
          // Simular suspensão de usuário
          await logAutoResponse(incident, 'Usuário suspenso temporariamente');
          break;

        case 'REQUIRE_2FA':
          // Simular requisição de 2FA
          await logAutoResponse(incident, '2FA obrigatório ativado');
          break;

        case 'LOG_DETAILED':
          // Log detalhado
          await logAutoResponse(incident, 'Log detalhado capturado');
          break;

        default:
          console.log('Tipo de resposta não reconhecido:', responseType);
      }
    } catch (error) {
      console.error('Erro na resposta automática:', error);
    }
  };

  // Registrar resposta automática
  const logAutoResponse = async (incident: SecurityIncident, action: string) => {
    try {
      await supabase.from('audit_logs').insert({
        event_type: 'automated_security_response',
        event_category: 'security',
        action: 'auto_response',
        description: `Resposta automática executada: ${action}`,
        entity_type: 'security_incident',
        entity_id: incident.id,
        risk_level: incident.severity === 'critical' ? 'critical' : 'high',
        success: true,
        metadata: {
          incident_id: incident.id,
          response_action: action,
          automated: true
        }
      });
    } catch (error) {
      console.error('Erro ao registrar resposta automática:', error);
    }
  };

  // Criar alerta de segurança
  const createSecurityAlert = async (incident: SecurityIncident) => {
    try {
      await supabase.from('security_alerts').insert({
        alert_type: incident.incident_type,
        severity: incident.severity,
        title: `Incidente de Segurança: ${incident.incident_type}`,
        description: incident.description,
        user_id: incident.user_id,
        metadata: {
          incident_id: incident.id,
          auto_generated: true,
          threat_score: incident.metadata.threat_score
        }
      });
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
    }
  };

  // Analisar inteligência de ameaças
  const analyzeThreatIntelligence = useCallback(async () => {
    try {
      // Buscar incidentes recentes
      const recentIncidents = incidents.filter(incident => 
        new Date(incident.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      );

      // Analisar padrões
      const patterns = analyzePatterns(recentIncidents);
      
      // Calcular score de segurança
      const securityScore = calculateSecurityScore(recentIncidents);

      const intelligence: ThreatIntelligence = {
        active_threats: incidents.filter(i => i.status === 'active'),
        threat_patterns: patterns,
        automated_responses: analyzeAutomatedResponses(recentIncidents),
        system_health: {
          overall_status: securityScore > 80 ? 'healthy' : 
                         securityScore > 60 ? 'warning' : 'critical',
          security_score: securityScore,
          last_assessment: new Date().toISOString()
        }
      };

      setThreats(intelligence);
    } catch (error) {
      console.error('Erro na análise de inteligência:', error);
    }
  }, [incidents]);

  // Analisar padrões de ameaças
  const analyzePatterns = (incidents: SecurityIncident[]) => {
    const patternCounts = incidents.reduce((acc, incident) => {
      acc[incident.incident_type] = (acc[incident.incident_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(patternCounts).map(([pattern, count]) => ({
      pattern_name: pattern,
      occurrences: count,
      last_seen: incidents
        .filter(i => i.incident_type === pattern)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
        ?.created_at || '',
      risk_level: calculatePatternRisk(pattern, count)
    }));
  };

  // Calcular risco do padrão
  const calculatePatternRisk = (pattern: string, occurrences: number): number => {
    const baseRisk = occurrences * 10;
    const patternMultipliers: Record<string, number> = {
      BRUTE_FORCE_ATTACK: 2.0,
      PRIVILEGE_ESCALATION: 3.0,
      DATA_EXFILTRATION: 2.5,
      UNUSUAL_LOCATION: 1.5,
      AFTER_HOURS_ACCESS: 1.2
    };

    return Math.min(baseRisk * (patternMultipliers[pattern] || 1), 100);
  };

  // Analisar respostas automáticas
  const analyzeAutomatedResponses = (incidents: SecurityIncident[]) => {
    const responses = incidents
      .filter(i => i.auto_response)
      .reduce((acc, incident) => {
        const response = incident.auto_response!;
        if (!acc[response]) {
          acc[response] = { executions: 0, successes: 0 };
        }
        acc[response].executions++;
        if (incident.status === 'resolved') {
          acc[response].successes++;
        }
        return acc;
      }, {} as Record<string, { executions: number; successes: number }>);

    return Object.entries(responses).map(([response, stats]) => ({
      response_type: response,
      executions: stats.executions,
      success_rate: stats.executions > 0 ? (stats.successes / stats.executions) * 100 : 0
    }));
  };

  // Calcular score de segurança
  const calculateSecurityScore = (recentIncidents: SecurityIncident[]): number => {
    const baseScore = 100;
    const criticalPenalty = recentIncidents.filter(i => i.severity === 'critical').length * 20;
    const highPenalty = recentIncidents.filter(i => i.severity === 'high').length * 10;
    const mediumPenalty = recentIncidents.filter(i => i.severity === 'medium').length * 5;

    return Math.max(baseScore - criticalPenalty - highPenalty - mediumPenalty, 0);
  };

  // Iniciar monitoramento em tempo real
  const startMonitoring = useCallback(() => {
    setMonitoring(true);

    const channel = supabase
      .channel('security_monitoring')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'audit_logs'
        },
        async (payload) => {
          const newLog = payload.new;
          
          // Detectar ameaças no log recém-inserido
          const threat = await detectThreat(newLog);
          
          if (threat) {
            console.log('🚨 Nova ameaça detectada:', threat);
            setIncidents(prev => [threat, ...prev]);
            
            // Mostrar notificação para ameaças críticas
            if (threat.severity === 'critical' || threat.severity === 'high') {
              toast.error(`Ameaça de Segurança: ${threat.incident_type}`, {
                duration: 10000,
                description: threat.description
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      setMonitoring(false);
    };
  }, [detectThreat]);

  // Executar análise inicial
  useEffect(() => {
    analyzeThreatIntelligence();
  }, [analyzeThreatIntelligence]);

  return {
    threats,
    incidents,
    monitoring,
    autoResponse,
    setAutoResponse,
    startMonitoring,
    detectThreat,
    analyzeThreatIntelligence
  };
};
