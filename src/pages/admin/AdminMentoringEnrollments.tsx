import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  UserPlus,
  Timer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMentoring } from '@/hooks/useMentoring';
import EnrollmentForm from '@/components/admin/mentoring/EnrollmentForm';
import ExtensionDialog from '@/components/admin/mentoring/ExtensionDialog';
import { CreateExtensionData, StudentMentoringEnrollment } from '@/types/mentoring.types';
import { format } from 'date-fns';

const AdminMentoringEnrollments = () => {
  const navigate = useNavigate();
  const { enrollments, getEnrollmentProgress, addExtension } = useMentoring();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<any>(null);
  const [selectedEnrollments, setSelectedEnrollments] = useState<string[]>([]);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [selectedEnrollmentForExtension, setSelectedEnrollmentForExtension] = useState<StudentMentoringEnrollment | null>(null);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Inscrições' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800 border-green-200';
      case 'concluida': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pausada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = !searchTerm || 
      enrollment.mentoring.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.responsibleMentor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || enrollment.status === statusFilter;
    const matchesType = !typeFilter || enrollment.mentoring.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateEnrollment = (data: any) => {
    console.log('Creating enrollment:', data);
    setShowForm(false);
  };

  const handleEditEnrollment = (data: any) => {
    console.log('Editing enrollment:', data);
    setEditingEnrollment(null);
  };

  const handleDeleteEnrollment = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta inscrição?')) {
      console.log('Deleting enrollment:', id);
    }
  };

  const handleAddExtension = (enrollment: StudentMentoringEnrollment) => {
    setSelectedEnrollmentForExtension(enrollment);
    setShowExtensionDialog(true);
  };

  const handleExtensionSubmit = async (data: CreateExtensionData) => {
    const success = await addExtension(data);
    if (success) {
      console.log('Extensão adicionada com sucesso');
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} for:`, selectedEnrollments);
  };

  const toggleSelection = (id: string) => {
    setSelectedEnrollments(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedEnrollments(
      selectedEnrollments.length === filteredEnrollments.length 
        ? [] 
        : filteredEnrollments.map(e => e.id)
    );
  };

  return (
    <div className="container mx-auto py-4 space-y-6">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin/mentorias"
        className="mb-4"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inscrições de Mentorias</h1>
          <p className="text-gray-600 mt-1">Gerencie todas as inscrições de alunos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Inscrição
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Inscrições</p>
                <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inscrições Ativas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => e.status === 'ativa').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => e.status === 'concluida').length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Com Extensões</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => e.hasExtension).length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Timer className="h-6 w-6 text-orange-600" />
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
                placeholder="Buscar por aluno, mentoria, mentor..."
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
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="pausada">Pausada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Grupo">Grupo</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedEnrollments.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedEnrollments.length} inscrição(ões) selecionada(s)
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('pause')}>
                  Pausar
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('activate')}>
                  Ativar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')}>
                  Excluir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enrollments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Inscrições ({filteredEnrollments.length})
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
                      checked={selectedEnrollments.length === filteredEnrollments.length && filteredEnrollments.length > 0}
                      onChange={selectAll}
                    />
                  </th>
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
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedEnrollments.includes(enrollment.id)}
                        onChange={() => toggleSelection(enrollment.id)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">Aluno {enrollment.studentId}</div>
                        <div className="text-sm text-gray-500">{enrollment.responsibleMentor}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{enrollment.mentoring.name}</div>
                        {enrollment.hasExtension && (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                            <Timer className="h-3 w-3 mr-1" />
                            Extensão
                          </Badge>
                        )}
                      </div>
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
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(enrollment.sessionsUsed / enrollment.totalSessions) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(enrollment.startDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <div>
                        {new Date(enrollment.endDate).toLocaleDateString('pt-BR')}
                        {enrollment.originalEndDate && (
                          <div className="text-xs text-gray-500">
                            Original: {new Date(enrollment.originalEndDate).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingEnrollment(enrollment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAddExtension(enrollment)}
                          title="Adicionar Extensão"
                        >
                          <Timer className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteEnrollment(enrollment.id)}
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
      <Dialog open={showForm || !!editingEnrollment} onOpenChange={(open) => {
        if (!open) {
          setShowForm(false);
          setEditingEnrollment(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEnrollment ? 'Editar Inscrição' : 'Nova Inscrição'}
            </DialogTitle>
          </DialogHeader>
          <EnrollmentForm
            onSubmit={editingEnrollment ? handleEditEnrollment : handleCreateEnrollment}
            onCancel={() => {
              setShowForm(false);
              setEditingEnrollment(null);
            }}
            initialData={editingEnrollment}
          />
        </DialogContent>
      </Dialog>

      {/* Extension Dialog */}
      <ExtensionDialog
        open={showExtensionDialog}
        onOpenChange={setShowExtensionDialog}
        enrollment={selectedEnrollmentForExtension}
        onSubmit={handleExtensionSubmit}
      />
    </div>
  );
};

export default AdminMentoringEnrollments;
