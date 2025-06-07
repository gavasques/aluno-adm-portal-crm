
// Performance monitoring utilities for development
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure component render time
  startRender(componentName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.metrics.has(componentName)) {
        this.metrics.set(componentName, []);
      }
      
      this.metrics.get(componentName)!.push(duration);
      
      // Log slow renders in development
      if (process.env.NODE_ENV === 'development' && duration > 16) {
        console.warn(`Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`);
      }
    };
  }

  // Get performance report
  getReport(): Record<string, { avg: number; max: number; count: number }> {
    const report: Record<string, { avg: number; max: number; count: number }> = {};
    
    this.metrics.forEach((times, component) => {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const max = Math.max(...times);
      
      report[component] = {
        avg: Number(avg.toFixed(2)),
        max: Number(max.toFixed(2)),
        count: times.length
      };
    });
    
    return report;
  }

  // Clear metrics
  clear(): void {
    this.metrics.clear();
  }
}

// Hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    startRender: () => monitor.startRender(componentName),
    getReport: () => monitor.getReport(),
    clear: () => monitor.clear()
  };
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('=== Bundle Analysis ===');
    console.log('Total scripts:', document.scripts.length);
    
    Array.from(document.scripts).forEach((script, index) => {
      if (script.src) {
        console.log(`Script ${index + 1}: ${script.src}`);
      }
    });
  }
};
