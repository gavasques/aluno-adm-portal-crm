
import React, { useState } from 'react';
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
  Play
} from 'lucide-react';
import { useMentoring } from '@/hooks/useMentoring';
import SessionForm from '@/components/admin/mentoring/SessionForm';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AdminMentoringSessions = () => {
  const { sessions } = useMentoring();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Gestão de Sessões' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'realizada': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'reagendada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = !searchTerm || 
      session.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || session.status === statusFilter;
    const matchesType = !typeFilter || session.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateSession = (data: any) => {
    console.log('Creating session:', data);
    setShowForm(false);
  };

  const handleEditSession = (data: any) => {
    console.log('Editing session:', data);
    setEditingSession(null);
  };

  const handleDeleteSession = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta sessão?')) {
      console.log('Deleting session:', id);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedSessions(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <BreadcrumbNav items={breadcrumbItems} showBackButton />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Sessões</h1>
          <p className="text-gray-600 mt-1">Gerencie todas as sessões de mentorias</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Sessão
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Sessões</p>
                <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
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
                  {sessions.filter(s => s.status === 'agendada').length}
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
                  {sessions.filter(s => s.status === 'realizada').length}
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
                  {sessions.filter(s => s.status === 'cancelada').length}
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
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por título da sessão..."
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
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Sessões ({filteredSessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedSessions.length === filteredSessions.length && filteredSessions.length > 0}
                      onChange={() => {
                        if (selectedSessions.length === filteredSessions.length) {
                          setSelectedSessions([]);
                        } else {
                          setSelectedSessions(filteredSessions.map(s => s.id));
                        }
                      }}
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Título</th>
                  <th className="text-left py-3 px-4 font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium">Data/Hora</th>
                  <th className="text-left py-3 px-4 font-medium">Duração</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedSessions.includes(session.id)}
                        onChange={() => toggleSelection(session.id)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{session.title}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="capitalize">{session.type}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {format(new Date(session.scheduledDate), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {session.durationMinutes}min
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingSession(session)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form Dialog */}
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
    </div>
  );
};

export default AdminMentoringSessions;
