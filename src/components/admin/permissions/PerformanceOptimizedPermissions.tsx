
import React, { useState } from 'react';
import { usePermissionGroups, PermissionGroup } from '@/hooks/admin/usePermissionGroups';
import { useMenuCounts } from '@/hooks/admin/useMenuCounts';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
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
  Loader2,
  Calendar,
  Settings,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PerformanceOptimizedPermissionsProps {
  onEdit: (group: PermissionGroup) => void;
  onDelete: (group: PermissionGroup) => void;
  onViewUsers: (group: PermissionGroup) => void;
}

const PerformanceOptimizedPermissions: React.FC<PerformanceOptimizedPermissionsProps> = ({
  onEdit,
  onDelete,
  onViewUsers,
}) => {
  usePerformanceMonitor('PerformanceOptimizedPermissions');
  
  const { permissionGroups, isLoading } = usePermissionGroups();
  const groupIds = permissionGroups.map(g => g.id);
  const { menuCounts } = useMenuCounts(groupIds);
  
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar grupos baseado na busca
  const filteredGroups = permissionGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGroupTypeIcon = (group: PermissionGroup) => {
    if (group.is_admin) {
      return <Shield className="h-5 w-5 text-red-500" />;
    }
    if (group.allow_admin_access) {
      return <Settings className="h-5 w-5 text-orange-500" />;
    }
    return <Users className="h-5 w-5 text-blue-500" />;
  };

  const getGroupTypeBadge = (group: PermissionGroup) => {
    if (group.is_admin) {
      return <Badge variant="destructive" className="text-xs">Admin Total</Badge>;
    }
    if (group.allow_admin_access) {
      return <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">Admin Limitado</Badge>;
    }
    return <Badge variant="outline" className="text-xs">Usuário</Badge>;
  };

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
      {/* Cabeçalho com busca e estatísticas */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Grupos de Permissão
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              {filteredGroups.length} de {permissionGroups.length} grupos
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar grupos por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de grupos */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      {/* Informações do grupo */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getGroupTypeIcon(group)}
                          <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                          {getGroupTypeBadge(group)}
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
                          {menuCounts[group.id] && (
                            <div className="flex items-center gap-1">
                              <Settings className="h-4 w-4" />
                              <span>{menuCounts[group.id]} menus permitidos</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Ações */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewUsers(group)}
                          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Usuários</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(group)}
                          className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Editar</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(group)}
                          className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 text-red-600 border-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Excluir</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Card>
                <CardContent className="p-12">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PerformanceOptimizedPermissions;
