
import { logSecureError } from "./security";

interface SecurityEvent {
  event_type: string;
  user_id?: string;
  email?: string;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  error_message?: string;
  risk_level: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
  timestamp: number;
  session_id?: string;
}

interface SecurityMetrics {
  suspiciousActivity: boolean;
  riskScore: number;
  patternFlags: string[];
}

class EnhancedAuditLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 200;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getClientFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.textBaseline = 'top';
    ctx!.font = '14px Arial';
    ctx!.fillText('Security fingerprint', 2, 2);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    return btoa(fingerprint).substr(0, 16);
  }

  private analyzeRiskLevel(eventType: string, success: boolean, metadata?: any): 'low' | 'medium' | 'high' {
    // Análise baseada em padrões
    const recentFailures = this.events
      .filter(e => e.event_type === eventType && !e.success && Date.now() - e.timestamp < 300000)
      .length;

    if (recentFailures >= 3) return 'high';
    if (recentFailures >= 2) return 'medium';
    if (!success) return 'medium';
    
    return 'low';
  }

  private detectSuspiciousPatterns(): SecurityMetrics {
    const recentEvents = this.events.filter(e => Date.now() - e.timestamp < 3600000); // Última hora
    const patternFlags: string[] = [];
    let riskScore = 0;

    // Múltiplas falhas consecutivas
    const consecutiveFailures = recentEvents
      .slice(-10)
      .reduce((count, event) => event.success ? 0 : count + 1, 0);
    
    if (consecutiveFailures >= 5) {
      patternFlags.push('CONSECUTIVE_FAILURES');
      riskScore += 30;
    }

    // Múltiplos IPs
    const uniqueIPs = new Set(recentEvents.map(e => e.ip_address)).size;
    if (uniqueIPs > 3) {
      patternFlags.push('MULTIPLE_IPS');
      riskScore += 20;
    }

    // Velocidade anormal de tentativas
    const attemptsLastMinute = recentEvents
      .filter(e => Date.now() - e.timestamp < 60000).length;
    
    if (attemptsLastMinute > 10) {
      patternFlags.push('HIGH_FREQUENCY');
      riskScore += 25;
    }

    // Horário suspeito (madrugada)
    const hour = new Date().getHours();
    if (hour >= 2 && hour <= 5) {
      patternFlags.push('UNUSUAL_HOURS');
      riskScore += 10;
    }

    return {
      suspiciousActivity: riskScore > 40,
      riskScore,
      patternFlags
    };
  }

  public async logSecurityEvent(
    eventType: string,
    success: boolean,
    options: {
      userId?: string;
      email?: string;
      errorMessage?: string;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<void> {
    try {
      const riskLevel = this.analyzeRiskLevel(eventType, success, options.metadata);
      const fingerprint = this.getClientFingerprint();

      const event: SecurityEvent = {
        event_type: eventType,
        user_id: options.userId,
        email: options.email,
        ip_address: 'client-masked', // Mascarar IP no frontend
        user_agent: navigator.userAgent,
        success,
        error_message: options.errorMessage,
        risk_level: riskLevel,
        metadata: {
          ...options.metadata,
          fingerprint,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          screen_resolution: `${screen.width}x${screen.height}`,
          referrer: document.referrer || 'direct'
        },
        timestamp: Date.now(),
        session_id: this.sessionId
      };

      this.events.push(event);
      
      // Manter apenas os eventos mais recentes
      if (this.events.length > this.maxEvents) {
        this.events = this.events.slice(-this.maxEvents);
      }

      // Detectar padrões suspeitos
      const securityMetrics = this.detectSuspiciousPatterns();
      
      if (securityMetrics.suspiciousActivity) {
        console.warn('🚨 Suspicious security activity detected:', {
          riskScore: securityMetrics.riskScore,
          flags: securityMetrics.patternFlags,
          event: eventType
        });
      }

      // Log estruturado para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        const logLevel = riskLevel === 'high' ? 'error' : riskLevel === 'medium' ? 'warn' : 'info';
        console[logLevel](`🔒 Security Event: ${eventType}`, {
          success,
          riskLevel,
          email: options.email || 'anonymous',
          fingerprint: fingerprint.substr(0, 8),
          metrics: securityMetrics
        });
      }

      // Persistir eventos críticos
      if (riskLevel === 'high' || securityMetrics.suspiciousActivity) {
        this.persistCriticalEvents();
      }

    } catch (error) {
      logSecureError(error, "Enhanced Audit Logger");
    }
  }

  private persistCriticalEvents(): void {
    try {
      const criticalEvents = this.events
        .filter(e => e.risk_level === 'high' || e.timestamp > Date.now() - 86400000)
        .slice(-50); // Manter apenas os 50 mais recentes
        
      localStorage.setItem('security_critical_events', JSON.stringify(criticalEvents));
    } catch (error) {
      logSecureError(error, "Enhanced Audit Logger Persist Critical");
    }
  }

  public getSecurityDashboard(): {
    totalEvents: number;
    riskDistribution: Record<string, number>;
    recentSuspiciousActivity: boolean;
    securityScore: number;
    recommendations: string[];
  } {
    const recentEvents = this.events.filter(e => Date.now() - e.timestamp < 86400000);
    const riskDistribution = recentEvents.reduce((acc, event) => {
      acc[event.risk_level] = (acc[event.risk_level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const metrics = this.detectSuspiciousPatterns();
    const successRate = recentEvents.length > 0 
      ? recentEvents.filter(e => e.success).length / recentEvents.length 
      : 1;

    const securityScore = Math.max(0, 100 - metrics.riskScore - (1 - successRate) * 20);

    const recommendations: string[] = [];
    if (metrics.patternFlags.includes('CONSECUTIVE_FAILURES')) {
      recommendations.push('Considere implementar CAPTCHA após falhas consecutivas');
    }
    if (metrics.patternFlags.includes('HIGH_FREQUENCY')) {
      recommendations.push('Rate limiting mais agressivo pode ser necessário');
    }
    if (securityScore < 70) {
      recommendations.push('Revisar configurações de segurança');
    }

    return {
      totalEvents: this.events.length,
      riskDistribution,
      recentSuspiciousActivity: metrics.suspiciousActivity,
      securityScore,
      recommendations
    };
  }

  public clearEvents(): void {
    this.events = [];
    try {
      localStorage.removeItem('security_critical_events');
    } catch (error) {
      logSecureError(error, "Enhanced Audit Logger Clear");
    }
  }
}

// Instância singleton
export const enhancedAuditLogger = new EnhancedAuditLogger();

// Funções auxiliares melhoradas
export const logEnhancedLoginAttempt = (email: string, success: boolean, errorMessage?: string) => {
  enhancedAuditLogger.logSecurityEvent('login_attempt', success, { email, errorMessage });
};

export const logEnhancedPasswordReset = (email: string, success: boolean, errorMessage?: string) => {
  enhancedAuditLogger.logSecurityEvent('password_reset', success, { email, errorMessage });
};

export const logEnhancedMagicLink = (email: string, success: boolean, errorMessage?: string) => {
  enhancedAuditLogger.logSecurityEvent('magic_link_request', success, { email, errorMessage });
};

export const logEnhancedSuspiciousActivity = (activityType: string, details: Record<string, any>) => {
  enhancedAuditLogger.logSecurityEvent('suspicious_activity', false, { 
    metadata: { activityType, ...details } 
  });
};
