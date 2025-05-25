
import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(performance.now());
  const metricsRef = useRef<PerformanceMetrics[]>([]);

  useEffect(() => {
    // Registrar tempo de render
    const renderTime = performance.now() - renderStartTime.current;
    
    const metric: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now(),
    };

    metricsRef.current.push(metric);

    // Manter apenas os últimos 50 registros
    if (metricsRef.current.length > 50) {
      metricsRef.current = metricsRef.current.slice(-50);
    }

    // Log apenas se render demorou mais que 16ms (60fps)
    if (renderTime > 16) {
      console.warn(`⚠️ Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
    } else {
      console.log(`✅ ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    }

    // Reset para próximo render
    renderStartTime.current = performance.now();
  });

  const getAverageRenderTime = useCallback(() => {
    const componentMetrics = metricsRef.current.filter(m => m.componentName === componentName);
    if (componentMetrics.length === 0) return 0;
    
    const total = componentMetrics.reduce((sum, metric) => sum + metric.renderTime, 0);
    return total / componentMetrics.length;
  }, [componentName]);

  const getSlowRenders = useCallback(() => {
    return metricsRef.current.filter(m => 
      m.componentName === componentName && m.renderTime > 16
    );
  }, [componentName]);

  const getAllMetrics = useCallback(() => {
    return metricsRef.current.filter(m => m.componentName === componentName);
  }, [componentName]);

  return {
    getAverageRenderTime,
    getSlowRenders,
    getAllMetrics,
  };
};
