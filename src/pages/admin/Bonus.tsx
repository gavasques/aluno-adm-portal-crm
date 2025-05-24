
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Grid, List } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBonuses } from "@/hooks/admin/useBonuses";
import { useBonusMigration } from "@/hooks/admin/useBonusMigration";
import { BonusType, AccessPeriod } from "@/types/bonus.types";
import BonusStatsCards from "@/components/admin/bonus/BonusStatsCards";
import BonusFilters from "@/components/admin/bonus/BonusFilters";
import BonusCard from "@/components/admin/bonus/BonusCard";

// Componente de formulário para adicionar/editar bônus
interface BonusFormProps {
  onSubmit: (data: {
    name: string;
    type: BonusType;
    description: string;
    access_period: AccessPeriod;
    observations?: string;
  }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const BonusForm: React.FC<BonusFormProps> = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<BonusType>("Outros");
  const [description, setDescription] = useState("");
  const [accessPeriod, setAccessPeriod] = useState<AccessPeriod>("30 dias");
  const [observations, setObservations] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      type,
      description,
      access_period: accessPeriod,
      observations: observations || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Nome</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">Tipo</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as BonusType)}
              className="w-full rounded-md border border-gray-300 p-2"
              required
              disabled={isSubmitting}
            >
              <option value="Software">Software</option>
              <option value="Sistema">Sistema</option>
              <option value="IA">IA</option>
              <option value="Ebook">Ebook</option>
              <option value="Lista">Lista</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="accessPeriod" className="block text-sm font-medium mb-1">Tempo de Acesso</label>
            <select
              id="accessPeriod"
              value={accessPeriod}
              onChange={(e) => setAccessPeriod(e.target.value as AccessPeriod)}
              className="w-full rounded-md border border-gray-300 p-2"
              required
              disabled={isSubmitting}
            >
              <option value="7 dias">7 dias</option>
              <option value="15 dias">15 dias</option>
              <option value="30 dias">30 dias</option>
              <option value="2 Meses">2 Meses</option>
              <option value="3 Meses">3 Meses</option>
              <option value="6 Meses">6 Meses</option>
              <option value="1 Ano">1 Ano</option>
              <option value="Vitalício">Vitalício</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição</label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label htmlFor="observations" className="block text-sm font-medium mb-1">Observações</label>
          <Textarea
            id="observations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            rows={2}
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Adicionando...
            </>
          ) : (
            'Adicionar Bônus'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

// Componente principal de Bônus
const Bonus = () => {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [bonusToDelete, setBonusToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Filtros
  const [typeFilter, setTypeFilter] = useState<BonusType | "all">("all");
  const [periodFilter, setPeriodFilter] = useState<AccessPeriod | "all">("all");
  
  const {
    bonuses,
    loading,
    searchTerm,
    setSearchTerm,
    stats,
    addBonus,
    deleteBonus
  } = useBonuses();

  const { migrationStatus, migratedCount } = useBonusMigration();

  // Filtrar bônus
  const filteredBonuses = bonuses.filter(bonus => {
    const matchesType = typeFilter === "all" || bonus.type === typeFilter;
    const matchesPeriod = periodFilter === "all" || bonus.access_period === periodFilter;
    return matchesType && matchesPeriod;
  });

  const handleAddBonus = async (bonusData: {
    name: string;
    type: BonusType;
    description: string;
    access_period: AccessPeriod;
    observations?: string;
  }) => {
    setIsSubmitting(true);
    const success = await addBonus(bonusData);
    setIsSubmitting(false);
    
    if (success) {
      setIsAddDialogOpen(false);
    }
  };
  
  const handleDeleteBonus = async () => {
    if (!bonusToDelete) return;
    
    setIsDeleting(true);
    const success = await deleteBonus(bonusToDelete);
    setIsDeleting(false);
    
    if (success) {
      setBonusToDelete(null);
    }
  };

  const handleViewBonus = (id: string) => {
    navigate(`/admin/bonus/${id}`);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setPeriodFilter("all");
  };

  const renderMigrationStatus = () => {
    if (migrationStatus === 'migrating') {
      return (
        <Alert className="mb-4">
          <AlertDescription>
            Migrando dados do localStorage para Supabase... {migratedCount} bônus migrados.
          </AlertDescription>
        </Alert>
      );
    }

    if (migrationStatus === 'error') {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            Erro durante a migração dos dados. Verifique o console para mais detalhes.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  if (loading && migrationStatus !== 'completed') {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-8">Cadastro de Bônus</h1>
        {renderMigrationStatus()}
        <BonusStatsCards stats={stats} loading={true} />
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" text="Carregando bônus..." />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Cadastro de Bônus</h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Adicionar Bônus
        </Button>
      </div>
      
      {renderMigrationStatus()}
      
      <BonusStatsCards stats={stats} loading={loading} />
      
      <BonusFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        periodFilter={periodFilter}
        onPeriodFilterChange={setPeriodFilter}
        onClearFilters={handleClearFilters}
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Bônus ({filteredBonuses.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBonuses.length > 0 ? (
                filteredBonuses.map((bonus) => (
                  <BonusCard
                    key={bonus.id}
                    bonus={bonus}
                    onView={handleViewBonus}
                    onDelete={setBonusToDelete}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Nenhum bônus encontrado.
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Tempo de Acesso</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBonuses.length > 0 ? (
                    filteredBonuses.map((bonus) => (
                      <TableRow 
                        key={bonus.id} 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => handleViewBonus(bonus.id)}
                      >
                        <TableCell className="font-medium">{bonus.bonus_id}</TableCell>
                        <TableCell>{bonus.name}</TableCell>
                        <TableCell>{bonus.type}</TableCell>
                        <TableCell>{bonus.access_period}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setBonusToDelete(bonus.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        Nenhum bônus encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de adicionar bônus */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Bônus</DialogTitle>
            <DialogDescription>
              Preencha as informações do bônus abaixo.
            </DialogDescription>
          </DialogHeader>
          <BonusForm 
            onSubmit={handleAddBonus} 
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={!!bonusToDelete} onOpenChange={() => setBonusToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este bônus? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBonusToDelete(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBonus}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bonus;
