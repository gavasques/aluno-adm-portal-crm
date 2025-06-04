
interface LogContext {
  component?: string;
  operation?: string;
  leadId?: string;
  columnId?: string;
  userId?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context: LogContext;
  stack?: string;
}

class DebugLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  log(level: 'info' | 'warn' | 'error' | 'debug', message: string, context: LogContext = {}) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      ...(level === 'error' && { stack: new Error().stack })
    };

    this.logs.push(entry);
    
    // Manter apenas os últimos logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log melhorado no console
    const logMethod = console[level] || console.log;
    const emoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      debug: '🔍'
    }[level];
    
    logMethod(`${emoji} [${level.toUpperCase()}] ${message}`, {
      ...context,
      timestamp: entry.timestamp
    });

    // Persistir logs críticos
    if (level === 'error' || level === 'warn') {
      this.persistCriticalLogs();
    }
  }

  info(message: string, context: LogContext = {}) {
    this.log('info', message, context);
  }

  warn(message: string, context: LogContext = {}) {
    this.log('warn', message, context);
  }

  error(message: string, context: LogContext = {}) {
    this.log('error', message, context);
  }

  debug(message: string, context: LogContext = {}) {
    this.log('debug', message, context);
  }

  getLogs(filter?: Partial<LogEntry>) {
    if (!filter) return this.logs;

    return this.logs.filter(log => {
      return Object.entries(filter).every(([key, value]) => {
        if (key === 'context') {
          return Object.entries(value as LogContext).every(([contextKey, contextValue]) => {
            return log.context[contextKey] === contextValue;
          });
        }
        return (log as any)[key] === value;
      });
    });
  }

  getRecentErrors(minutes = 30) {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000).toISOString();
    return this.logs.filter(log => 
      log.level === 'error' && log.timestamp > cutoff
    );
  }

  getLeadMovementLogs(leadId?: string) {
    return this.logs.filter(log => 
      log.message.includes('LEAD_MOVEMENT') || 
      log.message.includes('DRAG_') ||
      (leadId && log.context.leadId === leadId)
    );
  }

  exportLogs() {
    const data = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      logs: this.logs,
      stats: {
        total: this.logs.length,
        errors: this.logs.filter(l => l.level === 'error').length,
        warnings: this.logs.filter(l => l.level === 'warn').length,
        recentErrors: this.getRecentErrors().length
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm-debug-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('crm_debug_logs');
    localStorage.removeItem('crm_critical_logs');
    console.log('🧹 [DEBUG_LOGGER] Logs limpos');
  }

  // Diagnóstico do sistema
  getDiagnostics() {
    const recent = this.logs.slice(-50);
    const errors = recent.filter(l => l.level === 'error');
    const leadMovementLogs = this.getLeadMovementLogs();
    
    return {
      totalLogs: this.logs.length,
      recentLogs: recent.length,
      recentErrors: errors.length,
      leadMovementLogs: leadMovementLogs.length,
      lastError: errors[errors.length - 1] || null,
      systemHealth: errors.length === 0 ? 'healthy' : 'issues',
      recommendations: this.getRecommendations(errors)
    };
  }

  private getRecommendations(errors: LogEntry[]) {
    const recommendations = [];
    
    if (errors.some(e => e.message.includes('conexão'))) {
      recommendations.push('Verificar conexão com Supabase');
    }
    
    if (errors.some(e => e.message.includes('FULL JOIN'))) {
      recommendations.push('Simplificar queries do banco de dados');
    }
    
    if (errors.some(e => e.message.includes('Lead não encontrado'))) {
      recommendations.push('Verificar sincronização de dados');
    }
    
    return recommendations;
  }

  private persistCriticalLogs() {
    try {
      const criticalLogs = this.logs.filter(log => 
        log.level === 'error' || log.level === 'warn'
      ).slice(-20);
      
      localStorage.setItem('crm_critical_logs', JSON.stringify(criticalLogs));
    } catch (error) {
      console.warn('Não foi possível persistir logs críticos:', error);
    }
  }

  constructor() {
    this.loadPersistedLogs();
    
    // Adicionar ao window para debug global
    (window as any).crmDebugLogger = this;
    
    // Log de inicialização
    this.info('Debug Logger inicializado', {
      component: 'DebugLogger',
      logsCarregados: this.logs.length
    });
  }

  private loadPersistedLogs() {
    try {
      const stored = localStorage.getItem('crm_debug_logs');
      const critical = localStorage.getItem('crm_critical_logs');
      
      if (stored) {
        const logs = JSON.parse(stored);
        this.logs = [...logs];
      }
      
      if (critical) {
        const criticalLogs = JSON.parse(critical);
        // Adicionar logs críticos se não estiverem já carregados
        criticalLogs.forEach((criticalLog: LogEntry) => {
          if (!this.logs.some(log => log.timestamp === criticalLog.timestamp)) {
            this.logs.push(criticalLog);
          }
        });
      }
    } catch (error) {
      console.warn('Não foi possível carregar logs persistidos:', error);
    }
  }
}

export const debugLogger = new DebugLogger();

// Função para debug rápido de movimentação de leads
export const logLeadMovement = (
  leadId: string, 
  fromColumn: string, 
  toColumn: string, 
  status: 'start' | 'success' | 'error', 
  error?: any
) => {
  debugLogger.info(`Lead Movement ${status}`, {
    component: 'LeadMovement',
    operation: 'moveLeadToColumn',
    leadId,
    fromColumn,
    toColumn,
    status,
    ...(error && { 
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : error 
    })
  });
};

// Verificação de integridade do sistema
export const checkSystemIntegrity = () => {
  debugLogger.info('🔍 Verificação de integridade do sistema', {
    component: 'SystemCheck',
    diagnostics: debugLogger.getDiagnostics()
  });
};
