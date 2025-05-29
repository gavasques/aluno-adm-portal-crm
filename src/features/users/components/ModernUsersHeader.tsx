
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Users, Filter, Download, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ModernUsersHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddUser: () => void;
  onInviteUser: () => void;
  onRefresh?: () => void;
  totalUsers: number;
  isRefreshing?: boolean;
}

export const ModernUsersHeader: React.FC<ModernUsersHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddUser,
  onInviteUser,
  onRefresh,
  totalUsers,
  isRefreshing = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header com título e estatísticas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Users className="h-6 w-6" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Gestão de Usuários
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {totalUsers} {totalUsers === 1 ? 'usuário cadastrado' : 'usuários cadastrados'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onRefresh && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="backdrop-blur-sm bg-white/70 border-white/20 hover:bg-white/90"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </motion.div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="backdrop-blur-sm bg-white/70 border-white/20 hover:bg-white/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="backdrop-blur-xl bg-white/90 border-white/20">
              <DropdownMenuItem>
                <span>Exportar como CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Exportar como Excel</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Barra de ações */}
      <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-white/20 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 backdrop-blur-sm bg-white/50 border-white/20 focus:bg-white/70 transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="backdrop-blur-sm bg-white/70 border-white/20 hover:bg-white/90"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onInviteUser}
                  className="backdrop-blur-sm bg-white/70 border-white/20 hover:bg-white/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Convidar
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  onClick={onAddUser}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
