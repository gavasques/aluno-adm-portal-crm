
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
    'ingest', 'analytics', 'tracking', 'ads', 'metrics'
  ];

  static detectBlocking(): BlockingDetectionResult {
    const blockedResources: string[] = [];
    const suggestions: string[] = [];

    // Verificar se há erros de rede no console de forma mais conservadora
    const hasNetworkErrors = this.hasRecentNetworkErrors();
    
    if (hasNetworkErrors) {
      suggestions.push('Desative temporariamente extensões de bloqueio (AdBlock, uBlock Origin)');
      suggestions.push('Tente usar modo incógnito');
      suggestions.push('Adicione este site à lista de exceções das extensões');
    }

    return {
      isBlocked: hasNetworkErrors,
      blockedResources,
      suggestions
    };
  }

  private static hasRecentNetworkErrors(): boolean {
    // Verificação mais conservadora - apenas detecta se realmente há bloqueio
    try {
      // Verificar se algum recurso crítico foi bloqueado
      const scripts = document.querySelectorAll('script[src]');
      const hasBlockedScripts = Array.from(scripts).some(script => {
        const src = (script as HTMLScriptElement).src;
        return this.blockedPatterns.some(pattern => src.includes(pattern));
      });
      
      // Só retorna true se realmente detectar bloqueio específico
      return hasBlockedScripts && window.location.href.includes('lovable');
    } catch (error) {
      // Em caso de erro na detecção, não assumir bloqueio
      return false;
    }
  }

  static createFallbackMode(): void {
    // Definir modo de fallback global apenas se necessário
    if (!this.isFallbackMode()) {
      (window as any).__FALLBACK_MODE__ = true;
      console.log('🛡️ Modo fallback ativado - recursos externos desabilitados');
    }
  }

  static isFallbackMode(): boolean {
    return !!(window as any).__FALLBACK_MODE__;
  }
}
