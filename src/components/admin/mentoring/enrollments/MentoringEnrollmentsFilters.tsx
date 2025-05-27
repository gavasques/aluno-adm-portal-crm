
import React from 'react';

interface MentoringEnrollmentsFiltersProps {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onClearFilters: () => void;
}

export const MentoringEnrollmentsFilters: React.FC<MentoringEnrollmentsFiltersProps> = ({
  searchTerm,
  statusFilter,
  typeFilter,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onClearFilters
}) => {
  const hasFilters = Boolean(searchTerm || statusFilter || typeFilter);

  return (
    <div className="flex items-center gap-4">
      {/* Search input */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Buscar por nome da mentoria ou mentor..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Status filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos os Status</option>
        <option value="ativa">Ativa</option>
        <option value="concluida">Concluída</option>
        <option value="pausada">Pausada</option>
        <option value="cancelada">Cancelada</option>
      </select>

      {/* Type filter */}
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos os Tipos</option>
        <option value="Individual">Individual</option>
        <option value="Grupo">Grupo</option>
      </select>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Limpar Filtros
        </button>
      )}
    </div>
  );
};
