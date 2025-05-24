
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Filter, Download, Plus } from 'lucide-react';
import { useMentoring } from '@/hooks/useMentoring';

const AdminMentoringEnrollments = () => {
  const { enrollments } = useMentoring();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800 border-green-200';
      case 'concluida': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pausada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Inscrições</h1>
          <p className="text-gray-600 mt-1">Gerencie todas as inscrições de mentorias</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Inscrição
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por aluno, mentoria..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="pausada">Pausada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Grupo">Grupo</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enrollments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Inscrições ({enrollments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Aluno</th>
                  <th className="text-left py-3 px-4 font-medium">Mentoria</th>
                  <th className="text-left py-3 px-4 font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Progresso</th>
                  <th className="text-left py-3 px-4 font-medium">Início</th>
                  <th className="text-left py-3 px-4 font-medium">Fim</th>
                  <th className="text-left py-3 px-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">Aluno {enrollment.studentId}</div>
                        <div className="text-sm text-gray-500">{enrollment.responsibleMentor}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{enrollment.mentoring.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{enrollment.mentoring.type}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(enrollment.status)}>
                        {enrollment.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {enrollment.sessionsUsed}/{enrollment.totalSessions} sessões
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(enrollment.startDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(enrollment.endDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        Ver Detalhes
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

export default AdminMentoringEnrollments;
