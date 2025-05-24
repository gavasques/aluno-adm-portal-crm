
import { logSecureError } from "./security";

interface EnhancedRateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  lockoutMs: number;
  backoffMultiplier: number;
  maxBackoffMs: number;
  decayRate?: number;
}

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  lockedUntil?: number;
  successfulAttempts: number;
  lastSuccessfulAttempt?: number;
}

export class EnhancedRateLimiter {
  private config: EnhancedRateLimitConfig;
  private storageKey: string;

  constructor(action: string, config: Partial<EnhancedRateLimitConfig> = {}) {
    this.storageKey = `enhanced_rate_limit_${action}`;
    this.config = {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutos
      lockoutMs: 30 * 60 * 1000, // 30 minutos de lockout
      backoffMultiplier: 2,
      maxBackoffMs: 30000, // Max 30 segundos
      decayRate: 0.1, // Taxa de decaimento para tentativas antigas
      ...config
    };
  }

  private getAttemptRecord(): AttemptRecord {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return { 
          count: 0, 
          firstAttempt: Date.now(), 
          lastAttempt: Date.now(),
          successfulAttempts: 0
        };
      }
      return JSON.parse(stored);
    } catch (error) {
      logSecureError(error, "EnhancedRateLimiter getAttemptRecord");
      return { 
        count: 0, 
        firstAttempt: Date.now(), 
        lastAttempt: Date.now(),
        successfulAttempts: 0
      };
    }
  }

  private saveAttemptRecord(record: AttemptRecord): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(record));
    } catch (error) {
      logSecureError(error, "EnhancedRateLimiter saveAttemptRecord");
    }
  }

  private applyDecay(record: AttemptRecord): AttemptRecord {
    const now = Date.now();
    const timeSinceLastAttempt = now - record.lastAttempt;
    
    // Aplicar decaimento se passou tempo suficiente
    if (timeSinceLastAttempt > this.config.windowMs * 0.5) {
      const decayFactor = Math.exp(-this.config.decayRate! * (timeSinceLastAttempt / this.config.windowMs));
      record.count = Math.floor(record.count * decayFactor);
    }
    
    return record;
  }

  public isBlocked(): { 
    blocked: boolean; 
    timeRemaining?: number; 
    attemptsRemaining?: number;
    riskLevel: 'low' | 'medium' | 'high';
  } {
    let record = this.getAttemptRecord();
    const now = Date.now();

    // Aplicar decaimento
    record = this.applyDecay(record);

    // Verificar se está em lockout
    if (record.lockedUntil && now < record.lockedUntil) {
      return {
        blocked: true,
        timeRemaining: Math.ceil((record.lockedUntil - now) / 1000),
        riskLevel: 'high'
      };
    }

    // Limpar registro se a janela expirou
    if (now - record.firstAttempt > this.config.windowMs) {
      this.reset();
      return { 
        blocked: false, 
        attemptsRemaining: this.config.maxAttempts,
        riskLevel: 'low'
      };
    }

    // Determinar nível de risco
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    const remainingAttempts = this.config.maxAttempts - record.count;
    
    if (remainingAttempts <= 1) {
      riskLevel = 'high';
    } else if (remainingAttempts <= 2) {
      riskLevel = 'medium';
    }

    // Verificar se excedeu tentativas
    if (record.count >= this.config.maxAttempts) {
      const lockoutTime = now + this.config.lockoutMs;
      this.saveAttemptRecord({ ...record, lockedUntil: lockoutTime });
      return {
        blocked: true,
        timeRemaining: Math.ceil(this.config.lockoutMs / 1000),
        riskLevel: 'high'
      };
    }

    return {
      blocked: false,
      attemptsRemaining: remainingAttempts,
      riskLevel
    };
  }

  public recordAttempt(success: boolean = false): void {
    const record = this.getAttemptRecord();
    const now = Date.now();

    if (success) {
      // Sucesso - reduzir contadores gradualmente
      this.saveAttemptRecord({
        ...record,
        count: Math.max(0, record.count - 1),
        successfulAttempts: record.successfulAttempts + 1,
        lastSuccessfulAttempt: now
      });
    } else {
      // Falha - incrementar contador
      if (now - record.firstAttempt > this.config.windowMs) {
        // Nova janela
        this.saveAttemptRecord({
          count: 1,
          firstAttempt: now,
          lastAttempt: now,
          successfulAttempts: record.successfulAttempts,
          lastSuccessfulAttempt: record.lastSuccessfulAttempt
        });
      } else {
        // Incrementar contador
        this.saveAttemptRecord({
          ...record,
          count: record.count + 1,
          lastAttempt: now
        });
      }
    }
  }

  public getAdaptiveBackoffDelay(): number {
    const record = this.getAttemptRecord();
    if (record.count === 0) return 0;

    // Delay progressivo baseado no histórico
    const baseDelay = 1000 * Math.pow(this.config.backoffMultiplier, record.count - 1);
    
    // Fator de aleatoriedade para prevenir thundering herd
    const jitter = Math.random() * 0.3 + 0.85; // 85-115% do delay base
    
    return Math.min(baseDelay * jitter, this.config.maxBackoffMs);
  }

  public getSecurityMetrics(): {
    totalAttempts: number;
    successRate: number;
    isRepeatOffender: boolean;
    timeSinceLastSuccess: number;
  } {
    const record = this.getAttemptRecord();
    const now = Date.now();
    
    const totalAttempts = record.count + record.successfulAttempts;
    const successRate = totalAttempts > 0 ? record.successfulAttempts / totalAttempts : 0;
    const isRepeatOffender = record.count > this.config.maxAttempts * 0.8;
    const timeSinceLastSuccess = record.lastSuccessfulAttempt 
      ? now - record.lastSuccessfulAttempt 
      : Infinity;

    return {
      totalAttempts,
      successRate,
      isRepeatOffender,
      timeSinceLastSuccess
    };
  }

  public reset(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      logSecureError(error, "EnhancedRateLimiter reset");
    }
  }
}

// Instâncias melhoradas para diferentes ações
export const enhancedLoginRateLimiter = new EnhancedRateLimiter('login', {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
  lockoutMs: 30 * 60 * 1000,
  backoffMultiplier: 2,
  maxBackoffMs: 30000
});

export const enhancedPasswordResetRateLimiter = new EnhancedRateLimiter('password_reset', {
  maxAttempts: 3,
  windowMs: 10 * 60 * 1000,
  lockoutMs: 60 * 60 * 1000,
  backoffMultiplier: 3,
  maxBackoffMs: 60000
});

export const enhancedMagicLinkRateLimiter = new EnhancedRateLimiter('magic_link', {
  maxAttempts: 3,
  windowMs: 5 * 60 * 1000,
  lockoutMs: 15 * 60 * 1000,
  backoffMultiplier: 2,
  maxBackoffMs: 15000
});
