
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ListTable from "@/components/admin/ListTable";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";

interface Branch {
  id: number;
  name: string;
  cnpj?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  address?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  phone?: string;
  email?: string;
}

interface BranchesTabProps {
  branches: Branch[];
  onUpdate: (branches: Branch[]) => void;
  isEditing?: boolean;
  states?: string[];
}

const BranchesTab: React.FC<BranchesTabProps> = ({ 
  branches = [], 
  onUpdate,
  isEditing = true,
  states = []
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  
  const [newBranch, setNewBranch] = useState<Branch>({
    id: Date.now(),
    name: "",
    cnpj: "",
    inscricaoEstadual: "",
    inscricaoMunicipal: "",
    address: "",
    bairro: "",
    cep: "",
    cidade: "",
    estado: "",
    phone: "",
    email: ""
  });

  const resetNewBranch = () => {
    setNewBranch({
      id: Date.now(),
      name: "",
      cnpj: "",
      inscricaoEstadual: "",
      inscricaoMunicipal: "",
      address: "",
      bairro: "",
      cep: "",
      cidade: "",
      estado: "",
      phone: "",
      email: ""
    });
  };

  const handleAddBranch = () => {
    if (!newBranch.name) {
      toast.error("O nome da filial é obrigatório!");
      return;
    }

    onUpdate([...branches, { ...newBranch, id: Date.now() }]);
    toast.success("Filial adicionada com sucesso!");
    resetNewBranch();
    setIsAddDialogOpen(false);
  };

  const handleEditBranch = () => {
    if (!currentBranch || !currentBranch.name) {
      toast.error("O nome da filial é obrigatório!");
      return;
    }

    onUpdate(branches.map(branch => branch.id === currentBranch.id ? currentBranch : branch));
    toast.success("Filial atualizada com sucesso!");
    setCurrentBranch(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteBranch = (id: number | string) => {
    onUpdate(branches.filter(branch => branch.id !== id));
  };

  const handleViewBranch = (id: number | string) => {
    const branch = branches.find(b => b.id === id);
    if (branch) {
      setCurrentBranch({ ...branch });
      setIsEditDialogOpen(true);
    }
  };
  
  // Formatar CNPJ com máscara
  const formatCNPJ = (value: string) => {
    const cnpjClean = value.replace(/\D/g, '');
    let formattedCNPJ = cnpjClean;
    
    if (cnpjClean.length > 2) formattedCNPJ = cnpjClean.substring(0, 2) + '.' + cnpjClean.substring(2);
    if (cnpjClean.length > 5) formattedCNPJ = formattedCNPJ.substring(0, 6) + '.' + cnpjClean.substring(5);
    if (cnpjClean.length > 8) formattedCNPJ = formattedCNPJ.substring(0, 10) + '/' + cnpjClean.substring(8);
    if (cnpjClean.length > 12) formattedCNPJ = formattedCNPJ.substring(0, 15) + '-' + cnpjClean.substring(12, 14);
    
    return formattedCNPJ;
  };

  // Formatar CEP com máscara
  const formatCEP = (value: string) => {
    const cepClean = value.replace(/\D/g, '');
    if (cepClean.length > 5) {
      return cepClean.substring(0, 5) + '-' + cepClean.substring(5, 8);
    }
    return cepClean;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filiais</CardTitle>
        {isEditing && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Filial
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {branches.length > 0 ? (
          <div className="rounded-md border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">Nome</th>
                  <th className="py-3 px-4 text-left font-medium">CNPJ</th>
                  <th className="py-3 px-4 text-left font-medium">Cidade/Estado</th>
                  <th className="py-3 px-4 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch) => (
                  <tr key={branch.id} className="border-t">
                    <td className="py-3 px-4">{branch.name}</td>
                    <td className="py-3 px-4">{branch.cnpj || '-'}</td>
                    <td className="py-3 px-4">{branch.cidade && branch.estado ? `${branch.cidade}/${branch.estado}` : branch.address || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewBranch(branch.id)}
                        >
                          {isEditing ? 'Editar' : 'Visualizar'}
                        </Button>
                        
                        {isEditing && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-500">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir filial</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir a filial "{branch.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteBranch(branch.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Nenhuma filial cadastrada.
          </p>
        )}

        {/* Add Branch Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Filial</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome*</label>
                <Input 
                  value={newBranch.name} 
                  onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })} 
                  placeholder="Nome da filial" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">CNPJ</label>
                <Input 
                  value={newBranch.cnpj || ''} 
                  onChange={(e) => {
                    const formattedValue = formatCNPJ(e.target.value);
                    setNewBranch({ ...newBranch, cnpj: formattedValue });
                  }}
                  placeholder="00.000.000/0000-00" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Inscrição Estadual</label>
                <Input 
                  value={newBranch.inscricaoEstadual || ''} 
                  onChange={(e) => setNewBranch({ ...newBranch, inscricaoEstadual: e.target.value })}
                  placeholder="Inscrição Estadual" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Inscrição Municipal</label>
                <Input 
                  value={newBranch.inscricaoMunicipal || ''} 
                  onChange={(e) => setNewBranch({ ...newBranch, inscricaoMunicipal: e.target.value })}
                  placeholder="Inscrição Municipal" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Endereço</label>
                <Input 
                  value={newBranch.address || ''} 
                  onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  placeholder="Rua, número" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bairro</label>
                <Input 
                  value={newBranch.bairro || ''} 
                  onChange={(e) => setNewBranch({ ...newBranch, bairro: e.target.value })}
                  placeholder="Bairro" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CEP</label>
                <Input 
                  value={newBranch.cep || ''} 
                  onChange={(e) => {
                    const formattedValue = formatCEP(e.target.value);
                    setNewBranch({ ...newBranch, cep: formattedValue });
                  }} 
                  placeholder="00000-000" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cidade</label>
                <Input 
                  value={newBranch.cidade || ''} 
                  onChange={(e) => setNewBranch({ ...newBranch, cidade: e.target.value })}
                  placeholder="Cidade" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <select
                  value={newBranch.estado || ''}
                  onChange={(e) => setNewBranch({ ...newBranch, estado: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10"
                >
                  <option value="">Selecione</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone</label>
                <Input 
                  value={newBranch.phone || ''} 
                  onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                  placeholder="(00) 00000-0000" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">E-mail</label>
                <Input 
                  value={newBranch.email || ''} 
                  onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })}
                  placeholder="email@exemplo.com" 
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  resetNewBranch();
                  setIsAddDialogOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddBranch}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Branch Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar' : 'Visualizar'} Filial</DialogTitle>
            </DialogHeader>
            
            {currentBranch && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome*</label>
                  <Input 
                    value={currentBranch.name} 
                    onChange={(e) => setCurrentBranch({ ...currentBranch, name: e.target.value })} 
                    placeholder="Nome da filial" 
                    required
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">CNPJ</label>
                  <Input 
                    value={currentBranch.cnpj || ''} 
                    onChange={(e) => {
                      if (isEditing) {
                        const formattedValue = formatCNPJ(e.target.value);
                        setCurrentBranch({ ...currentBranch, cnpj: formattedValue });
                      }
                    }}
                    placeholder="00.000.000/0000-00" 
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Inscrição Estadual</label>
                  <Input 
                    value={currentBranch.inscricaoEstadual || ''} 
                    onChange={(e) => setCurrentBranch({ ...currentBranch, inscricaoEstadual: e.target.value })}
                    placeholder="Inscrição Estadual" 
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Inscrição Municipal</label>
                  <Input 
                    value={currentBranch.inscricaoMunicipal || ''} 
                    onChange={(e) => setCurrentBranch({ ...currentBranch, inscricaoMunicipal: e.target.value })}
                    placeholder="Inscrição Municipal" 
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Endereço</label>
                  <Input 
                    value={currentBranch.address || ''} 
                    onChange={(e) => setCurrentBranch({ ...currentBranch, address: e.target.value })}
                    placeholder="Rua, número" 
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bairro</label>
                  <Input 
                    value={currentBranch.bairro || ''} 
                    onChange={(e) => setCurrentBranch({ ...currentBranch, bairro: e.target.value })}
                    placeholder="Bairro" 
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">CEP</label>
                  <Input 
                    value={currentBranch.cep || ''} 
                    onChange={(e) => {
                      if (isEditing) {
                        const formattedValue = formatCEP(e.target.value);
                        setCurrentBranch({ ...currentBranch, cep: formattedValue });
                      }
                    }} 
                    placeholder="00000-000" 
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cidade</label>
                  <Input 
                    value={currentBranch.cidade || ''} 
                    onChange={(e) => setCurrentBranch({ ...currentBranch, cidade: e.target.value })}
                    placeholder="Cidade" 
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <select
                    value={currentBranch.estado || ''}
                    onChange={(e) => setCurrentBranch({ ...currentBranch, estado: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10"
                    disabled={!isEditing}
                  >
                    <option value="">Selecione</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone</label>
                  <Input 
                    value={currentBranch.phone || ''} 
                    onChange={(e) => setCurrentBranch({ ...currentBranch, phone: e.target.value })}
                    placeholder="(00) 00000-0000" 
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">E-mail</label>
                  <Input 
                    value={currentBranch.email || ''} 
                    onChange={(e) => setCurrentBranch({ ...currentBranch, email: e.target.value })}
                    placeholder="email@exemplo.com" 
                    disabled={!isEditing}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentBranch(null);
                  setIsEditDialogOpen(false);
                }}
              >
                Cancelar
              </Button>
              {isEditing && (
                <Button onClick={handleEditBranch}>Salvar Alterações</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BranchesTab;
