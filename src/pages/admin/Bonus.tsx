import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, IdCard, Database } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBonuses, type BonusType, type AccessPeriod } from "@/hooks/admin/useBonuses";
import { useBonusMigration } from "@/hooks/admin/useBonusMigration";

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
  
  const {
    bonuses,
    loading,
    searchTerm,
    setSearchTerm,
    addBonus,
    deleteBonus
  } = useBonuses();

  const { migrationStatus, migratedCount } = useBonusMigration();

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

  const renderMigrationStatus = () => {
    if (migrationStatus === 'migrating') {
      return (
        <Alert className="mb-4">
          <Database className="h-4 w-4" />
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
      <h1 className="text-3xl font-bold mb-8">Cadastro de Bônus</h1>
      
      {renderMigrationStatus()}
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciar Bônus</CardTitle>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Adicionar Bônus
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Pesquisar bônus..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><div className="flex items-center"><IdCard className="mr-1 h-4 w-4" /> ID</div></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Tempo de Acesso</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bonuses.length > 0 ? (
                  bonuses.map((bonus) => (
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
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:inline-flex">Excluir</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      {searchTerm ? 'Nenhum bônus encontrado com esse termo.' : 'Nenhum bônus cadastrado.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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
