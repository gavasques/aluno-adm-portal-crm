
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Mail, 
  RefreshCw, 
  Download,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ModernUsersHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddUser: () => void;
  onInviteUser: () => void;
  onRefresh: () => void;
  onExport?: () => void;
  totalUsers: number;
  isRefreshing: boolean;
}

export const ModernUsersHeader: React.FC<ModernUsersHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddUser,
  onInviteUser,
  onRefresh,
  onExport,
  totalUsers,
  isRefreshing,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header Principal */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestão de Usuários
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gerencie usuários, permissões e acessos do sistema
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Users className="h-3 w-3 mr-1" />
            {totalUsers} usuários
          </Badge>
        </div>
      </div>

      {/* Barra de Ações */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Busca */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar usuários por nome ou email..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center gap-2">
              {onExport && (
                <Button
                  variant="outline"
                  onClick={onExport}
                  className="flex items-center gap-2 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>

              <Button
                variant="outline"
                onClick={onInviteUser}
                className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              >
                <Mail className="h-4 w-4" />
                Convidar
              </Button>

              <Button
                onClick={onAddUser}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
              >
                <UserPlus className="h-4 w-4" />
                Novo Usuário
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
