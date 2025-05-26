
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, GraduationCap, Users, CheckCircle, PauseCircle } from 'lucide-react';
import { ViewModeToggle } from './ViewModeToggle';

interface ModernIndividualEnrollmentsHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  viewMode: 'cards' | 'list';
  onViewModeChange: (mode: 'cards' | 'list') => void;
  onAddEnrollment: () => void;
  statistics: {
    total: number;
    active: number;
    completed: number;
    paused: number;
  };
}

export const ModernIndividualEnrollmentsHeader: React.FC<ModernIndividualEnrollmentsHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  viewMode,
  onViewModeChange,
  onAddEnrollment,
  statistics
}) => {
  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Individuais</h1>
              <p className="text-blue-100 text-sm">Gerencie as inscrições individuais de mentoria</p>
            </div>
          </div>
          <Button
            onClick={onAddEnrollment}
            className="bg-white text-blue-700 hover:bg-blue-50 font-medium shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Inscrição
          </Button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-200" />
              <div>
                <p className="text-xs text-blue-200 font-medium">Total</p>
                <p className="text-xl font-bold">{statistics.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-xs text-blue-200 font-medium">Ativas</p>
                <p className="text-xl font-bold">{statistics.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <div>
                <p className="text-xs text-blue-200 font-medium">Concluídas</p>
                <p className="text-xl font-bold">{statistics.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <PauseCircle className="h-5 w-5 text-orange-300" />
              <div>
                <p className="text-xs text-blue-200 font-medium">Pausadas</p>
                <p className="text-xl font-bold">{statistics.paused}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por mentoria ou mentor..."
                className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 h-10 border-gray-200">
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
                <SelectTrigger className="w-full sm:w-40 h-10 border-gray-200">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Grupo">Grupo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <ViewModeToggle 
            viewMode={viewMode} 
            onViewModeChange={onViewModeChange}
          />
        </div>
      </div>
    </div>
  );
};
