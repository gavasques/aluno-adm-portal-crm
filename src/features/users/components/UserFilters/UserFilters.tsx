
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Ban, 
  Shield,
  UserPlus,
  Mail,
  RefreshCw,
  Download
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  mentorFilter: string;
  onMentorFilterChange: (value: string) => void;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  pendingUsers: number;
  bannedUsers?: number;
  onAddUser?: () => void;
  onInviteUser?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  isRefreshing?: boolean;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  mentorFilter,
  onMentorFilterChange,
  totalUsers,
  activeUsers,
  inactiveUsers,
  pendingUsers,
  bannedUsers = 0,
  onAddUser,
  onInviteUser,
  onRefresh,
  onExport,
  isRefreshing = false
}) => {
  const clearFilters = () => {
    onSearchChange('');
    onStatusFilterChange('all');
    onRoleFilterChange('all');
    onMentorFilterChange('all');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || roleFilter !== 'all' || mentorFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Inativos</p>
                <p className="text-2xl font-bold text-red-600">{inactiveUsers}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{pendingUsers}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Banidos</p>
                <p className="text-2xl font-bold text-purple-600">{bannedUsers}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Ban className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions Section */}
      <Card className="shadow-sm border-0 bg-gradient-to-r from-gray-50 to-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Filter className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Filtros e Ações</h3>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-auto">
                Filtros ativos
              </Badge>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Search Bar and Action Buttons */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Action Buttons */}
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
                
                {onRefresh && (
                  <Button
                    variant="outline"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 hover:bg-gray-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                )}

                {onInviteUser && (
                  <Button
                    variant="outline"
                    onClick={onInviteUser}
                    className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                  >
                    <Mail className="h-4 w-4" />
                    Convidar
                  </Button>
                )}

                {onAddUser && (
                  <Button
                    onClick={onAddUser}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
                  >
                    <UserPlus className="h-4 w-4" />
                    Novo Usuário
                  </Button>
                )}
              </div>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-gray-500" />
                  Status
                </label>
                <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="ativo">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        Ativo
                      </div>
                    </SelectItem>
                    <SelectItem value="inativo">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        Inativo
                      </div>
                    </SelectItem>
                    <SelectItem value="pendente">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                        Pendente
                      </div>
                    </SelectItem>
                    <SelectItem value="banido">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        Banido
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Role Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-500" />
                  Tipo
                </label>
                <Select value={roleFilter} onValueChange={onRoleFilterChange}>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3 text-red-500" />
                        Administrador
                      </div>
                    </SelectItem>
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-blue-500" />
                        Estudante
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mentor Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-gray-500" />
                  Mentor
                </label>
                <Select value={mentorFilter} onValueChange={onMentorFilterChange}>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="mentor">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        Apenas Mentores
                      </div>
                    </SelectItem>
                    <SelectItem value="notMentor">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Não Mentores
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-transparent">.</label>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="h-12 w-full border-gray-200 hover:border-red-300 hover:text-red-600 transition-colors"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
