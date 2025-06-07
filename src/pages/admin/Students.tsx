
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { UserCog, Plus, Search, Users, GraduationCap, UserCheck } from 'lucide-react';
import { PerformanceOptimizedUserProvider, usePerformanceOptimizedUserContext } from '@/contexts/PerformanceOptimizedUserContext';
import { User } from '@/types/user.types';
import LoadingUsersList from '@/components/admin/users/LoadingUsersList';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, UserMinus, UserPlus } from 'lucide-react';
import { CardStats } from '@/components/ui/card-stats';

const StudentsContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    users, 
    isLoading, 
    toggleMentorStatus,
    toggleUserStatus,
    studentStats 
  } = usePerformanceOptimizedUserContext();

  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Gestão de Alunos' }
  ];

  // Filtrar apenas estudantes
  const students = users.filter(user => user.role === 'Student');

  // Filtrar por busca
  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleMentor = async (user: User) => {
    const success = await toggleMentorStatus(user.id, user.is_mentor || false);
    if (success) {
      console.log(`Mentor status toggled for ${user.email}`);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const isActive = user.status?.toLowerCase() === 'ativo';
    const success = await toggleUserStatus(user.id, user.email, isActive);
    if (success) {
      console.log(`Status toggled for ${user.email}`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const statsData = [
    {
      title: "Total de Estudantes",
      value: studentStats.total,
      icon: <Users className="h-4 w-4" />,
      description: "Cadastrados no sistema"
    },
    {
      title: "Ativos",
      value: studentStats.active,
      icon: <UserCheck className="h-4 w-4" />,
      description: "Estudantes ativos"
    },
    {
      title: "Mentores",
      value: studentStats.mentors,
      icon: <GraduationCap className="h-4 w-4" />,
      description: "Também são mentores"
    },
    {
      title: "Novos este mês",
      value: studentStats.newThisMonth,
      icon: <UserPlus className="h-4 w-4" />,
      description: "Cadastrados este mês"
    }
  ];

  return (
    <div className="p-8 space-y-6">
      <BreadcrumbNav items={breadcrumbItems} showBackButton={true} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Alunos</h1>
          <p className="text-gray-600 mt-1">Gerencie os estudantes cadastrados no sistema</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Aluno
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <CardStats
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Lista de Estudantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudante</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <LoadingUsersList />
                </TableBody>
              </Table>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <UserCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'Nenhum estudante encontrado' : 'Nenhum estudante cadastrado'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Comece adicionando o primeiro estudante ao sistema.'
                }
              </p>
              {!searchQuery && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Estudante
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudante</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const isActive = student.status?.toLowerCase() === 'ativo';
                    
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{student.name || "Sem nome"}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={isActive ? "default" : "secondary"}>
                            {student.status || 'Ativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>Estudante</span>
                            {student.is_mentor && (
                              <Badge variant="outline" className="text-purple-700 border-purple-300 bg-purple-50">
                                <GraduationCap className="h-3 w-3 mr-1" />
                                Mentor
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(student.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleMentor(student)}>
                                <GraduationCap className="mr-2 h-4 w-4" />
                                {student.is_mentor ? 'Remover mentor' : 'Tornar mentor'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(student)}>
                                {isActive ? (
                                  <>
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    Desativar estudante
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Ativar estudante
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const AdminStudents = () => {
  return (
    <PerformanceOptimizedUserProvider>
      <StudentsContent />
    </PerformanceOptimizedUserProvider>
  );
};

export default AdminStudents;
