
interface LogContext {
  component?: string;
  operation?: string;
  leadId?: string;
  columnId?: string;
  userId?: string;
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

    // Log no console também
    const logMethod = console[level] || console.log;
    logMethod(`[${level.toUpperCase()}] ${message}`, context);

    // Persistir no localStorage para debug
    this.persistLogs();
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

  exportLogs() {
    const data = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      logs: this.logs
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
  }

  private persistLogs() {
    try {
      const recentLogs = this.logs.slice(-100); // Apenas os últimos 100
      localStorage.setItem('crm_debug_logs', JSON.stringify(recentLogs));
    } catch (error) {
      console.warn('Não foi possível persistir logs:', error);
    }
  }

  private loadPersistedLogs() {
    try {
      const stored = localStorage.getItem('crm_debug_logs');
      if (stored) {
        const logs = JSON.parse(stored);
        this.logs = [...logs, ...this.logs];
      }
    } catch (error) {
      console.warn('Não foi possível carregar logs persistidos:', error);
    }
  }

  constructor() {
    this.loadPersistedLogs();
    
    // Adicionar ao window para debug global
    (window as any).crmDebugLogger = this;
  }
}

export const debugLogger = new DebugLogger();

// Função para debug rápido de movimentação de leads
export const logLeadMovement = (leadId: string, fromColumn: string, toColumn: string, status: 'start' | 'success' | 'error', error?: any) => {
  debugLogger.info(`Lead Movement ${status}`, {
    component: 'LeadMovement',
    operation: 'moveLeadToColumn',
    leadId,
    fromColumn,
    toColumn,
    status,
    ...(error && { error: error.message || error })
  });
};
