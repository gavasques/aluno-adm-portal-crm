
import React, { useMemo } from 'react';
import { VirtualList } from '@/components/ui/virtual-list';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { usePermissionGroups } from '@/hooks/admin/usePermissionGroups';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface OptimizedPermissionsListProps {
  onEdit: (group: any) => void;
  onDelete: (group: any) => void;
  onViewUsers: (group: any) => void;
}

const OptimizedPermissionsList: React.FC<OptimizedPermissionsListProps> = ({
  onEdit,
  onDelete,
  onViewUsers,
}) => {
  const { permissionGroups, isLoading } = usePermissionGroups();
  const {
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    setSearchTerm,
    clearSearch,
  } = useDebouncedSearch('', { delay: 300, minLength: 1 });

  // Filtrar grupos baseado na busca
  const filteredGroups = useMemo(() => {
    if (!debouncedSearchTerm) return permissionGroups;
    
    const term = debouncedSearchTerm.toLowerCase();
    return permissionGroups.filter(group =>
      group.name.toLowerCase().includes(term) ||
      group.description?.toLowerCase().includes(term)
    );
  }, [permissionGroups, debouncedSearchTerm]);

  const renderPermissionGroupItem = (group: any, index: number) => (
    <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{group.name}</h3>
          {group.is_admin && (
            <Badge variant="destructive" className="text-xs">
              Admin Total
            </Badge>
          )}
          {group.allow_admin_access && !group.is_admin && (
            <Badge variant="secondary" className="text-xs">
              Admin Limitado
            </Badge>
          )}
        </div>
        {group.description && (
          <p className="text-sm text-gray-600 mt-1">{group.description}</p>
        )}
        <div className="text-xs text-gray-500 mt-1">
          Criado em: {new Date(group.created_at).toLocaleDateString('pt-BR')}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewUsers(group)}
        >
          Usuários
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(group)}
        >
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(group)}
        >
          Excluir
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Carregando grupos de permissão...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Busca otimizada */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar grupos de permissão..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
        {searchTerm && !isSearching && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Estatísticas */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {debouncedSearchTerm ? (
            <>Encontrados {filteredGroups.length} de {permissionGroups.length} grupos</>
          ) : (
            <>Total de {permissionGroups.length} grupos</>
          )}
        </span>
        {debouncedSearchTerm && (
          <Badge variant="outline">
            Busca: "{debouncedSearchTerm}"
          </Badge>
        )}
      </div>

      {/* Lista virtualizada */}
      {filteredGroups.length > 0 ? (
        <div className="border rounded-lg">
          <VirtualList
            items={filteredGroups}
            itemHeight={100}
            containerHeight={600}
            renderItem={renderPermissionGroupItem}
            overscan={3}
            className="rounded-lg"
          />
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {debouncedSearchTerm ? (
            <>Nenhum grupo encontrado para "{debouncedSearchTerm}"</>
          ) : (
            <>Nenhum grupo de permissão encontrado</>
          )}
        </div>
      )}
    </div>
  );
};

export default OptimizedPermissionsList;
