
import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users2, Filter, Search, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GroupEnrollmentSection } from '@/components/admin/mentoring/enrollments/GroupEnrollmentSection';
import { BulkActions } from '@/components/admin/mentoring/enrollments/BulkActions';
import { GroupEnrollment } from '@/types/mentoring.types';
import { mockGroupEnrollments } from '@/data/mockGroupEnrollments';

const AdminGroupEnrollments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Mock groups data - in real implementation, this would come from a hook
  const [groups] = useState<GroupEnrollment[]>(mockGroupEnrollments);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentorias' },
    { label: 'Inscrições em Grupo' }
  ];

  // Aplicar filtros
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const matchesSearch = !searchTerm || 
        group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.responsibleMentor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || group.status === statusFilter;
      const matchesType = typeFilter === 'all' || group.mentoring.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [groups, searchTerm, statusFilter, typeFilter]);

  // Estatísticas específicas para grupos
  const statistics = useMemo(() => {
    const totalGroups = groups.length;
    const totalParticipants = groups.reduce((sum, g) => sum + g.participants.length, 0);
    const activeGroups = groups.filter(g => g.status === 'ativa').length;
    const completedGroups = groups.filter(g => g.status === 'concluida').length;
    const pausedGroups = groups.filter(g => g.status === 'pausada').length;
    
    return { 
      totalGroups, 
      totalParticipants, 
      activeGroups, 
      completedGroups, 
      pausedGroups 
    };
  }, [groups]);

  // Handlers
  const handleViewGroup = (group: GroupEnrollment) => {
    console.log('Viewing group:', group);
  };

  const handleEditGroup = (group: GroupEnrollment) => {
    console.log('Editing group:', group);
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este grupo?')) {
      console.log('Deleting group:', id);
    }
  };

  const handleAddStudent = (group: GroupEnrollment) => {
    console.log('Adding student to group:', group);
  };

  const handleRemoveStudent = (groupId: string, studentId: string) => {
    if (confirm('Tem certeza que deseja remover este aluno do grupo?')) {
      console.log('Removing student:', studentId, 'from group:', groupId);
    }
  };

  const handleAddGroup = () => {
    setShowForm(true);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} for groups:`, selectedGroups);
  };

  const toggleGroupSelection = (id: string) => {
    setSelectedGroups(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedGroups([]);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin/mentorias"
        className="mb-4"
      />

      {/* Header Principal */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Users2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Inscrições em Grupo</h1>
              <p className="text-purple-100">
                Gerencie turmas e grupos de mentoria
              </p>
            </div>
          </div>
          <Button
            onClick={handleAddGroup}
            className="bg-white text-purple-600 hover:bg-purple-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Grupo
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{statistics.totalGroups}</div>
            <div className="text-sm text-purple-100">Total de Grupos</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{statistics.totalParticipants}</div>
            <div className="text-sm text-purple-100">Participantes</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{statistics.activeGroups}</div>
            <div className="text-sm text-purple-100">Grupos Ativos</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{statistics.completedGroups}</div>
            <div className="text-sm text-purple-100">Concluídos</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">{statistics.pausedGroups}</div>
            <div className="text-sm text-purple-100">Pausados</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome do grupo ou mentor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="ativa">Ativa</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
              <SelectItem value="pausada">Pausada</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Grupo">Grupo</SelectItem>
            </SelectContent>
          </Select>
          {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>

      {/* Ações em Lote */}
      <BulkActions
        selectedCount={selectedGroups.length}
        onBulkAction={handleBulkAction}
        onClearSelection={clearSelection}
      />

      {/* Seção de Grupos */}
      <GroupEnrollmentSection
        groups={filteredGroups}
        selectedGroups={selectedGroups}
        onView={handleViewGroup}
        onEdit={handleEditGroup}
        onDelete={handleDeleteGroup}
        onAddStudent={handleAddStudent}
        onRemoveStudent={handleRemoveStudent}
        onToggleSelection={toggleGroupSelection}
        onAddGroup={handleAddGroup}
      />

      {/* Dialog para novo grupo */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Grupo de Mentoria</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-600">Formulário para criação de novo grupo será implementado aqui.</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowForm(false)}>
                Criar Grupo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGroupEnrollments;
