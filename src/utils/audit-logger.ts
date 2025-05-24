
import { logSecureError } from "./security";

interface AuditEvent {
  event_type: string;
  user_id?: string;
  email?: string;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  error_message?: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

interface ClientInfo {
  userAgent: string;
  language: string;
  platform: string;
  timezone: string;
}

class AuditLogger {
  private events: AuditEvent[] = [];
  private maxEvents = 100;

  private getClientInfo(): ClientInfo {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  private getIPAddress(): Promise<string> {
    // Em produção, isso seria obtido do servidor
    // Para desenvolvimento, usamos um placeholder
    return Promise.resolve('client-ip-hidden');
  }

  public async logEvent(
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
      const clientInfo = this.getClientInfo();
      const ipAddress = await this.getIPAddress();

      const event: AuditEvent = {
        event_type: eventType,
        user_id: options.userId,
        email: options.email,
        ip_address: ipAddress,
        user_agent: clientInfo.userAgent,
        success,
        error_message: options.errorMessage,
        metadata: {
          ...options.metadata,
          client_info: clientInfo
        },
        timestamp: Date.now()
      };

      // Armazenar evento localmente
      this.events.push(event);
      
      // Manter apenas os últimos eventos
      if (this.events.length > this.maxEvents) {
        this.events = this.events.slice(-this.maxEvents);
      }

      // Log estruturado para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.group(`🔍 Audit Log: ${eventType}`);
        console.log('Success:', success);
        console.log('User:', options.email || options.userId || 'anonymous');
        if (options.errorMessage) {
          console.error('Error:', options.errorMessage);
        }
        if (options.metadata) {
          console.log('Metadata:', options.metadata);
        }
        console.groupEnd();
      }

      // Em produção, isso seria enviado para um serviço de auditoria
      // Por enquanto, apenas armazenamos localmente
      this.persistEvents();

    } catch (error) {
      logSecureError(error, "Audit Logger");
    }
  }

  private persistEvents(): void {
    try {
      const recentEvents = this.events.slice(-20); // Manter apenas os 20 mais recentes
      localStorage.setItem('audit_events', JSON.stringify(recentEvents));
    } catch (error) {
      logSecureError(error, "Audit Logger Persist");
    }
  }

  public getRecentEvents(limit = 20): AuditEvent[] {
    return this.events.slice(-limit);
  }

  public getEventsByType(eventType: string, limit = 10): AuditEvent[] {
    return this.events
      .filter(event => event.event_type === eventType)
      .slice(-limit);
  }

  public getFailedAttempts(email?: string, eventType?: string): AuditEvent[] {
    return this.events.filter(event => {
      const matchesEmail = !email || event.email === email;
      const matchesType = !eventType || event.event_type === eventType;
      const isFailed = !event.success;
      return matchesEmail && matchesType && isFailed;
    });
  }

  public clearEvents(): void {
    this.events = [];
    try {
      localStorage.removeItem('audit_events');
    } catch (error) {
      logSecureError(error, "Audit Logger Clear");
    }
  }
}

// Instância singleton
export const auditLogger = new AuditLogger();

// Funções auxiliares para eventos comuns
export const logLoginAttempt = (email: string, success: boolean, errorMessage?: string) => {
  auditLogger.logEvent('login_attempt', success, { email, errorMessage });
};

export const logPasswordReset = (email: string, success: boolean, errorMessage?: string) => {
  auditLogger.logEvent('password_reset', success, { email, errorMessage });
};

export const logMagicLink = (email: string, success: boolean, errorMessage?: string) => {
  auditLogger.logEvent('magic_link_request', success, { email, errorMessage });
};

export const logUserCreation = (email: string, success: boolean, createdBy?: string, errorMessage?: string) => {
  auditLogger.logEvent('user_creation', success, { 
    email, 
    errorMessage,
    metadata: { created_by: createdBy }
  });
};

export const logPermissionChange = (targetEmail: string, action: string, success: boolean, adminEmail?: string) => {
  auditLogger.logEvent('permission_change', success, {
    email: targetEmail,
    metadata: { 
      action,
      admin_email: adminEmail
    }
  });
};
