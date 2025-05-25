
import { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

interface DebouncedSearchOptions {
  delay?: number;
  minLength?: number;
}

export const useDebouncedSearch = (
  initialValue: string = '',
  options: DebouncedSearchOptions = {}
) => {
  const { delay = 300, minLength = 0 } = options;
  
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  // Criar função debounced usando useMemo para evitar recriações
  const debouncedUpdate = useMemo(
    () => debounce((value: string) => {
      setDebouncedSearchTerm(value);
      setIsSearching(false);
    }, delay),
    [delay]
  );

  useEffect(() => {
    // Se o termo é menor que o mínimo, não fazer debounce
    if (searchTerm.length < minLength) {
      setDebouncedSearchTerm('');
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debouncedUpdate(searchTerm);

    // Cleanup
    return () => {
      debouncedUpdate.cancel();
    };
  }, [searchTerm, debouncedUpdate, minLength]);

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setIsSearching(false);
    debouncedUpdate.cancel();
  };

  return {
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    setSearchTerm,
    clearSearch,
  };
};
