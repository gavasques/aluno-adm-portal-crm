
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';

interface WebhookLogFilters {
  pipeline_id?: string;
  success?: boolean;
  date_from?: string;
  date_to?: string;
  ip_address?: string;
}

interface WebhookLogFiltersProps {
  filters: WebhookLogFilters;
  onFiltersChange: (filters: WebhookLogFilters) => void;
}

export const WebhookLogFilters = ({ filters, onFiltersChange }: WebhookLogFiltersProps) => {
  const { pipelines } = useCRMPipelines();

  const handleFilterChange = (key: keyof WebhookLogFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pipeline */}
        <div className="space-y-2">
          <Label htmlFor="pipeline">Pipeline</Label>
          <Select
            value={filters.pipeline_id || ""}
            onValueChange={(value) => handleFilterChange('pipeline_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os pipelines" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os pipelines</SelectItem>
              {pipelines.map((pipeline) => (
                <SelectItem key={pipeline.id} value={pipeline.id}>
                  {pipeline.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="success">Status</Label>
          <Select
            value={filters.success === undefined ? "" : filters.success.toString()}
            onValueChange={(value) => 
              handleFilterChange('success', value === "" ? undefined : value === "true")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="true">Sucesso</SelectItem>
              <SelectItem value="false">Erro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data inicial */}
        <div className="space-y-2">
          <Label htmlFor="date_from">Data inicial</Label>
          <Input
            id="date_from"
            type="datetime-local"
            value={filters.date_from || ""}
            onChange={(e) => handleFilterChange('date_from', e.target.value)}
          />
        </div>

        {/* Data final */}
        <div className="space-y-2">
          <Label htmlFor="date_to">Data final</Label>
          <Input
            id="date_to"
            type="datetime-local"
            value={filters.date_to || ""}
            onChange={(e) => handleFilterChange('date_to', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* IP Address */}
        <div className="space-y-2">
          <Label htmlFor="ip_address">Endereço IP</Label>
          <Input
            id="ip_address"
            placeholder="192.168.1.1"
            value={filters.ip_address || ""}
            onChange={(e) => handleFilterChange('ip_address', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={clearFilters}
          disabled={Object.keys(filters).length === 0}
        >
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};
