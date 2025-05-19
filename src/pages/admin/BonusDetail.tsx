
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bonus, BonusType, AccessPeriod } from "./Bonus";

const BonusDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [bonus, setBonus] = useState<Bonus | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState<BonusType>("Outros");
  const [description, setDescription] = useState("");
  const [accessPeriod, setAccessPeriod] = useState<AccessPeriod>("30 dias");
  const [observations, setObservations] = useState("");

  useEffect(() => {
    // Simulating API call to fetch bonus details
    const fetchBonus = () => {
      setIsLoading(true);
      
      // In a real application, this would be an API call
      // For now, we'll use localStorage to simulate a database
      const storedBonuses = localStorage.getItem("bonuses");
      const bonuses: Bonus[] = storedBonuses ? JSON.parse(storedBonuses) : [];
      
      const foundBonus = bonuses.find(b => b.id === id);
      
      if (foundBonus) {
        setBonus(foundBonus);
        // Initialize form fields
        setName(foundBonus.name);
        setType(foundBonus.type);
        setDescription(foundBonus.description);
        setAccessPeriod(foundBonus.accessPeriod);
        setObservations(foundBonus.observations || "");
      } else {
        toast.error("Bônus não encontrado");
        navigate("/admin/bonus");
      }
      
      setIsLoading(false);
    };
    
    fetchBonus();
  }, [id, navigate]);

  const handleSave = () => {
    if (!bonus) return;
    
    const updatedBonus: Bonus = {
      ...bonus,
      name,
      type,
      description,
      accessPeriod,
      observations
    };
    
    // Update in localStorage (in a real app, this would be an API call)
    const storedBonuses = localStorage.getItem("bonuses");
    const bonuses: Bonus[] = storedBonuses ? JSON.parse(storedBonuses) : [];
    
    const updatedBonuses = bonuses.map(b => 
      b.id === id ? updatedBonus : b
    );
    
    localStorage.setItem("bonuses", JSON.stringify(updatedBonuses));
    
    setBonus(updatedBonus);
    setIsEditing(false);
    toast.success("Bônus atualizado com sucesso!");
  };
  
  const handleDelete = () => {
    if (!bonus) return;
    
    // Remove from localStorage (in a real app, this would be an API call)
    const storedBonuses = localStorage.getItem("bonuses");
    const bonuses: Bonus[] = storedBonuses ? JSON.parse(storedBonuses) : [];
    
    const updatedBonuses = bonuses.filter(b => b.id !== id);
    
    localStorage.setItem("bonuses", JSON.stringify(updatedBonuses));
    
    toast.success("Bônus removido com sucesso!");
    navigate("/admin/bonus");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bonus) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Bônus não encontrado</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/bonus")} 
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-3xl font-bold">Detalhes do Bônus</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{bonus.bonusId}</CardTitle>
              <CardDescription>
                Visualize e edite os detalhes do bônus
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" /> Salvar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" /> Excluir
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <label className="text-sm font-medium">Nome</label>
              {isEditing ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  <Select value={type} onValueChange={(value) => setType(value as BonusType)}>
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
                  <Select value={accessPeriod} onValueChange={(value) => setAccessPeriod(value as AccessPeriod)}>
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
                  <p className="text-base">{bonus.accessPeriod}</p>
                )}
              </div>
            </div>
            
            <div className="grid gap-3">
              <label className="text-sm font-medium">Descrição</label>
              {isEditing ? (
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={3}
                  placeholder="Observações opcionais"
                />
              ) : (
                <p className="text-base whitespace-pre-wrap">{bonus.observations || "Nenhuma observação"}</p>
              )}
            </div>
            
            <div className="grid gap-3">
              <label className="text-sm font-medium">ID do Bônus</label>
              <p className="text-base">{bonus.bonusId}</p>
            </div>
            
            <div className="grid gap-3">
              <label className="text-sm font-medium">Data de Criação</label>
              <p className="text-base">
                {new Date(bonus.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BonusDetail;
