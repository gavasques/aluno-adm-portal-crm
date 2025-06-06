
import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Users, 
  Edit, 
  Trash2, 
  Search, 
  Calendar,
  Settings,
  Eye,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { PermissionGroup } from '@/types/permissions';

interface PermissionGroupCardProps {
  group: PermissionGroup;
  menuCount?: number;
  onDelete: (group: PermissionGroup) => void;
  onViewUsers: (group: PermissionGroup) => void;
}

const PermissionGroupCard = memo<PermissionGroupCardProps>(({ 
  group, 
  menuCount, 
  onDelete, 
  onViewUsers 
}) => {
  const navigate = useNavigate();

  const getGroupTypeIcon = useCallback(() => {
    if (group.is_admin) {
      return <Shield className="h-5 w-5 text-red-500" />;
    }
    if (group.allow_admin_access) {
      return <Settings className="h-5 w-5 text-orange-500" />;
    }
    return <Users className="h-5 w-5 text-blue-500" />;
  }, [group.is_admin, group.allow_admin_access]);

  const getGroupTypeBadge = useCallback(() => {
    if (group.is_admin) {
      return <Badge variant="destructive" className="text-xs">Admin Total</Badge>;
    }
    if (group.allow_admin_access) {
      return <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">Admin Limitado</Badge>;
    }
    return <Badge variant="outline" className="text-xs">Usuário</Badge>;
  }, [group.is_admin, group.allow_admin_access]);

  const handleEdit = useCallback(() => {
    navigate(`/admin/permissoes/editar/${group.id}`);
  }, [navigate, group.id]);

  const handleDelete = useCallback(() => onDelete(group), [onDelete, group]);
  const handleViewUsers = useCallback(() => onViewUsers(group), [onViewUsers, group]);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {getGroupTypeIcon()}
              <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
              {getGroupTypeBadge()}
            </div>
            
            {group.description && (
              <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                {group.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Criado em: {new Date(group.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              {menuCount !== undefined && (
                <div className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  <span>{menuCount} menus permitidos</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewUsers}
              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
            >
              <Eye className="h-4 w-4" />
              <span>Usuários</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 text-red-600 border-red-200"
            >
              <Trash2 className="h-4 w-4" />
              <span>Excluir</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PermissionGroupCard.displayName = 'PermissionGroupCard';

interface OptimizedPermissionsListProps {
  groups: PermissionGroup[];
  filteredGroups: PermissionGroup[];
  menuCounts: Record<string, number>;
  searchTerm: string;
  isSearching: boolean;
  isLoading: boolean;
  onSearchChange: (term: string) => void;
  onClearSearch: () => void;
  onDelete: (group: PermissionGroup) => void;
  onViewUsers: (group: PermissionGroup) => void;
}

const OptimizedPermissionsList = memo<OptimizedPermissionsListProps>(({
  groups,
  filteredGroups,
  menuCounts,
  searchTerm,
  isSearching,
  isLoading,
  onSearchChange,
  onClearSearch,
  onDelete,
  onViewUsers,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Carregando grupos de permissão...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com busca */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Grupos de Permissão
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              {filteredGroups.length} de {groups.length} grupos
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar grupos por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
            )}
            {searchTerm && !isSearching && (
              <button
                onClick={onClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de grupos */}
      <div className="grid gap-4">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              <PermissionGroupCard
                group={group}
                menuCount={menuCounts[group.id]}
                onDelete={onDelete}
                onViewUsers={onViewUsers}
              />
            </motion.div>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum grupo encontrado' : 'Nenhum grupo de permissão'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? `Nenhum grupo corresponde ao termo "${searchTerm}"`
                  : 'Comece criando seu primeiro grupo de permissão'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
});

OptimizedPermissionsList.displayName = 'OptimizedPermissionsList';

export default OptimizedPermissionsList;
