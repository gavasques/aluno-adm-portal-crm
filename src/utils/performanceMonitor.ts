interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('page_load_time', navEntry.loadEventEnd - navEntry.navigationStart);
            this.recordMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.navigationStart);
            this.recordMetric('first_paint', navEntry.responseEnd - navEntry.navigationStart);
          }
        });
      });

      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Observe largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric('largest_contentful_paint', entry.startTime);
        });
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // Observe first input delay
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric('first_input_delay', (entry as any).processingStart - entry.startTime);
        });
      });

      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    }
  }

  recordMetric(name: string, value: number) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now()
    });

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance: ${name} = ${value.toFixed(2)}ms`);
    }
  }

  // Custom timing for React components
  startTiming(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      this.recordMetric(name, endTime - startTime);
    };
  }

  // Get performance summary
  getSummary(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const summary: Record<string, { values: number[]; avg: number; min: number; max: number; count: number }> = {};

    this.metrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = { values: [], avg: 0, min: Infinity, max: -Infinity, count: 0 };
      }
      
      summary[metric.name].values.push(metric.value);
      summary[metric.name].min = Math.min(summary[metric.name].min, metric.value);
      summary[metric.name].max = Math.max(summary[metric.name].max, metric.value);
      summary[metric.name].count++;
    });

    // Calculate averages
    Object.keys(summary).forEach(key => {
      const values = summary[key].values;
      summary[key].avg = values.reduce((a, b) => a + b, 0) / values.length;
      delete (summary[key] as any).values; // Remove values array from final summary
    });

    return summary;
  }

  // Clear metrics
  clear() {
    this.metrics = [];
  }

  // Cleanup observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for component performance tracking
export const usePerformanceTracking = (componentName: string) => {
  const startTiming = () => performanceMonitor.startTiming(`component_render_${componentName}`);
  
  return { startTiming };
};

// Utility for measuring async operations
export const measureAsyncOperation = async <T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> => {
  const endTiming = performanceMonitor.startTiming(operationName);
  
  try {
    const result = await operation();
    return result;
  } finally {
    endTiming();
  }
};
