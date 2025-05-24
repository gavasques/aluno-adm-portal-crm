
import { useState, useMemo } from 'react';
import { MySupplier } from '@/types/my-suppliers.types';
import { useDebounce } from './useDebounce';

export const useOptimizedFilters = (suppliers: MySupplier[]) => {
  const [nameFilter, setNameFilter] = useState("");
  const [cnpjFilter, setCnpjFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [contactFilter, setContactFilter] = useState("");
  
  // Debounce filter values to reduce re-calculations
  const debouncedNameFilter = useDebounce(nameFilter, 300);
  const debouncedCnpjFilter = useDebounce(cnpjFilter, 300);
  const debouncedBrandFilter = useDebounce(brandFilter, 300);
  const debouncedContactFilter = useDebounce(contactFilter, 300);
  
  // Memoized filtered suppliers to avoid recalculation
  const filteredSuppliers = useMemo(() => {
    if (!debouncedNameFilter && !debouncedCnpjFilter && !debouncedBrandFilter && !debouncedContactFilter) {
      return suppliers;
    }
    
    return suppliers.filter(supplier => {
      const nameMatch = !debouncedNameFilter || 
        supplier.name.toLowerCase().includes(debouncedNameFilter.toLowerCase());
      
      const cnpjMatch = !debouncedCnpjFilter || 
        (supplier.cnpj || "").replace(/\D/g, "").includes(debouncedCnpjFilter.replace(/\D/g, "")) || 
        supplier.branches.some(branch => 
          (branch.cnpj || "").replace(/\D/g, "").includes(debouncedCnpjFilter.replace(/\D/g, "")));
      
      const brandMatch = !debouncedBrandFilter || 
        supplier.brands.some(brand => 
          brand.name.toLowerCase().includes(debouncedBrandFilter.toLowerCase()));
      
      const contactMatch = !debouncedContactFilter || 
        supplier.contacts.some(contact => 
          contact.name.toLowerCase().includes(debouncedContactFilter.toLowerCase()));
      
      return nameMatch && cnpjMatch && brandMatch && contactMatch;
    });
  }, [suppliers, debouncedNameFilter, debouncedCnpjFilter, debouncedBrandFilter, debouncedContactFilter]);
  
  const clearFilters = () => {
    setNameFilter("");
    setCnpjFilter("");
    setBrandFilter("");
    setContactFilter("");
  };
  
  const hasActiveFilters = nameFilter || cnpjFilter || brandFilter || contactFilter;
  
  return {
    nameFilter,
    setNameFilter,
    cnpjFilter,
    setCnpjFilter,
    brandFilter,
    setBrandFilter,
    contactFilter,
    setContactFilter,
    filteredSuppliers,
    clearFilters,
    hasActiveFilters
  };
};
