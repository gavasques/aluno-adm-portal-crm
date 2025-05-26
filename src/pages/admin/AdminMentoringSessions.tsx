
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { 
  Video, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  Users,
  Play,
  GraduationCap,
  User,
  Grid3X3,
  List
} from 'lucide-react';
import { useMentoring } from '@/hooks/useMentoring';
import { useAuth } from '@/hooks/useAuth';
import SessionForm from '@/components/admin/mentoring/SessionForm';
import { SessionsList } from '@/components/admin/mentoring/sessions/SessionsList';
import { SessionDetailDialog } from '@/components/admin/mentoring/sessions/SessionDetailDialog';
import { format, isToday, isTomorrow, isWithinInterval, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AdminMentoringSessions = () => {
  const { sessions, enrollments, createSession } = useMentoring();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');
  const [mentorFilter, setMentorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);
  const [viewingSession, setViewingSession] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  console.log('AdminMentoringSessions render:');
  console.log('- user:', user);
  console.log('- sessions count:', sessions.length);
  console.log('- enrollments count:', enrollments.length);

  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Gestão de Sessões' }
  ];

  // Verificar se é admin - permitir acesso total se não houver usuário (desenvolvimento) ou se for Admin
  const isAdmin = !user || user?.role === 'Admin';
  console.log('- isAdmin:', isAdmin, 'user role:', user?.role);

  // Mock student names based on student IDs
  const studentNames = {
    'student-001': 'João Silva',
    'student-002': 'Maria Santos',
    'student-003': 'Pedro Oliveira',
    'student-004': 'Ana Costa',
    'student-005': 'Carlos Ferreira',
    'student-006': 'Juliana Rodrigues',
    'student-007': 'Roberto Lima',
    'student-008': 'Fernanda Alves',
    'student-009': 'Ricardo Pereira',
    'student-010': 'Camila Barbosa'
  };

  // Dados enriquecidos das sessões
  const enrichedSessions = useMemo(() => {
    console.log('Enriching sessions - sessions:', sessions.length, 'enrollments:', enrollments.length);
    
    return sessions.map(session => {
      const enrollment = enrollments.find(e => e.id === session.enrollmentId);
      const sessionNumber = sessions
        .filter(s => s.enrollmentId === session.enrollmentId)
        .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
        .findIndex(s => s.id === session.id) + 1;

      const studentName = enrollment ? studentNames[enrollment.studentId as keyof typeof studentNames] || 'Aluno não encontrado' : 'Aluno não encontrado';

      return {
        ...session,
        enrollment,
        sessionNumber,
        studentName,
        mentorName: enrollment?.responsibleMentor || 'Mentor não definido',
        mentoringName: enrollment?.mentoring.name || 'Mentoria não encontrada',
        totalSessions: enrollment?.totalSessions || 0
      };
    });
  }, [sessions, enrollments]);

  console.log('- enrichedSessions count:', enrichedSessions.length);

  // Filtrar sessões baseado em permissões
  const filteredSessions = useMemo(() => {
    let filtered = enrichedSessions;

    // Se não é admin, mostrar apenas sessões dos alunos relacionados ao mentor
    if (!isAdmin && user?.email) {
      filtered = filtered.filter(session => 
        session.mentorName === user.email || session.mentorName.includes(user.email)
      );
    }

    // Filtros de busca
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(session =>
        session.studentName.toLowerCase().includes(search) ||
        session.mentorName.toLowerCase().includes(search) ||
        session.mentoringName.toLowerCase().includes(search)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(session => session.status === statusFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(session => session.type === typeFilter);
    }

    if (studentFilter) {
      filtered = filtered.filter(session => 
        session.studentName.toLowerCase().includes(studentFilter.toLowerCase())
      );
    }

    if (mentorFilter) {
      filtered = filtered.filter(session => 
        session.mentorName.toLowerCase().includes(mentorFilter.toLowerCase())
      );
    }

    // Filtros de data
    if (dateFilter) {
      const today = new Date();
      
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.scheduledDate);
        
        switch (dateFilter) {
          case 'hoje':
            return isToday(sessionDate);
          case 'amanha':
            return isTomorrow(sessionDate);
          case 'proximos7dias':
            return isWithinInterval(sessionDate, {
              start: today,
              end: addDays(today, 7)
            });
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [enrichedSessions, searchTerm, statusFilter, typeFilter, studentFilter, mentorFilter, dateFilter, isAdmin, user]);

  console.log('- filteredSessions count:', filteredSessions.length);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'realizada': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'reagendada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ausente_aluno': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ausente_mentor': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCreateSession = async (data: any) => {
    try {
      console.log('Creating session with data:', data);
      
      // Combinar data e hora para criar o scheduledDate
      const scheduledDate = new Date(`${data.scheduledDate}T${data.scheduledTime}`).toISOString();
      
      const sessionData = {
        enrollmentId: data.enrollmentId,
        type: data.type,
        title: data.title,
        scheduledDate,
        durationMinutes: data.durationMinutes,
        accessLink: data.accessLink || undefined
      };
      
      await createSession(sessionData);
      setShowForm(false);
      console.log('Session created successfully');
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleEditSession = (data: any) => {
    console.log('Editing session:', data);
    setEditingSession(null);
  };

  const handleSaveSession = (sessionData: any) => {
    console.log('Saving session:', sessionData);
    setViewingSession(null);
  };

  const handleDeleteSession = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta sessão?')) {
      console.log('Deleting session:', id);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
    setStudentFilter('');
    setMentorFilter('');
    setDateFilter('');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <BreadcrumbNav items={breadcrumbItems} showBackButton={true} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Sessões</h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'Gerencie todas as sessões de mentorias' : 'Suas sessões de mentoria'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="h-8"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Sempre mostrar o botão Nova Sessão para admin */}
          {isAdmin && (
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Sessão
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Sessões</p>
                <p className="text-2xl font-bold text-gray-900">{filteredSessions.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agendadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSessions.filter(s => s.status === 'agendada').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Realizadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSessions.filter(s => s.status === 'realizada').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Play className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSessions.filter(s => s.status === 'cancelada').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Primeira linha de filtros */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por aluno, mentor ou mentoria..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="agendada">Agendada</SelectItem>
                  <SelectItem value="realizada">Realizada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                  <SelectItem value="reagendada">Reagendada</SelectItem>
                  <SelectItem value="ausente_aluno">Ausente - Aluno</SelectItem>
                  <SelectItem value="ausente_mentor">Ausente - Mentor</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="grupo">Grupo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Segunda linha de filtros */}
            <div className="flex gap-4 items-center">
              <Input
                placeholder="Filtrar por aluno..."
                className="flex-1"
                value={studentFilter}
                onChange={(e) => setStudentFilter(e.target.value)}
              />
              <Input
                placeholder="Filtrar por mentor..."
                className="flex-1"
                value={mentorFilter}
                onChange={(e) => setMentorFilter(e.target.value)}
              />
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as datas</SelectItem>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="amanha">Amanhã</SelectItem>
                  <SelectItem value="proximos7dias">Próximos 7 dias</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Content */}
      {viewMode === 'list' ? (
        <SessionsList
          sessions={filteredSessions}
          onView={setViewingSession}
          onEdit={setEditingSession}
          onDelete={handleDeleteSession}
          isAdmin={isAdmin}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => (
            <Card 
              key={session.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setViewingSession(session)}
            >
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-medium">{session.mentoringName}</h4>
                        <p className="text-sm text-gray-500">
                          Sessão {session.sessionNumber}/{session.totalSessions}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium">Aluno:</span>
                        <span className="text-sm text-gray-600 ml-2">{session.studentName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium">Mentor:</span>
                        <span className="text-sm text-gray-600 ml-2">{session.mentorName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(session.scheduledDate), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{session.durationMinutes} min</span>
                    </div>
                    <Badge variant="outline" className="capitalize">{session.type}</Badge>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    {session.status === 'agendada' && session.accessLink && (
                      <Button size="sm" className="flex-1" onClick={(e) => {
                        e.stopPropagation();
                        window.open(session.accessLink, '_blank');
                      }}>
                        <Play className="h-4 w-4 mr-2" />
                        Entrar
                      </Button>
                    )}
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSession(session);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {isAdmin && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredSessions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma sessão encontrada</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter || typeFilter || studentFilter || mentorFilter || dateFilter
                ? 'Tente ajustar os filtros para encontrar as sessões desejadas.'
                : 'Não há sessões agendadas no momento.'}
            </p>
            {(searchTerm || statusFilter || typeFilter || studentFilter || mentorFilter || dateFilter) ? (
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            ) : isAdmin ? (
              <Button onClick={() => setShowForm(true)} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Sessão
              </Button>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Form Dialog */}
      {isAdmin && (
        <Dialog open={showForm || !!editingSession} onOpenChange={(open) => {
          if (!open) {
            setShowForm(false);
            setEditingSession(null);
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSession ? 'Editar Sessão' : 'Nova Sessão'}
              </DialogTitle>
            </DialogHeader>
            <SessionForm
              onSubmit={editingSession ? handleEditSession : handleCreateSession}
              onCancel={() => {
                setShowForm(false);
                setEditingSession(null);
              }}
              initialData={editingSession}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Session Detail Dialog */}
      <SessionDetailDialog
        session={viewingSession}
        open={!!viewingSession}
        onOpenChange={(open) => {
          if (!open) setViewingSession(null);
        }}
        onSave={handleSaveSession}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default AdminMentoringSessions;
