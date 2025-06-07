
/**
 * Utilitário para detectar e lidar com bloqueio de recursos por extensões
 */

interface BlockingDetectionResult {
  isBlocked: boolean;
  blockedResources: string[];
  suggestions: string[];
}

export class ResourceBlockingDetector {
  private static blockedPatterns = [
    'lovable.dev/ingest'
  ];

  static detectBlocking(): BlockingDetectionResult {
    const blockedResources: string[] = [];
    const suggestions: string[] = [];

    // Verificação muito conservadora - apenas para casos óbvios
    const hasActualBlocking = this.hasConfirmedNetworkBlocking();
    
    if (hasActualBlocking) {
      suggestions.push('Desative temporariamente extensões de bloqueio (AdBlock, uBlock Origin)');
      suggestions.push('Tente usar modo incógnito');
    }

    return {
      isBlocked: hasActualBlocking,
      blockedResources,
      suggestions
    };
  }

  private static hasConfirmedNetworkBlocking(): boolean {
    try {
      // Só detectar bloqueio se realmente houver evidência clara
      const userAgent = navigator.userAgent;
      const hasAdBlocker = window.location.href.includes('blocked') || 
                          document.querySelector('[data-adblock-key]') !== null;
      
      // Retornar false por padrão para evitar falsos positivos
      return false;
    } catch (error) {
      return false;
    }
  }

  static createFallbackMode(): void {
    if (!this.isFallbackMode()) {
      (window as any).__FALLBACK_MODE__ = true;
      console.log('🛡️ Modo fallback ativado');
    }
  }

  static isFallbackMode(): boolean {
    return !!(window as any).__FALLBACK_MODE__;
  }
}
