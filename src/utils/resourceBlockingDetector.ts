
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

    // Verificar se há erros de rede no console
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
    // Verificar se há indicadores de bloqueio
    return window.location.href.includes('lovable') || 
           document.querySelector('script[src*="ingest"]') === null;
  }

  static createFallbackMode(): void {
    // Definir modo de fallback global
    (window as any).__FALLBACK_MODE__ = true;
    
    // Desabilitar analytics problemáticos
    (window as any).__DISABLE_ANALYTICS__ = true;
    
    console.log('🛡️ Modo fallback ativado - recursos externos desabilitados');
  }

  static isFallbackMode(): boolean {
    return !!(window as any).__FALLBACK_MODE__;
  }
}
