
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SuppliersFilterProps {
  nameFilter: string;
  setNameFilter: (value: string) => void;
  cnpjFilter: string;
  setCnpjFilter: (value: string) => void;
  brandFilter: string;
  setBrandFilter: (value: string) => void;
  contactFilter: string;
  setContactFilter: (value: string) => void;
  clearFilters: () => void;
  onAddSupplier: () => void;
}

export function SuppliersFilter({
  nameFilter,
  setNameFilter,
  cnpjFilter,
  setCnpjFilter,
  brandFilter,
  setBrandFilter,
  contactFilter,
  setContactFilter,
  clearFilters,
  onAddSupplier
}: SuppliersFilterProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Filtrar por Fornecedor..."
            className="pl-10"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <Input
            placeholder="Filtrar por CNPJ..."
            value={cnpjFilter}
            onChange={(e) => setCnpjFilter(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <Input
            placeholder="Filtrar por Marca..."
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <Input
            placeholder="Filtrar por Contato..."
            value={contactFilter}
            onChange={(e) => setContactFilter(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearFilters} size="sm">
            Limpar Filtros
          </Button>
        </div>
        
        <Button onClick={onAddSupplier}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg> Adicionar Fornecedor
        </Button>
      </div>
    </div>
  );
}
