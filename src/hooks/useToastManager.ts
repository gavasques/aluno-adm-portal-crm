
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface ToastCache {
  message: string;
  timestamp: number;
  type: string;
}

const DUPLICATE_THRESHOLD = 2000; // 2 segundos
const MAX_TOASTS = 3; // Máximo de toasts simultâneos

export const useToastManager = () => {
  const [activeToasts, setActiveToasts] = useState<string[]>([]);
  const toastCache = useRef<ToastCache[]>([]);
  const pendingToasts = useRef<Set<string>>(new Set());

  const isDuplicate = useCallback((message: string, type: string) => {
    const now = Date.now();
    const recentToast = toastCache.current.find(
      item => 
        item.message === message && 
        item.type === type && 
        now - item.timestamp < DUPLICATE_THRESHOLD
    );
    return !!recentToast;
  }, []);

  const addToCache = useCallback((message: string, type: string) => {
    const now = Date.now();
    toastCache.current.push({ message, type, timestamp: now });
    
    // Limpar cache antigo
    toastCache.current = toastCache.current.filter(
      item => now - item.timestamp < DUPLICATE_THRESHOLD * 2
    );
  }, []);

  const showToast = useCallback((
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    description?: string
  ) => {
    // Verificar se é duplicado
    if (isDuplicate(message, type)) {
      console.log('🚫 Toast duplicado bloqueado:', message);
      return null;
    }

    // Verificar se já está pendente
    const toastKey = `${type}-${message}`;
    if (pendingToasts.current.has(toastKey)) {
      return null;
    }

    // Verificar limite de toasts
    if (activeToasts.length >= MAX_TOASTS) {
      console.log('🚫 Limite de toasts atingido');
      return null;
    }

    // Marcar como pendente
    pendingToasts.current.add(toastKey);

    // Adicionar ao cache
    addToCache(message, type);

    // Mostrar toast
    const toastId = toast[type](message, {
      description,
      onDismiss: () => {
        setActiveToasts(prev => prev.filter(id => id !== toastId));
        pendingToasts.current.delete(toastKey);
      },
      onAutoClose: () => {
        setActiveToasts(prev => prev.filter(id => id !== toastId));
        pendingToasts.current.delete(toastKey);
      }
    });

    if (toastId) {
      setActiveToasts(prev => [...prev, toastId]);
    }

    // Remover do pendente após um tempo
    setTimeout(() => {
      pendingToasts.current.delete(toastKey);
    }, 1000);

    return toastId;
  }, [isDuplicate, addToCache, activeToasts.length]);

  const success = useCallback((message: string, description?: string) => 
    showToast(message, 'success', description), [showToast]);

  const error = useCallback((message: string, description?: string) => 
    showToast(message, 'error', description), [showToast]);

  const info = useCallback((message: string, description?: string) => 
    showToast(message, 'info', description), [showToast]);

  const warning = useCallback((message: string, description?: string) => 
    showToast(message, 'warning', description), [showToast]);

  const clearAll = useCallback(() => {
    toast.dismiss();
    setActiveToasts([]);
    pendingToasts.current.clear();
  }, []);

  return {
    success,
    error,
    info,
    warning,
    clearAll,
    activeCount: activeToasts.length
  };
};
