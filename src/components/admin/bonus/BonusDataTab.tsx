
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bonus, BonusType, AccessPeriod } from "@/types/bonus.types";

interface BonusDataTabProps {
  bonus: Bonus;
  isEditing: boolean;
  formData: {
    name: string;
    type: BonusType;
    description: string;
    accessPeriod: AccessPeriod;
    observations: string;
  };
  onChange: (field: string, value: string) => void;
}

const BonusDataTab: React.FC<BonusDataTabProps> = ({
  bonus,
  isEditing,
  formData,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-6">
        <div className="grid gap-3">
          <label className="text-sm font-medium">Nome</label>
          {isEditing ? (
            <Input
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="max-w-md"
            />
          ) : (
            <p className="text-base">{bonus.name}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-3">
            <label className="text-sm font-medium">Tipo</label>
            {isEditing ? (
              <Select value={formData.type} onValueChange={(value) => onChange('type', value)}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Sistema">Sistema</SelectItem>
                  <SelectItem value="IA">IA</SelectItem>
                  <SelectItem value="Ebook">Ebook</SelectItem>
                  <SelectItem value="Lista">Lista</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-base">{bonus.type}</p>
            )}
          </div>
          
          <div className="grid gap-3">
            <label className="text-sm font-medium">Tempo de Acesso</label>
            {isEditing ? (
              <Select value={formData.accessPeriod} onValueChange={(value) => onChange('accessPeriod', value)}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7 dias">7 dias</SelectItem>
                  <SelectItem value="15 dias">15 dias</SelectItem>
                  <SelectItem value="30 dias">30 dias</SelectItem>
                  <SelectItem value="2 Meses">2 Meses</SelectItem>
                  <SelectItem value="3 Meses">3 Meses</SelectItem>
                  <SelectItem value="6 Meses">6 Meses</SelectItem>
                  <SelectItem value="1 Ano">1 Ano</SelectItem>
                  <SelectItem value="Vitalício">Vitalício</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-base">{bonus.access_period}</p>
            )}
          </div>
        </div>
        
        <div className="grid gap-3">
          <label className="text-sm font-medium">Descrição</label>
          {isEditing ? (
            <Textarea
              value={formData.description}
              onChange={(e) => onChange('description', e.target.value)}
              rows={3}
            />
          ) : (
            <p className="text-base whitespace-pre-wrap">{bonus.description}</p>
          )}
        </div>
        
        <div className="grid gap-3">
          <label className="text-sm font-medium">Observações</label>
          {isEditing ? (
            <Textarea
              value={formData.observations}
              onChange={(e) => onChange('observations', e.target.value)}
              rows={3}
              placeholder="Observações opcionais"
            />
          ) : (
            <p className="text-base whitespace-pre-wrap">{bonus.observations || "Nenhuma observação"}</p>
          )}
        </div>
        
        <div className="grid gap-3">
          <label className="text-sm font-medium">ID do Bônus</label>
          <p className="text-base">{bonus.bonus_id}</p>
        </div>
        
        <div className="grid gap-3">
          <label className="text-sm font-medium">Data de Criação</label>
          <p className="text-base">
            {new Date(bonus.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BonusDataTab;
