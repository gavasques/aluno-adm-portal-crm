
import { useState, useEffect, useRef } from "react";

interface ConnectionState {
  isOnline: boolean;
  consecutiveErrors: number;
  isCircuitOpen: boolean;
  lastErrorTime: number | null;
  canRetry: boolean;
}

export const useConnectionManager = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isOnline: navigator.onLine,
    consecutiveErrors: 0,
    isCircuitOpen: false,
    lastErrorTime: null,
    canRetry: true
  });

  const circuitBreakerRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_CONSECUTIVE_ERRORS = 5;
  const CIRCUIT_BREAKER_TIMEOUT = 30000; // 30 segundos
  const MIN_RETRY_INTERVAL = 5000; // 5 segundos

  useEffect(() => {
    const handleOnline = () => {
      console.log('Network came back online');
      setConnectionState(prev => ({
        ...prev,
        isOnline: true,
        consecutiveErrors: 0,
        isCircuitOpen: false,
        canRetry: true
      }));
    };

    const handleOffline = () => {
      console.log('Network went offline');
      setConnectionState(prev => ({
        ...prev,
        isOnline: false
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (circuitBreakerRef.current) {
        clearTimeout(circuitBreakerRef.current);
      }
    };
  }, []);

  const recordError = () => {
    const now = Date.now();
    
    setConnectionState(prev => {
      const newConsecutiveErrors = prev.consecutiveErrors + 1;
      const shouldOpenCircuit = newConsecutiveErrors >= MAX_CONSECUTIVE_ERRORS;
      
      console.log(`Recording error #${newConsecutiveErrors}. Circuit open: ${shouldOpenCircuit}`);
      
      if (shouldOpenCircuit && !prev.isCircuitOpen) {
        // Abrir circuit breaker
        if (circuitBreakerRef.current) {
          clearTimeout(circuitBreakerRef.current);
        }
        
        circuitBreakerRef.current = setTimeout(() => {
          console.log('Circuit breaker timeout - allowing retry');
          setConnectionState(prevState => ({
            ...prevState,
            isCircuitOpen: false,
            consecutiveErrors: 0,
            canRetry: true
          }));
        }, CIRCUIT_BREAKER_TIMEOUT);
      }
      
      return {
        ...prev,
        consecutiveErrors: newConsecutiveErrors,
        isCircuitOpen: shouldOpenCircuit,
        lastErrorTime: now,
        canRetry: !shouldOpenCircuit && (now - (prev.lastErrorTime || 0)) > MIN_RETRY_INTERVAL
      };
    });
  };

  const recordSuccess = () => {
    console.log('Recording successful operation - resetting error count');
    setConnectionState(prev => ({
      ...prev,
      consecutiveErrors: 0,
      isCircuitOpen: false,
      canRetry: true,
      lastErrorTime: null
    }));
    
    if (circuitBreakerRef.current) {
      clearTimeout(circuitBreakerRef.current);
      circuitBreakerRef.current = null;
    }
  };

  const canMakeRequest = () => {
    return connectionState.isOnline && 
           !connectionState.isCircuitOpen && 
           connectionState.canRetry;
  };

  return {
    connectionState,
    recordError,
    recordSuccess,
    canMakeRequest,
    isNetworkError: !connectionState.isOnline,
    isCircuitOpen: connectionState.isCircuitOpen,
    consecutiveErrors: connectionState.consecutiveErrors
  };
};
