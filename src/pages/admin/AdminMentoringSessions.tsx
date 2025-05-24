
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Filter, Download, Plus, Clock, Video } from 'lucide-react';
import { useMentoring } from '@/hooks/useMentoring';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AdminMentoringSessions = () => {
  const { sessions } = useMentoring();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'realizada': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'reagendada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Sessões</h1>
          <p className="text-gray-600 mt-1">Agende e gerencie sessões de mentoria</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Sessão
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por título, aluno..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agendada">Agendada</SelectItem>
                <SelectItem value="realizada">Realizada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="reagendada">Reagendada</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="grupo">Grupo</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Sessões ({sessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Título</th>
                  <th className="text-left py-3 px-4 font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium">Data/Hora</th>
                  <th className="text-left py-3 px-4 font-medium">Duração</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Links</th>
                  <th className="text-left py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{session.title}</div>
                      <div className="text-sm text-gray-500">ID: {session.enrollmentId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="capitalize">
                        {session.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>{format(new Date(session.scheduledDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</div>
                        <div className="text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(session.scheduledDate), 'HH:mm')}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {session.durationMinutes} min
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {session.accessLink && (
                          <Button variant="ghost" size="sm">
                            <Video className="h-3 w-3 mr-1" />
                            Acesso
                          </Button>
                        )}
                        {session.recordingLink && (
                          <Button variant="ghost" size="sm">
                            <Video className="h-3 w-3 mr-1" />
                            Gravação
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMentoringSessions;
