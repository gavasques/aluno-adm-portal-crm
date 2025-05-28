
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, GraduationCap, BookOpen, UserPlus, Users, UserCheck } from 'lucide-react';
import { usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { useUserOperations } from '@/hooks/users/useUserOperations';
import UsersList from '@/components/admin/users/UsersList';
import UserActionButtons from '@/components/admin/users/UserActionButtons';
import UserOperationDialogs from './UserOperationDialogs';

const UnifiedUserPage = () => {
  const { 
    filteredUsers, 
    stats, 
    filters, 
    setFilters, 
    isLoading, 
    error 
  } = usePerformanceOptimizedUserContext();
  
  const userOperations = useUserOperations();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setFilters({ search: query });
  };

  const handleRoleFilter = (role: string) => {
    setFilters({ role });
  };

  const handleStatusFilter = (status: string) => {
    setFilters({ status: status as any });
  };

  const isStudentView = filters.role === 'student';

  // Calculate student stats from the current filtered users
  const studentStats = React.useMemo(() => {
    const students = filteredUsers.filter(user => user.role === 'student');
    return {
      total: students.length,
      active: students.filter(user => user.status === 'ativo').length,
      mentors: students.filter(user => user.is_mentor).length,
      newThisMonth: students.filter(user => {
        if (!user.created_at) return false;
        const createdDate = new Date(user.created_at);
        const now = new Date();
        return createdDate.getMonth() === now.getMonth() && 
               createdDate.getFullYear() === now.getFullYear();
      }).length
    };
  }, [filteredUsers]);

  const getStatsCards = () => {
    if (isStudentView && studentStats) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Total de Estudantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentStats.total}</div>
              <p className="text-xs text-muted-foreground">
                Cadastrados no sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2" />
                Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentStats.active}</div>
              <p className="text-xs text-muted-foreground">
                Com status ativo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Mentores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentStats.mentors}</div>
              <p className="text-xs text-muted-foreground">
                Estudantes que são mentores
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Novos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentStats.newThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Total de usuários
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2" />
              Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Usuários ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Inativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              Usuários inativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando validação
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie usuários, estudantes e permissões do sistema
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600">Erro ao carregar usuários: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isStudentView ? 'Gestão de Estudantes' : 'Gestão de Usuários'}
          </h1>
          <p className="text-muted-foreground">
            {isStudentView 
              ? 'Gerencie estudantes e suas atividades'
              : 'Gerencie usuários, estudantes e permissões do sistema'
            }
          </p>
        </div>
        <UserActionButtons 
          onAddUser={userOperations.handleAddUser}
          onInviteUser={userOperations.handleInviteUser}
        />
      </div>

      {getStatsCards()}

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select value={filters.role || 'all'} onValueChange={handleRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os usuários</SelectItem>
                <SelectItem value="student">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Estudantes
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Administradores
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>

            {isStudentView && (
              <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                <GraduationCap className="h-3 w-3" />
                Visualização de Estudantes
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <UsersList
        users={filteredUsers}
        isLoading={isLoading}
        searchQuery={searchQuery}
        fetchError={error}
        onSearchChange={handleSearchChange}
        onResetPassword={userOperations.handleResetPassword}
        onAddUser={userOperations.handleAddUser}
        onInviteUser={userOperations.handleInviteUser}
        onDeleteUser={userOperations.handleDeleteUser}
        onToggleUserStatus={userOperations.handleToggleUserStatus}
        onSetPermissionGroup={userOperations.handleSetPermissionGroup}
      />

      <UserOperationDialogs {...userOperations} />
    </div>
  );
};

export default UnifiedUserPage;
