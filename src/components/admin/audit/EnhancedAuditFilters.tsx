
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Filter, 
  X, 
  Search, 
  Calendar,
  User,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { AuditFilters } from '@/hooks/admin/useAuditLogs';

interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filters: AuditFilters;
}

interface EnhancedAuditFiltersProps {
  filters: AuditFilters;
  onFiltersChange: (filters: AuditFilters) => void;
  onReset: () => void;
}

export const EnhancedAuditFilters: React.FC<EnhancedAuditFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const filterPresets: FilterPreset[] = [
    {
      id: 'security-alerts',
      name: 'Alertas de Segurança',
      description: 'Eventos de alto risco nas últimas 24h',
      filters: {
        risk_level: 'high',
        date_from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    },
    {
      id: 'authentication-failures',
      name: 'Falhas de Autenticação',
      description: 'Tentativas de login falharam',
      filters: {
        event_category: 'authentication',
        search: 'failed'
      }
    },
    {
      id: 'data-operations',
      name: 'Operações de Dados',
      description: 'Criação, edição e exclusão de dados',
      filters: {
        event_category: 'data_management'
      }
    },
    {
      id: 'admin-actions',
      name: 'Ações Administrativas',
      description: 'Ações realizadas por administradores',
      filters: {
        search: 'admin'
      }
    }
  ];

  const applyPreset = (preset: FilterPreset) => {
    onFiltersChange(preset.filters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && value !== null
  ).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} ativos</Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
              {showAdvanced ? 'Simples' : 'Avançado'}
            </Button>
            <Button variant="outline" size="sm" onClick={onReset}>
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros Rápidos (Presets) */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Filtros Rápidos</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {filterPresets.map((preset) => (
              <Button
                key={preset.id}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
                className="h-auto p-2 text-left"
              >
                <div>
                  <div className="font-medium text-xs">{preset.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{preset.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Filtros Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search" className="text-sm font-medium">
              <Search className="h-4 w-4 inline mr-1" />
              Buscar
            </Label>
            <Input
              id="search"
              placeholder="Buscar em descrição, ação..."
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value || undefined })}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">
              <ShieldAlert className="h-4 w-4 inline mr-1" />
              Nível de Risco
            </Label>
            <Select
              value={filters.risk_level || 'all'}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, risk_level: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os riscos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="low">Baixo</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">
              <Activity className="h-4 w-4 inline mr-1" />
              Categoria
            </Label>
            <Select
              value={filters.event_category || 'all'}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, event_category: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="authentication">Autenticação</SelectItem>
                <SelectItem value="data_management">Gestão de Dados</SelectItem>
                <SelectItem value="user_activity">Atividade do Usuário</SelectItem>
                <SelectItem value="security">Segurança</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros Avançados */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Data Início
                </Label>
                <Input
                  type="date"
                  value={filters.date_from || ''}
                  onChange={(e) => 
                    onFiltersChange({ ...filters, date_from: e.target.value || undefined })
                  }
                />
              </div>

              <div>
                <Label className="text-sm font-medium">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Data Fim
                </Label>
                <Input
                  type="date"
                  value={filters.date_to || ''}
                  onChange={(e) => 
                    onFiltersChange({ ...filters, date_to: e.target.value || undefined })
                  }
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">
                <User className="h-4 w-4 inline mr-1" />
                ID do Usuário
              </Label>
              <Input
                placeholder="UUID do usuário"
                value={filters.user_id || ''}
                onChange={(e) => 
                  onFiltersChange({ ...filters, user_id: e.target.value || undefined })
                }
              />
            </div>

            {/* Filtros de Status */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Opções Adicionais</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="onlyFailures" />
                  <Label htmlFor="onlyFailures" className="text-sm">
                    Apenas eventos com falha
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="onlyHighRisk" />
                  <Label htmlFor="onlyHighRisk" className="text-sm">
                    Apenas alto risco e crítico
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="onlyToday" />
                  <Label htmlFor="onlyToday" className="text-sm">
                    Apenas eventos de hoje
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumo dos Filtros Ativos */}
        {activeFiltersCount > 0 && (
          <div className="border-t pt-4">
            <Label className="text-sm font-medium mb-2 block">Filtros Ativos</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === '') return null;
                return (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {key}: {String(value)}
                    <button
                      onClick={() => onFiltersChange({ ...filters, [key]: undefined })}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
