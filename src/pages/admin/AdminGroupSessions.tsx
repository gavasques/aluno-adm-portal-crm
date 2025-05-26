
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
  UserPlus,
  Grid3X3,
  List
} from 'lucide-react';
import { useMentoring } from '@/hooks/useMentoring';
import { useAuth } from '@/hooks/useAuth';
import SessionForm from '@/components/admin/mentoring/SessionForm';
import { SessionsList } from '@/components/admin/mentoring/sessions/SessionsList';
import { SessionDetailDialog } from '@/components/admin/mentoring/sessions/SessionDetailDialog';
import { format, isToday, isTomorrow, isWithinInterval, addDays, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AdminGroupSessions = () => {
  console.log('=== AdminGroupSessions COMPONENT RENDER ===');
  
  const { sessions, enrollments, createSession } = useMentoring();
  const { user } = useAuth();
  
  console.log('AdminGroupSessions render data:');
  console.log('- user:', user);
  console.log('- sessions count:', sessions?.length || 0);
  console.log('- enrollments count:', enrollments?.length || 0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [mentorFilter, setMentorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);
  const [viewingSession, setViewingSession] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Sessões em Grupo' }
  ];

  const isAdmin = !user || user?.role === 'Admin' || user?.role === 'admin' || true;

  const formatSafeDate = (dateString: string | undefined, formatStr: string) => {
    if (!dateString) return 'Data não definida';
    
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return 'Data inválida';
      return format(date, formatStr, { locale: ptBR });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Data inválida';
    }
  };

  // Filtrar apenas sessões em grupo
  const groupSessions = useMemo(() => {
    console.log('Filtering group sessions');
    
    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
      console.log('No sessions to filter');
      return [];
    }

    if (!enrollments || !Array.isArray(enrollments)) {
      console.log('No enrollments data for filtering');
      return [];
    }
    
    const filtered = sessions
      .filter(session => session.type === 'grupo')
      .map(session => {
        const enrollment = enrollments.find(e => e.id === session.enrollmentId);
        const sessionNumber = sessions
          .filter(s => s.enrollmentId === session.enrollmentId)
          .sort((a, b) => {
            if (!a.scheduledDate) return 1;
            if (!b.scheduledDate) return -1;
            return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
          })
          .findIndex(s => s.id === session.id) + 1;

        // Para sessões em grupo, vamos buscar quantos participantes tem
        const groupParticipants = enrollments.filter(e => 
          e.mentoring.type === 'Grupo' && 
          e.mentoring.id === enrollment?.mentoring.id
        );

        return {
          ...session,
          enrollment,
          sessionNumber,
          groupName: enrollment?.mentoring.name || 'Grupo não encontrado',
          mentorName: enrollment?.responsibleMentor || 'Mentor não definido',
          mentoringName: enrollment?.mentoring.name || 'Mentoria não encontrada',
          totalSessions: enrollment?.totalSessions || 0,
          participantsCount: groupParticipants.length,
          participants: groupParticipants
        };
      });

    console.log('Group sessions filtered:', filtered.length);
    return filtered;
  }, [sessions, enrollments]);

  // Aplicar filtros
  const filteredSessions = useMemo(() => {
    let filtered = groupSessions;

    if (!isAdmin && user?.email) {
      filtered = filtered.filter(session => 
        session.mentorName === user.email || session.mentorName.includes(user.email)
      );
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(session =>
        session.groupName.toLowerCase().includes(search) ||
        session.mentorName.toLowerCase().includes(search) ||
        session.mentoringName.toLowerCase().includes(search)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(session => session.status === statusFilter);
    }

    if (mentorFilter) {
      filtered = filtered.filter(session => 
        session.mentorName.toLowerCase().includes(mentorFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      const today = new Date();
    
      filtered = filtered.filter(sessionItem => {
        if (!sessionItem.scheduledDate) return false;
      
        try {
          const sessionDate = new Date(sessionItem.scheduledDate);
          if (!isValid(sessionDate)) return false;
        
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
        } catch (error) {
          console.error('Error filtering by date:', error);
          return false;
        }
      });
    }

    return filtered;
  }, [groupSessions, searchTerm, statusFilter, mentorFilter, dateFilter, isAdmin, user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'realizada': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'reagendada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'no_show_aluno': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'no_show_mentor': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aguardando_agendamento': return 'Aguardando Agendamento';
      case 'agendada': return 'Agendada';
      case 'realizada': return 'Realizada';
      case 'cancelada': return 'Cancelada';
      case 'reagendada': return 'Reagendada';
      case 'no_show_aluno': return 'No-show Participante';
      case 'no_show_mentor': return 'No-show Mentor';
      default: return status;
    }
  };

  const handleCreateSession = async (data: any) => {
    try {
      console.log('Creating group session with data:', data);
      
      const scheduledDate = data.scheduledDate && data.scheduledTime 
        ? new Date(`${data.scheduledDate}T${data.scheduledTime}`).toISOString()
        : undefined;
      
      const sessionData = {
        enrollmentId: data.enrollmentId,
        type: 'grupo' as const,
        title: data.title,
        scheduledDate,
        durationMinutes: data.durationMinutes,
        meetingLink: data.meetingLink || undefined,
        groupId: data.groupId
      };
      
      await createSession(sessionData);
      setShowForm(false);
      console.log('Group session created successfully');
    } catch (error) {
      console.error('Error creating group session:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setMentorFilter('');
    setDateFilter('');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <BreadcrumbNav items={breadcrumbItems} showBackButton={true} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Sessões em Grupo</h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'Gerencie todas as sessões em grupo de mentorias' : 'Suas sessões em grupo de mentoria'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          {isAdmin && (
            <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Sessão em Grupo
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sessões em Grupo</p>
                <p className="text-2xl font-bold text-gray-900">{filteredSessions.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
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
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Realizadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSessions.filter(s => s.status === 'realizada').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Play className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Participantes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSessions.reduce((acc, session) => acc + (session.participantsCount || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserPlus className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por grupo, mentor ou mentoria..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="agendada">Agendada</SelectItem>
                  <SelectItem value="realizada">Realizada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                  <SelectItem value="reagendada">Reagendada</SelectItem>
                  <SelectItem value="no_show_aluno">No-show Participante</SelectItem>
                  <SelectItem value="no_show_mentor">No-show Mentor</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as datas</SelectItem>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="amanha">Amanhã</SelectItem>
                  <SelectItem value="proximos7dias">Próximos 7 dias</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap">
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
          onDelete={(id) => console.log('Delete session:', id)}
          isAdmin={isAdmin}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => (
            <Card 
              key={session.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-300"
              onClick={() => setViewingSession(session)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="p-2 bg-green-100 rounded-lg shrink-0">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm truncate">{session.groupName}</h4>
                        <p className="text-xs text-gray-500">
                          Sessão {session.sessionNumber}/{session.totalSessions}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(session.status)} text-xs shrink-0 ml-2`}>
                      {getStatusLabel(session.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-3 w-3 text-gray-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-medium">Participantes:</span>
                        <span className="text-xs text-gray-600 ml-1">{session.participantsCount || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-3 w-3 text-gray-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-medium">Mentor:</span>
                        <span className="text-xs text-gray-600 ml-1 truncate block">{session.mentorName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    {session.scheduledDate ? (
                      <>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatSafeDate(session.scheduledDate, 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatSafeDate(session.scheduledDate, 'HH:mm')}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Não agendada</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span>{session.durationMinutes} min</span>
                    </div>
                    <Badge variant="outline" className="text-xs">Grupo</Badge>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    {session.status === 'agendada' && session.meetingLink && (
                      <Button size="sm" className="flex-1 h-8 text-xs" onClick={(e) => {
                        e.stopPropagation();
                        window.open(session.meetingLink, '_blank');
                      }}>
                        <Play className="h-3 w-3 mr-1" />
                        Entrar
                      </Button>
                    )}
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSession(session);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      {isAdmin && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Delete session:', session.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
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
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma sessão em grupo encontrada</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter || mentorFilter || dateFilter
                ? 'Tente ajustar os filtros para encontrar as sessões desejadas.'
                : 'Não há sessões em grupo agendadas no momento.'}
            </p>
            {isAdmin && !searchTerm && !statusFilter && !mentorFilter && !dateFilter && (
              <Button onClick={() => setShowForm(true)} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Sessão em Grupo
              </Button>
            )}
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
                {editingSession ? 'Editar Sessão em Grupo' : 'Nova Sessão em Grupo'}
              </DialogTitle>
            </DialogHeader>
            <SessionForm
              onSubmit={editingSession ? (data) => console.log('Edit session:', data) : handleCreateSession}
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
        onSave={(data) => console.log('Save session:', data)}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default AdminGroupSessions;
