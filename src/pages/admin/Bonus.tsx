import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, IdCard } from "lucide-react";
import { toast } from "sonner";
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

// Tipos para os bônus
export type BonusType = "Software" | "Sistema" | "IA" | "Ebook" | "Lista" | "Outros";
export type AccessPeriod = "7 dias" | "15 dias" | "30 dias" | "2 Meses" | "3 Meses" | "6 Meses" | "1 Ano" | "Vitalício";

export interface Bonus {
  id: string;
  bonusId: string; // Campo ID único
  name: string;
  type: BonusType;
  description: string;
  accessPeriod: AccessPeriod;
  observations?: string;
  createdAt: Date;
}

// Componente de formulário para adicionar/editar bônus
interface BonusFormProps {
  onSubmit: (data: Omit<Bonus, "id" | "createdAt" | "bonusId">) => void;
  onCancel: () => void;
}

const BonusForm: React.FC<BonusFormProps> = ({ onSubmit, onCancel }) => {
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
      accessPeriod,
      observations
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
          />
        </div>
        
        <div>
          <label htmlFor="observations" className="block text-sm font-medium mb-1">Observações</label>
          <Textarea
            id="observations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            rows={2}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Adicionar Bônus
        </Button>
      </DialogFooter>
    </form>
  );
};

// Componente principal de Bônus
const Bonus = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [bonusToDelete, setBonusToDelete] = useState<string | null>(null);
  
  const [bonuses, setBonuses] = useState<Bonus[]>([
    {
      id: "1",
      bonusId: "BNS001", // ID do bônus
      name: "Lista de Fornecedores Premium",
      type: "Lista",
      description: "Lista exclusiva com mais de 100 fornecedores confiáveis para dropshipping",
      accessPeriod: "Vitalício",
      observations: "Atualizada trimestralmente",
      createdAt: new Date(2024, 1, 15)
    },
    {
      id: "2",
      bonusId: "BNS002", // ID do bônus
      name: "Software Gerador de Termos",
      type: "Software",
      description: "Gerador automático de políticas e termos para lojas virtuais",
      accessPeriod: "1 Ano",
      createdAt: new Date(2024, 2, 20)
    }
  ]);

  // Load bonuses from localStorage on component mount
  useEffect(() => {
    const storedBonuses = localStorage.getItem("bonuses");
    if (storedBonuses) {
      try {
        const parsedBonuses = JSON.parse(storedBonuses);
        // Convert string dates back to Date objects
        const formattedBonuses = parsedBonuses.map((bonus: any) => ({
          ...bonus,
          createdAt: new Date(bonus.createdAt)
        }));
        setBonuses(formattedBonuses);
      } catch (error) {
        console.error("Error parsing bonuses from localStorage:", error);
      }
    } else {
      // Initialize localStorage with default bonuses
      localStorage.setItem("bonuses", JSON.stringify(bonuses));
    }
  }, []);

  // Função para gerar IDs únicos para bônus
  const generateBonusId = () => {
    const prefix = "BNS";
    const existingIds = bonuses.map(bonus => bonus.bonusId);
    let counter = existingIds.length + 1;
    let newId;
    
    do {
      newId = `${prefix}${counter.toString().padStart(3, '0')}`;
      counter++;
    } while (existingIds.includes(newId));
    
    return newId;
  };
  
  // Filtrar bônus baseado na pesquisa
  const filteredBonuses = bonuses.filter(bonus => 
    bonus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bonus.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bonus.bonusId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddBonus = (newBonus: Omit<Bonus, "id" | "createdAt" | "bonusId">) => {
    const bonus: Bonus = {
      ...newBonus,
      id: Date.now().toString(),
      bonusId: generateBonusId(), // Gerar ID único para o bônus
      createdAt: new Date()
    };
    
    const updatedBonuses = [...bonuses, bonus];
    setBonuses(updatedBonuses);
    
    // Save to localStorage
    localStorage.setItem("bonuses", JSON.stringify(updatedBonuses));
    
    setIsAddDialogOpen(false);
    toast.success("Bônus adicionado com sucesso!");
  };
  
  const handleDeleteBonus = (id: string) => {
    const updatedBonuses = bonuses.filter(bonus => bonus.id !== id);
    setBonuses(updatedBonuses);
    
    // Update localStorage
    localStorage.setItem("bonuses", JSON.stringify(updatedBonuses));
    
    setBonusToDelete(null);
    toast.success("Bônus removido com sucesso!");
  };

  const handleViewBonus = (id: string) => {
    navigate(`/admin/bonus/${id}`);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Cadastro de Bônus</h1>
      
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
                {filteredBonuses.length > 0 ? (
                  filteredBonuses.map((bonus) => (
                    <TableRow 
                      key={bonus.id} 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleViewBonus(bonus.id)}
                    >
                      <TableCell className="font-medium">{bonus.bonusId}</TableCell>
                      <TableCell>{bonus.name}</TableCell>
                      <TableCell>{bonus.type}</TableCell>
                      <TableCell>{bonus.accessPeriod}</TableCell>
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
                      Nenhum bônus encontrado.
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
          <BonusForm onSubmit={handleAddBonus} onCancel={() => setIsAddDialogOpen(false)} />
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
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => bonusToDelete && handleDeleteBonus(bonusToDelete)}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bonus;
