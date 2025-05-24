
import { logSecureError } from "./security";

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  lockoutMs: number;
  backoffMultiplier: number;
}

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  lockedUntil?: number;
}

export class RateLimiter {
  private config: RateLimitConfig;
  private storageKey: string;

  constructor(action: string, config: Partial<RateLimitConfig> = {}) {
    this.storageKey = `rate_limit_${action}`;
    this.config = {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutos
      lockoutMs: 30 * 60 * 1000, // 30 minutos de lockout
      backoffMultiplier: 2,
      ...config
    };
  }

  private getAttemptRecord(): AttemptRecord {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return { count: 0, firstAttempt: Date.now(), lastAttempt: Date.now() };
      }
      return JSON.parse(stored);
    } catch (error) {
      logSecureError(error, "RateLimiter getAttemptRecord");
      return { count: 0, firstAttempt: Date.now(), lastAttempt: Date.now() };
    }
  }

  private saveAttemptRecord(record: AttemptRecord): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(record));
    } catch (error) {
      logSecureError(error, "RateLimiter saveAttemptRecord");
    }
  }

  public isBlocked(): { blocked: boolean; timeRemaining?: number; attemptsRemaining?: number } {
    const record = this.getAttemptRecord();
    const now = Date.now();

    // Verificar se está em lockout
    if (record.lockedUntil && now < record.lockedUntil) {
      return {
        blocked: true,
        timeRemaining: Math.ceil((record.lockedUntil - now) / 1000)
      };
    }

    // Limpar registro se a janela expirou
    if (now - record.firstAttempt > this.config.windowMs) {
      this.reset();
      return { blocked: false, attemptsRemaining: this.config.maxAttempts };
    }

    // Verificar se excedeu tentativas
    if (record.count >= this.config.maxAttempts) {
      const lockoutTime = now + this.config.lockoutMs;
      this.saveAttemptRecord({ ...record, lockedUntil: lockoutTime });
      return {
        blocked: true,
        timeRemaining: Math.ceil(this.config.lockoutMs / 1000)
      };
    }

    return {
      blocked: false,
      attemptsRemaining: this.config.maxAttempts - record.count
    };
  }

  public recordAttempt(): void {
    const record = this.getAttemptRecord();
    const now = Date.now();

    // Se a janela expirou, reiniciar contador
    if (now - record.firstAttempt > this.config.windowMs) {
      this.saveAttemptRecord({
        count: 1,
        firstAttempt: now,
        lastAttempt: now
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

  public getBackoffDelay(): number {
    const record = this.getAttemptRecord();
    if (record.count === 0) return 0;

    // Delay progressivo: 1s, 2s, 4s, 8s, 16s...
    return Math.min(
      1000 * Math.pow(this.config.backoffMultiplier, record.count - 1),
      30000 // Max 30 segundos
    );
  }

  public reset(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      logSecureError(error, "RateLimiter reset");
    }
  }

  public getRemainingTime(): number {
    const record = this.getAttemptRecord();
    if (!record.lockedUntil) return 0;
    
    const remaining = record.lockedUntil - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000));
  }
}

// Instâncias pré-configuradas para diferentes ações
export const loginRateLimiter = new RateLimiter('login', {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutos
  lockoutMs: 30 * 60 * 1000 // 30 minutos
});

export const passwordResetRateLimiter = new RateLimiter('password_reset', {
  maxAttempts: 3,
  windowMs: 10 * 60 * 1000, // 10 minutos
  lockoutMs: 60 * 60 * 1000 // 1 hora
});

export const magicLinkRateLimiter = new RateLimiter('magic_link', {
  maxAttempts: 3,
  windowMs: 5 * 60 * 1000, // 5 minutos
  lockoutMs: 15 * 60 * 1000 // 15 minutos
});
